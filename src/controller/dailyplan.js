const DailyPlan = require('../model/DailyPlan');
const Mealplan = require('../model/Mealplan');

const createDailyPlan = async (req, res, next) => {
    try {
      const userId = req.userId;
      const clientId = req.params.clientId;
      const { mealId, name, note, categories } = req.body;
  
      const existingMealPlan = await Mealplan.findOne({ clientId: clientId });
  
      if (!existingMealPlan) {
        const defaultMealPlan = new Mealplan({
          userId: userId,
          days: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          clientId: clientId,
        });
  
        const savedDefaultMealPlan = await defaultMealPlan.save();
        const plan = new DailyPlan({
          userId,
          clientId,
          mealId: savedDefaultMealPlan._id,
          name,
          note,
          categories,
        });
  
        const result = await plan.save();
        const populatedPlan = await DailyPlan.findById(result._id).populate('mealId');
        return res.status(201).json({ message: 'Successfully added plan', data: populatedPlan });
      } else {
        const plan = new DailyPlan({
          userId,
          clientId,
          mealId: existingMealPlan._id,
          name,
          note,
          categories,
        });
  
        const result = await plan.save();
        const populatedPlan = await DailyPlan.findById(result._id).populate('mealId');
        return res.status(201).json({ message: 'Successfully added plan', data: populatedPlan });
      }
    } catch (error) {
      next(error);
    }
  };
  

module.exports = {
    createDailyPlan
}