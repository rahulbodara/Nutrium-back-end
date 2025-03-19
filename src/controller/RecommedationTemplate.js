const RecommendationTemplate = require("../model/RecommendationTemplate");

const addRecommendationTemplate = async (req, res) => {
    try {
        const userId = req.userId;
        const { templateName, recommendation } = req.body;

        const newRecommendationTemplate = new RecommendationTemplate({
            userId: userId,
            templateName: templateName,
            recommendation: recommendation,
        });

        await newRecommendationTemplate.save();

        return res.status(201).json({
            success: true,
            message: "Recommendation template added successfully",
            recommendationTemplate: newRecommendationTemplate,
        });
    } catch (error) {
        console.error("Error in addRecommendationTemplate:", error);
        next(error);
    }
}

const fetchRecommendationTemplate = async (req, res) => {
    try {
        const userId = req.userId
        const templates = await RecommendationTemplate.find({ userId })
        if (!templates.length) {
            return res.status(404).json({
                success: false,
                message: "No recommendation template found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Recommendation templates fetched successfully",
            data: templates
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

const getAllRecommendationTemplate = async (req, res) => {
    try {
        const userId = req.userId;

        const allTemplates = await RecommendationTemplate.find();

        const myTemplates = allTemplates.filter(template => template.userId.toString() === userId);
        const systemTemplates = allTemplates.filter(template => template.userId.toString() !== userId);

        return res.status(200).json({
            success: true,
            message: "Recommendations templates fetched successfully",
            myTemplates,
            systemTemplates,
            all: allTemplates
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}


module.exports = { addRecommendationTemplate, fetchRecommendationTemplate, getAllRecommendationTemplate }
