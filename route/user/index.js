const express = require('express');

const authenticate = require('../../middleware/authenticate');

const { createUser, loginUser, logoutUser } = require('../../controllers/user');

const {
  validateUserSignUp,
  validateUserSignIn,
} = require('../../middleware/validators/user');

const {
  getUserProfile,
  addField,
  getUserStatus,
} = require('../../controllers/profile');

const router = express.Router();

router.post('/create', validateUserSignUp, createUser);
router.post('/login', validateUserSignIn, loginUser);
router.post('/logout', logoutUser);
router.get('/status', authenticate, getUserStatus);
router.get('/profile', authenticate, getUserProfile);

//field is the problem of the user
router.post('/add-field', authenticate, addField);

module.exports = router;
