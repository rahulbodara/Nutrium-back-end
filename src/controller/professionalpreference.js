const professionalPreference = require('../model/professionalPreference');

const createProfessionalPreference = async (req, res, next) => {
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

            const preference = new professionalPreference({
                userId,
                systempreference,
                calendarsettings,
                presets,
                appointementreference,
                nutritionassessmentformconfiguration,
                emailandprintingpreference,
                mealplansettings,
                measurementspreferences
            });

            const result = await preference.save();

            return res.status(201).json({ success: true, message: "professionPreference created successfully", data: result });
        }

    } catch (error) {
        next(error);
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

module.exports = {
    createProfessionalPreference,
    getprofessionPreference
}