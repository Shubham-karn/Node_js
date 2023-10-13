const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.BACKEND_URL + '/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, cb) {
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
      // });
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
