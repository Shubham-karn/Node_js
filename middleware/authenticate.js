const passport = require('passport');

module.exports = (req, res, next) => {
  passport.authenticate('jwt', (err, user, info) => {
    if (err) return next(err);
    console.log(user, 'user');
    req.user = user;
    console.log(req.user, 'userrrr');
    next();
  })(req, res, next);
};
