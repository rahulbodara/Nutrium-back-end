const DailyPlan = require('../model/DailyPlan');
const MealPlan = require('../model/Mealplan');
const mongoose = require('mongoose');
const Food = require('../model/Food');
const Mealplan = require('../model/Mealplan');

// const createMealPlan = async (req, res, next) => {

//   try {
//     const userId = req.userId;
//     const { days, creationMethod, associatePlanning, copyMealsPlan } = req.body;

//     // Create a new Mealplan instance with the provided data
//     const newMealPlanData = {
//       userId: userId,
//       days,
//       creationMethod,
//       associatePlanning,
//       copyMealsPlan,
//     };

//     // Check the creationMethod to determine how to handle the daily plans
//     if (creationMethod === 'Merge selected days into a single version') {
//       // Merge selected days into a single daily plan
//       const selectedDays = days.map((dayData) => dayData.day);
//       const unselectedDays = [
//         'Monday',
//         'Tuesday',
//         'Wednesday',
//         'Thursday',
//         'Friday',
//         'Saturday',
//         'Sunday',
//       ].filter((day) => !selectedDays.includes(day));

//       const dailyPlanDataMerged = {
//         selectedDays,
//         userId: userId,
//         breakfast: '',
//         morningSnack: '',
//         lunch: '',
//       };

//       const createdDailyPlanMerged = await DailyPlan.create(
//         dailyPlanDataMerged
//       );

//       // Store the dailyPlan ObjectId in the Mealplan model
//       newMealPlanData.days = createdDailyPlanMerged._id;

//       // Create another DailyPlan for unselected days
//       const dailyPlanDataUnselected = {
//         selectedDays: unselectedDays,
//         userId: userId,
//         breakfast: '',
//         morningSnack: '',
//         lunch: '',
//       };
//       const createdDailyPlanUnselected = await DailyPlan.create(
//         dailyPlanDataUnselected
//       );

//       // Store the ObjectId of the second DailyPlan in the associatePlanning array of the Mealplan model
//       newMealPlanData.associatePlanning = [
//         { planning: createdDailyPlanUnselected._id },
//       ];
//     } else if (creationMethod === 'Create a verion for each day') {
//       // Create separate daily plans for each selected day
//       for (const dayData of days) {
//         const dailyPlanDataSingle = {
//           selectedDays: [dayData.day],
//           userId: userId,
//           breakfast: '',
//           morningSnack: '',
//           lunch: '',
//         };
//         const createdDailyPlanSingle = await DailyPlan.create(
//           dailyPlanDataSingle
//         );
//         dayData.dailyPlan = createdDailyPlanSingle._id; // Associate the DailyPlan with the Mealplan
//       }
//     } else {
//       throw new Error('Invalid creationMethod provided.');
//     }

//     // Create the Meal Plan in the database using the Mealplan model
//     const createdMealPlan = await Mealplan.create(newMealPlanData);
//     return res.status(201).json({
//       success: true,
//       message: 'Meal Plan created successfully!!!',
//       mealPlan: createdMealPlan,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// createMealPlan


