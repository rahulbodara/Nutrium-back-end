const Food = require('../model/Food');

const addFood = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {
      name,
      source,
      group,
      quantity,
      energy,
      fat,
      carbohydrate,
      protein,
      cholesterol,
      fiber,
      sodium,
      water,
      vitaminA,
      vitaminB6,
      vitaminB12,
      vitaminC,
      vitaminD_D2_D3,
      vitaminE,
      vitaminK,
      starch,
      lactose,
      alcohol,
      caffeine,
      sugars,
      calcium,
      iron,
      magnesium,
      phosphorus,
      potassium,
      zinc,
      copper,
      fluorlde,
      manganese,
      selenium,
      thiamin,
      riboflavin,
      niacin,
      pantothenicAcid,
      folateTotal,
      folicAcid,
      fattyAcidsTotalTrans,
      fattyAcidsTotalSaturated,
      fattyAcidsTotalMonounsaturated,
      fattyAcidsTotalPolyunsaturated,
      chloride,
      commonMeasures,
    } = req.body;

    const macronutrients = {
      energy:energy,
      fat:fat,
      carbohydrate:carbohydrate,
      protein:protein,
    }
    const micronutrients = {
      cholesterol:cholesterol,
      fiber:fiber,
      sodium:sodium,
      water:water,
      vitaminA:vitaminA,
      vitaminB6:vitaminB6,
      vitaminB12:vitaminB12,
      vitaminC:vitaminC,
      vitaminD_D2_D3:vitaminD_D2_D3,
      vitaminE:vitaminE,
      vitaminK:vitaminK,
      starch:starch,
      lactose:lactose,
      alcohol:alcohol,
      caffeine:caffeine,
      sugars:sugars,
      calcium:calcium,
      iron:iron,
      magnesium:magnesium,
      phosphorus:phosphorus,
      potassium:potassium,
      zinc:zinc,
      copper:copper,
      fluorlde:fluorlde,
      manganese:manganese,
      selenium:selenium,
      thiamin:thiamin,
      riboflavin:riboflavin,
      niacin:niacin,
      pantothenicAcid:pantothenicAcid,
      folateTotal:folateTotal,
      folicAcid:folicAcid,
      fattyAcidsTotalTrans:fattyAcidsTotalTrans,
      fattyAcidsTotalSaturated:fattyAcidsTotalSaturated,
      fattyAcidsTotalMonounsaturated:fattyAcidsTotalMonounsaturated,
      fattyAcidsTotalPolyunsaturated:fattyAcidsTotalPolyunsaturated,
      chloride:chloride,
    }

    const newFood = await Food.create({
      userId,
      name,
      source,
      group,
      quantity,
      macronutrients,
      micronutrients,
      commonMeasures,
    });

    return res.status(200).json({
      success: true,
      message: 'Food created successfully',
      newFood,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getAllFood = async (req, res, next) => {
  try {
    const foods = await Food.find();

    return res.status(200).json({
      success: true,
      foods,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getFoodById = async (req, res, next) => {
  try {
    const foodId = req.params.foodId;
    const userId = req.userId;

    const food = await Food.find({ _id: foodId, userId: userId });

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found',
      });
    }

    return res.status(200).json({
      success: true,
      food,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getFoodsByUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const foods = await Food.find({ userId });

    return res.status(200).json({
      success: true,
      foods,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteFood = async (req, res, next) => {
  try {
    const userId = req.userId;
    const foodId = req.params.foodId;
    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found',
      });
    }

    if (food.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this food',
      });
    }

    await Food.findByIdAndDelete(foodId);

    return res.status(200).json({
      success: true,
      message: 'Food deleted successfully',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateFood = async (req, res, next) => {
  try {
    const foodId = req.params.foodId;
    const userId = req.userId;
    const updateFields = req.body;

    const existing = await Food.findOne({_id: foodId});

    if(!existing) {
      return res.status(404).json({message: 'food not found'})
    }

    if(existing){
      for(let field in updateFields){
        if(existing.micronutrients.hasOwnProperty(field)){
          existing.micronutrients[field] = updateFields[field]
        }
        if(existing.macronutrients.hasOwnProperty(field)){
          existing.macronutrients[field] = updateFields[field]
        }
       
          existing[field] = updateFields[field];

          if (
            existing.commonMeasures &&
            Array.isArray(existing.commonMeasures) &&
            existing.commonMeasures.length > 0 &&
            updateFields._id
          ) {
            const updatedCommonMeasure = existing.commonMeasures.find(
              (measure) => measure._id.toString() === updateFields._id.toString()
            );
      
            if (updatedCommonMeasure) {
              updatedCommonMeasure[field] = updateFields[field];
            }
          }
          if (existing.hasOwnProperty(field) && field !== 'commonMeasures') {
            existing[field] = updateFields[field];
          }
      }
    }

    const result = await existing.save();

    return res.status(200).json({
      success: true,
      message: 'Food updated successfully',
      result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  addFood,
  getAllFood,
  getFoodById,
  getFoodsByUser,
  deleteFood,
  updateFood,
};
