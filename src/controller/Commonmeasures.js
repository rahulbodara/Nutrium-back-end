const Commonmeasures = require('../model/CommonMeasures');

const getCommonmeasures = async (req, res, next) => {
    try {
        const userId = req.userId; 
        const commonMeasures = await Commonmeasures.find({ userId });

        return res.status(200).json({
            success: true,
            data: commonMeasures,
        });
    } catch (error) {
        console.error("Error fetching common measures:", error);
        next(error);
    }
};

const addOrUpdateCommonMeasures = async (req, res, next) => {
    const { _id, singularName, pluralName, quantity, totalGrams, ediblePortion } = req.body;

    try {
        if (_id) {
            const updatedCommon = await Commonmeasures.findByIdAndUpdate(
                _id,
                { singularName, pluralName, quantity, totalGrams, ediblePortion },
                { new: true, runValidators: true }
            );
            if (!updatedCommon) {
                return res.status(404).json({ error: 'Common measure not found' });
            }
            return res.status(200).json(updatedCommon);
        }

        const newCommon = new Commonmeasures({
            userId: req.userId,
            measures: [
                { singularName, pluralName, quantity, totalGrams, ediblePortion }
            ]
        });

        await newCommon.save();
        res.status(201).json(newCommon);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};




const deleteMeasures = async (req, res, next) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const deletedMeasure = await Commonmeasures.findOneAndDelete({ _id: id, userId });

        if (!deletedMeasure) {
            return res.status(404).json({
                success: false,
                message: "Common measure not found or you're not authorized to delete it.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Common measure deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting common measure:", error);
        next(error);
    }
};

module.exports = {
    addOrUpdateCommonMeasures,
    getCommonmeasures,
    deleteMeasures,
};
