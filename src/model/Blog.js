const mongoose = require('mongoose');

const blogSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    blogTitle: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    blogContent: {
      type: String,
    },
    isActive: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
