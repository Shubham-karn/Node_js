const express = require('express');
const passport = require('passport');
const Message = require('../../config/message');

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect(process.env.FRONTEND_URL);
});

module.exports = router;
