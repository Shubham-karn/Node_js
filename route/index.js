const express = require('express');
const passport = require('passport');

const user = require('./user/index');
const project = require('./project/index');
const auth = require('./auth/index');
require('../middleware/jwt')(passport);

const router = express.Router();

router.use('/user', user);
router.use('/project', project);
// router.use('/auth', auth);
router.post('/auth/google', (req, res) => {
  res.send('hello');
});
module.exports = router;
