const mongoose = require('mongoose');

const dietarySupplementsSchema = new mongoose.Schema({
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
    default: 'My dietary supplements',
  },
  group: {
    type: String,
    required: true,
    enum: ['Dietary supplements', 'Phytotherapeutic agents'],
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
    cholineTotal: {
      value: Number,
      unit: String,
    },
    betaine: {
      value: Number,
      unit: String,
    },
    DHA: {
      value: Number,
      unit: String,
    },
    EPA: {
      value: Number,
      unit: String,
    },
    creatineMonohydrate: {
      value: Number,
      unit: String,
    },
    biotin: {
      value: Number,
      unit: String,
    },
    chromium: {
      value: Number,
      unit: String,
    },
    lodine: {
      value: Number,
      unit: String,
    },
    CLA: {
      value: Number,
      unit: String,
    },
    inositol: {
      value: Number,
      unit: String,
    },
    creatine: {
      value: Number,
      unit: String,
    },
    glutamine: {
      value: Number,
      unit: String,
    },
    lecithin: {
      value: Number,
      unit: String,
    },
    hyaluronicAcid: {
      value: Number,
      unit: String,
    },
    beta_Alanine: {
      value: Number,
      unit: String,
    },
    HMB: {
      value: Number,
      unit: String,
    },
  },
  aminogram: {
    tryptophan: {
      value: Number,
      unit: String,
    },
    threonline: {
      value: Number,
      unit: String,
    },
    isoleucine: {
      value: Number,
      unit: String,
    },
    leucine: {
      value: Number,
      unit: String,
    },
    lysine: {
      value: Number,
      unit: String,
    },
    methionline: {
      value: Number,
      unit: String,
    },
    cystine: {
      value: Number,
      unit: String,
    },
    phenylalanine: {
      value: Number,
      unit: String,
    },
    tyrosine: {
      value: Number,
      unit: String,
    },
    valine: {
      value: Number,
      unit: String,
    },
    arginine: {
      value: Number,
      unit: String,
    },
    histidine: {
      value: Number,
      unit: String,
    },
    alanine: {
      value: Number,
      unit: String,
    },
    asparticAcid: {
      value: Number,
      unit: String,
    },
    glutamicAcid: {
      value: Number,
      unit: String,
    },
    glycine: {
      value: Number,
      unit: String,
    },
    proline: {
      value: Number,
      unit: String,
    },
    serine: {
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

const DietarySupplements = mongoose.model(
  'DietarySupplements',
  dietarySupplementsSchema
);

module.exports = DietarySupplements;
