const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogsByUser,
  updateBlogs,
  getUserBlogPageDetail,
} = require('../controller/blog');

router.post('/blogs', isAuthenticated, createBlog);
router.delete('/blogs/:blogId', isAuthenticated, deleteBlog);
router.get('/blogs', isAuthenticated, getAllBlogs);
router.get('/user-blogs', isAuthenticated, getBlogsByUser);
router.put('/blogs/:blogId', isAuthenticated, updateBlogs);

router.get('/blogs-page-detail', isAuthenticated, getUserBlogPageDetail);

module.exports = router;
