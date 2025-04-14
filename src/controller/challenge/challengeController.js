const challenge = require("../../model/Challenge/challenge");
const challenge_master = require("../../model/Masters/challenge/challenge_master");
const { addCoinsToClient } = require("../../utils/addCoin");


exports.createChallenge = async (req, res) => {
    try {
        const userId = req.params.userId;
        const {
            name, type, description, startDate, endDate,
            rewardRange,
            targetValue, participationLimit, privacy, selectedClients = []
        } = req.body;

        const master = await challenge_master.findById(type);
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
            rewardRange
        });

        await challenges.save();

        const io = req.app.get('io');
        if (privacy === 'private') {
            selectedClients.forEach(clientId => {
                io.to(clientId.toString()).emit('newPrivateChallenge', challenges);
            });
        } else {
            io.emit('newPublicChallenge', challenges);
        }

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
        const { action } = req.body;

        const challenges = await challenge.findById(challengeId);
        if (!challenges) return res.status(404).json({ message: 'Challenge not found' });

        const participant = challenges.participants.find(p => p.clientId.toString() === userId);
        if (!participant) return res.status(403).json({ message: 'You are not invited to this challenge' });

        participant.status = action;
        participant.respondedAt = new Date();

        if (action === 'accepted') {
            participant.progress = 0;
            participant.completedAt = null;
        }

        await challenges.save();
        const io = req.app.get('io');
        io.to(challenges.createdBy.toString()).emit('challengeResponse', {
            challengeId,
            clientId: userId,
            action
        });

        res.status(200).json({ success: true, message: `Challenge ${action}` });
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
            $and: [
                {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } },
                    ]
                },
                {
                    $or: [
                        { privacy: 'public' },
                        { selectedClients: userId },
                        { createdBy: userId },
                    ]
                }
            ]
        };

        const challenges = await challenge.find(query)
            .populate('participants.clientId', 'fullName email')
            .populate('rewardRange').populate('type')
            .lean()
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const total = await challenge.countDocuments(query);

        const mappedChallenges = challenges.map(ch => {
            const reward = ch.type?.rewardRanges?.find(r =>
                ch.targetValue >= r.min && ch.targetValue <= r.max
            );

            return {
                ...ch,
                type: {
                    _id: ch.type?._id,
                    type: ch.type?.type,
                    unitLabel: ch.type?.unitLabel
                },
                rewardRange: reward
                    ? {
                        _id: reward._id,
                        min: reward.min,
                        max: reward.max,
                        coins: reward.coins
                    }
                    : null
            };
        });

        res.json({ total, page: Number(page), challenges: mappedChallenges });
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
        }).populate('rewardRange').populate('type').lean().sort({ createdAt: -1 })

        const mappedChallenges = challenges.map(ch => {
            const reward = ch.type?.rewardRanges?.find(r =>
                ch.targetValue >= r.min && ch.targetValue <= r.max
            );

            return {
                ...ch,
                type: {
                    _id: ch.type?._id,
                    type: ch.type?.type,
                    unitLabel: ch.type?.unitLabel
                },
                rewardRange: reward
                    ? {
                        _id: reward._id,
                        min: reward.min,
                        max: reward.max,
                        coins: reward.coins
                    }
                    : null
            };
        });


        res.status(200).json({
            success: true,
            challenges: mappedChallenges
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllPublicChallenges = async (req, res) => {
    try {
        const challenges = await challenge.find({
            privacy: 'public'
        }).sort({ createdAt: -1 }).populate('type').populate('rewardRange').lean();

        const mappedChallenges = challenges.map(ch => {
            const reward = ch.type?.rewardRanges?.find(r =>
                ch.targetValue >= r.min && ch.targetValue <= r.max
            );

            return {
                ...ch,
                type: {
                    _id: ch.type?._id,
                    type: ch.type?.type,
                    unitLabel: ch.type?.unitLabel
                },
                rewardRange: reward
                    ? {
                        _id: reward._id,
                        min: reward.min,
                        max: reward.max,
                        coins: reward.coins
                    }
                    : null
            };
        });


        res.status(200).json({ success: true, challenges: mappedChallenges });
    } catch (error) {
        console.error("Error in getAllPublicChallenges:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getPrivateChallenges = async (req, res) => {
    try {
        const userId = req.params.userId;

        const challenges = await challenge.find({
            privacy: 'private',
            selectedClients: userId,
            $or: [
                { 'participants.clientId': { $ne: userId } },
                { 'participants': { $elemMatch: { clientId: userId, status: 'pending' } } }
            ]
        }).populate('type').populate('rewardRange').lean().sort({ createdAt: -1 });

        const mappedChallenges = challenges.map(ch => {
            const reward = ch.type?.rewardRanges?.find(r =>
                ch.targetValue >= r.min && ch.targetValue <= r.max
            );

            return {
                ...ch,
                type: {
                    _id: ch.type?._id,
                    type: ch.type?.type,
                    unitLabel: ch.type?.unitLabel
                },
                rewardRange: reward
                    ? {
                        _id: reward._id,
                        min: reward.min,
                        max: reward.max,
                        coins: reward.coins
                    }
                    : null
            };
        });

        res.status(200).json({ success: true, challenges: mappedChallenges });
    } catch (error) {
        console.error("Error in getPrivateChallenges:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.joinPublicChallenge = async (req, res) => {
    try {
        const userId = req.params.userId;
        const challengeId = req.params.challengeId;

        const challenges = await challenge.findById(challengeId);
        if (!challenges) return res.status(404).json({ message: 'Challenge not found' });

        if (challenges.privacy !== 'public') {
            return res.status(400).json({ message: 'Challenge is not public' });
        }

        if (challenges.participants.length >= challenges.participationLimit) {
            return res.status(400).json({ message: 'Challenge participation limit reached' });
        }


        const alreadyJoined = challenges.participants.some(p => p.clientId.toString() === userId);
        if (alreadyJoined) {
            return res.status(400).json({ message: 'You have already joined this challenge' });
        }

        challenges.participants.push({
            clientId: userId,
            status: 'accepted',
            respondedAt: new Date()
        });

        await challenges.save();
        res.status(200).json({ message: 'You have successfully joined the challenge', challenge: challenges });
    } catch (error) {
        console.error("Error in joinPublicChallenge:", error);
        res.status(500).json({ message: error.message });
    }
};


exports.logProgress = async (req, res) => {
    try {
        const { challengeId, userId } = req.params;
        const { value, date } = req.body;

        const challenges = await challenge.findById(challengeId);
        if (!challenges) return res.status(404).json({ message: 'Challenge not found' });

        const participant = challenges.participants.find(p => p.clientId.toString() === userId);
        if (!participant || participant.status !== 'accepted') {
            return res.status(403).json({ message: 'You are not a valid participant' });
        }

        const now = new Date();
        const logDate = date ? new Date(date) : now;
        const logDateStr = logDate.toISOString().split('T')[0];

        if (logDate < new Date(challenges.startDate) || logDate > new Date(challenges.endDate)) {
            return res.status(400).json({ message: 'You can only log progress during the challenge period' });
        }

        if (!participant.progress) {
            participant.progress = {
                total: 0,
                entries: []
            };
        }

        const existingEntry = participant.progress.entries.find(e => e.date === logDateStr);
        if (existingEntry) {
            existingEntry.value += value;
        } else {
            participant.progress.entries.push({ date: logDateStr, value });
        }

        participant.progress.total += value;

        if (participant.progress.total >= challenges.targetValue && !participant.completedAt) {
            participant.completedAt = now;
            participant.earnedCoins = challenges.coinReward;

            await addCoinsToClient({
                clientId: participant.clientId,
                coins: challenges.coinReward,
                type: 'challenge_complete',
                description: `Completed challenge: ${challenges.name}`,
                challengeId: challengeId
            });
        }

        await challenges.save();

        const io = req.app.get('io');
        io.to(challengeId.toString()).emit('progressUpdated', {
            challengeId,
            userId,
            total: participant.progress.total,
            entries: participant.progress.entries,
            completedAt: participant.completedAt || null,
            earnedCoins: participant.earnedCoins || 0
        });

        res.json({
            message: 'Progress logged',
            progress: participant.progress,
            earnedCoins: participant.earnedCoins || 0,
            completedAt: participant.completedAt || null
        });
    } catch (error) {
        console.error('Progress log error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


exports.getChallengeById = async (req, res) => {
    try {
        const { challengeId } = req.params;

        const challengeData = await challenge
            .findById(challengeId)
            .populate('participants.clientId', 'fullName email')
            .populate('type')
            .populate('rewardRange')
            .lean();

        if (!challengeData) {
            return res.status(404).json({ message: 'Challenge not found' });
        }

        const reward = challengeData.type?.rewardRanges?.find(r =>
            challengeData.targetValue >= r.min && challengeData.targetValue <= r.max
        );

        const mappedChallenge = {
            ...challengeData,
            type: {
                _id: challengeData.type?._id,
                type: challengeData.type?.type,
                unitLabel: challengeData.type?.unitLabel
            },
            rewardRange: reward
                ? {
                    _id: reward._id,
                    min: reward.min,
                    max: reward.max,
                    coins: reward.coins
                }
                : null
        };

        res.status(200).json({ success: true, challenge: mappedChallenge });
    } catch (error) {
        console.error("Error in getChallengeById:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getChallengesByCreator = async (req, res) => {
    try {
        const { creatorId } = req.params;

        const challenges = await challenge.find({ createdBy: creatorId }).populate('participants.clientId', 'fullName email')
            .populate('type')
            .populate('rewardRange').sort({ createdAt: -1 }).lean();

        const mappedChallenges = challenges.map(ch => {
            const reward = ch.type?.rewardRanges?.find(r =>
                ch.targetValue >= r.min && ch.targetValue <= r.max
            );

            return {
                ...ch,
                type: {
                    _id: ch.type?._id,
                    type: ch.type?.type,
                    unitLabel: ch.type?.unitLabel
                },
                rewardRange: reward
                    ? {
                        _id: reward._id,
                        min: reward.min,
                        max: reward.max,
                        coins: reward.coins
                    }
                    : null
            };
        });

        res.status(200).json({
            success: true,
            challenge: mappedChallenges
        });
    } catch (error) {
        console.error("Error in getChallengesByCreator:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

