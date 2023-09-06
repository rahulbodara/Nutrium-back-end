const dailyPlan = require('../model/DailyPlan');

const createDailyPlan = async(req,res,next) => {
    try {
        const userId = req.userId;
        const clientId = req.params.clientId;
        const {mealId,name,note,categories} = req.body;

        const plan = new dailyPlan({
            userId,
            clientId,
            mealId,
            name,
            note,
            categories
        });
        const result = await plan.save();
        const populatedPlan = await dailyPlan.findById(result._id).populate('mealId');
        return res.status(201).json({message:"successfully added plan",data:populatedPlan});
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createDailyPlan
}