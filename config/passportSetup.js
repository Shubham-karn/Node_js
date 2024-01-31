const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.js');
const { v4: uuidv4 } = require('uuid');
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.BACKEND_URL + '/auth/google/redirect',
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile.emails[0].value, profile._json.picture, 'access');
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          console.log('user is', currentUser);
          done(null, currentUser);
        } else {
          new User({
            id: uuidv4(),
            name: profile.displayName,
            googleId: profile.id,
            thumbnail: profile._json.picture,
            email: profile.emails[0].value,
          })
            .save()
            .then((newUser) => {
              console.log('new user created' + newUser);

              done(null, newUser);
            });
        }
      });
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findOne({ id: id }).then((user) => {
    done(null, user);
  });
});
