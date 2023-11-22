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

    },
    fiber: {
      type: Number,

    },
    sodium: {
      type: Number,

    },
    water: {
      type: Number,

    },
    vitaminA: {
      type: Number,

    },
    vitaminB6: {
      type: Number,

    },
    vitaminB12: {
      type: Number,

    },
    vitaminC: {
      type: Number,

    },
    vitaminD_D2_D3: {
      type: Number,

    },
    vitaminE: {
      type: Number,

    },
    vitaminK: {
      type: Number,

    },
    starch: {
      type: Number,

    },
    lactose: {
      type: Number,

    },
    alcohol: {
      type: Number,

    },
    caffeine: {
      type: Number,

    },
    sugars: {
      type: Number,

    },
    calcium: {
      type: Number,

    },
    iron: {
      type: Number,

    },
    magnesium: {
      type: Number,

    },
    phosphorus: {
      type: Number,

    },
    potassium: {
      type: Number,

    },
    zinc: {
      type: Number,

    },
    copper: {
      type: Number,

    },
    fluorlde: {
      type: Number,

    },
    manganese: {
      type: Number,

    },
    selenium: {
      type: Number,

    },
    thiamin: {
      type: Number,

    },
    riboflavin: {
      type: Number,

    },
    niacin: {
      type: Number,

    },
    pantothenicAcid: {
      type: Number,

    },
    folateTotal: {
      type: Number,

    },
    folicAcid: {
      type: Number,

    },
    fattyAcidsTotalTrans: {
      type: Number,

    },
    fattyAcidsTotalSaturated: {
      type: Number,

    },
    fattyAcidsTotalMonounsaturated: {
      type: Number,

    },
    fattyAcidsTotalPolyunsaturated: {
      type: Number,

    },
    chloride: {
      type: Number,

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
