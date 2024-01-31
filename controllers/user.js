const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Message = require('../config/message');

// checking if email is valid
const isEmailValid = (email) => {
  const emailRegex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  if (!email) return false;

  if (email.length > 254) return false;

  const valid = emailRegex.test(email);
  if (!valid) return false;

  // Further checking of some things regex can't handle
  const parts = email.split('@');
  if (parts[0].length > 64) return false;

  const domainParts = parts[1].split('.');
  if (
    domainParts.some(function (part) {
      return part.length > 63;
    })
  )
    return false;

  return true;
};

//creating new user for /create endpoint
exports.createUser = async (req, res) => {
  const body = req.body;

  let { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.send(Message('Required fields missing.'));

  name = name.trim();
  email = email.trim();
  if (!isEmailValid(email)) return res.send(Message('Invalid email.'));

  let id = `${name}${Math.floor(Math.random() * 10)}`
    .replace(/[^a-zA-Z0-9]/g, '-')
    .toLowerCase();

  while (true) {
    const duplicateUser = await User.findOne({ id: id });
    if (!duplicateUser) break;
    id = `${id}${Math.floor(Math.random() * 10)}`;
  }

  const userData = {
    id: id,
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password: password,
    type: 'user',
  };

  try {
    const emailExists = await User.findOne({ email: userData.email });
    if (emailExists) {
      return res.send(Message('Email already exists.'));
    }
  } catch (err) {
    return res.status(400).send(Message('Unknown error occurred.'));
  }

  const user = new User(userData);

  try {
    await user.save();
    return res.send(Message('User Created Successfully.', true));
  } catch (err) {
    return res.send(Message(err.message));
  }
};

//controlling login of existing user for /login endpoint
exports.loginUser = async (req, res) => {
  const data = req.body;
  console.log(data);
  console.log(data);
  try {
    if (!data.email || !data.password) {
      return res.send(Message('Email and password required'));
    }

    const emailRegex = new RegExp(
      ['^', data.email.toLowerCase(), '$'].join(''),
      'i'
    );
    const user = await User.findOne({ email: emailRegex }).exec();

    if (!user || !data.password)
      return res.send(Message('Invalid email or password.'));

    user.validatePassword(data.password, user.password, (err, matched) => {
      if (err) return res.send(Message('Error Encountered'));

      if (!matched) return res.send(Message('Invalid email or password.'));

      const currentUser = {
        email: user.email,
        id: user._id,
      };
      const token = jwt.sign(currentUser, process.env.JWT_SECRET, {
        expiresIn: '540h',
      });

      let cookie = {
        httpOnly: true,
        secure: false,
      };
      if (true) {
        cookie = {
          ...cookie,
          secure: true,
          domain: process.env.COOKIE_DOMAIN,
          sameSite: 'none',
          maxAge: 8640000000,
        };
      }
      res
        .cookie('jwt', token, cookie)
        .send(Message('Logged in successfully.', true));
    });
  } catch (err) {
    return res.send(Message('Unknonwn error occurred.'));
  }
};

exports.logoutUser = async (req, res) => {
  if (req.cookies['jwt']) {
    let cookie = {
      httpOnly: true,
      secure: false,
    };
    if (process.env.PRODUCTION_MODE === 'true') {
      cookie = {
        ...cookie,
        secure: true,
        domain: process.env.COOKIE_DOMAIN,
        sameSite: 'none',
      };
    }
    res
      .clearCookie('jwt', cookie)
      .json(Message('Logged out successfully.', true));
  } else if (req.isauthenticated()) {
    req.logout();
    res.send(Message('Logged out successfully.', true));
  } else {
    res.send(Message('Invalid jwt.'));
  }
};
