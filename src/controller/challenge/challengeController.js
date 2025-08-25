const challenge = require("../../model/Challenge/challenge");
const Client = require("../../model/Client");
const challenge_master = require("../../model/Masters/challenge/challenge_master");
const User = require("../../model/User")
const { addCoinsToClient } = require("../../utils/addCoin");


exports.createChallenge = async (req, res) => {
    try {
        const userId = req.userId;
        const {
            name, type, description, startDate, endDate,
            rewardRange,
            targetValue, participationLimit, privacy, selectedClients = [],
            category, tags = [], status
        } = req.body;

        const master = await challenge_master.findById(type);
        if (!master) return res.status(400).json({ message: 'Invalid challenge type' });

        // Validate that category matches the challenge type
        if (category !== master.type) {
            return res.status(400).json({ message: 'Category must match the challenge type' });
        }

        const selectedRange = master.rewardRanges.id(rewardRange);
        if (!selectedRange) return res.status(400).json({ message: 'Invalid reward range ID' });

        if (targetValue < selectedRange.min || targetValue > selectedRange.max) {
            return res.status(400).json({ message: 'Target value is not within selected reward range' });
        }

        // Calculate difficulty based on target value and range
        const calculateDifficulty = (targetValue, min, max) => {
            const range = max - min;
            const percentageOfRange = ((targetValue - min) / range) * 100;

            if (percentageOfRange <= 30) {
                return 'beginner';
            } else if (percentageOfRange <= 70) {
                return 'intermediate';
            } else {
                return 'advanced';
            }
        };

        const difficulty = calculateDifficulty(targetValue, selectedRange.min, selectedRange.max);

        if (privacy === 'private') {
            for (const clientId of selectedClients) {
                const existsInClient = await Client.exists({ _id: clientId });
                const existsInUser = await User.exists({ _id: clientId });

                if (!existsInClient && !existsInUser) {
                    return res.status(400).json({ message: `Invalid client ID: ${clientId}` });
                }
            }
        }

        const challenges = new challenge({
            name,
            type,
            description,
            startDate,
            endDate,
            targetValue,
            coinReward: selectedRange.coins,
            participationLimit,
            privacy,
            createdBy: userId,
            selectedClients: privacy === 'private' ? selectedClients : [],
            participants: privacy === 'private'
                ? selectedClients.map(clientId => ({
                    clientId,
                    status: 'pending',
                    progress: { total: 0, entries: [] },
                    earnedCoins: 0
                }))
                : [],
            rewardRange,
            category: master.type, // Ensure category matches the challenge type
            tags,
            difficulty,
            status
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

        const challenges = await challenge.findOne({ _id: challengeId });
        if (!challenges) return res.status(404).json({ message: 'Challenge not found' });

        const participant = challenges.participants.find(p =>
            (p.clientId?._id?.toString?.() || p.clientId?.toString?.()) === userId.toString()
        );

        if (!participant) return res.status(403).json({ message: 'You are not invited to this challenge' });

        participant.status = action;
        participant.respondedAt = new Date();

        if (action === 'accepted') {
            participant.progress = {
                total: 0,
                entries: []
            };
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
            .populate('participants.clientId', 'fullName email image')
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
                    : null,
                category: ch.category,
                tags: ch.tags,
                difficulty: ch.difficulty,
                status: ch.status
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

        const challenges = await challenge.findById(challengeId).populate('participants.clientId', 'fullName email image');

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
        }).populate('participants.clientId', 'fullName email image').populate('rewardRange').populate('type').lean().sort({ createdAt: -1 })

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
                    : null,
                category: ch.category,
                tags: ch.tags,
                difficulty: ch.difficulty,
                status: ch.status
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
        }).sort({ createdAt: -1 }).populate('participants.clientId', 'fullName email image').populate('type').populate('rewardRange').lean();

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
                    : null,
                category: ch.category,
                tags: ch.tags,
                difficulty: ch.difficulty,
                status: ch.status
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
        }).populate('participants.clientId', 'fullName email image').populate('type').populate('rewardRange').populate("createdBy", "fullName").lean().sort({ createdAt: -1 });

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
                    : null,
                category: ch.category,
                tags: ch.tags,
                difficulty: ch.difficulty,
                status: ch.status
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

        const mappedChallenge = {
            ...challenges.toObject(), // Convert mongoose document to a plain object
            category: challenges.category,
            tags: challenges.tags,
            difficulty: challenges.difficulty,
            status: challenges.status
        };

        res.status(200).json({ message: 'You have successfully joined the challenge', challenge: mappedChallenge });
    } catch (error) {
        console.error("Error in joinPublicChallenge:", error);
        res.status(500).json({ message: error.message });
    }
};


