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
            data: newRecommendationTemplate,
        });
    } catch (error) {
        console.error("Error in addRecommendationTemplate:", error);
        next(error);
    }
}

const fetchRecommendationTemplate = async (req, res) => {
    try {
        const userId = req.userId
        const templates = await RecommendationTemplate.find()
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



const editRecommendationTemplate = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.userId
        const { templateName, recommendation } = req.body
        const template = await RecommendationTemplate.findByIdAndUpdate(id, { userId, templateName, recommendation }, { new: true })
        if (!template) {
            return res.status(404).json({
                success: false,
                message: "Recommendation template not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Recommendation template updated successfully",
            data: template
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

const deleteRecommendationTemplate = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.userId
        const template = await RecommendationTemplate.findByIdAndDelete(id)
        if (!template) {
            return res.status(404).json({
                success: false,
                message: "Recommendation template not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Recommendation template deleted successfully"
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

const getRecommendationtempletId = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.userId
        const template = await RecommendationTemplate.findById(id)
        if (!template) {
            return res.status(404).json({
                success: false,
                message: "Recommendation template not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Recommendation template fetched successfully",
            data: template
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


module.exports = { addRecommendationTemplate, fetchRecommendationTemplate, getAllRecommendationTemplate, editRecommendationTemplate, deleteRecommendationTemplate, getRecommendationtempletId }
