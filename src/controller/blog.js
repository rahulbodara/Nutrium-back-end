const { default: mongoose } = require('mongoose');
const Blog = require('../model/Blog');
const User = require('../model/User');

const createBlog = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { blogTitle, tags, blogContent } = req.body;
    const newBlog = await Blog.create({
      userId,
      blogTitle,
      tags,
      blogContent,
    });

    return res.status(200).json({
      success: true,
      message: 'Blog created successfully',
      newBlog,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const userId = req.userId;
    const blogId = req.params.blogId;

    const deletedBlog = await Blog.findOneAndDelete({
      _id: blogId,
      userId: userId,
    });

    if (!deletedBlog) {
      return res
        .status(404)
        .json({ success: false, message: 'Blog not found' });
    }

    return res
      .status(200)
      .json({ success: true, message: 'Blog Deleted successfully!!!' });
  } catch (error) {
    next(error);
  }
};

const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find();
    return res.status(200).json({ success: true, blogs });
  } catch (error) {
    next(error);
  }
};

const getBlogsByUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const blogs = await Blog.find({ userId });
    if (!blogs || blogs.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'No blogs found for this user' });
    }
    return res.status(200).json({ success: true, blogs });
  } catch (error) {
    next(error);
  }
};

const updateBlogs = async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const userId = req.userId;
    const { blogTitle, tags, blogContent } = req.body;

    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: blogId, userId: userId },
      {
        blogTitle,
        tags,
        blogContent,
      },
      { new: true }
    );

    if (!updatedBlog) {
      return res
        .status(404)
        .json({ success: false, message: 'Blog not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Blog Updated Successfully',
      blog: updatedBlog,
    });
  } catch (error) {
    next(error);
  }
};

const getUserBlogPageDetail = async (req, res, next) => {
  try {
    const userId = req.userId;

    const query = {
      _id: userId,
      isActive: 1,
    };
    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ message: 'User Not Found!' });
    }

    const aggregate = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
          isActive: 1,
        },
      },
    ];

    aggregate.push({
      $lookup: {
        from: 'blogs',
        localField: '_id',
        foreignField: 'userId',
        as: 'Blogs',
      },
    });
    aggregate.push({
      $lookup: {
        from: 'workplaces',
        localField: '_id',
        foreignField: 'userId',
        as: 'Workplaces',
      },
    });

    const results = await User.aggregate(aggregate);
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogsByUser,
  updateBlogs,
  getUserBlogPageDetail,
};
