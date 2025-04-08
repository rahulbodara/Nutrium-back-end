const Message = require("../model/Message")

const getUserMessages = async (req, res) => {
    const userId = req.userId
    try {
        const messages = await Message.find({ receiverId: userId })
        if (!messages) {
            return res.status(404).json({ message: "Messages not found" })
        }

        return res.status(200).json(messages)

    } catch (error) {
        return res.status(500).json({ message: error })
    }
}

module.exports = { getUserMessages }