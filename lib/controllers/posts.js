const { Router } = require('express');
// const authenticate = require('../middleware/authenticate');
// const authorize = require('../middleware/authorize');
const Post = require('../models/Post');

module.exports = Router().post('/', async (req, resp, next) => {
  try {
    const post = await Post.insert(req.body);
    resp.json(post);
  } catch (e) {
    next(e);
  }
});
