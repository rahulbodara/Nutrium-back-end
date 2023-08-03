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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
