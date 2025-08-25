const Lookup = require("../model/lookupUser");

const getLookupByUser = async (req, res, next) => {
    try {
        const userId = req.userId;
        const lookupData = await Lookup.findOne({ userId: userId });
        return res.status(200).json({ data: lookupData });
    } catch (error) {
        next(error);
    }
}

module.exports = { getLookupByUser }