const { check, validationResult } = require('express-validator');

exports.validateUserSignUp = [
  check('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('name is empty')
    .isString()
    .withMessage('Must be a string')
    .isLength({ min: 2, max: 20 })
    .withMessage('name must be 2 to 20 characters long!'),

  check('email').normalizeEmail().isEmail().withMessage('Enter a valid email'),

  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password is empty')
    .isLength({ min: 6, max: 15 })
    .withMessage('Password must be 6 to 15 characters long!'),
];

exports.userValidation = (req, res, next) => {
  const result = validationResult(req).array();

  if (!result.length) return next();

  const err = result[0].msg;

  res.json(Message(err.message));
};

exports.validateUserSignIn = [
  check('email').normalizeEmail().isEmail().withMessage('Enter valid email'),
  check('password').trim().not().isEmpty().withMessage('Password is required'),
];
