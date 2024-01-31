// const JwtStrategy = require('passport-jwt').Strategy;

// const User = require('../models/user');

// const cookieExtractor = (req) => {
//   // console.log(req.isAuthenticated(), 'jwt calledddddddddddddddddddd');
//   let jwt = null;
//   if (req && req.cookies) {
//     jwt = req.cookies['jwt'];
//   }
//   return jwt;
// };

// var opts = {
//   jwtFromRequest: cookieExtractor,
//   secretOrKey: 'codeeditor',
// };

// module.exports = (passport) => {
//   passport.use(
//     new JwtStrategy(opts, (jwtPayload, callback) => {
//       User.findById(jwtPayload.id, (err, user) => {
//         if (err) return callback(null, user);
//         if (user) return callback(null, user);
//         return callback(null, false);
//       });
//     })
//   );
// };
