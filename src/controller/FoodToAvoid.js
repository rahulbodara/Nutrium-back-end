const FoodAvoidTemplate = require("../model/FoodAvoidTemplate")

const addFoodAvoidTemplate = async (req, res) => {
    try {
        const userId = req.userId
        const { tamplateName, foodsToAvoid } = req.body
        const tamplate = new FoodAvoidTemplate({ userId, tamplateName, foodsToAvoid })
        const savedTemplate = await tamplate.save()
        return res.status(201).json({
            success: true,
            message: "Food avoid template created successfully",
            data: savedTemplate
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

const fetchFoodAvoidTemplates = async (req, res) => {
    try {
        const userId = req.userId
        const templates = await FoodAvoidTemplate.find({ userId })
        if (!templates.length) {
            return res.status(404).json({
                success: false,
                message: "No food avoid templates found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Food avoid templates fetched successfully",
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

const GetAllFoodAvoidTamplate = async (req, res) => {
    try {
        const userId = req.userId;

        const allTemplates = await FoodAvoidTemplate.find();

        const myTemplates = allTemplates.filter(template => template.userId.toString() === userId);
        const systemTemplates = allTemplates.filter(template => template.userId.toString() !== userId);

        return res.status(200).json({
            success: true,
            message: "Food avoid templates fetched successfully",
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
};

const EditFoodAvoid = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.userId
        const { tamplateName, foodsToAvoid } = req.body
        const template = await FoodAvoidTemplate.findByIdAndUpdate(id, { userId, tamplateName, foodsToAvoid }, { new: true })
        if (!template) {
            return res.status(404).json({
                success: false,
                message: "Food avoid template not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Food avoid template updated successfully",
            data: template
        })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })

    }

}

const DeleteFoodAvoidTamplate = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.userId
        const template = await FoodAvoidTemplate.findByIdAndDelete(id)
        if (!template) {
            return res.status(404).json({
                success: false,
                message: "Food avoid template not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Food avoid template deleted successfully"
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


module.exports = { addFoodAvoidTemplate, fetchFoodAvoidTemplates, GetAllFoodAvoidTamplate, EditFoodAvoid, DeleteFoodAvoidTamplate }