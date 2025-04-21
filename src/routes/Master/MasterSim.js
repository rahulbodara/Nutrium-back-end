const express = require('express');
const { createItem, getAllItems, getItemById, updateItem, deleteItem } = require('../../controller/Master/MasterController');
const alchohol_consumption = require('../../model/Masters/alcohol_consumption');
const allergies = require('../../model/Masters/allergies');
const appointment_status = require('../../model/Masters/appointment_status');
const AppointmentConsultation = require('../../model/Masters/appointment_consultation');
const BirthdaySystem = require('../../model/Masters/birthday_system');
const BloodGroup = require('../../model/Masters/blood_group');
const BowelMovement = require('../../model/Masters/bowel_movement');
const ClientFilter = require('../../model/Masters/client_filter');
const ClinicalGoals = require('../../model/Masters/clinical_goal');
const Country = require('../../model/Masters/country');
const DietaryDatabaseFilter = require('../../model/Masters/dietary_databse_filter');
const Diseases = require('../../model/Masters/diseases');
const FileCategory = require('../../model/Masters/file_category');
const FoodDatabaseFilter = require('../../model/Masters/food_database_filter');
const FoodFilter = require('../../model/Masters/food_filter');
const FoodGroup = require('../../model/Masters/food_group');
const FoodIntolerances = require('../../model/Masters/food_intolerances');
const Gender = require('../../model/Masters/gender');
const GestationType = require('../../model/Masters/gestation_type');
const GoalType = require('../../model/Masters/goal_type');
const Language = require('../../model/Masters/language');
const MeritialStatus = require('../../model/Masters/meritial_status');
const NutritionalDeficiencies = require('../../model/Masters/nutritional_deficiencies');
const NutriumProfession = require('../../model/Masters/nutrium_profession');
const PregnancyType = require('../../model/Masters/pregnancy_type');
const Race = require('../../model/Masters/race');
const RecipeCategory = require('../../model/Masters/recipe_category');
const SleepQuality = require('../../model/Masters/sleep_quality');
const Smoker = require('../../model/Masters/smoker');
const TemplateFilter = require('../../model/Masters/template_filter');
const TimeZone = require('../../model/Masters/time_zones');
const TypeOFDiet = require('../../model/Masters/type_of_diet');
const food_diary = require('../../model/Masters/food_diary');
const measurement_type = require('../../model/Masters/measurement_type');
const signup_qna = require('../../model/Masters/signup_qna');
const time_zones = require('../../model/Masters/time_zones');
const unit = require('../../model/Masters/unit');
const weightunit = require('../../model/Masters/weight_unit');
const lengthUnit = require('../../model/Masters/length_unit');
const energyUnit = require('../../model/Masters/energy_unit');
const volumeunit = require('../../model/Masters/volume_unit');
const distanceUnit = require('../../model/Masters/distance_unit');


// const diet_databse_filter = require('../../model/Masters/dietary-databse-filter');


const router = express.Router();

router.post('/alcohol-consumption', (req, res) => createItem(req, res, alchohol_consumption));
router.get('/alcohol-consumption', (req, res) => getAllItems(req, res, alchohol_consumption));
router.get('/alcohol-consumption/:id', (req, res) => getItemById(req, res, alchohol_consumption));
router.put('/alcohol-consumption/:id', (req, res) => updateItem(req, res, alchohol_consumption));
router.delete('/alcohol-consumption/:id', (req, res) => deleteItem(req, res, alchohol_consumption));

router.post('/allergies', (req, res) => createItem(req, res, allergies))
router.get('/allergies', (req, res) => getAllItems(req, res, allergies))
router.get('/allergies/:id', (req, res) => getItemById(req, res, allergies))
router.put('/allergies/:id', (req, res) => updateItem(req, res, allergies))
router.delete('/allergies/:id', (req, res) => deleteItem(req, res, allergies))

router.post('/appointment-status', (req, res) => createItem(req, res, appointment_status))
router.get('/appointment-status', (req, res) => getAllItems(req, res, appointment_status))
router.get('/appointment-status/:id', (req, res) => getItemById(req, res, appointment_status))
router.put('/appointment-status/:id', (req, res) => updateItem(req, res, appointment_status))
router.delete('/appointment-status/:id', (req, res) => deleteItem(req, res, appointment_status))

