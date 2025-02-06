const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Template = require("../model/mealTemplate");
const Food = require('../model/Food');
const { findById } = require("../model/Food");

const createMealTemplate = async (req, res) => {
  try {
    const { Name } = req.body;
    const templateName = Name || "Meal plan template";
    const mealTemplate = {
      days: "Everyday",
      mealSchedule: [
        {
          mealType: "BreakFast",
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
      return res.status(401).json({ error: "Unauthorized, user ID missing" });
    }

    const newTemplate = await Template.create({
      templateName,
      userId,
      mealTemplate,
    });

    return res.status(201).json({
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
    const query = {
      userId: req.userId,
    };
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized, user ID missing" });
    }
    const templet = await Template.find(query);
    if (!templet) {
      return res.status(404).json({ message: "templet Not Found!!" });
    }
    res.status(200).json(templet);
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
      return res.status(401).json({ error: "Unauthorized, user ID missing" });
    }
    const template = await Template.findOne(query);
    if (!template) {
      return res.status(404).json({ message: "template Not Found!!" });
    }
    res.status(200).json({template:template});
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
      res.status(404).json({ message: 'template not found!!!' });
    } else {
      res.status(200).json({ message: 'template deleted successfully' });
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
    if (!template) return res.status(404).json({ error: "Template not found" });
    
    const variabel = template.mealTemplate.filter((entry) => {
      return entry._id.toString() === mealId;
    });
        
    const existingMeals = variabel[0].mealSchedule.filter((meal) =>
      meal.mealType.includes(mealType)
    );
    console.log("existingMeals",existingMeals);
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
        case "BreakFast":
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
    if (!template) return res.status(404).json({ error: "Template not found" });
    const allDays = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    if (copyMealsOfMealPlan === "Do not copy" && creationMethod === "null") {
      const newMeal = {
        days: selectedDesiredDays,
        mealSchedule: [
          { mealType: "Breakfast", time: "7:00 AM", meal: [], notes: "" },
          { mealType: "Morning Snack", time: "10:00 AM", meal: [], notes: "" },
          { mealType: "Lunch", time: "12:00 PM", appetizer: [], dish: [], dessert: [], beverage: [], notes: "",},
          { mealType: "Afternoon Snack", time: "4:00 PM", meal: [], notes: "" },
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
          { mealType: "Morning Snack", time: "10:00 AM", meal: [], notes: "" },
          { mealType: "Lunch", time: "12:00 PM", appetizer: [], dish: [], dessert: [], beverage: [], notes: "",},
          { mealType: "Afternoon Snack", time: "4:00 PM", meal: [], notes: "" },
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
        { mealType: "Morning Snack", time: "10:00 AM", meal: [], notes: "" },
        { mealType: "Lunch", time: "12:00 PM", appetizer: [], dish: [], dessert: [], beverage: [], notes: "",},
        { mealType: "Afternoon Snack", time: "4:00 PM", meal: [], notes: "" },
        { mealType: "Dinner", time: "7:00 PM", appetizer: [], dish: [], dessert: [], beverage: [], notes: "",},
        { mealType: "Supper", time: "10:00 PM", meal: [], notes: "" },
    ]

    const newMeal = selectedDesiredDays.map((entry)=>({
      days : [entry],
      mealSchedule : mealSchedule,
      _id: new mongoose.Types.ObjectId(),
    }))

    const updateMealTemplate = (template, newMeal) => {
      template.mealTemplate = template.mealTemplate.map((entry) => {
       
        if (entry.days === "Everyday") {
          entry.days = [];
        }
        if (entry.days.some((day) => newMeal[0].days.includes(day))) {
          entry.days = entry.days.filter((day) => !newMeal[0].days.includes(day));
        }
        template.mealTemplate = template.mealTemplate.filter((entry) => entry.days.length > 0);
        return entry;
      });
      template.mealTemplate.push(...newMeal);

        template.mealTemplate = template.mealTemplate.map((entry) => {
          if (entry.days.length === 0) {
            const existingDays = new Set(template.mealTemplate.flatMap((item) => item.days));
            const remainingDays = allDays.filter((day) => !existingDays.has(day));
            entry.days = remainingDays;
          }
          return entry;
        });
    };

    updateMealTemplate(template, newMeal);
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
      message: "Meal added successfully",
      template: template,
    });
  } catch (error) {
    console.error("Error adding meal:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const addFoodInTemplate = async(req, res)=> {
try {
    const { templateId ,mealId, mealType ,foodId} =req.body
    const userId = req.userId;

    const template = await Template.findById(templateId);
    if (!template) return res.status(404).json({ error: "Template not found" });

    const variabel = template.mealTemplate.filter((entry)=>{ return entry._id.toString() === `${mealId}` })
    const food = await Food.find({ _id: foodId, userId: userId });
    
    variabel[0].mealSchedule.map((entry) => {
      if (entry.mealType === `${mealType}`) {
        entry.meal.push({ displayName:`${food[0].displayName}`,or : []});
      }
      return entry;
    });
    
    template.markModified("mealTemplate");
      await template.save();
   
    return res.status(201).json({
      message: "Meal added successfully",
      template: template,
    });
} catch (error) {
  console.error("Error adding meal:", error);
  return res.status(500).json({ error: "Internal Server Error" });
}
}

const updateMealPlanInTemplate = async(req, res)=> {
  try {
    const { templateId ,_id, mealType ,time} =req.body
    const userId = req.userId;

    const template = await Template.findById(templateId);
    if (!template) return res.status(404).json({ error: "Template not found" });

    const variabel = template.mealTemplate.filter((entry)=>{ return entry._id.toString() === `${_id}` })
    console.log("variabel",variabel);
    

  } catch (error) {
  console.error("Error adding meal:", error);
  return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createMealTemplate,
  addNewMeal,
  createVersion,
  getMealTemplate,
  getMealTemplateById,
  deleteMealTemplate,
  addFoodInTemplate,
  updateMealPlanInTemplate
};

