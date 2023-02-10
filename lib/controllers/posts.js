const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const authorizePost = require('../middleware/authorizePost');
const Post = require('../models/Post');
const Favorites = require('../models/Favorite');

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
  })
  .put('/:id', [authenticate, authorizePost], async (req, resp, next) => {
    try {
      const post = await Post.updatePost(req.params.id, req.body);
      resp.json(post);
    } catch (e) {
      next(e);
    }
  })
  .delete('/:id', [authenticate, authorizePost], async (req, resp, next) => {
    try {
      const post = await Post.delete(req.params.id);
      if (!post) next();
      resp.status(200);
      resp.send();
    } catch (e) {
      next(e);
    }
  })
  .post(
    '/:id/favorite',
    [authenticate, authorizePost],
    async (req, resp, next) => {
      try {
        const post = await Favorites.addFavorites(req.user.id, req.params.id);
        resp.json(post);
      } catch (e) {
        next(e);
      }
    }
  );
// user can add favorites to their list
//* next thing to implement is removal of post off favorites list