router.post('/appointment-consultation', (req, res) => createItem(req, res, AppointmentConsultation))
router.get('/appointment-consultation', (req, res) => getAllItems(req, res, AppointmentConsultation))
router.get('/appointment-consultation/:id', (req, res) => getItemById(req, res, AppointmentConsultation))
router.put('/appointment-consultation/:id', (req, res) => updateItem(req, res, AppointmentConsultation))
router.delete('/appointment-consultation/:id', (req, res) => deleteItem(req, res, AppointmentConsultation))

router.post('/birthday-system', (req, res) => createItem(req, res, BirthdaySystem))
router.get('/birthday-system', (req, res) => getAllItems(req, res, BirthdaySystem))
router.get('/birthday-system/:id', (req, res) => getItemById(req, res, BirthdaySystem))
router.put('/birthday-system/:id', (req, res) => updateItem(req, res, BirthdaySystem))
router.delete('/birthday-system/:id', (req, res) => deleteItem(req, res, BirthdaySystem))

router.post("/blood-group", (req, res) => createItem(req, res, BloodGroup))
router.get("/blood-group", (req, res) => getAllItems(req, res, BloodGroup))
router.get("/blood-group/:id", (req, res) => getItemById(req, res, BloodGroup))
router.put("/blood-group/:id", (req, res) => updateItem(req, res, BloodGroup))
router.delete("/blood-group/:id", (req, res) => deleteItem(req, res, BloodGroup))

router.post("/bowel-movement", (req, res) => createItem(req, res, BowelMovement))
router.get("/bowel-movement", (req, res) => getAllItems(req, res, BowelMovement))
router.get("/bowel-movement/:id", (req, res) => getItemById(req, res, BowelMovement))
router.put("/bowel-movement/:id", (req, res) => updateItem(req, res, BowelMovement))
router.delete("/bowel-movement/:id", (req, res) => deleteItem(req, res, BowelMovement))

router.post("/client-filter", (req, res) => createItem(req, res, ClientFilter))
router.get("/client-filter", (req, res) => getAllItems(req, res, ClientFilter))
router.get("/client-filter/:id", (req, res) => getItemById(req, res, ClientFilter))
router.put("/client-filter/:id", (req, res) => updateItem(req, res, ClientFilter))
router.delete("/client-filter/:id", (req, res) => deleteItem(req, res, ClientFilter))

router.post("/clinical-goal", (req, res) => createItem(req, res, ClinicalGoals))
router.get("/clinical-goal", (req, res) => getAllItems(req, res, ClinicalGoals))
router.get("/clinical-goal/:id", (req, res) => getItemById(req, res, ClinicalGoals))
router.put("/clinical-goal/:id", (req, res) => updateItem(req, res, ClinicalGoals))
router.delete("/clinical-goal/:id", (req, res) => deleteItem(req, res, ClinicalGoals))

router.post("/country", (req, res) => createItem(req, res, Country))
router.get("/country", (req, res) => getAllItems(req, res, Country))
router.get("/country/:id", (req, res) => getItemById(req, res, Country))
router.put("/country/:id", (req, res) => updateItem(req, res, Country))
router.delete("/country/:id", (req, res) => deleteItem(req, res, Country))

router.post("/dietary-databse-filter", (req, res) => createItem(req, res, DietaryDatabaseFilter))
router.get("/dietary-databse-filter", (req, res) => getAllItems(req, res, DietaryDatabaseFilter))
router.get("/dietary-databse-filter/:id", (req, res) => getItemById(req, res, DietaryDatabaseFilter))
router.put("/dietary-databse-filter/:id", (req, res) => updateItem(req, res, DietaryDatabaseFilter))
router.delete("/dietary-databse-filter/:id", (req, res) => deleteItem(req, res, DietaryDatabaseFilter))


router.post("/diseases", (req, res) => createItem(req, res, Diseases))
router.get("/diseases", (req, res) => getAllItems(req, res, Diseases))
router.get("/diseases/:id", (req, res) => getItemById(req, res, Diseases))
router.put("/diseases/:id", (req, res) => updateItem(req, res, Diseases))
router.delete("/diseases/:id", (req, res) => deleteItem(req, res, Diseases))

router.post("/file-category", (req, res) => createItem(req, res, FileCategory))
router.get("/file-category", (req, res) => getAllItems(req, res, FileCategory))
router.get("/file-category/:id", (req, res) => getItemById(req, res, FileCategory))
router.put("/file-category/:id", (req, res) => updateItem(req, res, FileCategory))
router.delete("/file-category/:id", (req, res) => deleteItem(req, res, FileCategory))


