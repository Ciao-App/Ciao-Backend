const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
// const authorize = require('../middleware/authorize');
const Post = require('../models/Post');

module.exports = Router().post('/', authenticate, async (req, resp, next) => {
  try {
    const post = await Post.insert({ user_id: req.user.id, ...req.body });
    resp.json(post);
  } catch (e) {
    next(e);
  }
});
