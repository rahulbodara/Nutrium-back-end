const cron = require("node-cron");
const Lookup = require("./model/lookupUser");
const Template = require("./model/mealTemplate");
const FoodDiary = require('./model/FoodDiary');

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

module.exports = cron;
