const cron = require("node-cron");
const Lookup = require("./model/lookupUser");

cron.schedule("* * * * *", async () => {
    console.log("Cron job started...");

    try {
        const expiredEntriesCount = await Lookup.countDocuments({ timestamp: { $lte: new Date(Date.now() - 1296000000) } });
        console.log(`Expired entries in the last minute: ${expiredEntriesCount}`);
    } catch (error) {
        console.error("Error checking expired lookup entries:", error);
    }
});

module.exports = cron;
