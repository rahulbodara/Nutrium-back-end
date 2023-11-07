const client_Recommendation = require('../model/Recommendations');
const physicalActivity = require('../model/Physicalactivity');

const createRecommendation = async (req, res, next) => {
    try {
        const userId = req.userId;
        const clientId = req.params.clientId;
        const { physicalActivity, foodAvoids, waterIntake, recommendation } = req.body;

        const filter = {
            userId: userId,
            clientId: clientId
        };

        const update = {
            physicalActivity,
            foodAvoids,
            waterIntake,
            recommendation
        };

        const result = await client_Recommendation.findOneAndUpdate(filter, update, {
            upsert: true,
            new: true,
        });

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


module.exports = {
    createRecommendation,
    deletePhysicalActivity,
    getRecommendations,
    createPhysicalActivity,
    getPhysicalActivity
}