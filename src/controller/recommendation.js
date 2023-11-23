const client_Recommendation = require('../model/Recommendations');
const physicalActivity = require('../model/Physicalactivity');
const { default: mongoose } = require('mongoose');

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
                console.log('<<---start-->>');
                existingRecommendation.physicalActivity.push([physicalActivity]);
            } else if(physicalActivity) {
                console.log('<<--statrt1-->>');
                let matchingSubarrayIndex = -1;

                existingRecommendation.physicalActivity.some((subarray, index) => {
                    if (subarray.some(obj => obj._id.toString() === physicalActivity._id)) {
                        console.log('subarray-->>',subarray);
                        matchingSubarrayIndex = index;
                        return true;
                    }
                    return false;
                });

                if (matchingSubarrayIndex !== -1) {
                    existingRecommendation.physicalActivity[matchingSubarrayIndex].push({...physicalActivity,_id:mongoose.Schema.Types.objectId});
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

        const existingRecord = await client_Recommendation.findOne({clientId: clientId});
        console.log('existingRecord-->>',existingRecord);

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


module.exports = {
    createRecommendation,
    deletePhysicalActivity,
    getRecommendations,
    createPhysicalActivity,
    getPhysicalActivity,
    addPhysicalActivityObject
}