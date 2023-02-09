const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
// const authorize = require('../middleware/authorize');
const Post = require('../models/Post');

module.exports = Router()
  .post('/', authenticate, async (req, resp, next) => {
    try {
      const post = await Post.insert({ user_id: req.user.id, ...req.body });
      resp.json(post);
    } catch (e) {
      next(e);
    }
  })
  .get('/', authenticate, async (req, resp, next) => {
    try {
      const posts = await Post.getAll();
      resp.json(posts);
    } catch (e) {
      next(e);
    }
  })
  .get('/user/:id', authenticate, async (req, resp, next) => {
    try {
      const posts = await Post.getAllByUserId(req.params.id);
      resp.json(posts);
    } catch (e) {
      next(e);
    }
  })
  .get('/:id', authenticate, async (req, resp, next) => {
    try {
      const post = await Post.getById(req.params.id);
      resp.json(post);
    } catch (e) {
      next(e);
    }
  });
