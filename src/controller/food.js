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
      energy: energy,
      fat: fat,
      carbohydrate: carbohydrate,
      protein: protein,
    }
    const micronutrients = {
      cholesterol: cholesterol,
      fiber: fiber,
      sodium: sodium,
      water: water,
      vitaminA: vitaminA,
      vitaminB6: vitaminB6,
      vitaminB12: vitaminB12,
      vitaminC: vitaminC,
      vitaminD_D2_D3: vitaminD_D2_D3,
      vitaminE: vitaminE,
      vitaminK: vitaminK,
      starch: starch,
      lactose: lactose,
      alcohol: alcohol,
      caffeine: caffeine,
      sugars: sugars,
      calcium: calcium,
      iron: iron,
      magnesium: magnesium,
      phosphorus: phosphorus,
      potassium: potassium,
      zinc: zinc,
      copper: copper,
      fluorlde: fluorlde,
      manganese: manganese,
      selenium: selenium,
      thiamin: thiamin,
      riboflavin: riboflavin,
      niacin: niacin,
      pantothenicAcid: pantothenicAcid,
      folateTotal: folateTotal,
      folicAcid: folicAcid,
      fattyAcidsTotalTrans: fattyAcidsTotalTrans,
      fattyAcidsTotalSaturated: fattyAcidsTotalSaturated,
      fattyAcidsTotalMonounsaturated: fattyAcidsTotalMonounsaturated,
      fattyAcidsTotalPolyunsaturated: fattyAcidsTotalPolyunsaturated,
      chloride: chloride,
    }

    if (!name) {
      return res.status(400).json({ message: 'name is required' });
    }
    if (!group) {
      return res.status(400).json({ message: 'group is required' });
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
    const measureId = req.body.measureId;

    const commonMeasure = await Food.findOne({userId: userId,_id:foodId});

    if(measureId) {
      const data = commonMeasure.commonMeasures.findIndex((food) => {
        return measureId.toString() === food._id.toString()
     })
 
       if(data !== -1){
         commonMeasure.commonMeasures.splice(data,1);
       }
       else{
         return res.status(404).json({message:'commonMeasure not found'});
       }
 
       await commonMeasure.save();
    }
    
    const existing = await Food.findOne({ _id: foodId });

    if (!existing) {
      return res.status(404).json({ message: 'food not found' })
    }

    if (existing) {
      for (let field in updateFields) {
        if (existing.micronutrients.hasOwnProperty(field)) {
          existing.micronutrients[field] = updateFields[field]
        }
        if (existing.macronutrients.hasOwnProperty(field)) {
          existing.macronutrients[field] = updateFields[field]
        }
        if (existing.macronutrients.hasOwnProperty(field)) {
          existing.macronutrients[field] = updateFields[field]
        }
        const fieldsToUpdate = ["name", "source", "group", "quantity"];

        for (const field of fieldsToUpdate) {
          if (updateFields.hasOwnProperty(field)) {
            existing[field] = updateFields[field];
          }
        }

        if (updateFields.hasOwnProperty('commonMeasures')) {
          const updatedCommonMeasures = updateFields.commonMeasures;

          if (Array.isArray(existing.commonMeasures)) {
            updatedCommonMeasures.forEach(updatedMeasure => {
              if (updatedMeasure._id) {
                const indexToUpdate = existing.commonMeasures.findIndex((oldMeasure) =>
                  oldMeasure._id.toString() === updatedMeasure._id
                );

                if (indexToUpdate !== -1) {
                  if (updatedMeasure.singularName !== undefined) {
                    existing.commonMeasures[indexToUpdate].singularName = updatedMeasure.singularName;
                  }
                  if (updatedMeasure.pluralName !== undefined) {
                    existing.commonMeasures[indexToUpdate].pluralName = updatedMeasure.pluralName;
                  }
                  if (updatedMeasure.quantity !== undefined) {
                    existing.commonMeasures[indexToUpdate].quantity = updatedMeasure.quantity;
                  }
                  if (updatedMeasure.totalGrams !== undefined) {
                    existing.commonMeasures[indexToUpdate].totalGrams = updatedMeasure.totalGrams;
                  }
                  if (updatedMeasure.ediblePortion !== undefined) {
                    existing.commonMeasures[indexToUpdate].ediblePortion = updatedMeasure.ediblePortion;
                  }

                }
              } else {
                existing.commonMeasures.push(updatedMeasure);
              }
            });
          }
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

const deleteCommonMeasure = async(req, res, next) => {
  try {

    const userId = req.userId;
    const foodId = req.params.foodId;
    const measureId = req.body.measureId;
    const commonMeasure = await Food.findOne({userId: userId,_id:foodId});
    if(!commonMeasure){
      return res.status(404).json({message: 'food not found'});
    }
    const data = commonMeasure.commonMeasures.findIndex((food) => {
       return measureId.toString() === food._id.toString()
    })

      if(data !== -1){
        commonMeasure.commonMeasures.splice(data,1);
      }
      else{
        return res.status(404).json({message:'commonMeasure not fo  und'});
      }

    const result = await commonMeasure.save();
    return res.status(200).json({success:true, data:result});
  }
  catch (err){
    next(err);
  }
}

module.exports = {
  addFood,
  getAllFood,
  getFoodById,
  getFoodsByUser,
  deleteFood,
  updateFood,
  deleteCommonMeasure
};
