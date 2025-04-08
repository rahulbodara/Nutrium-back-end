const challenge_master = require("../../../model/Masters/challenge/challenge_master");

exports.createChallengeMaster = async (req, res) => {
    try {
        const { type, unitLabel, rewardRanges } = req.body;

        const existing = await challenge_master.findOne({ type });
        if (existing) return res.status(400).json({ message: 'Type already exists' });

        const master = await challenge_master.create({
            type,
            unitLabel,
            rewardRanges,
            createdBy: req.userId
        });

        res.status(201).json({ success: true, data: master });
    } catch (error) {
        console.log("🚀 ~ exports.createChallengeMaster= ~ error:", error)
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllChallengeMasters = async (req, res) => {
    try {
        const masters = await challenge_master.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: masters });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getChallengeMasterById = async (req, res) => {
    try {
        const master = await challenge_master.findById(req.params.id);
        if (!master) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ success: true, data: master });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateChallengeMaster = async (req, res) => {
    try {
        const updated = await challenge_master.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: 'Not found' });

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteChallengeMaster = async (req, res) => {
    try {
        const deleted = await challenge_master.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Not found' });
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
