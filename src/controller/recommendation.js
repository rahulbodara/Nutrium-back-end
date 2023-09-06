const client_Recommendation = require('../model/Recommendations');

const createRecommendation = async (req, res, next) => {
    try {
        const userId = req.userId;
        const clientId = req.params.clientId;
        const { physicalActivity, foodAvoids, waterIntake, recommendation } = req.body;

        const recommendations = await client_Recommendation.create({
            userId: userId,
            physicalActivity,
            foodAvoids,
            waterIntake,
            recommendation,
            clientId: clientId
        });
        const result = await recommendations.save();

        res.status(201).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
}

const deletePhysicalActivity = async (req, res, next) => {

    const { subArrayIndex, elementIndex } = req.params;

    try {
        const activity = await client_Recommendation.findOne({ _id: req.params.id });

        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        activity.physicalActivity[subArrayIndex].splice(elementIndex, 1);

        const result = await activity.save();

        return res.status(200).json({ message: 'Activity removed successfully', data: result });
    }
    catch (err) {
        console.log(err);
        next(err);
    }

}




module.exports = {
    createRecommendation,
    deletePhysicalActivity
}