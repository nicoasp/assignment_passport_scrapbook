const GitHubStrategy = require("passport-github2").Strategy;
const {connectModule} = require("../helpers/helpers");

const User = require("../models/User");

module.exports = new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback",
    passReqToCallback: true
  },

  function(req, accessToken, refreshToken, profile, done) {
      const githubId = profile.id;
      const displayName = profile.displayName;
      console.log(profile)
      if (req.user) {
        
        req.user.githubId = githubId;
        req.user.displayName = req.user.displayName || displayName;
        connectModule(req.user, accessToken, "Github");
        req.user.save((err, user) => {

          if (err) {
            done(err);
          } else {
            done(null, user);
          }
        });
      } else {
        User.findOne({ githubId }, function(err, user) {
          if (err) return done(err);

          if (!user) {
            // Create a new account if one doesn't exist
            user = new User({ githubId , displayName });
            connectModule(user, accessToken, "Github");
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
);
