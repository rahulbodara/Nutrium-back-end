const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  group: {
    type: String,
    required: true,
  },
  quantity: {
    String,
    required: true,
  },
  macronutrients: {
    energy: {
      value: Number,
      unit: "kcal",
    },
    fat: {
      value: Number,
      unit: "g",
    },
    carbohydrate: {
      value: Number,
      unit: "g",
    },
    protein: {
      value: Number,
      unit: "g",
    },
  },
  micronutrients: {
    cholesterol: {
      value: Number,
      unit: "mg",
    },
    fiber: {
      value: Number,
      unit: "g",
    },
    sodium: {
      value: Number,
      unit: "mg",
    },
    water: {
      value: Number,
      unit: "g",
    },
    vitaminA: {
      value: Number,
      unit: "ug",
    },
    vitaminB6: {
      value: Number,
      unit: "mg",
    },
    vitaminB12: {
      value: Number,
      unit: "ug",
    },
    vitaminC: {
      value: Number,
      unit: "mg",
    },
    vitaminD_D2_D3: {
      value: Number,
      unit: "ug",
    },
    vitaminE: {
      value: Number,
      unit: "mg",
    },
    vitaminK: {
      value: Number,
      unit: "ug",
    },
    starch: {
      value: Number,
      unit: "g",
    },
    lactose: {
      value: Number,
      unit: "g",
    },
    alcohol: {
      value: Number,
      unit: "g",
    },
    caffeine: {
      value: Number,
      unit: "mg",
    },
    sugars: {
      value: Number,
      unit: "g",
    },
    calcium: {
      value: Number,
      unit: "mg",
    },
    iron: {
      value: Number,
      unit: "mg",
    },
    magnesium: {
      value: Number,
      unit: "mg",
    },
    phosphorus: {
      value: Number,
      unit: "mg",
    },
    potassium: {
      value: Number,
      unit: "mg",
    },
    zinc: {
      value: Number,
      unit: "mg",
    },
    copper: {
      value: Number,
      unit: "mg",
    },
    fluorlde: {
      value: Number,
      unit: "ug",
    },
    manganese: {
      value: Number,
      unit: "mg",
    },
    selenium: {
      value: Number,
      unit: "ug",
    },
    thlamin: {
      value: Number,
      unit: "mg",
    },
    zinc: {
      value: Number,
      unit: "mg",
    },
    riboflavin: {
      value: Number,
      unit: "mg",
    },
    niacin: {
      value: Number,
      unit: "mg",
    },
    pantothenicAcid: {
      value: Number,
      unit: "mg",
    },
    folateTotal: {
      value: Number,
      unit: "ug",
    },
    folicAcid: {
      value: Number,
      unit: "ug",
    },
    fattyAcidsTotalTrans: {
      value: Number,
      unit: "g",
    },
    fattyAcidsTotalSaturated: {
      value: Number,
      unit: "g",
    },
    fattyAcidsTotalMonounsaturated: {
      value: Number,
      unit: "g",
    },
    fattyAcidsTotalPolyunsaturated: {
      value: Number,
      unit: "g",
    },
    chloride: {
      value: Number,
      unit: "mg",
    },
  },
});
const Food = mongoose.model("Food", FoodSchema);

module.exports = Food;