router.post("/food-database-filter", (req, res) => createItem(req, res, FoodDatabaseFilter))
router.get("/food-database-filter", (req, res) => getAllItems(req, res, FoodDatabaseFilter))
router.get("/food-database-filter/:id", (req, res) => getItemById(req, res, FoodDatabaseFilter))
router.put("/food-database-filter/:id", (req, res) => updateItem(req, res, FoodDatabaseFilter))
router.delete("/food-database-filter/:id", (req, res) => deleteItem(req, res, FoodDatabaseFilter))

router.post("/food-filter", (req, res) => createItem(req, res, FoodFilter))
router.get("/food-filter", (req, res) => getAllItems(req, res, FoodFilter))
router.get("/food-filter/:id", (req, res) => getItemById(req, res, FoodFilter))
router.put("/food-filter/:id", (req, res) => updateItem(req, res, FoodFilter))
router.delete("/food-filter/:id", (req, res) => deleteItem(req, res, FoodFilter))

router.post("/food-group", (req, res) => createItem(req, res, FoodGroup))
router.get("/food-group", (req, res) => getAllItems(req, res, FoodGroup))
router.get("/food-group/:id", (req, res) => getItemById(req, res, FoodGroup))
router.put("/food-group/:id", (req, res) => updateItem(req, res, FoodGroup))
router.delete("/food-group/:id", (req, res) => deleteItem(req, res, FoodGroup))


router.post("/food-intolerances", (req, res) => createItem(req, res, FoodIntolerances))
router.get("/food-intolerances", (req, res) => getAllItems(req, res, FoodIntolerances))
router.get("/food-intolerances/:id", (req, res) => getItemById(req, res, FoodIntolerances))
router.put("/food-intolerances/:id", (req, res) => updateItem(req, res, FoodIntolerances))
router.delete("/food-intolerances/:id", (req, res) => deleteItem(req, res, FoodIntolerances))


router.post("/gender", (req, res) => createItem(req, res, Gender))
router.get("/gender", (req, res) => getAllItems(req, res, Gender))
router.get("/gender/:id", (req, res) => getItemById(req, res, Gender))
router.put("/gender/:id", (req, res) => updateItem(req, res, Gender))
router.delete("/gender/:id", (req, res) => deleteItem(req, res, Gender))


router.post("/gestation-type", (req, res) => createItem(req, res, GestationType))
router.get("/gestation-type", (req, res) => getAllItems(req, res, GestationType))
router.get("/gestation-type/:id", (req, res) => getItemById(req, res, GestationType))
router.put("/gestation-type/:id", (req, res) => updateItem(req, res, GestationType))
router.delete("/gestation-type/:id", (req, res) => deleteItem(req, res, GestationType))


router.post("/goal-type", (req, res) => createItem(req, res, GoalType))
router.get("/goal-type", (req, res) => getAllItems(req, res, GoalType))
router.get("/goal-type/:id", (req, res) => getItemById(req, res, GoalType))
router.put("/goal-type/:id", (req, res) => updateItem(req, res, GoalType))
router.delete("/goal-type/:id", (req, res) => deleteItem(req, res, GoalType))

router.post("/language", (req, res) => createItem(req, res, Language))
router.get("/language", (req, res) => getAllItems(req, res, Language))
router.get("/language/:id", (req, res) => getItemById(req, res, Language))
router.put("/language/:id", (req, res) => updateItem(req, res, Language))
router.delete("/language/:id", (req, res) => deleteItem(req, res, Language))


router.post("/meritial-status", (req, res) => createItem(req, res, MeritialStatus))
router.get("/meritial-status", (req, res) => getAllItems(req, res, MeritialStatus))
router.get("/meritial-status/:id", (req, res) => getItemById(req, res, MeritialStatus))
router.put("/meritial-status/:id", (req, res) => updateItem(req, res, MeritialStatus))
router.delete("/meritial-status/:id", (req, res) => deleteItem(req, res, MeritialStatus))


