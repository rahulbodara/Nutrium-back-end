const cron = require("node-cron");
const Lookup = require("./model/lookupUser");
const Template = require("./model/mealTemplate");
const FoodDiary = require('./model/FoodDiary');
const challenge = require("./model/Challenge/challenge");

cron.schedule("* * * * *", async () => {
    console.log("Cron job started...");

    try {
        const expiredEntriesCount = await Lookup.countDocuments({ timestamp: { $lte: new Date(Date.now() - 1296000000) } });
        console.log(`Expired entries in the last minute: ${expiredEntriesCount}`);
    } catch (error) {
        console.error("Error checking expired lookup entries:", error);
    }
});
//"0 0 * * *"  "*/30 * * * *"
cron.schedule("1 0 * * *", async () => {
    console.log(" Running scheduled task at 12:00 AM...");

    try {
        const diaries = await FoodDiary.find();

        const today = new Date();
        const isoDate = today.toISOString();
        const dayName = today.toLocaleDateString("en-US", { weekday: "long" });

        const userClientPairs = diaries.map(d => ({ userId: d.userId, clientId: d.clientId }));
        const templates = await Template.find({ $or: userClientPairs });

        const templateMap = new Map();
        templates.forEach(template => {
            templateMap.set(`${template.userId}-${template.clientId}`, template);
        });

        for (const diary of diaries) {
            const { userId, clientId } = diary;
            const template = templateMap.get(`${userId}-${clientId}`);

            if (template) {
                const index = template.mealTemplate.findIndex(item => item.days.includes(dayName));
                const data = {
                    registrationDate: isoDate,
                    mealSchedule: (index !== -1)
                        ? template.mealTemplate[index].mealSchedule
                        : template.mealTemplate[0].mealSchedule
                };

                diary.foodDiaryData.push(data);
                await diary.save();
            }
        }
        console.log("✅ Food diary updates completed.");
    } catch (error) {
        console.error("❌ [Job 2] Error:", error);
    }
});


const dailyChallengeSnapshot = (io) => {
    cron.schedule('0 0 * * * *', async () => {
        console.log("🎯 Running daily challenge snapshot (12 am)");

        const now = new Date();
        const today = now.toISOString().split('T')[0];

        try {
            const challenges = await challenge.find({
                startDate: { $lte: now },
                endDate: { $gte: now }
            });

            for (const c of challenges) {
                const participants = c.participants.filter(p => p.status === 'accepted');

                participants.forEach(participant => {
                    const { clientId, progress } = participant;

                    io.to(c._id.toString()).emit('dailyChallengeUpdate', {
                        challengeId: c._id,
                        userId: clientId,
                        date: today,
                        total: progress?.total || 0,
                        entries: progress?.entries || [],
                        completedAt: participant.completedAt || null,
                        earnedCoins: participant.earnedCoins || 0
                    });

                    io.to(clientId.toString()).emit('dailyChallengeUpdate', {
                        challengeId: c._id,
                        userId: clientId,
                        date: today,
                        total: progress?.total || 0,
                        entries: progress?.entries || [],
                        completedAt: participant.completedAt || null,
                        earnedCoins: participant.earnedCoins || 0
                    });
                });
            }

        } catch (err) {
            console.error('🔥 Error during daily challenge snapshot:', err);
        }
    });
};



module.exports = cron;
module.exports.dailyChallengeSnapshot = dailyChallengeSnapshot;
