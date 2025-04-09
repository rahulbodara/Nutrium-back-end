const moment = require('moment');
const Challenge = require('../../model/Challenge/challenge');
const Client = require('../../model/Client');

exports.getLeaderboard = async (req, res) => {
    try {
        const { challengeId } = req.params;
        const { type, date, limit } = req.query;

        const challenge = await Challenge.findById(challengeId).lean();
        if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

        if ((type === 'date' || type === 'day' || type === 'week' || type === 'month') && !moment(date, 'YYYY-MM-DD', true).isValid()) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        const participants = challenge.participants.filter(p => p.status === 'accepted');

        const leaderboard = participants.map(p => {
            const progressEntries = p.progress?.entries || [];
            let total = 0;

            if (!type || type === 'overall') {
                total = p.progress?.total || 0;
            } else {
                const entryDate = moment(date, 'YYYY-MM-DD');
                for (const entry of progressEntries) {
                    const eDate = moment(entry.date, 'YYYY-MM-DD');
                    if ((type === 'date' || type === 'day') && eDate.isSame(entryDate, 'day')) total += entry.value;
                    if (type === 'week' && eDate.isSame(entryDate, 'week')) total += entry.value;
                    if (type === 'month' && eDate.isSame(entryDate, 'month')) total += entry.value;
                }
            }

            return {
                clientId: p.clientId.toString(),
                progress: total,
                completedAt: p.completedAt
            };
        });

        const clientIds = leaderboard.map(p => p.clientId);
        const clients = await Client.find({ _id: { $in: clientIds } })
            .select('_id fullName image')
            .lean();

        const clientMap = Object.fromEntries(clients.map(c => [c._id.toString(), c]));

        const sorted = leaderboard
            .map(entry => ({
                ...entry,
                user: clientMap[entry.clientId] || { fullName: 'Unknown', image: '' }
            }))
            .sort((a, b) => b.progress - a.progress)
            .map((entry, index) => ({
                clientId: entry.clientId,
                rank: index + 1,
                fullName: entry.user.fullName,
                image: entry.user.image,
                progress: entry.progress,
                completedAt: entry.completedAt
            }));

        res.status(200).json({
            leaderboard: limit ? sorted.slice(0, parseInt(limit)) : sorted,
            totalParticipants: sorted.length
        });
    } catch (err) {
        console.error('Leaderboard error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
