const Message = require("../model/Message");
const User = require("../model/User");
const Client = require("../model/Client");

const getUserMessages = async (req, res) => {
    const userId = req.userId;

    try {
        const messages = await Message.find({ receiverId: userId }).sort({ createdAt: -1 }).lean();

        const latestMessagesMap = new Map();

        for (const msg of messages) {
            if (!latestMessagesMap.has(msg.senderId.toString())) {
                latestMessagesMap.set(msg.senderId.toString(), msg);
            }
        }

        const senderIds = Array.from(latestMessagesMap.keys());

        const users = await User.find({ _id: { $in: senderIds } }).lean();
        const clients = await Client.find({ _id: { $in: senderIds } }).lean();

        const senderDetailsMap = new Map();

        for (const sender of [...users, ...clients]) {
            senderDetailsMap.set(sender._id.toString(), {
                name: sender.fullName,
                profileImage: sender.image || null,
            });
        }

        const result = Array.from(latestMessagesMap.values()).map((msg) => {
            const senderInfo = senderDetailsMap.get(msg.senderId.toString()) || {};
            return {
                ...msg,
                senderName: senderInfo.name || "Unknown",
                senderImage: senderInfo.profileImage || null,
            };
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { getUserMessages }