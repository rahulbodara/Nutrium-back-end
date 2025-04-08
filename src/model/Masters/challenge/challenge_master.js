const mongoose = require('mongoose');

const rewardRangeSchema = new mongoose.Schema({
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  coins: { type: Number, required: true },
}, { _id: false });

const challengeMasterSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['steps', 'calories', 'loss_weight', 'gain_weight'],
      required: true,
      unique: true,
    },
    unitLabel: {
      type: String,
      required: true,
    },
    rewardRanges: {
      type: [rewardRangeSchema],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('challenge_master', challengeMasterSchema);
