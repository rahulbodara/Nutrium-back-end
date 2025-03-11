const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Template = require("../model/mealTemplate");
const Food = require('../model/Food');
const FoodDiary = require('../model/FoodDiary');
const { findById } = require("../model/Food");

const createMealTemplate = async (req, res) => {
  try {
    const { Name , clientId } = req.body;
    const templateName = Name || "Meal plan template";
    const mealTemplate = {
      days: "Everyday",
      mealSchedule: [
        {
          mealType: "Breakfast",
          time: "7:00 AM",
          meal: [],
          Notes: "",
        },
        {
          mealType: "Morning snack",
          time: "10:00 AM",
          meal: [],
          Notes: "",
        },
        {
          mealType: "Lunch",
          time: "12:00 PM",
          Appetizer: [],
          Dish: [],
          Dessert: [],
          Beverage: [],
          Notes: "",
        },
        {
          mealType: "Afternoon snack",
          time: "4:00 PM",
          meal: [],
          Notes: "",
        },
        {
          mealType: "Dinner",
          time: "7:00 PM",
          Appetizer: [],
          Dish: [],
          Dessert: [],
          Beverage: [],
          Notes: "",
        },
        {
          mealType: "Super",
          time: "10:00 PM",
          meal: [],
          Notes: "",
        },
      ],
      _id: new mongoose.Types.ObjectId()
    };
    const userId = req.userId;
    if (!req.userId) {
      return res.status(401).json({success: false, error: "Unauthorized, user ID missing" });
    }

    if (clientId) {
      const existingTemplate = await Template.findOne({ clientId, userId });
      if (existingTemplate) {
        return res.status(400).json({success: false, error: "Client already registered",});
      }
    }

    const templateData = {
      templateName,
      userId,
      mealTemplate,
    };

    if (clientId) templateData.clientId = clientId;

    const newTemplate = await Template.create(templateData);

    if(clientId){
    const today = new Date().toISOString();
    const newFoodDiary = await FoodDiary.create({
      userId,
      clientId,
      foodDiaryData: [
        {
          registrationDate: today,
        },
      ],
    });
    
    }

    return res.status(201).json({
      success: true,
      message: "Template created successfully",
      template: newTemplate,
    });
  } catch (error) {
    console.error("Error creating template:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMealTemplate = async (req, res, next) => {
  try {
    const { clientId } = req.query;

    if (!req.userId) {
      return res.status(401).json({ success: false,error: "Unauthorized, user ID missing" });
    }

    const query = {userId: req.userId};
    if (clientId) {
      query.clientId = clientId;
    }

    const template = await Template.find(query);
    if (!template || template.length === 0) {
      return res.status(404).json({ success: false, message: "Template not found!" });
    }
    res.status(200).json({success: true, template});
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getMealTemplateById = async (req, res, next) => {
  try {
    const query = {
      _id: req.params.id,
      userId: req.userId,
    };
    if (!req.userId) {
      return res.status(401).json({ success: false,error: "Unauthorized, user ID missing" });
    }
    const template = await Template.findOne(query);
    if (!template) {
      return res.status(404).json({success: false, message: "template Not Found!!" });
    }
    res.status(200).json({ success: true, template:template});
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const deleteMealTemplate = async (req, res, next) => {
  try {
    const query = {
      _id: req.params.id,
      userId: req.userId,
    };
    const deletedtemplate = await Template.findOneAndDelete(
      query,
      { new: true }
    );

    if (!deletedtemplate) {
      res.status(404).json({ success: false,message: 'template not found!!!' });
    } else {
      res.status(200).json({success: true, message: 'template deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const addNewMeal = async (req, res) => {
  try {
    const { templateId, mealId, mealType } = req.body;
    
    const template = await Template.findById(templateId);
    if (!template) return res.status(404).json({success: false, error: "Template not found" });
    
    const variabel = template.mealTemplate.filter((entry) => {
      return entry._id.toString() === mealId;
    });
        
    const existingMeals = variabel[0].mealSchedule.filter((meal) =>
      meal.mealType.includes(mealType)
    );

    let newMealType = mealType;
    if (existingMeals.length > 0) {
      const suffix = ["Second", "Third", "Fourth", "Fifth"];
      const index = existingMeals.length;
      newMealType = `${suffix[index - 1] || `${index + 1}th`} ${mealType}`;
    }

    let newMeal = {
      mealType: newMealType,
      time: "",
      meal: [],
      Notes: "",
    };
    
    if (mealType === "Dinner" || mealType === "Lunch") {
      newMeal = {
        ...newMeal,
        time: mealType === "Dinner" ? "7:00 PM" : "12:00 PM",
        Appetizer: [],
        Dish: [],
        Dessert: [],
        Beverage: [],
      };
    } else {
      newMeal = {
        ...newMeal,
        time: "10:00 AM",
        meal: [],
      };
      
      switch (newMeal.mealType) {
        case "Breakfast":
          newMeal.time = "7:00 AM";
          break;
        case "Morning snack":
          newMeal.time = "10:00 AM";
          break;
        case "Afternoon snack":
          newMeal.time = "4:00 PM";
          break;
        case "Super":
          newMeal.time = "10:00 PM";
          break;
        case "Pre-workout snack":
          newMeal.time = "4:30 PM";
          break;
        case "Post-workout snack":
          newMeal.time = "6:00 PM";
          break;
        default:
          newMeal.time = "10:00 AM";
          break;
      }
    }
     
    variabel[0].mealSchedule.push(newMeal);
    template.markModified("mealTemplate");
    await template.save();
    const updatedTemplate = await Template.findById(templateId);

    return res.status(201).json({
      success: true,
      message: "Meal added successfully",
      template: template,
    });
  } catch (error) {
    console.error("Error adding meal:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const createVersion = async (req, res) => {
  try {
    const { templateId, creationMethod, copyMealsOfMealPlan, selectedDesiredDays} = req.body;
    const template = await Template.findById(templateId);
    if (!template) return res.status(404).json({success: false, error: "Template not found" });
    const allDays = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    if (copyMealsOfMealPlan === "Do not copy" && creationMethod === "null") {
      const newMeal = {
        days: selectedDesiredDays,
        mealSchedule: [
          { mealType: "Breakfast", time: "7:00 AM", meal: [], notes: "" },
          { mealType: "Morning snack", time: "10:00 AM", meal: [], notes: "" },
          { mealType: "Lunch", time: "12:00 PM", appetizer: [], dish: [], dessert: [], beverage: [], notes: "",},
          { mealType: "Afternoon snack", time: "4:00 PM", meal: [], notes: "" },
          { mealType: "Dinner", time: "7:00 PM", appetizer: [], dish: [], dessert: [], beverage: [], notes: "",},
          { mealType: "Supper", time: "10:00 PM", meal: [], notes: "" },
        ],
        _id: new mongoose.Types.ObjectId(),
      };

      const updateMealTemplate = (template, newMeal) => {
        template.mealTemplate = template.mealTemplate.map((entry) => {

          if (entry.days === "Everyday") {
            entry.days = [];
          }
          if (entry.days.some((day) => newMeal.days.includes(day))) {
            entry.days = entry.days.filter((day) => !newMeal.days.includes(day));
          }
          return entry;
        });
        template.mealTemplate.push(newMeal);

        template.mealTemplate = template.mealTemplate.map((entry) => {
          if (entry.days.length === 0) {
            const existingDays = new Set(template.mealTemplate.flatMap((item) => item.days));
            const remainingDays = allDays.filter((day) => !existingDays.has(day));
            entry.days = remainingDays;
          }
          return entry;
        });
        template.mealTemplate = template.mealTemplate.filter((entry) => entry.days.length > 0);
      };

      updateMealTemplate(template, newMeal);
      template.markModified("mealTemplate");
      await template.save();
    }

    if (copyMealsOfMealPlan !== "Do not copy" && creationMethod === "null") {
      const newMeal = {
        days: selectedDesiredDays,
      };
      const matchedEntry = template.mealTemplate.find((entry) => { const entrySet = new Set(entry.days); const copyMealSet = new Set(copyMealsOfMealPlan); const isMatch = entrySet.size === copyMealSet.size && [...entrySet].every((day) => copyMealSet.has(day)); return isMatch;});
      if (matchedEntry) newMeal.mealSchedule = matchedEntry.mealSchedule;

      const updateMealTemplate = (template, newMeal) => {
        template.mealTemplate = template.mealTemplate.map((entry) => {

          if (entry.days === "Everyday") {
            entry.days = [];
          }
          if (entry.days.some((day) => newMeal.days.includes(day))) {
            entry.days = entry.days.filter((day) => !newMeal.days.includes(day));
          }
          return entry;
        });
        template.mealTemplate.push(newMeal);

        template.mealTemplate = template.mealTemplate.map((entry) => {
          if (entry.days.length === 0) {
            const existingDays = new Set(template.mealTemplate.flatMap((item) => item.days));
            const remainingDays = allDays.filter((day) => !existingDays.has(day));
            entry.days = remainingDays;
          }
          return entry;
        });
        template.mealTemplate = template.mealTemplate.filter((entry) => entry.days.length > 0);
      };

      updateMealTemplate(template, newMeal);
      template.markModified("mealTemplate");
      await template.save();
    }

    if ( copyMealsOfMealPlan === "Do not copy" && creationMethod === "Merge selected days into a single version") {
      const newMeal = {
        days: selectedDesiredDays,
        mealSchedule: [
          { mealType: "Breakfast", time: "7:00 AM", meal: [], notes: "" },
          { mealType: "Morning snack", time: "10:00 AM", meal: [], notes: "" },
          { mealType: "Lunch", time: "12:00 PM", appetizer: [], dish: [], dessert: [], beverage: [], notes: "",},
          { mealType: "Afternoon snack", time: "4:00 PM", meal: [], notes: "" },
          { mealType: "Dinner", time: "7:00 PM", appetizer: [], dish: [], dessert: [], beverage: [], notes: "",},
          { mealType: "Supper", time: "10:00 PM", meal: [], notes: "" },
        ],
        _id: new mongoose.Types.ObjectId(),
      };
      const updateMealTemplate = (template, newMeal) => {
        template.mealTemplate = template.mealTemplate.map((entry) => {

          if (entry.days === "Everyday") {
            entry.days = [];
          }
          if (entry.days.some((day) => newMeal.days.includes(day))) {
            entry.days = entry.days.filter((day) => !newMeal.days.includes(day));
          }
          return entry;
        });
        template.mealTemplate.push(newMeal);

        template.mealTemplate = template.mealTemplate.map((entry) => {
          if (entry.days.length === 0) {
            const existingDays = new Set(template.mealTemplate.flatMap((item) => item.days));
            const remainingDays = allDays.filter((day) => !existingDays.has(day));
            entry.days = remainingDays;
          }
          return entry;
        });
        template.mealTemplate = template.mealTemplate.filter((entry) => entry.days.length > 0);
      };

      updateMealTemplate(template, newMeal);
      template.markModified("mealTemplate");
      await template.save();
    }

    if ( copyMealsOfMealPlan === "Do not copy" && creationMethod === "Create a version for each day") {
      const mealSchedule = [
        { mealType: "Breakfast", time: "7:00 AM", meal: [], notes: "" },
        { mealType: "Morning snack", time: "10:00 AM", meal: [], notes: "" },
        { mealType: "Lunch", time: "12:00 PM", appetizer: [], dish: [], dessert: [], beverage: [], notes: "",},
        { mealType: "Afternoon snack", time: "4:00 PM", meal: [], notes: "" },
        { mealType: "Dinner", time: "7:00 PM", appetizer: [], dish: [], dessert: [], beverage: [], notes: "",},
        { mealType: "Supper", time: "10:00 PM", meal: [], notes: "" },
    ]

    const newMeal = selectedDesiredDays.map((entry)=>({
      days : [entry],
      mealSchedule : mealSchedule,
      _id: new mongoose.Types.ObjectId(),
    }))
    const newDays = newMeal.flatMap(item => item.days);

    const updateMealTemplate = (template) => {
      template.mealTemplate = template.mealTemplate.map((entry) => {

        if (entry.days === "Everyday") {
          entry.days = [];
        }
        return entry;
      });
    };

    updateMealTemplate(template);

    template.mealTemplate.forEach(entry => {
      entry.days = entry.days.filter(day => !newDays.includes(day));
    });
    template.mealTemplate.push(...newMeal)

    const missingDays = allDays.filter(day => 
      !newDays.includes(day) && !template.mealTemplate.some(entry => entry.days.includes(day))
    );
    
    for (const day of missingDays) {
      const target = template.mealTemplate.find(entry => !newDays.some(d => entry.days.includes(d)));
      if (target) target.days.push(day);
    }
    template.mealTemplate = template.mealTemplate.filter((entry) => entry.days.length > 0);

    template.markModified("mealTemplate");
    await template.save();     
    }

    if ( copyMealsOfMealPlan !== "Do not copy" && creationMethod === "Merge selected days into a single version") {
      const newMeal = {
        days: selectedDesiredDays,
      };
      const matchedEntry = template.mealTemplate.find((entry) => { const entrySet = new Set(entry.days); const copyMealSet = new Set(copyMealsOfMealPlan); const isMatch = entrySet.size === copyMealSet.size && [...entrySet].every((day) => copyMealSet.has(day)); return isMatch;});
      if (matchedEntry) newMeal.mealSchedule = matchedEntry.mealSchedule;

      const updateMealTemplate = (template, newMeal) => {
        template.mealTemplate = template.mealTemplate.map((entry) => {

          if (entry.days === "Everyday") {
            entry.days = [];
          }
          if (entry.days.some((day) => newMeal.days.includes(day))) {
            entry.days = entry.days.filter((day) => !newMeal.days.includes(day));
          }
          return entry;
        });
        template.mealTemplate.push(newMeal);

        template.mealTemplate = template.mealTemplate.map((entry) => {
          if (entry.days.length === 0) {
            const existingDays = new Set(template.mealTemplate.flatMap((item) => item.days));
            const remainingDays = allDays.filter((day) => !existingDays.has(day));
            entry.days = remainingDays;
          }
          return entry;
        });
        template.mealTemplate = template.mealTemplate.filter((entry) => entry.days.length > 0);
      };

      updateMealTemplate(template, newMeal);
      template.markModified("mealTemplate");
      await template.save();
    }

    if ( copyMealsOfMealPlan !== "Do not copy" && creationMethod === "Create a version for each day") {

      const newMeal = selectedDesiredDays.map((entry)=>({
        days : [entry],
      }))
      const matchedEntry = template.mealTemplate.find((entry) => { const entrySet = new Set(entry.days); const copyMealSet = new Set(copyMealsOfMealPlan); const isMatch = entrySet.size === copyMealSet.size && [...entrySet].every((day) => copyMealSet.has(day)); return isMatch;});
      if (matchedEntry) newMeal.mealSchedule = matchedEntry.mealSchedule;

      const updateMealTemplate = (template, newMeal) => {
        template.mealTemplate = template.mealTemplate.map((entry) => {
         
          if (entry.days === "Everyday") {
            entry.days = [];
          }
          return entry;
        });
        function getNewMealDays(newMeal) {
          return newMeal.flatMap(item => item.days);
        }
  
        function mergeMealData(template, newMeal) {
          const newMealDays = new Set(getNewMealDays(newMeal));
          const updatedTemplate = template.mealTemplate.map(entry => { const filteredDays = entry.days.filter(day => !newMealDays.has(day)); return { ...entry, days: filteredDays };}).filter(entry => entry.days.length > 0);
          return [...updatedTemplate, ...newMeal];
        }
        const result = mergeMealData(template, newMeal);
      };
  
      updateMealTemplate(template, newMeal);
      template.markModified("mealTemplate");
      await template.save();     
    }

    return res.status(201).json({
      success: true,
      message: "Meal added successfully",
      template,
    });
  } catch (error) {
    console.error("Error adding meal:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const addFoodInTemplate = async (req, res) => {
  try {
    const { templateId, mealId, mealType, foodId } = req.body;

    const userId = req.userId;

    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ success: false, error: "Template not found" });
    }

    const mealIndex = template.mealTemplate.findIndex(
      (entry) => entry._id.toString() === mealId
    );

    if (mealIndex === -1) {
      return res.status(404).json({ success: false, error: "Meal not found in template" });
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ success: false, error: "Food not found" });
    }

    template.mealTemplate[mealIndex].mealSchedule.forEach((entry) => {
      if (entry.mealType === mealType) {
        if (!entry.meal) {
          entry.meal = [];
        }
        entry.meal.push({
          displayName: food.displayName,
          foodId: food._id,
          or: [],
          foodIndex: new mongoose.Types.ObjectId(),
        });
      }
    });

    template.markModified("mealTemplate");
    await template.save();

    return res.status(201).json({
      success: true,
      message: "Meal added successfully",
      template,
    });
  } catch (error) {
    console.error("Error adding meal:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateTimeAndSubMealTypeName = async (req, res) => {
  try {
    const { templateId, mealId, mealType, time ,subMealTypeName} = req.body;
    const userId = req.userId;

    const template = await Template.findById(templateId);
    if (!template) return res.status(404).json({success: false, error: "Template not found" });

    const mealTemplateEntry = template.mealTemplate.find((entry) => entry._id.toString() === mealId);
    if (!mealTemplateEntry) return res.status(404).json({success: false, error: "Meal entry not found" });
    
    const scheduleEntry = mealTemplateEntry.mealSchedule.find((entry) => entry.mealType === mealType);
    if (!scheduleEntry) return res.status(404).json({success: false, error: "Meal type not found" });
    
    if (subMealTypeName) scheduleEntry.subMealTypeName = subMealTypeName;
    if (time) scheduleEntry.time = time;
    template.markModified("mealTemplate");
    await template.save();

    return res.status(200).json({
      success: true,
      message: "Meal updated successfully",
      template,
    });
  } catch (error) {
    console.error("Error updating meal:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteDayInTemplate = async (req, res, next) => {
  try {
    const { templateId, mealId, mealType } = req.body;
    
    const template = await Template.findById(templateId);
    if (!template) return res.status(404).json({success: false, error: "Template not found" });
    console.log("template",template.mealTemplate);
    
    const index = template.mealTemplate.findIndex((entry) => entry._id.toString() === mealId);
    if (index !== -1) {
      const copiedDays = template.mealTemplate[index].days;
      console.log("copiedDays",copiedDays);
      
      template.mealTemplate.splice(index, 1);
      template.mealTemplate[0].days.push(...copiedDays);
  }
    
    template.markModified("mealTemplate");
    await template.save();

    return res.status(200).json({
      success: true,
      message: "Meal updated successfully",
      template,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const deleteFoodInTemplate = async (req, res, next) => {
  try {
    const { templateId, mealId, mealType ,foodIndex} = req.body;
    
    const template = await Template.findById(templateId);
    if (!template) return res.status(404).json({success: false, error: "Template not found" });

    const index = template.mealTemplate.findIndex((entry) => entry._id.toString() === mealId);

    if (index !== -1) {
      template.mealTemplate[index].mealSchedule.forEach((entry)=>{ 
        if(entry.mealType === `${mealType}`) {
          const index = entry.meal.findIndex(item => item?.foodIndex?.toString() === foodIndex);
          if (index !== -1) entry.meal.splice(index, 1);
        }
      })
  }
    
    template.markModified("mealTemplate");
    await template.save();

    return res.status(200).json({
      success: true,
      message: "Meal updated successfully",
      template,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const deleteMealScheduleInTemplate = async (req, res, next) => {
  try {
    const { templateId, mealId, mealType } = req.body;

    const template = await Template.findById(templateId);
    if (!template) return res.status(404).json({success: false, error: "Template not found" });
    
    const mealIndex = template.mealTemplate.findIndex((entry) => entry._id.toString() === mealId);

    if (mealIndex !== -1) {

    const scheduleIndex = template.mealTemplate[mealIndex].mealSchedule.findIndex((entry) => entry.mealType === mealType);
    if (scheduleIndex !== -1) template.mealTemplate[mealIndex].mealSchedule.splice(scheduleIndex, 1);
      
    }

    template.markModified("mealTemplate");
    await template.save();

    return res.status(200).json({
      success: true,
      message: "Meal schedule deleted successfully",
      template,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const createNote = async (req, res, next) => {
  try {

    const { templateId, mealId, mealType ,note} = req.body;

    const template = await Template.findById(templateId);
    if (!template) return res.status(404).json({success: false, error: "Template not found" });

    const index = template.mealTemplate.findIndex((entry) => entry._id.toString() === mealId);

    if (index !== -1) {
      template.mealTemplate[index].mealSchedule.forEach((entry)=>{ 
        if(entry.mealType === `${mealType}`) entry.Notes = note
      })
  }
    
    template.markModified("mealTemplate");
    await template.save();

    return res.status(200).json({
      success: true,
      message: "Meal updated successfully",
      template,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const chnageTemplateName = async (req, res, next) => {
  try {

    const { templateId, name} = req.body;

    const template = await Template.findById(templateId);
    if (!template) return res.status(404).json({success: false, error: "Template not found" });

    template.templateName = name

    await template.save();

    return res.status(200).json({
      success: true,
      message: "Meal updated successfully",
      template,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

//***********************************/ Mobile Apis /***********************************

const featchMealPlanForClient = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    
    if (!clientId) {
      return res.status(400).json({success: false, error: "clientId ID is required" });
    }

    const template = await Template.find({clientId});

    if (!template) {
      return res.status(404).json({success: false, error: "Meal plan not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Meal plan fetched successfully",
      template,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  createMealTemplate,
  addNewMeal,
  createVersion,
  getMealTemplate,
  getMealTemplateById,
  deleteMealTemplate,
  addFoodInTemplate,
  updateTimeAndSubMealTypeName,
  deleteDayInTemplate,
  deleteFoodInTemplate,
  deleteMealScheduleInTemplate,
  featchMealPlanForClient,
  createNote,
  chnageTemplateName
};


const mealUpdateResponse = {
  message: "Meal updated successfully",
  template: {
      _id: "67a59074b6f1658ed08f89b9",
      templateName: "Meal plan template",
      userId: "674fe376aa235b41d1ef6af6",
      mealTemplate: [
          {
              days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              mealSchedule: [
                  { mealType: "Breakfast", time: "7:00 AM", meal: [], notes: "" },
                  { mealType: "Morning snack", time: "10:00 AM", meal: [], notes: "" },
              ],
              _id: "67ad6c5f90622b34b99ea11f"
          },
          {
              days: ["Saturday"],
              mealSchedule: [
                  { mealType: "Breakfast", time: "7:00 AM", meal: [], notes: "" },
                  { mealType: "Morning snack", time: "10:00 AM", meal: [], notes: "" },
              ],
              _id: "67ad6c7a90622b34b99ea132"
          },
          {
              days: ["Sunday"],
              mealSchedule: [
                  { mealType: "Breakfast", time: "7:00 AM", meal: [], notes: "" },
                  { mealType: "Morning snack", time: "10:00 AM", meal: [], notes: "" },
              ],
              _id: "67ad6c7a90622b34b99ea133"
          }
      ],
      __v: 8
  }
};

