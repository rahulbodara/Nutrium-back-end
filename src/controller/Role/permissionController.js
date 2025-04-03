const Permission = require("../../model/Roles-Permission/Permission");

exports.createPermission = async (req, res) => {
    try {
        const { name, action, subject } = req.body;
        const permission = new Permission({ name, action, subject });
        await permission.save();
        res.status(201).json({ message: 'Permission created', permission });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.json(permissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
