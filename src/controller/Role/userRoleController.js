const UserRole = require("../../model/Roles-Permission/UserRole");

exports.assignRoleToUser = async (req, res) => {
    try {
        const { userId, roleId } = req.body;
        const userRole = new UserRole({ userId, roleId });
        await userRole.save();
        res.status(201).json({ message: 'Role assigned to user', userRole });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserRoles = async (req, res) => {
    try {
        const userRoles = await UserRole.find().populate('userId roleId');
        res.json(userRoles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { roleId } = req.body;

        const updated = await UserRole.findByIdAndUpdate(id, { roleId }, { new: true });
        if (!updated) return res.status(404).json({ message: 'UserRole not found' });

        res.json({ message: 'User role updated', userRole: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUserRole = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await UserRole.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'UserRole not found' });

        res.json({ message: 'User role deleted', userRole: deleted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
