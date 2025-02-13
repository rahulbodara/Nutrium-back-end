const client_Recommendation = require('../model/Recommendations');
const physicalActivity = require('../model/Physicalactivity');
const { default: mongoose } = require('mongoose');
const Recommendation = require('../model/Recommendations');
const WaterIntake = require('../model/waterIntake');

const createRecommendation = async (req, res, next) => {
    try {
        const userId = req.userId;
        const clientId = req.params.clientId;
        const { physicalActivity = [], foodAvoids, waterIntake, recommendation } = req.body;

        const filter = { userId, clientId };

        let existingRecommendation = await client_Recommendation.findOne(filter);

        if (!existingRecommendation) {
            // If no existing record, create a new one with a FLAT ARRAY of objects
            const newRecommendation = new client_Recommendation({
                userId,
                clientId,
                physicalActivity: physicalActivity.map(act => ({ ...act, _id: new mongoose.Types.ObjectId() })),
                foodAvoids,
                waterIntake,
                recommendation,
            });

            await newRecommendation.save();
            return res.status(200).json({ success: true, data: newRecommendation });
        }

        // Ensure physicalActivity is properly structured as a FLAT array
        if (!Array.isArray(existingRecommendation.physicalActivity)) {
            existingRecommendation.physicalActivity = [];
        }

        // Add new activities if they don't already exist
        physicalActivity.forEach((newActivity) => {
            const exists = existingRecommendation.physicalActivity.some(act => act.activity === newActivity.activity);

            if (!exists) {
                existingRecommendation.physicalActivity.push({ ...newActivity, _id: new mongoose.Types.ObjectId() });
            }
        });

        // Update other fields if provided
        if (foodAvoids !== undefined) existingRecommendation.foodAvoids = foodAvoids;
        if (waterIntake !== undefined) existingRecommendation.waterIntake = waterIntake;
        if (recommendation !== undefined) existingRecommendation.recommendation = recommendation;

        await existingRecommendation.save();

        res.status(200).json({ success: true, data: existingRecommendation });
    } catch (err) {
        console.error("Error in createRecommendation:", err);
        next(err);
    }
};

