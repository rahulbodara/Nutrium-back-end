const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Template = require("../model/mealTemplate");

const createMealTemplate = async (req, res) => {
  try {
    const { Name } = req.body;
    const templateName = Name || "Meal plan template";
    const mealTemplate = {
      days: "Everyday",
      mealSechdule: [
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

const addNewMeal = async (req, res) => {
  try {
    const { templateId, mealdays, mealType } = req.body;

    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    const existingMeals = template.mealTemplate[0].mealSechdule.filter((meal) =>
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

    template.mealTemplate.forEach((meal) => {
      if (meal.hasOwnProperty("days") && meal.days === mealdays) {
        meal.mealSechdule.push(newMeal);
      }
    });

    template.markModified("mealTemplate");

    await template.save();

    const updatedTemplate = await Template.findById(templateId);

    return res.status(201).json({
      message: "Meal added successfully",
      template: updatedTemplate,
    });
  } catch (error) {
    console.error("Error adding meal:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const createVersion = async (req, res) => {
  try {
    const { templateId, creationMethod, copyMealsOfMealPlan, selectedDesiredDays } = req.body;

    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

  if(copyMealsOfMealPlan === "Do not copy" && creationMethod === "Create a version for each day"){
    const newMeal = {
      days: selectedDesiredDays,
      mealSchedule: [
        { mealType: "Breakfast", time: "7:00 AM", meal: [], notes: "" },
        { mealType: "Morning Snack", time: "10:00 AM", meal: [], notes: "" },
        { mealType: "Lunch", time: "12:00 PM", appetizer: [], dish: [], dessert: [], beverage: [], notes: "" },
        { mealType: "Afternoon Snack", time: "4:00 PM", meal: [], notes: "" },
        { mealType: "Dinner", time: "7:00 PM", appetizer: [], dish: [], dessert: [], beverage: [], notes: "" },
        { mealType: "Supper", time: "10:00 PM", meal: [], notes: "" },
      ],
    };

    const updateMealTemplate = (template, newMeal) => {
      template.mealTemplate = template.mealTemplate.map((entry) => {
        if (!Array.isArray(entry.days)) {
          entry.days = [];
        }
        if (entry.days.some((day) => newMeal.days.includes(day))) {
          entry.days = entry.days.filter((day) => !newMeal.days.includes(day));
        }
        return entry;
      });
      template.mealTemplate.push(newMeal);
      template.mealTemplate = template.mealTemplate.filter((entry) => entry.days.length > 0);
    };

    updateMealTemplate(template, newMeal);
    template.markModified("mealTemplate");
    await template.save();
  }

  if (copyMealsOfMealPlan === "copy" && creationMethod === 'null') {

    const newMeal = {
      days: selectedDesiredDays, 
      mealSchedule: [],
    };

    const copyMealScheduleForDays = (template, specifiedDays) => {
      specifiedDays.forEach((day) => {
        const existingEntry = template.mealTemplate.find((entry) =>
          entry.days.includes(day)
        );

        if (existingEntry) {
          const copiedSchedule = existingEntry.mealSchedule.map((meal) => ({
            ...meal,
          }));

          newMeal.mealSchedule.push(...copiedSchedule);
        }
      });
    };

    copyMealScheduleForDays(template, newMeal.days);

    const updateMealTemplate = (template, newMeal) => {
      template.mealTemplate = template.mealTemplate.map((entry) => {
        if (!Array.isArray(entry.days)) {
          entry.days = [];
        }

        if (entry.days.some((day) => newMeal.days.includes(day))) {
          entry.days = entry.days.filter((day) => !newMeal.days.includes(day));
        }
        return entry;
      });
      template.mealTemplate.push(newMeal);
    };

    updateMealTemplate(template, newMeal);
    template.markModified("mealTemplate");
    await template.save();
  }

  if (copyMealsOfMealPlan !== "Do not copy" && creationMethod === "Merge selected days into a single version"){
    
  }

  if (copyMealsOfMealPlan === "Do not copy" && creationMethod === "Merge selected days into a single version"){

  }

  if (copyMealsOfMealPlan === "Do not copy" && creationMethod === "Create a version for each day"){

  }

  if (copyMealsOfMealPlan !== "Do not copy" && creationMethod === "Create a version for each day"){

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
module.exports = {
  createMealTemplate,
  addNewMeal,
  createVersion,
};

