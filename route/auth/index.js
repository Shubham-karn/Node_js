const express = require('express');
require('../../middleware/googleAuth');
const passport = require('passport');

const router = express.Router();

router.post('/google', (req, res) => {
  // passport.authenticate('google', {scope: ['profile', 'email']})
  // });
  // router.use('/google/callback', (req, res) => {
  // passport.authenticate('google', {failureRedirect: '/login',
  // successRedirect: '/'}), (req, res) => {
  //   res.redirect('/');
  console.log(req);
  res.send('hello');
});
module.exports = router;
