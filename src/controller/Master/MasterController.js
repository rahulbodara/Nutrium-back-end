const mongoose = require('mongoose');


const createItem = async (req, res, Model) => {
    try {
        const { name, value } = req.body;
        const existingItem = await Model.findOne({
            $or: [
                { name: { $regex: `^${name}$`, $options: 'i' } },
                { value: { $regex: `^${value}$`, $options: 'i' } }
            ]
        });

        if (existingItem) {
            return res.status(400).json({
                message: 'Item with the same name or value already exists.'
            });
        }
        const newItem = await Model.create({ name, value });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllItems = async (req, res, Model) => {
    try {
        const items = await Model.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getItemById = async (req, res, Model) => {
    try {
        const item = await Model.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateItem = async (req, res, Model) => {
    try {
        const { name, value } = req.body;
        const updatedItem = await Model.findByIdAndUpdate(req.params.id, { name, value }, { new: true });
        if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteItem = async (req, res, Model) => {
    try {
        const deletedItem = await Model.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createItem, getAllItems, getItemById, updateItem, deleteItem };
