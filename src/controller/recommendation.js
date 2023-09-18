const client_Recommendation = require('../model/Recommendations');

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

    const { subArrayIndex, elementIndex } = req.params;

    try {
        const activity = await client_Recommendation.findOne({ _id: req.params.id });

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        activity.physicalActivity[subArrayIndex].splice(elementIndex, 1);

        const result = await activity.save();

        return res.status(200).json({ message: 'Activity removed successfully', data: result });
    }
    catch (err) {
        next(err);
    }

}


const getRecommendations = async(req,res,next)=>{
    try{
        const clientId = req.params.clientId;
        const recommendations = await client_Recommendation.find({clientId: clientId});
        if(!recommendations){
            return res.status(404).json({message:'Recommendations not found'});
        }
       return res.status(200).json({success:true,data:recommendations});
    }
    catch(err){
        next(err);
    }
}


module.exports = {
    createRecommendation,
    deletePhysicalActivity,
    getRecommendations
}