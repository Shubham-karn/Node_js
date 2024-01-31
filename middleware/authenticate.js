// const passport = require('passport');
const Message = require('../config/message');
module.exports = (req, res, next) => {
  console.log('isAuthenticated()', req.isAuthenticated());

  if (req.isAuthenticated()) {
    const user = req.user;
    return next();
  }
  return res.status(401).send(Message('Not logged in.'));
  // passport.authenticate('jwt', (err, user, info) => {
  //   if (err) return next(err);
  //   req.user = user;
  //   console.log('user', user);
  //   next();
  // })(req, res, next);
};
