const FacebookStrategy = require("passport-facebook").Strategy;

const {connectModule} = require("../helpers/helpers");
const User = require("../models/User");

const facebookStrategy = () => {
	return new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      scope: "user_photos",
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {

      const facebookId = profile.id;
      const displayName = profile.displayName;
      
      if (req.user) {
        req.user.facebookId = facebookId;
        req.user.displayName = displayName;
        connectModule(user, accessToken, "Facebook");
        req.user.save((err, user) => {
          if (err) {
            done(err);
          } else {
            done(null, user);
          }
        });
      } else {
        User.findOne({ facebookId }, function(err, user) {
          if (err) return done(err);

          if (!user) {
            // Create a new account if one doesn't exist
            user = new User({ facebookId, displayName });
            connectModule(user, accessToken, "Facebook");
            user.save((err, user) => {
              if (err) return done(err);
              done(null, user);
            });
          } else {
            // Otherwise, return the extant user.
            done(null, user);
          }
        });
      }
    }
  )
}




module.exports = facebookStrategy;
