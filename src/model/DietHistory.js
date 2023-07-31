const mongoose = require('mongoose');

const dietHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Clients',
  },
  wakeupTime: {
    type: String,
  },
  bedTime: {
    type: String,
  },
  typeOfDiet: [
    {
      type: String,
      enum: [
        'DASH',
        'Halal',
        'Kosher',
        'Lacto-ovo-vegeterian',
        'Lactovegeterian',
        'Low-carb',
        'Low-fat',
        'Macrobiotic',
        'Ovo-vegeterian',
        'Paleo',
        'Pescatarian',
        'Red meat avoider',
        'Vegan',
        'Vegeterian',
        'Other',
      ],
    },
  ],
  typeOfDietDetail: {
    type: String,
  },
  favoriteFood: {
    type: String,
  },
  dislikeFood: {
    type: String,
  },
  allergies: [
    {
      type: String,
      enum: [
        'Celery',
        'Crustacean',
        'Egg',
        'Fish',
        'Gluten',
        'Lupin',
        'Milk',
        'Mollusc',
        'Mustard',
        'Natural latex',
        'Peanut',
        'Sesame',
        'Soybeans',
        'Sulphur dioxide',
        'Tree nut',
        'Wheat',
      ],
    },
  ],
  allergiesDetail: {
    type: String,
  },
  foodIntolerances: [
    {
      type: String,
      enum: [
        'Alcohol',
        'Amines',
        'Artificial sweeteners',
        'Caffeine',
        'FODMAPs',
        'Food coloring',
        'Fructose',
        'Gluten',
        'Histamine',
        'Lactose',
        'Monosodium glutamate (MSG)',
        'Salicylates',
        'Sulfites',
        'Wheat',
        'Yeast',
      ],
    },
  ],
  foodIntolerancesDetail: {
    type: String,
  },
  nutritionalDeficiencies: [
    {
      type: String,
      enum: [
        'Calcium',
        'Electrolytes',
        'Fluid',
        'Folic acid',
        'Iodine',
        'Iron',
        'Magnesium',
        'Niacin',
        'Potassium',
        'Sodium',
        'Thiamine',
        'Vitamin A',
        'Vitamin B12',
        'Vitamin C',
        'Vitamin D',
      ],
    },
  ],
  nutritionalDeficienciesDetail: {
    type: String,
  },
  waterTank: {
    type: String,
  },
  otherInfo: {
    type: String,
    enum: [
      'Less than 0.5 litres',
      'Between 0.5 and 1 litre',
      'Between 1 and 1.5 litre',
      'Between 1.5 and 2 litre',
      'Between 2 and 2.5 litre',
      'Between 2.5 and 3 litre',
      'More than 3 litres',
    ],
  },
});

module.exports = mongoose.model('dietHistory', dietHistorySchema);