const createMealPlan = async (req, res, next) => {
  try {
    const mealPlanData = req.body;
    const clientId = req.params.clientId;
    const userId = req.userId;


    if (mealPlanData.days && mealPlanData.days.length > 0) {
      const allDaysSelected = mealPlanData.days.length === 7;

      if (mealPlanData.creationMethod === 'Merge selected days into a single version') {

        const existingDays = await MealPlan.find({ clientId, days: { $in: mealPlanData.days } });
        for (const existingRecord of existingDays) {
          const allDaysMatch = existingRecord.days.every(day => mealPlanData.days.includes(day));
          if (allDaysMatch) {
            const del_obj = await MealPlan.deleteOne({ _id: existingRecord._id });
          } else {
            const updateResult = await MealPlan.updateOne(
              { _id: existingRecord._id },
              { $pull: { days: { $in: mealPlanData.days } } }
            );
          }
        }

        const everyDayPlan = await MealPlan.findOne({ clientId, days: { $in: mealPlanData.copyMealPlan } });

        if (everyDayPlan) {
          mealPlanData.mealPlans = everyDayPlan.mealPlans;
        }

        for (const day of mealPlanData.days) {
          await MealPlan.updateOne(
            { clientId, userId, days: { $in: [day] } },
            { $pull: { days: day } }
          );
        }

        // Use upsert to update the existing record if found, or create a new one if not found.
        const result = await MealPlan.updateOne(
          { clientId, userId, days: mealPlanData.days },
          { $set: { ...mealPlanData, clientId } },
          { upsert: true }
        );

        const existingPlan = await MealPlan.findOne({ clientId });
        const currentDays = existingPlan ? existingPlan.days : [];

        const allDays = ['Every Day', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const remainingDays = allDays.filter(day => !currentDays.includes(day));


        const filter = { clientId, userId, days: { $in: mealPlanData.copyMealPlan } };
        const update = { $pull: { days: { $in: mealPlanData.days } } };
        const data = await MealPlan.findOneAndUpdate(filter, update);



        res.status(201).json({ data: mealPlanData, message: 'Meal plan created or updated successfully' });
      } else if (mealPlanData.creationMethod === 'Create a version for each day') {

        const selectedDays = mealPlanData.days;
        const existingDays = await MealPlan.find({ clientId, days: { $in: mealPlanData.days } });

        for (const existingRecord of existingDays) {
          const allDaysMatch = existingRecord.days.every(day => mealPlanData.days.includes(day));

          if (allDaysMatch) {
            const del_obj = await MealPlan.deleteOne({ _id: existingRecord._id });
          } else {
            const updateResult = await MealPlan.updateOne(
              { _id: existingRecord._id },
              { $pull: { days: { $in: mealPlanData.days } } }
            );
          }
        }

        const allDays = ['Every Day', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const remainingDays = allDays.filter(day => !selectedDays.includes(day));


        const everyDayPlan = await MealPlan.findOne({ clientId, days: { $in: mealPlanData.copyMealPlan } });

        if (everyDayPlan) {
          mealPlanData.mealPlans = everyDayPlan.mealPlans;
        }

        for (const day of selectedDays) {
          const existingPlanForDay = await MealPlan.findOne({ clientId, days: [day] });

          if (existingPlanForDay) {
            await MealPlan.updateOne(
              { clientId, userId, days: [day] },
              { $set: { ...mealPlanData, clientId, days: [day] } }
            );
          } else {
            await MealPlan.create({ ...mealPlanData, clientId, days: [day] });
          }
        }

        const filter = { clientId, userId, days: { $in: mealPlanData.copyMealPlan } };
        const update = { $pull: { days: { $in: mealPlanData.days } } };
        const result = await MealPlan.findOneAndUpdate(filter, update);

        const updatedMealPlan = await MealPlan.findOne({ clientId });


        res.status(201).json({ data: updatedMealPlan, message: 'Meal plan created or updated successfully' });
      } else {


        const existingDays = await MealPlan.find({ clientId, days: { $in: mealPlanData.days } });

        for (const existingRecord of existingDays) {
          const allDaysMatch = existingRecord.days.every(day => mealPlanData.days.includes(day));
          if (allDaysMatch) {
            const del_obj = await MealPlan.deleteOne({ _id: existingRecord._id });
          } else {
            const updateResult = await MealPlan.updateOne(
              { _id: existingRecord._id },
              { $pull: { days: { $in: mealPlanData.days } } }
            );
          }
        }

        const selectedDays = mealPlanData.days;
        const allDays = ['Every Day', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const remainingDays = allDays.filter(day => !selectedDays.includes(day));

        // Check if copyMealPlan is specified and set to 'Copy from Every Day'
        const everyDayPlan = await MealPlan.findOne({ clientId, days: { $in: mealPlanData.copyMealPlan } });

        if (everyDayPlan) {
          mealPlanData.mealPlans = everyDayPlan.mealPlans;
        }

        for (const day of mealPlanData.days) {
          const existingPlanForDay = await MealPlan.findOne({ clientId, days: [day] });

          if (existingPlanForDay) {
            const result = await MealPlan.updateOne(
              { clientId, userId, days: [day] },
              { $set: { ...mealPlanData, clientId, days: [day] } }
            );

          } else {
            await MealPlan.create({ ...mealPlanData, clientId, days: [day] });
          }
        }
        const filter = { clientId, userId, days: 'Every Day' };
        const update = { $pull: { days: { $in: mealPlanData.days } } };
        const result = await MealPlan.findOneAndUpdate(filter, update);
        const updatedMealPlan = await MealPlan.findOne({ clientId });

        res.status(201).json({ data: updatedMealPlan, message: 'Meal plan created or updated successfully' });
      }
    } else {

      const everyDayPlan = await MealPlan.findOne({ clientId, days: { $in: mealPlanData.copyMealPlan } });

      if (everyDayPlan) {
        mealPlanData.mealPlans = everyDayPlan.mealPlans;
      }

      mealPlanData.days = ['Every Day'];
      mealPlanData.clientId = clientId;

      await MealPlan.updateOne(
        { clientId, userId, days: ['Every Day'] },
        { $set: { ...mealPlanData, clientId } },
        { upsert: true }
      );

      // Update the "Every Day" plan to include the remaining days.
      const existingPlan = await MealPlan.findOne({ clientId });
      const currentDays = existingPlan ? existingPlan.days : [];
      const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const remainingDays = allDays.filter(day => !currentDays.includes(day));

      await MealPlan.updateOne(
        { clientId, userId, days: ['Every Day'] },
        { $set: { ...mealPlanData, clientId, days: ['Every Day', ...remainingDays] } },
        { upsert: true }
      );

      const updatedMealPlan = await MealPlan.findOne({ clientId });

      res.status(201).json({ data: updatedMealPlan, message: 'Meal plan created or updated successfully' });
    }
  } catch (error) {
    next(error);
  }
};

//get meal plan

const getMealPlan = async (req, res, next) => {
  try {
    clientId = req.params.clientId;
    const mealPlan = await MealPlan.find({ clientId: clientId });
    if (mealPlan.length === 0) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    return res.status(200).json({ message: "Meal plan retrieved successfully", mealPlan });
  }
  catch (error) {
    next(error);
  }
}

//update meal plan

// const updateMealPlan = async (req, res, next) => {
//   try {
//     const mealId = req.params.mealId;

//     const mealPlan = await MealPlan.findOneAndUpdate(
//       { _id: mealId },
//       req.body,
//       { new: true }
//     )


//     const pop = await MealPlan
//       .findOne({ _id: mealId })
//       .populate({
//         path: 'mealPlans.foods.name mealPlans.foods.subfoods.name mealPlans.Appetizer.name mealPlans.Appetizer.subfoods.name',
//         model: 'Food',
//       })

//     console.log('pop-->>', pop);

//     if (!mealPlan) {
//       return res.status(404).json({ message: 'Meal plan not found' });
//     }
//     return res.status(200).json({ message: "Meal plan updated successfully", pop });
//   }
//   catch (error) {
//     next(error);
//   }
// }

const updateMealPlan = async (req, res, next) => {
  try {
    const mealId = req.params.mealId;

    const mealPlan = await MealPlan.findOneAndUpdate(
      { _id: mealId },
      req.body,
      { new: true }
    );

    const pop = await MealPlan
      .findOne({ _id: mealId })

    const modifiedPop = {
      _id: pop._id,
      userId: pop.userId,
      clientId: pop.clientId,
      mealPlans: pop.mealPlans.map(plan => ({
        meal: plan.meal,
        time: plan.time,
        foods: plan.foods.map(food => ({
          name: food.name,
          source: food.source,
          group: food.group,
          quantity: food.quantity,
          foodId: food.foodId?._id,
          subfoods: food.subfoods.map(subfood => ({
            name: subfood.name,
            source: subfood.source,
            group: subfood.group,
            quantity: subfood.quantity,
            foodId: subfood.foodId?._id,
          })),
        })),
        Appetizer: plan.Appetizer.map(appetizer => ({
          name: appetizer.name,
          source: appetizer.source,
          group: appetizer.group,
          quantity: appetizer.quantity,
          foodId: appetizer.foodId?._id,
          subfoods: appetizer.subfoods.map(subfood => ({
            name: subfood.name,
            source: subfood.source,
            group: subfood.group,
            quantity: subfood.quantity,
            foodId: subfood.foodId?._id,
          })),
        })),
        Dish: plan.Dish.map(dish => ({
          name: dish.name,
          source: dish.source,
          group: dish.group,
          quantity: dish.quantity,
          foodId: dish.foodId?._id,
          subfoods: dish.subfoods.map(subfood => ({
            name: subfood.name,
            source: subfood.source,
            group: subfood.group,
            quantity: subfood.quantity,
            foodId: subfood.foodId?._id,
          })),
        })),
        Dessert: plan.Dessert.map(dessert => ({
          name: dessert.name,
          source: dessert.source,
          group: dessert.group,
          quantity: dessert.quantity,
          foodId: dessert.foodId?._id,
          subfoods: dessert.subfoods.map(subfood => ({
            name: subfood.name,
            source: subfood.source,
            group: subfood.group,
            quantity: subfood.quantity,
            foodId: subfood.foodId?._id,
          })),
        })),
        Beverage: plan.Beverage.map(beverage => ({
          name: beverage.name,
          source: beverage.source,
          group: beverage.group,
          quantity: beverage.quantity,
          foodId: beverage.foodId?._id,
          subfoods: beverage.subfoods.map(subfood => ({
            name: subfood.name,
            source: subfood.source,
            group: subfood.group,
            quantity: subfood.quantity,
            foodId: subfood.foodId?._id,
          })),
        })),
        Soup: plan.Soup.map(soup => ({
          name: soup.name,
          source: soup.source,
          group: soup.group,
          quantity: soup.quantity,
          foodId: soup.foodId?._id,
          subfoods: soup.subfoods.map(subfood => ({
            name: subfood.name,
            source: subfood.source,
            group: subfood.group,
            quantity: subfood.quantity,
            foodId: subfood.foodId._id,
          })),
        })),
        Firstcourse: plan.Firstcourse.map(firstcourse => ({
          name: firstcourse.name,
          source: firstcourse.source,
          group: firstcourse.group,
          quantity: firstcourse.quantity,
          foodId: firstcourse.foodId?._id,
          subfoods: firstcourse.subfoods.map(subfood => ({
            name: subfood.name,
            source: subfood.source,
            group: subfood.group,
            quantity: subfood.quantity,
            foodId: subfood.foodId?._id,
          })),
        })),
        Secondcourse: plan.Secondcourse.map(secondcourse => ({
          name: secondcourse.name,
          source: secondcourse.source,
          group: secondcourse.group,
          quantity: secondcourse.quantity,
          foodId: secondcourse.foodId?._id,
          subfoods: secondcourse.subfoods.map(subfood => ({
            name: subfood.name,
            source: subfood.source,
            group: subfood.group,
            quantity: subfood.quantity,
            foodId: subfood.foodId?._id,
          })),
        })),
        Sidedish: plan.Sidedish.map(sidedish => ({
          name: sidedish.name,
          source: sidedish.source,
          group: sidedish.group,
          quantity: sidedish.quantity,
          foodId: sidedish.foodId?._id,
          subfoods: sidedish.subfoods.map(subfood => ({
            name: subfood.name,
            source: subfood.source,
            group: subfood.group,
            quantity: subfood.quantity,
            foodId: subfood.foodId?._id,
          })),
        })),
        Others: plan.Others.map(other => ({
          name: other.name,
          source: other.source,
          group: other.group,
          quantity: other.quantity,
          foodId: other.foodId?._id,
          subfoods: other.subfoods.map(subfood => ({
            name: subfood.name,
            source: subfood.source,
            group: subfood.group,
            quantity: subfood.quantity,
            foodId: subfood.foodId?._id,
          })),
        })),
        notes: plan.notes,
      })),
      days: pop.days,
      creationMethod: pop.creationMethod,
      copyMealPlan: pop.copyMealPlan
    };


    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    return res.status(200).json({ message: "Meal plan updated successfully", pop: modifiedPop });
  } catch (error) {
    console.log(error);
    next(error);
  }
}


//delete perticular meal plan object
const deleteMealPlanObject = async (req, res, next) => {
  try {
    const userId = req.userId;
    const mealId = req.params.mealId;
    const ObjectId = req.params.objectId;

    const result = await MealPlan.updateOne(
      { _id: mealId, userId },
      { $pull: { mealPlans: { _id: ObjectId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No matching meal found' });
    }

    res.status(200).json({ message: 'Meal deleted successfully' });
  } catch (error) {
    next(error);
  }

}

// delete whole meal Plan
const deleteMealPlan = async (req, res, next) => {
  try {
    const mealId = req.params.mealId;
    const clientId = req.body.clientId;

    const deletedRecord = await MealPlan.findByIdAndRemove(mealId);
    const deletedDays = deletedRecord ? deletedRecord.days : [];

    const everyDayRecord = await MealPlan.findOne({ clientId, days: { $in: 'Every Day' } });
    if (everyDayRecord) {
      everyDayRecord.days = [...everyDayRecord.days, ...deletedDays];
      await everyDayRecord.save();
    }

    const remainingPlans = await MealPlan.find({ clientId: clientId });

    if (remainingPlans.length === 1) {
      const remainingPlan = remainingPlans[0];
      const allDays = ['Every Day', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      await MealPlan.findByIdAndUpdate(
        remainingPlan._id,
        { $set: { days: allDays } },
        { new: true }
      );
    }
    res.status(200).json({ message: 'Meal plan deleted successfully' });
  } catch (error) {
    next(error);
  }
}

const deleteFoods = async (req, res, next) => {
  try {
    const userId = req.userId;
    const mealId = req.params.mealId;
    const objectId = req.params.objectId;

    const fieldsToCheck = [
      'mealPlans.$[].foods',
      'mealPlans.$[].Appetizer',
      'mealPlans.$[].Dish',
      'mealPlans.$[].Dessert',
      'mealPlans.$[].Beverage',
      'mealPlans.$[].Soup',
      'mealPlans.$[].Firstcourse',
      'mealPlans.$[].Secondcourse',
      'mealPlans.$[].Sidedish',
      'mealPlans.$[].Others'
    ];

    const pullQueries = fieldsToCheck.map((field) => ({
      [field]: { _id: objectId }
    }));

    const updatePromises = pullQueries.map((query) => {
      return MealPlan.updateOne({ _id: mealId, userId }, { $pull: query });
    });

    const result = await Promise.all(updatePromises);


    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No matching foods found' });
    }

    res.status(200).json({ message: 'Foods deleted successfully' });
  }
  catch (error) {
    next(error);
  }

}

const deleteParticularFood = async (req, res, next) => {
  try {
    const userId = req.userId;

    const mealId = req.params.mealId;
    const objectId = req.params.objectId;
    const Id = req.body.Id;

    const mealPlan = await MealPlan.findOne({ _id: mealId, userId });

    if (!mealPlan) {
      return res.status(404).json({ message: 'No matching meal found' });
    }

    const mealTypes = ['foods', 'Appetizer', 'Dish', 'Dessert', 'Beverage', 'Soup', 'Firstcourse', 'Secondcourse', 'Sidedish', 'Others'];

    const meal = mealPlan.mealPlans
      .map((meal) => mealTypes.map((type) => meal[type].filter((item) => item._id.toString() === objectId)))
      .flat()
      .filter((foods) => foods.length > 0);


    if (meal[0][0].name === null) {
      return res.status(404).json({ message: 'No matching food found' });
    }

    if (meal) {
      console.log('start-->>');
      const indexToDelete = meal[0].findIndex((food) => food.foodId.toString() === Id)
      if (indexToDelete !== -1) {
        meal[0][indexToDelete].name = null;
        meal[0][indexToDelete].source = null
        meal[0][indexToDelete].group = null
        meal[0][indexToDelete].quantity = null
        meal[0][indexToDelete].foodId = null

        let m1 = null
        let m2 = null
        let m3 = null
        let m4 = null
        let m5 = null
        meal[0].forEach((food) => {
          if (food.subfoods.length > 0) {
            m1 = food.subfoods[0].name,
              m2 = food.subfoods[0].source,
              m3 = food.subfoods[0].group,
              m4 = food.subfoods[0].quantity,
              m5 = food.subfoods[0].foodId
          }
        });

        if (meal[0][0].foodId === null && m5 != null) {
          meal[0][0].name = m1;
          meal[0][0].source = m2;
          meal[0][0].group = m3;
          meal[0][0].quantity = m4;
          meal[0][0].foodId = m5;
          meal[0].forEach((food) => {

            if (food.subfoods.length >= 1) {
              food.subfoods.splice(0, 1);
            }
          });
        } else if (meal[0][0].name === null && m5 === null) {
          console.log('<<start>>');
          meal.splice(0, 1);
        }
      }
    }

    const submeal = mealPlan.mealPlans
      .map((meal) => mealTypes.map((type) => meal[type].filter((item) => item._id.toString() === objectId)))
      .flat()
      .filter((foods) => foods.length > 0);

    if (submeal) {
      for (const submealArray of submeal) {
        for (const subfoodArray of submealArray) {
          const indexToDelete = subfoodArray.subfoods.findIndex((subfood) => subfood.foodId.toString() === Id);
          if (indexToDelete !== -1) {
            subfoodArray.subfoods.splice(indexToDelete, 1);
          }
        }
      }
    }

    await mealPlan.save();

    return res.status(200).json({ message: 'Food deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


module.exports = {
  createMealPlan,
  getMealPlan,
  updateMealPlan,
  deleteMealPlan,
  deleteFoods,
  deleteMealPlanObject,
  deleteParticularFood
};