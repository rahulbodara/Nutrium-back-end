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

exports.updatePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, action, subject } = req.body;

        const updated = await Permission.findByIdAndUpdate(
            id,
            { name, action, subject },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Permission not found' });
        }

        res.json({ message: 'Permission updated', permission: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Permission.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: 'Permission not found' });
        }

        res.json({ message: 'Permission deleted', permission: deleted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

