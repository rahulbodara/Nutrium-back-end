const professionalPreference = require('../model/professionalPreference');
const User = require('../model/User');

const createProfessionalPreference = async (userId) => {
    try {

        const user = await User.findOne({_id: userId});
        const defaultData = {
            "systempreference": {
                "timezone": "",
                "language": "English",
                "weightunit": "Kilogram",
                "lengthunit": "Centimeters",
                "energyunit": "Kilocalorie",
                "volumeunit": "Liter",
                "distanceunit": "Kilometer",
                "statisticmeasure": "Percentile"
            },
            "calendarsettings":{
                "birtdaysystem": "Show on calendar",
                "appointmentrequestsystem" : "Enabled"
            },
            "presets":{
                "accesstomobileapp": "Enabled",
                "clientmessages":"Enabled",
                "clientweightregistration":"Enabled",
                "appointementconfirmation":"Enabled",
                "fooddiary":"Enabled",
                "nutritionalinformation":"Enabled",
                "clientreviews": "Enabled"
            },
            "appointementreference":{
                "status":"Not confirmed",
                "appointementnotification":["Notify 1 hour before the appointment","Notify 1 day before the appointment","Notify 3 days before the appointment"]
            },
            "nutritionassessmentformconfiguration":{
                "appointementinformation":["Reason for appointment","Expectations","Clinical goals","Other information"],
                "personalandsocialhistory":["Maternal weight gain","Maternal behaviors at pregnancy","Gestational age at birth","Bowel movements","Sleep quality",
                "Smoker","Alcohol consumption","Marital status","Physical activity","Race","Other information"],
                "dietaryhistory":["Breastfeeding","Food diversification","Milk and infant formulas","Usual wake up time","Usual bedtime","Usual bedtime","Types of diet",
                "Favorite food","Disliked food","Allergies","Food intolerances","Nutritional deficiencies","Water intake","Other information"],
                "medicalhistory":["Diseases","Medication","Personal history","Family history","Other information"],
                "gestationalinformation":["Pregnant","Gestation type","Last menstrual period","Lactating","Beginning of lactation","Observations"],
                "finalconsideration":["Weight","Height","Observations"]
            },
            "emailandprintingpreference":{
                "mealplanemailsubject":"Meal plan",
                "mealplanemailbody":`Hello [patient_first_name]. The meal plan created on [meal_plan_last_update_date] is sent in attachment. \
                Remember that you can check the meal plan in the mobile app, available for Android and iOS. \
                \
                I'm available to help you with any question you have. \
                \
                Best regards,${user.fullName} `,
                "mealplansections":["Client information","Meal plan","Recommendations","Other information","Recipes","Signature"],
                "printingdesign":"Simple design (2018)",
                "multipledaysprintinglayout":"Layout with columns",
                "fontsizeoftheprints":"Normal"
            },
            "mealplansettings":{
                "lunchanddinnersection":["Appetizer","Dish","Dessert","Beverage"],
                "fooddatabases":["USDA, 2018","CNF, GC","McCance and Widdowson's"]
            },
            "measurementspreferences":{
                "deducemeasurements":"Deduce fat mass, lean body mass and percentages",
                "anthropometricmeasurements":["Weight","Height","Hip circumference","Waist circumference"],
                "analyticaldata":["Diastolic blood pressure","HDL Cholesterol","LDL Cholesterol","Systolic blood pressure","Total cholesterol","Triglycerides"],
                "bodycompotion":["Body fat percentage","Fat mass","Muscle mass","Muscle mass percentage"]
            }
        }

            const preference = new professionalPreference({
                userId: userId,
                ...defaultData
            });

            const result = await preference.save();

    } catch (error) {
        console.log(error);
    }
};

const getprofessionPreference = async (req, res, next) => {
    try {
        const userId = req.userId;
        const existingPreference = await professionalPreference.findOne({ userId: userId });

        if (existingPreference) {
            return res.status(200).json({ success: true, message: "professionPreference found successfully", data: existingPreference });
        }
        else {
            return res.status(404).json({ success: false, message: "No professionPreference found" });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const updateprofessionPreference = async(req,res,next) => {
    try {
        const userId = req.userId;
        const
            {
                systempreference,
                calendarsettings,
                presets,
                appointementreference,
                nutritionassessmentformconfiguration,
                emailandprintingpreference,
                mealplansettings,
                measurementspreferences
            } = req.body;

        const existingPreference = await professionalPreference.findOne({ userId: userId });

        if (existingPreference) {
            existingPreference.systempreference = systempreference;
            existingPreference.calendarsettings = calendarsettings;
            existingPreference.presets = presets;
            existingPreference.appointementreference = appointementreference;
            existingPreference.nutritionassessmentformconfiguration = nutritionassessmentformconfiguration;
            existingPreference.emailandprintingpreference = emailandprintingpreference;
            existingPreference.mealplansettings = mealplansettings;
            existingPreference.measurementspreferences = measurementspreferences;

            const result = await existingPreference.save();
            return res.status(201).json({ success: true, message: "professionPreference updated successfully", data: result });
        }
        else {
            res.status(404).json({message: "professionPreference not found"})
        }

    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    createProfessionalPreference,
    getprofessionPreference,
    updateprofessionPreference
}