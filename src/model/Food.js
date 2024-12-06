const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    // required: true,
  },
  source: {
    type: String,
    default: 'My foods',
  },
  group: {
    type: String,
    // required: true,
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
      type: Number,

    },
    fat: {
      type: Number,

    },
    carbohydrate: {
      type: Number,

    },
    protein: {
      type: Number,

    },
  },
  micronutrients: {
    cholesterol: {
      type: Number,
      default: 0.0
    },
    fiber: {
      type: Number,
      default: 0.0
    },
    sodium: {
      type: Number,
      default: 0.0
    },
    water: {
      type: Number,
      default: 0.0
    },
    vitaminA: {
      type: Number,
      default: 0.0
    },
    vitaminB6: {
      type: Number,
      default: 0.0
    },
    vitaminB12: {
      type: Number,
      default: 0.0
    },
    vitaminC: {
      type: Number,
      default: 0.0
    },
    vitaminD_D2_D3: {
      type: Number,
      default: 0.0
    },
    vitaminE: {
      type: Number,
      default: 0.0
    },
    vitaminK: {
      type: Number,
      default: 0.0
    },
    starch: {
      type: Number,
      default: 0.0
    },
    lactose: {
      type: Number,
      default: 0.0
    },
    alcohol: {
      type: Number,
      default: 0.0
    },
    caffeine: {
      type: Number,
      default: 0.0
    },
    sugars: {
      type: Number,
      default: 0.0
    },
    calcium: {
      type: Number,
      default: 0.0
    },
    iron: {
      type: Number,
      default: 0.0
    },
    magnesium: {
      type: Number,
      default: 0.0
    },
    phosphorus: {
      type: Number,
      default: 0.0
    },
    potassium: {
      type: Number,
      default: 0.0
    },
    zinc: {
      type: Number,
      default: 0.0
    },
    copper: {
      type: Number,
      default: 0.0
    },
    fluorlde: {
      type: Number,
      default: 0.0
    },
    manganese: {
      type: Number,
      default: 0.0
    },
    selenium: {
      type: Number,
      default: 0.0
    },
    thiamin: {
      type: Number,
      default: 0.0
    },
    riboflavin: {
      type: Number,
      default: 0.0
    },
    niacin: {
      type: Number,
      default: 0.0
    },
    pantothenicAcid: {
      type: Number,
      default: 0.0
    },
    folateTotal: {
      type: Number,
      default: 0.0
    },
    folicAcid: {
      type: Number,
      default: 0.0
    },
    fattyAcidsTotalTrans: {
      type: Number,
      default: 0.0
    },
    fattyAcidsTotalSaturated: {
      type: Number,
      default: 0.0
    },
    fattyAcidsTotalMonounsaturated: {
      type: Number,
      default: 0.0
    },
    fattyAcidsTotalPolyunsaturated: {
      type: Number,
      default: 0.0
    },
    chloride: {
      type: Number,
      default: 0.0
    },
  },
  commonMeasures: [
    {
      singularName: {
        type: String,

      },
      pluralName: {
        type: String,

      },
      quantity: {
        type: Number,

      },
      totalGrams: {
        type: Number,

      },
      ediblePortion: {
        type: Number,

      },
    },
  ],
});

const Food = mongoose.model('Food', FoodSchema);

module.exports = Food;
