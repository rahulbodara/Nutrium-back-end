const Role = require("../../model/Roles-Permission/Role");

const createRole = async (req, res) => {
    try {
        const { name } = req.body;
        const role = new Role({ name });
        await role.save();
        res.status(201).json({ message: 'Role created', role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updatedRole = await Role.findByIdAndUpdate(id, { name }, { new: true });
        res.json({ message: 'Role updated', updatedRole });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRole = await Role.findByIdAndDelete(id);
        res.json({ message: 'Role deleted', deletedRole });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getRoles, createRole, updateRole, deleteRole }