const addPhysicalActivityObject = async (req, res, next) => {
    try {
        const userId = req.userId;
        const clientId = req.params.clientId;
        const { physicalActivity, indexToPush } = req.body;

        const existingRecord = await client_Recommendation.findOne({ clientId: clientId });

        if (!existingRecord) {
            return res.status(404).json({ success: false, message: 'Record not found' });
        }

        existingRecord.physicalActivity[indexToPush].push(...physicalActivity);

        const result = await existingRecord.save();

        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

const deletePhysicalActivity = async (req, res, next) => {
    try {
        const { clientId, objectId } = req.params;

        // Find client recommendation
        const client = await client_Recommendation.findOne({ clientId });

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Flatten the nested array
        let flattenedActivities = client.physicalActivity.flat();

        // Check if physicalActivity exists
        if (!flattenedActivities.length) {
            return res.status(404).json({ message: 'No activities found' });
        }

        // Filter out the activity with the given `objectId`
        const initialLength = flattenedActivities.length;
        flattenedActivities = flattenedActivities.filter(item => item?._id?.toString() !== objectId);

        // Check if anything was removed
        if (flattenedActivities.length === initialLength) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Assign the modified activities back to the original structure (re-nesting)
        client.physicalActivity = flattenedActivities;

        // Save updated document
        const result = await client.save();

        return res.status(200).json({ message: 'Activity removed successfully', data: result });
    } catch (err) {
        console.error("Error in deletePhysicalActivity:", err);
        next(err);
    }
};



const getRecommendations = async (req, res, next) => {
    try {
        const clientId = req.params.clientId;
        const recommendations = await client_Recommendation.findOne({ clientId: clientId });
        if (!recommendations) {
            return res.status(404).json({ message: 'Recommendations not found' });
        }
        return res.status(200).json({ success: true, data: recommendations });
    }
    catch (err) {
        next(err);
    }
}

const createPhysicalActivity = async (req, res, next) => {
    try {

        const { time, timeunit, durations, activity, met, byactivity, dailyaverage } = req.body;

        const newActivity = new physicalActivity({
            time,
            timeunit,
            durations,
            activity,
            met,
            byactivity,
            dailyaverage
        });
        const result = await newActivity.save();
        return res.status(200).json({ success: true, data: result });

    }
    catch (err) {
        next(err);
    }
}

const getPhysicalActivity = async (req, res, next) => {
    try {
        const activities = await physicalActivity.find();
        if (!activities) {
            return res.status(404).json({ message: 'Activities not found' });
        }
        return res.status(200).json({ success: true, data: activities });
    }
    catch (err) {
        next(err);
    }
}

const setWaterIntakeLimit = async (req, res) => {
    try {
        const clientId = req.params.clientId;
        const userId = req.userId;
        const { waterIntakeLimit } = req.body;
        console.log("🚀 ~ setWaterIntakeLimit ~ req.body:", req.body)

        if (!waterIntakeLimit || isNaN(waterIntakeLimit) || waterIntakeLimit <= 0) {
            return res.status(400).json({ message: 'Valid water intake limit is required.' });
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        let waterIntakeRecord = await WaterIntake.findOne({ clientId, userId });

        if (waterIntakeRecord) {
            waterIntakeRecord.waterIntakeLimit = waterIntakeLimit;
            waterIntakeRecord.waterIntakeDate = today;

            let todayRecord = waterIntakeRecord.waterIntakeRecords.find(record =>
                new Date(record.date).getTime() === today.getTime()
            );

            if (todayRecord) {
                todayRecord.DailyGoal = waterIntakeLimit;
            } else {
                waterIntakeRecord.waterIntakeRecords.push({
                    date: today,
                    time: new Date().toISOString().split('T')[1].split('.')[0],
                    DailyGoal: waterIntakeLimit,
                    waterIntakeAmount: []
                });
            }
        } else {
            waterIntakeRecord = new WaterIntake({
                clientId,
                userId,
                waterIntakeLimit,
                waterIntakeDate: today,
                waterIntakeRecords: [
                    {
                        date: today,
                        time: new Date().toISOString().split('T')[1].split('.')[0],
                        DailyGoal: waterIntakeLimit,
                        waterIntakeAmount: []
                    }
                ]
            });
        }

        await waterIntakeRecord.save();

        return res.status(200).json({
            success: true,
            waterIntakeLimit: waterIntakeRecord.waterIntakeLimit
        });

    } catch (error) {
        console.error('Error setting water intake limit:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const waterIntakeLimit = async (req, res) => {
    try {
        const clientId = req.params.clientId;
        const waterIntakeLimit = await WaterIntake.findOne({ clientId }, { clientId: 1, userId: 1, waterIntakeLimit: 1 })

        return res.status(200).json({ success: true, waterIntakeLimit });
    } catch (error) {
        console.error('Error fetching water intake limit:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }

}

const setWaterIntake = async (req, res) => {
    try {
        const userId = req.userId;
        const clientId = req.params.clientId;
        const { waterIntake, date, time } = req.body;

        if (!waterIntake) {
            return res.status(400).json({ message: 'Water intake amount is required.' });
        }

        const recordDate = date ? new Date(date) : new Date();
        recordDate.setUTCHours(0, 0, 0, 0);

        let recordTime;
        if (time) {
            const [hours, minutes] = time.split(':').map(Number);
            const utcTime = new Date(Date.UTC(recordDate.getUTCFullYear(), recordDate.getUTCMonth(), recordDate.getUTCDate(), hours, minutes, 0));
            recordTime = utcTime.toISOString().split('T')[1].split('.')[0]; // Store as HH:mm:ss
        } else {
            const nowUtc = new Date();
            recordTime = nowUtc.toISOString().split('T')[1].split('.')[0];
        }
        let waterIntakeData = await WaterIntake.findOne({ clientId, userId });

        if (!waterIntakeData) {
            waterIntakeData = new WaterIntake({
                clientId,
                userId,
                waterIntakeRecords: [
                    {
                        date: recordDate,
                        waterIntakeAmount: [{ amount: `${waterIntake}ml`, time: recordTime, }]
                    }
                ]
            });
        } else {
            let existingDateRecord = waterIntakeData.waterIntakeRecords.find(record =>
                new Date(record.date).getTime() === recordDate.getTime()
            );

            if (existingDateRecord) {
                existingDateRecord.waterIntakeAmount.push({ amount: `${waterIntake}ml` });
            } else {
                waterIntakeData.waterIntakeRecords.push({
                    date: recordDate,
                    waterIntakeAmount: [{ amount: `${waterIntake}ml`, time: recordTime, }]
                });
            }
        }

        await waterIntakeData.save();

        return res.status(200).json({
            success: true,
            message: 'Water intake recorded successfully.',
            data: waterIntakeData
        });
    } catch (err) {
        console.error('Error setting water intake:', err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const getWaterIntake = async (req, res, next) => {
    try {
        const clientId = req.params.clientId;
        const userId = req.userId;
        const waterIntakeData = await WaterIntake.findOne({ clientId, userId });
        if (!waterIntakeData) {
            return res.status(404).json({ message: 'Water intake data not found.' });
        }
        return res.status(200).json({ success: true, waterIntakeData });
    } catch (error) {
        console.error('Error fetching water intake data:', error);
        return res.status(500).json({ message: 'Internal server error.' });

    }
}


const updateWaterIntake = async (req, res) => {
    try {
        const { waterIntakeId, waterRecordId, waterIntakeAmountId } = req.params;
        const userId = req.userId;
        let { waterIntake, date, time } = req.body;

        let waterIntakeData = await WaterIntake.findOne({ _id: waterIntakeId, userId });

        if (!waterIntakeData) {
            return res.status(404).json({ message: "Water intake data not found." });
        }

        let existingDateRecord = waterIntakeData.waterIntakeRecords.find(record =>
            record._id.toString() === waterRecordId
        );

        if (!existingDateRecord) {
            return res.status(404).json({ message: "Water record for the specified date not found." });
        }

        if (date) {
            existingDateRecord.date = new Date(date);
        }

        let recordTime;
        if (time) {
            const [hours, minutes] = time.split(":").map(Number);
            recordTime = new Date(Date.UTC(
                new Date().getUTCFullYear(),
                new Date().getUTCMonth(),
                new Date().getUTCDate(),
                hours, minutes, 0
            )).toISOString().split("T")[1].split(".")[0];
        } else {
            recordTime = new Date().toISOString().split("T")[1].split(".")[0];
        }

        let existingWaterRecord = existingDateRecord.waterIntakeAmount.find(entry =>
            entry._id.toString() === waterIntakeAmountId
        );

        if (existingWaterRecord) {
            existingWaterRecord.amount = waterIntake !== undefined ? `${waterIntake}ml` : existingWaterRecord.amount;
            existingWaterRecord.time = recordTime;
        } else {
            let existingTimeRecord = existingDateRecord.waterIntakeAmount.find(entry =>
                entry.time === recordTime
            );

            if (existingTimeRecord) {
                existingTimeRecord.amount = waterIntake !== undefined ? `${waterIntake}ml` : existingTimeRecord.amount;
            } else {
                existingDateRecord.waterIntakeAmount.push({
                    _id: new mongoose.Types.ObjectId(),
                    amount: waterIntake !== undefined ? `${waterIntake}ml` : "0ml",
                    time: recordTime,
                });
            }
        }
        await waterIntakeData.save();

        return res.status(200).json({
            success: true,
            message: "Water intake record updated successfully.",
            data: waterIntakeData,
        });
    } catch (error) {
        console.error("Error updating water intake:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};



const deleteWaterIntake = async (req, res) => {
    try {
        const { waterIntakeId, waterRecordId, waterIntakeAmountId } = req.params;
        const userId = req.userId;

        // Find the user's water intake document
        let waterIntakeData = await WaterIntake.findOne({ _id: waterIntakeId, userId });

        if (!waterIntakeData) {
            return res.status(404).json({ message: "Water intake data not found." });
        }

        if (waterRecordId && waterIntakeAmountId) {
            // ✅ Case 1: Delete a single water intake entry by ID
            let dateRecord = waterIntakeData.waterIntakeRecords.find(record => record._id.toString() === waterRecordId);
            if (!dateRecord) {
                return res.status(404).json({ message: "Water record not found." });
            }

            let initialLength = dateRecord.waterIntakeAmount.length;
            dateRecord.waterIntakeAmount = dateRecord.waterIntakeAmount.filter(entry => entry._id.toString() !== waterIntakeAmountId);

            if (dateRecord.waterIntakeAmount.length === initialLength) {
                return res.status(404).json({ message: "Water intake entry not found." });
            }

            // Remove empty date records
            waterIntakeData.waterIntakeRecords = waterIntakeData.waterIntakeRecords.filter(record => record.waterIntakeAmount.length > 0);

        } else if (waterRecordId) {
            // ✅ Case 2: Delete an entire water record for a date
            let initialLength = waterIntakeData.waterIntakeRecords.length;
            waterIntakeData.waterIntakeRecords = waterIntakeData.waterIntakeRecords.filter(record => record._id.toString() !== waterRecordId);

            if (waterIntakeData.waterIntakeRecords.length === initialLength) {
                return res.status(404).json({ message: "Water record not found." });
            }
        } else {
            // ✅ Case 3: Delete all water intake records for the user
            waterIntakeData.waterIntakeRecords = [];
        }

        await waterIntakeData.save();

        return res.status(200).json({
            success: true,
            message: "Water intake data deleted successfully.",
            data: waterIntakeData,
        });

    } catch (error) {
        console.error("Error deleting water intake:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};


module.exports = {
    createRecommendation,
    deletePhysicalActivity,
    getRecommendations,
    createPhysicalActivity,
    getPhysicalActivity,
    addPhysicalActivityObject,
    setWaterIntakeLimit,
    waterIntakeLimit,
    setWaterIntake,
    getWaterIntake,
    updateWaterIntake,
    deleteWaterIntake,
}