exports.logProgress = async (req, res) => {
    try {
        const { userId } = req.params;
        const { value, date } = req.body;

        const now = new Date();
        const logDate = date ? new Date(date) : now;
        const logDateStr = logDate.toISOString().split('T')[0];

        const challenges = await challenge.find({
            participants: {
                $elemMatch: {
                    clientId: userId,
                    status: 'accepted',
                },
            },
            startDate: { $lte: logDate },
            endDate: { $gte: logDate },
        });

        if (!challenges.length) {
            return res.status(404).json({ message: 'No active challenges found for this user on the given date' });
        }

        const results = [];

        for (const challenge of challenges) {
            const participant = challenge.participants.find(p => p.clientId.toString() === userId);
            if (!participant) continue;

            if (!participant.progress) {
                participant.progress = { total: 0, entries: [] };
            }

            const existingEntry = participant.progress.entries.find(e => e.date === logDateStr);
            if (existingEntry) {
                existingEntry.value += value;
            } else {
                participant.progress.entries.push({ date: logDateStr, value });
            }

            participant.progress.total += value;

            if (participant.progress.total >= challenge.targetValue && !participant.completedAt) {
                participant.completedAt = logDate;
                participant.earnedCoins = challenge.coinReward;

                await addCoinsToClient({
                    clientId: participant.clientId,
                    coins: challenge.coinReward,
                    type: 'challenge_complete',
                    description: `Completed challenge: ${challenge.name}`,
                    challengeId: challenge._id,
                });
            }

            await challenge.save();

            const io = req.app.get('io');
            io.to(challenge._id.toString()).emit('progressUpdated', {
                challengeId: challenge._id,
                userId,
                total: participant.progress.total,
                entries: participant.progress.entries,
                completedAt: participant.completedAt || null,
                earnedCoins: participant.earnedCoins || 0,
            });

            results.push({
                challengeId: challenge._id,
                progress: participant.progress,
                earnedCoins: participant.earnedCoins || 0,
                completedAt: participant.completedAt || null,
            });
        }

        const client = await Client.findById(userId);
        if (client) {
            if (!client.stepLogs) client.stepLogs = [];

            const existingLog = client.stepLogs.find(l => l.date === logDateStr);
            if (existingLog) {
                existingLog.steps += value;
            } else {
                client.stepLogs.push({ date: logDateStr, steps: value });
            }

            await client.save();
        }

        res.json({
            message: 'Progress logged for active challenges',
            challengesUpdated: results.length,
            results,
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
            .populate('participants.clientId', 'fullName email image')
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
                : null,
            category: challengeData.category,
            tags: challengeData.tags,
            difficulty: challengeData.difficulty,
            status: challengeData.status
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

        const challenges = await challenge.find({ createdBy: creatorId }).populate('participants.clientId', 'fullName email image')
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
                    : null,
                category: ch.category,
                tags: ch.tags,
                difficulty: ch.difficulty,
                status: ch.status
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


exports.getAcceptedChallenges = async (req, res) => {
    try {
        const userId = req.params.userId;

        const challenges = await challenge.find({
            'participants': {
                $elemMatch: {
                    clientId: userId,
                    status: 'accepted'
                }
            }
        }).populate('participants.clientId', 'fullName email image')
            .populate('rewardRange')
            .populate('type')
            .lean()
            .sort({ createdAt: -1 });

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
                    : null,
                category: ch.category,
                tags: ch.tags,
                difficulty: ch.difficulty,
                status: ch.status
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


exports.getAllPrivateChallenges = async (req, res) => {
    try {
        const userId = req.params.userId;

        const challenges = await challenge.find({
            privacy: 'private',
            selectedClients: userId,
            $or: [
                { 'participants.clientId': { $ne: userId } },
                {
                    participants: {
                        $elemMatch: {
                            clientId: userId,
                            status: 'accepted'
                        }
                    }
                }
            ]
        })
            .populate('participants.clientId', 'fullName email image')
            .populate('type')
            .populate('rewardRange')
            .lean()
            .sort({ createdAt: -1 });

        const mappedChallenges = challenges.map(ch => {
            let reward = null;

            if (ch.type?.rewardRanges && ch.targetValue != null) {
                reward = ch.type.rewardRanges.find(r =>
                    ch.targetValue >= r.min && ch.targetValue <= r.max
                );
            }

            return {
                ...ch,
                type: ch.type
                    ? {
                        _id: ch.type._id,
                        type: ch.type.type,
                        unitLabel: ch.type.unitLabel
                    }
                    : null,
                rewardRange: reward
                    ? {
                        _id: reward._id,
                        min: reward.min,
                        max: reward.max,
                        coins: reward.coins
                    }
                    : null,
                category: ch.category,
                tags: ch.tags,
                difficulty: ch.difficulty,
                status: ch.status
            };
        });

        res.status(200).json({ success: true, challenges: mappedChallenges });
    } catch (error) {
        console.error("Error in getAllPrivateChallenges:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getAllPublicJoinedChallenges = async (req, res) => {
    try {
        const userId = req.params.userId;

        const challenges = await challenge.find({
            privacy: 'public',
            selectedClients: userId,
            $or: [
                { 'participants.clientId': { $ne: userId } },
                {
                    participants: {
                        $elemMatch: {
                            clientId: userId,
                            status: 'accepted'
                        }
                    }
                }
            ]
        })
            .populate('participants.clientId', 'fullName email image')
            .populate('type')
            .populate('rewardRange')
            .lean()
            .sort({ createdAt: -1 });

        const mappedChallenges = challenges.map(ch => {
            let reward = null;

            if (ch.type?.rewardRanges && ch.targetValue != null) {
                reward = ch.type.rewardRanges.find(r =>
                    ch.targetValue >= r.min && ch.targetValue <= r.max
                );
            }

            return {
                ...ch,
                type: ch.type
                    ? {
                        _id: ch.type._id,
                        type: ch.type.type,
                        unitLabel: ch.type.unitLabel
                    }
                    : null,
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
        console.error("Error in getAllPrivateChallenges:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getAllChallenges = async (req, res) => {
    console.log('HIT: getAllChallenges API');

    try {
        const {
            search = '',
            privacy,
            type,
            status,
            participantStatus,
            sortBy = 'createdAt',
            order = 'desc',
            page = 1,
            limit = 10,
            category,
            difficulty
        } = req.query;

        const filter = {};

        if (privacy) {
            filter.privacy = privacy;
        }

        if (type) {
            filter.type = type;
        }

        if (category) {
            filter.category = category;
        }

        if (difficulty) {
            filter.difficulty = difficulty;
        }

        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        // Handle status filter
        if (status) {
            const now = new Date();
            switch (status) {
                case 'active':
                    filter.startDate = { $lte: now };
                    filter.endDate = { $gte: now };
                    break;
                case 'upcoming':
                    filter.startDate = { $gt: now };
                    break;
                case 'passed':
                    filter.endDate = { $lt: now };
                    break;
            }
        }

        // Handle participant status filter
        if (participantStatus) {
            switch (participantStatus) {
                case 'no-participants':
                    filter['participants.0'] = { $exists: false };
                    break;
                case 'partial':
                    filter['$expr'] = {
                        $and: [
                            { $gt: [{ $size: '$participants' }, 0] },
                            { $lt: [{ $size: '$participants' }, { $size: '$selectedClients' }] }
                        ]
                    };
                    break;
                case 'full':
                    filter['$expr'] = {
                        $eq: [{ $size: '$participants' }, { $size: '$selectedClients' }]
                    };
                    break;
            }
        }

        const skip = (page - 1) * limit;

        const challengesRaw = await challenge.find(filter)
            .populate({
                path: 'type',
                select: 'type rewardRanges unitLabel'
            })
            .populate({
                path: 'rewardRange',
            })
            .populate({
                path: 'selectedClients',
                select: 'fullName image'
            })
            .populate({
                path: 'participants.clientId',
                select: 'fullName stepLogs image'
            })
            .populate({
                path: 'createdBy',
                select: 'fullName stepLogs coin image'
            })
            .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        // Process each challenge to ensure analytics data
        const challenges = await Promise.all(challengesRaw.map(async (ch) => {
            // Update analytics for each challenge
            await ch.updateAnalytics?.();

            // Find matching reward range based on targetValue
            const rewardRange = ch.type?.rewardRanges?.find(r =>
                ch.targetValue >= r.min && ch.targetValue <= r.max
            ) || null;

            return {
                ...ch,
                type: ch.type
                    ? {
                        _id: ch.type._id,
                        type: ch.type.type,
                        unitLabel: ch.type.unitLabel,
                    }
                    : null,
                rewardRange,
                selectedClients: ch.selectedClients?.map(client => ({
                    _id: client._id,
                    fullName: client.fullName,
                    image: client.image,
                })),
                participants: ch.participants?.map(p => ({
                    ...p,
                    clientId: p.clientId
                        ? {
                            _id: p.clientId._id,
                            fullName: p.clientId.fullName,
                            image: p.clientId.image,
                            stepLogs: p.clientId.stepLogs,
                        }
                        : null,
                })),
                createdBy: ch.createdBy
                    ? {
                        _id: ch.createdBy._id,
                        fullName: ch.createdBy.fullName,
                        image: ch.createdBy.image,
                        stepLogs: ch.createdBy.stepLogs,
                        coin: ch.createdBy.coin,
                    }
                    : null,
                analytics: {
                    totalParticipants: ch.analytics?.totalParticipants || 0,
                    activeParticipants: ch.analytics?.activeParticipants || 0,
                    completionRate: ch.analytics?.completionRate || 0,
                    averageProgress: ch.analytics?.averageProgress || 0,
                    averageRating: ch.analytics?.averageRating || 0,
                    totalFeedback: ch.analytics?.totalFeedback || 0
                }
            };
        }));

        const total = await challenge.countDocuments(filter);

        res.status(200).json({
            success: true,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            challenges,
        });

    } catch (error) {
        console.error('Error fetching challenges:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch challenges',
            error: error.message
        });
    }
};

exports.updateChallenge = async (req, res) => {
    try {
        const challengeId = req.params.id;
        const {
            name,
            type,
            description,
            startDate,
            endDate,
            targetValue,
            coinReward,
            participationLimit,
            privacy,
            category,
            tags,
            difficulty,
            status
        } = req.body;

        const challenges = await challenge.findById(challengeId);
        if (!challenges) {
            return res.status(404).json({ message: 'Challenge not found' });
        }

        // Update challenge fields
        challenges.name = name;
        challenges.type = type;
        challenges.description = description;
        challenges.startDate = startDate;
        challenges.endDate = endDate;
        challenges.targetValue = targetValue;
        challenges.coinReward = coinReward;
        challenges.participationLimit = participationLimit;
        challenges.privacy = privacy;
        challenges.category = category;
        challenges.tags = tags;
        challenges.difficulty = difficulty;
        challenges.status = status;

        await challenges.save();

        res.status(200).json({
            success: true,
            message: 'Challenge updated successfully',
            challenge: challenges
        });
    } catch (error) {
        console.error('Error updating challenge:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteChallenge = async (req, res) => {
    try {
        const challengeId = req.params.id;

        const challenges = await challenge.findById(challengeId);
        if (!challenges) {
            return res.status(404).json({
                success: false,
                message: 'Challenge not found'
            });
        }

        // // Check if there are any active participants
        // const hasActiveParticipants = challenges.participants.some(p => p.status === 'accepted');
        // if (hasActiveParticipants) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Cannot delete challenge with active participants'
        //     });
        // }

        await challenges.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Challenge deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting challenge:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get challenge analytics
exports.getChallengeAnalytics = async (req, res) => {
    try {
        const challenge = await challenge.findById(req.params.id);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }

        await challenge.updateAnalytics();

        res.status(200).json({
            success: true,
            data: challenge.analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get challenges by category
exports.getChallengesByCategory = async (req, res) => {
    try {
        const challenges = await challenge.find({
            category: req.params.category,
            status: 'active'
        }).populate('type', 'name description');

        res.status(200).json({
            success: true,
            data: challenges
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Submit challenge feedback
exports.submitFeedback = async (req, res) => {
    try {
        const challenge = await challenge.findById(req.params.id);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }

        const participant = challenge.participants.find(
            p => p.clientId.toString() === req.user.id
        );

        if (!participant) {
            return res.status(404).json({ message: 'You are not a participant in this challenge' });
        }

        participant.feedback = {
            rating: req.body.rating,
            comment: req.body.comment,
            submittedAt: new Date()
        };

        await challenge.save();
        await challenge.updateAnalytics();

        res.status(200).json({
            success: true,
            data: participant.feedback
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create challenge from template
exports.createFromTemplate = async (req, res) => {
    try {
        const template = await challenge.findOne({
            _id: req.params.templateId,
            isTemplate: true
        });

        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        if (template.templateSettings.isReusable &&
            template.templateSettings.currentReuses >= template.templateSettings.maxReuses) {
            return res.status(400).json({ message: 'Template has reached maximum reuse limit' });
        }

        const newChallenge = new challenge({
            ...template.toObject(),
            _id: undefined,
            isTemplate: false,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            createdBy: req.user.id,
            participants: [],
            analytics: {
                totalParticipants: 0,
                activeParticipants: 0,
                completionRate: 0,
                averageProgress: 0,
                averageRating: 0,
                totalFeedback: 0
            }
        });

        await newChallenge.save();

        if (template.templateSettings.isReusable) {
            template.templateSettings.currentReuses += 1;
            await template.save();
        }

        res.status(201).json({
            success: true,
            data: newChallenge
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get challenge templates
exports.getTemplates = async (req, res) => {
    try {
        const templates = await challenge.find({ isTemplate: true });

        res.status(200).json({
            success: true,
            data: templates
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
