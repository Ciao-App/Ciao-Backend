const Post = require('../models/Post');
module.exports = async (req, res, next) => {
  const post = await Post.getById(req.params.id);
  try {
    if (
      !(post && (req.user.id === post.user_id || req.user.email === 'admin'))
    ) {
      throw new Error('You do not have access to this post');
    }
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};
