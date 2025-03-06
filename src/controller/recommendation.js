const client_Recommendation = require('../model/Recommendations');
const physicalActivity = require('../model/Physicalactivity');
const { default: mongoose } = require('mongoose');
const Recommendation = require('../model/Recommendations');
const WaterIntake = require('../model/waterIntake');
const ClientSidePhysicalActivity = require("../model/ClintSidePhysicalActivity")

const createRecommendation = async (req, res, next) => {
    try {
        const userId = req.userId;
        const clientId = req.params.clientId;
        const { physicalActivity = [], foodAvoids, waterIntake, recommendation } = req.body;

        const filter = { userId, clientId };

        let existingRecommendation = await client_Recommendation.findOne(filter);

        if (!existingRecommendation) {
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

        if (!Array.isArray(existingRecommendation.physicalActivity)) {
            existingRecommendation.physicalActivity = [];
        }

        physicalActivity.forEach((newActivity) => {
            const exists = existingRecommendation.physicalActivity.some(act => act.activity === newActivity.activity);

            if (!exists) {
                existingRecommendation.physicalActivity.push({ ...newActivity, _id: new mongoose.Types.ObjectId() });
            }
        });

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

        const client = await client_Recommendation.findOne({ clientId });

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        let flattenedActivities = client.physicalActivity.flat();

        if (!flattenedActivities.length) {
            return res.status(404).json({ message: 'No activities found' });
        }

        const initialLength = flattenedActivities.length;
        flattenedActivities = flattenedActivities.filter(item => item?._id?.toString() !== objectId);

        if (flattenedActivities.length === initialLength) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        client.physicalActivity = flattenedActivities;

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

        // Get current UTC date at midnight
        let recordDate = date ? new Date(date) : new Date();
        recordDate.setUTCHours(0, 0, 0, 0);

        // Validate time input
        let recordTime;
        if (time && /^\d{2}:\d{2}$/.test(time)) {
            let [hours, minutes] = time.split(':').map(Number);

            // If minutes are invalid, default to current time
            if (minutes >= 60) {
                console.warn("Invalid time format. Using current UTC time.");
                const nowUtc = new Date();
                recordTime = nowUtc.toISOString().split('T')[1].split('.')[0];
            } else {
                const utcTime = new Date(Date.UTC(
                    recordDate.getUTCFullYear(),
                    recordDate.getUTCMonth(),
                    recordDate.getUTCDate(),
                    hours, minutes, 0
                ));
                recordTime = utcTime.toISOString().split('T')[1].split('.')[0]; // Store as HH:mm:ss
            }
        } else {
            // Default to current UTC time if time is missing or invalid
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
                        DailyGoal: 0, // Default to 0 if not provided
                        waterIntakeAmount: [{ amount: `${waterIntake}ml`, time: recordTime }]
                    }
                ]
            });
        } else {
            let existingDateRecord = waterIntakeData.waterIntakeRecords.find(record =>
                new Date(record.date).getTime() === recordDate.getTime()
            );

            if (existingDateRecord) {
                existingDateRecord.waterIntakeAmount.push({
                    amount: `${waterIntake}ml`,
                    time: recordTime
                });
            } else {
                waterIntakeData.waterIntakeRecords.push({
                    date: recordDate,
                    DailyGoal: 0,
                    waterIntakeAmount: [{ amount: `${waterIntake}ml`, time: recordTime }]
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

        let existingWaterRecord = existingDateRecord.waterIntakeAmount.find(entry =>
            entry._id.toString() === waterIntakeAmountId
        );

        if (!existingWaterRecord) {
            return res.status(404).json({ message: "Water intake entry not found." });
        }

        let oldDate = existingDateRecord.date.toISOString().split("T")[0];
        let newDate = date ? new Date(date).toISOString().split("T")[0] : oldDate;

        let recordTime = existingWaterRecord.time;
        if (time) {
            const [hours, minutes, seconds] = time.split(":").map(Number);
            recordTime = new Date(Date.UTC(
                new Date().getUTCFullYear(),
                new Date().getUTCMonth(),
                new Date().getUTCDate(),
                hours, minutes, seconds || 0
            )).toISOString().split("T")[1].split(".")[0];
        }

        if (newDate === oldDate) {

            existingDateRecord.waterIntakeAmount.push({
                _id: new mongoose.Types.ObjectId(),
                amount: waterIntake && !isNaN(parseInt(waterIntake))
                    ? `${waterIntake}ml`
                    : "0ml",
                time: recordTime
            });

        } else {
            let newDateRecord = waterIntakeData.waterIntakeRecords.find(record =>
                record.date.toISOString().split("T")[0] === newDate
            );

            if (!newDateRecord) {
                newDateRecord = {
                    _id: new mongoose.Types.ObjectId(),
                    date: new Date(newDate),
                    DailyGoal: existingDateRecord.DailyGoal,
                    waterIntakeAmount: [{
                        _id: existingWaterRecord._id,
                        amount: waterIntake
                            ? `${waterIntake}ml`
                            : existingWaterRecord.amount,
                        time: recordTime
                    }]
                };
                waterIntakeData.waterIntakeRecords.push(newDateRecord);
            } else {
                let existingNewTimeRecord = newDateRecord.waterIntakeAmount.find(
                    entry => entry.time === recordTime
                );

                if (existingNewTimeRecord) {
                    const oldAmount = parseInt(existingNewTimeRecord.amount) || 0;
                    const newAmount = parseInt(waterIntake) || 0;
                    existingNewTimeRecord.amount = `${oldAmount + newAmount}ml`;
                } else {
                    newDateRecord.waterIntakeAmount.push({
                        _id: existingWaterRecord._id,
                        amount: waterIntake && !isNaN(parseInt(waterIntake))
                            ? `${waterIntake}ml`
                            : existingWaterRecord.amount,
                        time: recordTime
                    });
                }
            }

            existingDateRecord.waterIntakeAmount = existingDateRecord.waterIntakeAmount.filter(
                entry => entry._id.toString() !== waterIntakeAmountId
            );

            if (existingDateRecord.waterIntakeAmount.length === 0) {
                existingDateRecord.waterIntakeAmount = [];
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

        let waterIntakeData = await WaterIntake.findOne({ _id: waterIntakeId, userId });

        if (!waterIntakeData) {
            return res.status(404).json({ message: "Water intake data not found." });
        }

        if (waterRecordId && waterIntakeAmountId) {
            let dateRecord = waterIntakeData.waterIntakeRecords.find(record => record._id.toString() === waterRecordId);
            if (!dateRecord) {
                return res.status(404).json({ message: "Water record not found." });
            }

            let initialLength = dateRecord.waterIntakeAmount.length;
            dateRecord.waterIntakeAmount = dateRecord.waterIntakeAmount.filter(entry => entry._id.toString() !== waterIntakeAmountId);

            if (dateRecord.waterIntakeAmount.length === initialLength) {
                return res.status(404).json({ message: "Water intake entry not found." });
            }

            waterIntakeData.waterIntakeRecords = waterIntakeData.waterIntakeRecords.filter(record => record.waterIntakeAmount.length > 0);

        } else if (waterRecordId) {
            let initialLength = waterIntakeData.waterIntakeRecords.length;
            waterIntakeData.waterIntakeRecords = waterIntakeData.waterIntakeRecords.filter(record => record._id.toString() !== waterRecordId);

            if (waterIntakeData.waterIntakeRecords.length === initialLength) {
                return res.status(404).json({ message: "Water record not found." });
            }
        } else {
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

const addPhysicalActivityByClient = async (req, res) => {
    try {
        const userId = req.userId;
        const clientId = req.params.clientId;
        const { physicalActivity } = req.body;

        if (!Array.isArray(physicalActivity)) {
            return res.status(400).json({ message: "Invalid format. 'physicalActivity' must be an array." });
        }

        let clientData = await ClientSidePhysicalActivity.findOne({ clientId });

        if (clientData) {
            physicalActivity.forEach(activity => {
                activity.date = activity.date ? new Date(activity.date) : new Date();
            });
            clientData.physicalActivity.push(...physicalActivity);
        } else {
            clientData = new ClientSidePhysicalActivity({
                userId,
                clientId,
                physicalActivity: physicalActivity.map(activity => ({
                    ...activity,
                    date: activity.date ? new Date(activity.date) : new Date(),
                })),
            });
        }

        await clientData.save();

        let recommendation = await Recommendation.findOne({ clientId });

        if (!recommendation) {
            recommendation = new Recommendation({
                userId,
                clientId,
                physicalActivity: []
            });
        }

        let flatActivities = recommendation.physicalActivity.flat();

        physicalActivity.forEach(newActivity => {
            let existingActivity = flatActivities.find(existing => existing.activity === newActivity.activity);

            if (existingActivity) {
                existingActivity.time = newActivity.time;
                existingActivity.timeunit = newActivity.timeunit;
                existingActivity.durations = newActivity.durations;
                existingActivity.met = newActivity.met;
                existingActivity.byactivity = newActivity.byactivity;
                existingActivity.dailyaverage = newActivity.dailyaverage;
            } else {
                flatActivities.push(newActivity);
            }
        });

        recommendation.physicalActivity = flatActivities.map(activity => [activity]);

        await recommendation.save();

        return res.status(200).json({
            success: true,
            message: "Activity added successfully and updated in quick access",
            data: {
                clientData,
                recommendation
            },
        });
    } catch (error) {
        console.error("Error in addPhysicalActivityByClient:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};


const getPhysicalActivityByClient = async (req, res) => {
    try {
        const { clientId } = req.params;

        const clientData = await ClientSidePhysicalActivity.findOne({ clientId });

        if (!clientData) {
            return res.status(404).json({ message: "No records found for this client." });
        }

        return res.status(200).json({
            success: true,
            message: "Data retrieved successfully",
            data: clientData,
        });
    } catch (error) {
        console.error("Error in getPhysicalActivityByClient:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};


const updatePhysicalActivityByClient = async (req, res) => {
    try {
        const { clientId, activityId } = req.params;
        const updateData = req.body;

        let clientData = await ClientSidePhysicalActivity.findOne({ clientId });

        if (!clientData) {
            return res.status(404).json({ message: "Client record not found." });
        }

        let activityIndex = clientData.physicalActivity.findIndex(activity => activity._id.toString() === activityId);

        if (activityIndex === -1) {
            return res.status(404).json({ message: "Activity not found." });
        }

        clientData.physicalActivity[activityIndex] = {
            ...clientData.physicalActivity[activityIndex].toObject(),
            ...updateData,
            date: updateData.date ? new Date(updateData.date) : clientData.physicalActivity[activityIndex].date,
        };

        await clientData.save();

        let recommendation = await Recommendation.findOne({ clientId });

        if (!recommendation) {
            recommendation = new Recommendation({
                userId: clientData.userId,
                clientId,
                physicalActivity: [],
            });
        }

        let updated = false;

        recommendation.physicalActivity = recommendation.physicalActivity.map((group) => {
            return group.map((activity) => {
                if (activity._id.toString() === activityId) {
                    updated = true;
                    return {
                        ...activity.toObject(),
                        ...updateData,
                        date: updateData.date ? new Date(updateData.date) : activity.date,
                    };
                }
                return activity;
            });
        });

        if (!updated) {
            recommendation.physicalActivity.push([
                {
                    _id: activityId,
                    ...updateData,
                    date: updateData.date ? new Date(updateData.date) : new Date(),
                },
            ]);
        }

        await recommendation.save();

        return res.status(200).json({
            success: true,
            message: "Activity updated successfully in client and recommendation",
            data: {
                clientActivity: clientData.physicalActivity[activityIndex],
                recommendation,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};




const deletePhysicalActivityByClient = async (req, res) => {
    try {
        const { clientId, activityId } = req.params;

        let clientData = await ClientSidePhysicalActivity.findOne({ clientId });

        if (!clientData) {
            return res.status(404).json({ message: "Client record not found." });
        }

        let activityIndex = clientData.physicalActivity.findIndex(activity => activity._id.toString() === activityId);

        if (activityIndex === -1) {
            return res.status(404).json({ message: "Activity not found." });
        }

        clientData.physicalActivity.splice(activityIndex, 1);

        await clientData.save();

        return res.status(200).json({
            success: true,
            message: "Activity deleted successfully",
            data: clientData,
        });
    } catch (error) {
        console.error("Error in deletePhysicalActivityByClient:", error);
        return res.status(500).json({ success: true, message: "Server error", error });
    }
};


const deleteAllPhysicalActivitiesByClient = async (req, res) => {
    try {
        const { clientId } = req.params;

        let clientData = await ClientSidePhysicalActivity.findOne({ clientId });

        if (!clientData) {
            return res.status(404).json({ message: "Client record not found." });
        }

        clientData.physicalActivity = [];

        await clientData.save();

        return res.status(200).json({
            success: true,
            message: "All activities deleted successfully",
            data: clientData,
        });
    } catch (error) {
        console.error("Error in deleteAllPhysicalActivitiesByClient:", error);
        return res.status(500).json({ success: true, message: "Server error", error });
    }
};


const getQuickAccessActivityByClient = async (req, res) => {
    try {
        const { clientId } = req.params;

        const clientData = await Recommendation.findOne(
            { clientId },
            { clientId: 1, userId: 1, timestamp: 1, physicalActivity: 1, _id: 1 }
        );

        if (!clientData) {
            return res.status(404).json({ message: "No records found for this client." });
        }


        return res.status(200).json({
            success: true,
            message: "Data retrieved successfully",
            data: clientData,
        });
    } catch (error) {
        console.error("❌ Error in getQuickAccessActivityByClient:", error);
        return res.status(500).json({ success: true, message: "Server error", error });
    }
};

const getOtherRecommendation = async (req, res) => {
    try {
        const { clientId } = req.params;

        const clientData = await Recommendation.findOne(
            { clientId },
            { clientId: 1, userId: 1, timestamp: 1, recommendation: 1, _id: 1 }
        );

        if (!clientData) {
            return res.status(404).json({ success: true, data: [], message: "No records found for this client." });
        }


        return res.status(200).json({
            success: true,
            message: "Data retrieved successfully",
            data: clientData,
        });
    } catch (error) {
        console.error("❌ Error in getQuickAccessActivityByClient:", error);
        return res.status(500).json({ sucess: true, message: "Server error", error });
    }
}

const getFoodAvoid = async (req, res) => {
    try {
        const { clientId } = req.params;

        const clientData = await Recommendation.findOne(
            { clientId },
            { clientId: 1, userId: 1, timestamp: 1, foodAvoids: 1, _id: 1 }
        );

        if (!clientData) {
            return res.status(404).json({ success: true, message: "No records found for this client." });
        }


        return res.status(200).json({
            success: true,
            message: "Data retrieved successfully",
            data: clientData,
        });
    } catch (error) {
        console.error("❌ Error in getQuickAccessActivityByClient:", error);
        return res.status(500).json({ message: "Server error", error });
    }
}





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
    addPhysicalActivityByClient,
    getPhysicalActivityByClient,
    updatePhysicalActivityByClient,
    deletePhysicalActivityByClient,
    deleteAllPhysicalActivitiesByClient,
    getQuickAccessActivityByClient,
    getOtherRecommendation,
    getFoodAvoid
}