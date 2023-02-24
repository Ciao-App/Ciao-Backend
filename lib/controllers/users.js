const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const Friend = require('../models/Friend');
const User = require('../models/User');
const UserService = require('../services/UserService');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body); // calling UserService instead of model
      res.json(user);
    } catch (e) {
      next(e);
    }
  })

  .post('/sessions', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const token = await UserService.signIn({ email, password });
      // const token = await UserService.signIn(req.body); // go check if they can have a wristband
      res
        .cookie(process.env.COOKIE_NAME, token, {
          httpOnly: true,
          secure: process.env.SECURE_COOKIES === 'true',
          sameSite: process.env.SECURE_COOKIES === 'true' ? 'none' : 'strict',
          maxAge: ONE_DAY_IN_MS,
        })
        .json({ message: 'Signed in successfully!', accessToken: token }); // attach wristband to wrist
    } catch (e) {
      next(e);
    }
  })

  //* get friends list route
  .get('/friends-list', async (req, res, next) => {
    try {
      const friends = await Friend.getAllFriends(req.user.id);
      res.json(friends);
    } catch (e) {
      next(e);
    }
  })

  .get('/me', authenticate, async (req, res) => {
    res.json(req.user);
  })

  .get('/protected', authenticate, async (req, res) => {
    res.json({ message: 'hello world' });
  })

  .get('/', [authenticate, authorize], async (req, res, next) => {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (e) {
      next(e);
    }
  })

  .get('/:id', async (req, res, next) => {
    try {
      const users = await User.getById(req.params.id);
      res.json(users);
    } catch (e) {
      next(e);
    }
  })

  //* add friend route
  .post('/add-friend/:id', authenticate, async (req, res, next) => {
    try {
      const friend = await Friend.addFriend(req.user.id, req.params.id);
      res.json(friend);
    } catch (e) {
      next(e);
    }
  })

  //* accept friend request route
  .put('/friend-request/:id', authenticate, async (req, res, next) => {
    try {
      const obj = {
        receiver_id: req.user.id,
        sender_id: req.params.id,
        added: false,
      };
      const friend = await Friend.acceptFriendRequest(obj);
      res.json(friend);
    } catch (e) {
      next(e);
    }
  })

  //* delete friend route
  .delete('/remove-friend/:id', authenticate, async (req, res, next) => {
    try {
      const friend = await Friend.deleteFriend(req.user.id, req.params.id);
      if (!friend) next();
      res.status(200);
      res.send();
    } catch (e) {
      next(e);
    }
  })

  //* delete friend route
  .delete('/sessions', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME, {
        httpOnly: true,
        secure: process.env.SECURE_COOKIES === 'true',
        sameSite: process.env.SECURE_COOKIES === 'true' ? 'none' : 'strict',
        maxAge: ONE_DAY_IN_MS,
      })
      .status(204)
      .send();
  });

// .get('/friend-request/:id', authenticate, async (req, res, next) => {
//   try {
//     const friend = await Friend.getFriendRequest(req.user.id, req.params.id);
//     res.json(friend);
//   } catch (e) {
//     next(e);
//   }
// })
