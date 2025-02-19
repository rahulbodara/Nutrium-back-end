const cron = require("node-cron");
const Lookup = require("./model/lookupUser");
const Template = require("./model/mealTemplate");
const foodDiary = require("./model/FoodDiary");

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
cron.schedule("0 0 * * *", async () => {
    console.log(" Running scheduled task at 12:00 AM...");

    try {
        // const templates = await Template.find({
        //     userId: { $exists: true },
        //     clientId: { $exists: true }
        // });
        // console.log("templates",templates);
        
        // const Diary = await foodDiary.find(); 

        // console.log("foodDiaries",foodDiary);
        // for (const template of templates){
        //     const { userId, clientId } = template;
        //     const existingEntry = await foodDiary.findOne({ userId, clientId });
        //     if (!existingEntry) {
        //         await foodDiary.create({
        //             userId,
        //             clientId,
        //             registrationDate,
        //             mealSchedule
        //         })
        //     }

        // }
        
        
    } catch (error) {
        console.error("❌ [Job 2] Error:", error);
    }
});

module.exports = cron;
