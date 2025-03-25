const mongoose = require("mongoose");

const personalHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Clients",
  },
  bowelMovements: {
    type: String,
    enum: ["Normal", "Constipation", "Diarrhea", "Irregular"],
  },
  bowelMovementsInfo: {
    type: String,
  },
  sleepQuality: {
    type: String,
    enum: [
      "Less than 5 hours/night",
      "About 5 hours/night",
      "About 6 hours/night",
      "About 7 hours/night",
      "About 8 hours/night",
      "About 9 hours/night",
      "About 10 hours/night",
      "More than 5 hours/night",
    ],
  },
  sleepQualityInfo: {
    type: String,
  },
  smoker: {
    type: String,
    enum: ["Yes", "No"],
  },
  smokerInfo: {
    type: String,
  },
  alcoholConsumption: {
    type: String,
    enum: ["Yes", "No"],
  },
  alcoholConsumptionInfo: {
    type: String,
  },
  maritalStatus: {
    type: String,
    enum: ["Married", "Single", "Divorced", "Widower"],
  },
  maritalStatusInfo: {
    type: String,
  },
  physicalActivity: {
    type: String,
  },
  race: {
    type: String,
    enum: ["Caucasian", "Black", "Asian"],
  },
  bmr: {
    type: String,
  },
  bloodGroup: {
    type: String,
  },
  caloriesReq: {
    type: String,
  },
  overWeight: {
    type: String,
  },
  underWeight: {
    type: String,
  },
  idealBodyWeight: {
    type: String,
  },
  targetWeight: {
    type: String,
  },
  lmpDate: {
    type: String,
  },
  pa_h: {
    type: String,
  },
  F_H: {
    type: String,
  },
  anyMedication: {
    type: String,
  },
  sCholesterol: {
    type: String,
  },
  sTriglyceride: {
    type: String,
  },
  hdl: {
    type: String,
  },
  ldl: {
    type: String,
  },
  vldl: {
    type: String,
  },
  sTSH: {
    type: String,
  },
  sT3: {
    type: String,
  },
  sT4: {
    type: String,
  },
  sB12: {
    type: String,
  },
  svitD3: {
    type: String,
  },
  hb: {
    type: String,
  },
  bp: {
    type: String,
  },
  hb1ac: {
    type: String,
  },
  validityDate: {
    type: String,
  },
  rbs: {
    type: String,
  },
  fbs: {
    type: String,
  },
  pp2bs: {
    type: String,
  },
  selectProgram: {
    type: String,
  },
  session: {
    type: String,
  },
  months: {
    type: String,
  },
  beforePicture1: {
    type: String,
  },
  beforePicture2: {
    type: String,
  },
  beforePicture3: {
    type: String,
  },
  beforePicture4: {
    type: String,
  },
  beforePicture5: {
    type: String,
  },
  afterPicture1: {
    type: String,
  },
  afterPicture2: {
    type: String,
  },
  afterPicture3: {
    type: String,
  },
  afterPicture4: {
    type: String,
  },
  afterPicture5: {
    type: String,
  },
  occupation: {
    type: String,
  },
  foodChoice: {
    type: String
  },
  time: {
    type: String,
  },
  milk: {
    type: String,
  },
  oil: {
    type: String,
  },
  salt: {
    type: String,
  },
  fastingDay: {
    type: String,
  },
  fastFood: {
    type: String,
  },
  hotelFood: {
    type: String,
  },
  AnythingElse: {
    type: String,
  },
  Habit: {
    type: String,
  },
  otherInfo: {
    type: String,
  },
});

module.exports = mongoose.model("PersonalHistory", personalHistorySchema);