router.post("/nutritional-deficiencies", (req, res) => createItem(req, res, NutritionalDeficiencies))
router.get("/nutritional-deficiencies", (req, res) => getAllItems(req, res, NutritionalDeficiencies))
router.get("/nutritional-deficiencies/:id", (req, res) => getItemById(req, res, NutritionalDeficiencies))
router.put("/nutritional-deficiencies/:id", (req, res) => updateItem(req, res, NutritionalDeficiencies))
router.delete("/nutritional-deficiencies/:id", (req, res) => deleteItem(req, res, NutritionalDeficiencies))


router.post("/nutrium-profession", (req, res) => createItem(req, res, NutriumProfession))
router.get("/nutrium-profession", (req, res) => getAllItems(req, res, NutriumProfession))
router.get("/nutrium-profession/:id", (req, res) => getItemById(req, res, NutriumProfession))
router.put("/nutrium-profession/:id", (req, res) => updateItem(req, res, NutriumProfession))
router.delete("/nutrium-profession/:id", (req, res) => deleteItem(req, res, NutriumProfession))


router.post("/pregnancy-type", (req, res) => createItem(req, res, PregnancyType))
router.get("/pregnancy-type", (req, res) => getAllItems(req, res, PregnancyType))
router.get("/pregnancy-type/:id", (req, res) => getItemById(req, res, PregnancyType))
router.put("/pregnancy-type/:id", (req, res) => updateItem(req, res, PregnancyType))
router.delete("/pregnancy-type/:id", (req, res) => deleteItem(req, res, PregnancyType))


router.post("/race", (req, res) => createItem(req, res, Race))
router.get("/race", (req, res) => getAllItems(req, res, Race))
router.get("/race/:id", (req, res) => getItemById(req, res, Race))
router.put("/race/:id", (req, res) => updateItem(req, res, Race))
router.delete("/race/:id", (req, res) => deleteItem(req, res, Race))

router.post("/recipe-category", (req, res) => createItem(req, res, RecipeCategory))
router.get("/recipe-category", (req, res) => getAllItems(req, res, RecipeCategory))
router.get("/recipe-category/:id", (req, res) => getItemById(req, res, RecipeCategory))
router.put("/recipe-category/:id", (req, res) => updateItem(req, res, RecipeCategory))
router.delete("/recipe-category/:id", (req, res) => deleteItem(req, res, RecipeCategory))

router.post("/sleep-quality", (req, res) => createItem(req, res, SleepQuality))
router.get("/sleep-quality", (req, res) => getAllItems(req, res, SleepQuality))
router.get("/sleep-quality/:id", (req, res) => getItemById(req, res, SleepQuality))
router.put("/sleep-quality/:id", (req, res) => updateItem(req, res, SleepQuality))
router.delete("/sleep-quality/:id", (req, res) => deleteItem(req, res, SleepQuality))


router.post("/smoker", (req, res) => createItem(req, res, Smoker))
router.get("/smoker", (req, res) => getAllItems(req, res, Smoker))
router.get("/smoker/:id", (req, res) => getItemById(req, res, Smoker))
router.put("/smoker/:id", (req, res) => updateItem(req, res, Smoker))
router.delete("/smoker/:id", (req, res) => deleteItem(req, res, Smoker))

router.post("/template-filter", (req, res) => createItem(req, res, TemplateFilter))
router.get("/template-filter", (req, res) => getAllItems(req, res, TemplateFilter))
router.get("/template-filter/:id", (req, res) => getItemById(req, res, TemplateFilter))
router.put("/template-filter/:id", (req, res) => updateItem(req, res, TemplateFilter))
router.delete("/template-filter/:id", (req, res) => deleteItem(req, res, TemplateFilter))

router.post("/time-zone", (req, res) => createItem(req, res, TimeZone))
router.get("/time-zone", (req, res) => getAllItems(req, res, TimeZone))
router.get("/time-zone/:id", (req, res) => getItemById(req, res, TimeZone))
router.put("/time-zone/:id", (req, res) => updateItem(req, res, TimeZone))
router.delete("/time-zone/:id", (req, res) => deleteItem(req, res, TimeZone))

router.post("/type-of-diet", (req, res) => createItem(req, res, TypeOFDiet))
router.get("/type-of-diet", (req, res) => getAllItems(req, res, TypeOFDiet))
router.get("/type-of-diet/:id", (req, res) => getItemById(req, res, TypeOFDiet))
router.put("/type-of-diet/:id", (req, res) => updateItem(req, res, TypeOFDiet))
router.delete("/type-of-diet/:id", (req, res) => deleteItem(req, res, TypeOFDiet))


