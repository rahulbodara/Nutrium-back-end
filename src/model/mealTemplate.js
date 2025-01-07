const mongoose = require("mongoose");

const TemplateSchema = new mongoose.Schema({
  templateName: { type: String, },
  userId: { type: String, required: true },
  mealTemplate: {type: [Object] , default: []}, 
});

const Template = mongoose.model("Template", TemplateSchema);

module.exports = Template;
