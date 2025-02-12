const client_Recommendation = require('../model/Recommendations');
const physicalActivity = require('../model/Physicalactivity');
const { default: mongoose } = require('mongoose');
const Recommendation = require('../model/Recommendations');
const WaterIntake = require('../model/waterIntake');

const createRecommendation = async (req, res, next) => {
    try {
        const userId = req.userId;
        const clientId = req.params.clientId;
        const { physicalActivity, foodAvoids, waterIntake, recommendation } = req.body;

        const filter = {
            userId: userId,
            clientId: clientId
        };

        const existingRecommendation = await client_Recommendation.findOne(filter);

        if (existingRecommendation) {
            if (physicalActivity && !physicalActivity._id) {
                existingRecommendation.physicalActivity.push([physicalActivity]);
            } else if (physicalActivity) {
                let matchingSubarrayIndex = -1;

                existingRecommendation.physicalActivity.some((subarray, index) => {
                    if (subarray.some(obj => obj._id.toString() === physicalActivity._id)) {
                        matchingSubarrayIndex = index;
                        return true;
                    }
                    return false;
                });

                if (matchingSubarrayIndex !== -1) {
                    existingRecommendation.physicalActivity[matchingSubarrayIndex].push({ ...physicalActivity, _id: mongoose.Schema.Types.objectId });
                } else {
                    existingRecommendation.physicalActivity.push([physicalActivity]);
                }
            }

            if (foodAvoids !== undefined) {
                existingRecommendation.foodAvoids = foodAvoids;
            }
            if (waterIntake !== undefined) {
                existingRecommendation.waterIntake = waterIntake;
            }
            if (recommendation !== undefined) {
                existingRecommendation.recommendation = recommendation;
            }

            await existingRecommendation.save();

            res.status(200).json({ success: true, data: existingRecommendation });
        } else {
            const newRecommendation = new client_Recommendation({
                userId,
                clientId,
                physicalActivity: physicalActivity ? [[physicalActivity]] : [],
                foodAvoids,
                waterIntake,
                recommendation
            });

            await newRecommendation.save();

            res.status(200).json({ success: true, data: newRecommendation });
        }
    } catch (err) {
        console.log(err);
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

    const { clientId, objectId } = req.params;

    try {
        const client = await client_Recommendation.findOne({ clientId: clientId });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        let activity = client.physicalActivity.map(object => {
            const data = object.map(item => {
                if (item._id.toString() !== objectId) {
                    return item
                }
            }
            )
            return data;
        });

        let data = activity.map(subArray => subArray.filter(item => item));

        client.physicalActivity = data;

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        const result = await client.save()

        return res.status(200).json({ message: 'Activity removed successfully', data: result });
    }
    catch (err) {
        next(err);
    }
}
const getRecommendations = async (req, res, next) => {
    try {
        const clientId = req.params.clientId;
        const recommendations = await client_Recommendation.find({ clientId: clientId });
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

        const recordTime = time || new Date().toISOString().split('T')[1].split('.')[0];

        let waterIntakeData = await WaterIntake.findOne({ clientId, userId });

        if (!waterIntakeData) {
            waterIntakeData = new WaterIntake({
                clientId,
                userId,
                waterIntakeRecords: [
                    {
                        date: recordDate,
                        time: recordTime,
                        waterIntakeAmount: [{ amount: `${waterIntake}ml` }]
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
                    time: recordTime,
                    waterIntakeAmount: [{ amount: `${waterIntake}ml` }]
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
    getWaterIntake
}