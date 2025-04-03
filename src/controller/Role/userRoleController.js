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
