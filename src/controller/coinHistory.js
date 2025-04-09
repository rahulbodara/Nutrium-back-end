const express = require('express');
const CoinTransaction = require('../model/CoinTransaction');
const router = express.Router()

router.get('/history/:userId', async (req, res) => {
    const userId = req.params.userId
    try {
        const history = await CoinTransaction.find({ clientId: userId }).sort({ createdAt: -1 });
        res.json({ success: true, data: history });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


module.exports = router