const mongoose = require('mongoose');

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
    default: 'My foods',
  },
  group: {
    type: String,
    required: true,
    enum: [
      'Dairy and Egg Products',
      'Spices and Herbs',
      'Baby Foods',
      'Fats and Oils',
      'Poultry Products',
      'Soup,Sauces,and Gravies',
      'Sausages and Luncheon Meats',
      'Breakfast Cereals',
      'Fruits and Fruit Juices',
      'Pork Products',
      'Vegetables and Vegetable Products',
      'Nut and Seed Products',
      'Beef Products',
      'Beverages',
      'Finfish and Shellfish Products',
      'Legumes and Legume Products',
      'Lamb,Veal,and Game Products',
      'Baked Products',
      'Sweets',
      'Cereal Grains and Pasta',
      'Fast Foods',
      'Meals,Entrees,and Side Dishes',
      'Snacks',
      'American Indian/Alaska Native Foods',
      'Restaurants Food',
    ],
  },
  quantity: {
    type: String,
    required: true,
  },
  macronutrients: {
    energy: {
      value: Number,
      unit: String,
    },
    fat: {
      value: Number,
      unit: String,
    },
    carbohydrate: {
      value: Number,
      unit: String,
    },
    protein: {
      value: Number,
      unit: String,
    },
  },
  micronutrients: {
    cholesterol: {
      value: Number,
      unit: String,
    },
    fiber: {
      value: Number,
      unit: String,
    },
    sodium: {
      value: Number,
      unit: String,
    },
    water: {
      value: Number,
      unit: String,
    },
    vitaminA: {
      value: Number,
      unit: String,
    },
    vitaminB6: {
      value: Number,
      unit: String,
    },
    vitaminB12: {
      value: Number,
      unit: String,
    },
    vitaminC: {
      value: Number,
      unit: String,
    },
    vitaminD_D2_D3: {
      value: Number,
      unit: String,
    },
    vitaminE: {
      value: Number,
      unit: String,
    },
    vitaminK: {
      value: Number,
      unit: String,
    },
    starch: {
      value: Number,
      unit: String,
    },
    lactose: {
      value: Number,
      unit: String,
    },
    alcohol: {
      value: Number,
      unit: String,
    },
    caffeine: {
      value: Number,
      unit: String,
    },
    sugars: {
      value: Number,
      unit: String,
    },
    calcium: {
      value: Number,
      unit: String,
    },
    iron: {
      value: Number,
      unit: String,
    },
    magnesium: {
      value: Number,
      unit: String,
    },
    phosphorus: {
      value: Number,
      unit: String,
    },
    potassium: {
      value: Number,
      unit: String,
    },
    zinc: {
      value: Number,
      unit: String,
    },
    copper: {
      value: Number,
      unit: String,
    },
    fluorlde: {
      value: Number,
      unit: String,
    },
    manganese: {
      value: Number,
      unit: String,
    },
    selenium: {
      value: Number,
      unit: String,
    },
    thiamin: {
      value: Number,
      unit: String,
    },
    riboflavin: {
      value: Number,
      unit: String,
    },
    niacin: {
      value: Number,
      unit: String,
    },
    pantothenicAcid: {
      value: Number,
      unit: String,
    },
    folateTotal: {
      value: Number,
      unit: String,
    },
    folicAcid: {
      value: Number,
      unit: String,
    },
    fattyAcidsTotalTrans: {
      value: Number,
      unit: String,
    },
    fattyAcidsTotalSaturated: {
      value: Number,
      unit: String,
    },
    fattyAcidsTotalMonounsaturated: {
      value: Number,
      unit: String,
    },
    fattyAcidsTotalPolyunsaturated: {
      value: Number,
      unit: String,
    },
    chloride: {
      value: Number,
      unit: String,
    },
  },
  commonMeasures: [
    [
      {
        singularName: {
          value: Number,
          unit: String,
        },
        pluralName: {
          value: Number,
          unit: String,
        },
        quantity: {
          value: Number,
          unit: String,
        },
        totalGrams: {
          value: Number,
          unit: String,
        },
        ediblePortion: {
          value: Number,
          unit: String,
        },
      },
    ],
  ],
});

const Food = mongoose.model('Food', FoodSchema);

module.exports = Food;