router.post("/food-diary", (req, res) => createItem(req, res, food_diary))
router.get("/food-diary", (req, res) => getAllItems(req, res, food_diary))
router.get("/food-diary/:id", (req, res) => getItemById(req, res, food_diary))
router.put("/food-diary/:id", (req, res) => updateItem(req, res, food_diary))
router.delete("/food-diary/:id", (req, res) => deleteItem(req, res, food_diary))

router.post("/measurement-type", (req, res) => createItem(req, res, measurement_type))
router.get("/measurement-type", (req, res) => getAllItems(req, res, measurement_type))
router.get("/measurement-type/:id", (req, res) => getItemById(req, res, measurement_type))
router.put("/measurement-type/:id", (req, res) => updateItem(req, res, measurement_type))
router.delete("/measurement-type/:id", (req, res) => deleteItem(req, res, measurement_type))


router.post("/signup-qna", (req, res) => createItem(req, res, signup_qna))
router.get("/signup-qna", (req, res) => getAllItems(req, res, signup_qna))
router.get("/signup-qna/:id", (req, res) => getItemById(req, res, signup_qna))
router.put("/signup-qna/:id", (req, res) => updateItem(req, res, signup_qna))
router.delete("/signup-qna/:id", (req, res) => deleteItem(req, res, signup_qna))

router.post("/time-zones", (req, res) => createItem(req, res, time_zones))
router.get("/time-zones", (req, res) => getAllItems(req, res, time_zones))
router.get("/time-zones/:id", (req, res) => getItemById(req, res, time_zones))
router.put("/time-zones/:id", (req, res) => updateItem(req, res, time_zones))
router.delete("/time-zones/:id", (req, res) => deleteItem(req, res, time_zones))

router.post("/unit", (req, res) => createItem(req, res, unit))
router.get("/unit", (req, res) => getAllItems(req, res, unit))
router.get("/unit/:id", (req, res) => getItemById(req, res, unit))
router.put("/unit/:id", (req, res) => updateItem(req, res, unit))
router.delete("/unit/:id", (req, res) => deleteItem(req, res, unit))


router.post("/weight-unit", (req, res) => createItem(req, res, weightunit))
router.get("/weight-unit", (req, res) => getAllItems(req, res, weightunit))
router.get("/weight-unit/:id", (req, res) => getItemById(req, res, weightunit))
router.put("/weight-unit/:id", (req, res) => updateItem(req, res, weightunit))
router.delete("/weight-unit/:id", (req, res) => deleteItem(req, res, weightunit))

router.post("/length-unit", (req, res) => createItem(req, res, lengthUnit))
router.get("/length-unit", (req, res) => getAllItems(req, res, lengthUnit))
router.get("/length-unit/:id", (req, res) => getItemById(req, res, lengthUnit))
router.put("/length-unit/:id", (req, res) => updateItem(req, res, lengthUnit))
router.delete("/length-unit/:id", (req, res) => deleteItem(req, res, lengthUnit))


router.post("/energy-unit", (req, res) => createItem(req, res, energyUnit))
router.get("/energy-unit", (req, res) => getAllItems(req, res, energyUnit))
router.get("/energy-unit/:id", (req, res) => getItemById(req, res, energyUnit))
router.put("/energy-unit/:id", (req, res) => updateItem(req, res, energyUnit))
router.delete("/energy-unit/:id", (req, res) => deleteItem(req, res, energyUnit))

router.post("/volume-unit", (req, res) => createItem(req, res, volumeunit))
router.get("/volume-unit", (req, res) => getAllItems(req, res, volumeunit))
router.get("/volume-unit/:id", (req, res) => getItemById(req, res, volumeunit))
router.put("/volume-unit/:id", (req, res) => updateItem(req, res, volumeunit))
router.delete("/volume-unit/:id", (req, res) => deleteItem(req, res, volumeunit))


router.post("/distance-unit", (req, res) => createItem(req, res, distanceUnit))
router.get("/distance-unit", (req, res) => getAllItems(req, res, distanceUnit))
router.get("/distance-unit/:id", (req, res) => getItemById(req, res, distanceUnit))
router.put("/distance-unit/:id", (req, res) => updateItem(req, res, distanceUnit))
router.delete("/distance-unit/:id", (req, res) => deleteItem(req, res, distanceUnit))

module.exports = router;