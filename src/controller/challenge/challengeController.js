const challenge = require("../../model/Challenge/challenge");
const challenge_master = require("../../model/Masters/challenge/challenge_master");

exports.createChallenge = async (req, res) => {
    try {
        const userId = req.params.userId;
        const {
            name, type, description, startDate, endDate,
            targetValue, participationLimit, privacy, selectedClients = []
        } = req.body;

        const master = await challenge_master.findOne({ type });
        if (!master) return res.status(400).json({ message: 'Invalid challenge type' });

        const reward = master.rewardRanges.find(r => targetValue >= r.min && targetValue <= r.max);
        if (!reward) return res.status(400).json({ message: 'No reward found for target value' });

        const challenges = new challenge({
            name,
            type,
            description,
            startDate,
            endDate,
            targetValue,
            coinReward: reward.coins,
            participationLimit,
            privacy,
            createdBy: userId,
            selectedClients: privacy === 'private' ? selectedClients : [],
            participants: privacy === 'private' ? selectedClients.map(clientId => ({ clientId })) : [],
        });

        await challenges.save();
        res.status(201).json({ message: 'Challenge created successfully', challenges });
    } catch (error) {
        console.log("🚀 ~ exports.createChallenge= ~ error:", error)
        res.status(500).json({ message: error.message });
    }
};

exports.respondToChallenge = async (req, res) => {
    try {
        const userId = req.params.userId;
        const challengeId = req.params.challengeId;
        const { response } = req.body;

        const challenges = await challenge.findById(challengeId);
        if (!challenges) return res.status(404).json({ message: 'Challenge not found' });

        const participant = challenges.participants.find(p => p.clientId.toString() === userId);
        if (!participant) return res.status(403).json({ message: 'You are not invited to this challenge' });

        participant.status = response;
        participant.respondedAt = new Date();

        await challenges.save();
        res.json({ message: `Challenge ${response}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.reinviteClient = async (req, res) => {
    try {
        const challengeId = req.params.challengeId;
        const clientId = req.params.clientId;
        // const userId = req.params.userId;

        const challenges = await challenge.findById(challengeId);
        // if (!challenges || challenges.createdBy.toString() !== userId) {
        //     return res.status(403).json({ message: 'Unauthorized or challenge not found' });
        // }

        const participant = challenges.participants.find(p => p.clientId.toString() === clientId);
        if (participant) {
            participant.status = 'pending';
            participant.respondedAt = null;
        } else {
            challenges.participants.push({ clientId });
        }

        if (!challenges.selectedClients.includes(clientId)) {
            challenges.selectedClients.push(clientId);
        }

        await challenges.save();
        res.json({ message: 'Client reinvited' });
    } catch (error) {
        console.log("🚀 ~ exports.reinviteClient= ~ error:", error)
        res.status(500).json({ message: error.message });
    }
};

exports.getChallenges = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { page = 1, limit = 10, search = '' } = req.query;

        const query = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ],
            $or: [
                { privacy: 'public' },
                { selectedClients: userId },
                { createdBy: userId },
            ]
        };

        const challenges = await challenge.find(query)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const total = await challenge.countDocuments(query);

        res.json({ total, page: Number(page), challenges });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.viewParticipants = async (req, res) => {
    try {
        const challengeId = req.params.challengeId;

        const challenges = await challenge.findById(challengeId).populate('participants.clientId', 'fullName email');

        const accepted = challenges.participants.filter(p => p.status === 'accepted');
        const rejected = challenges.participants.filter(p => p.status === 'rejected');
        const pending = challenges.participants.filter(p => p.status === 'pending');

        res.json({ accepted, rejected, pending });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getParticipatedChallenges = async (req, res) => {
    try {
        const userId = req.params.userId;

        const challenges = await challenge.find({
            participants: { $elemMatch: { clientId: userId } }
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            challenges
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

