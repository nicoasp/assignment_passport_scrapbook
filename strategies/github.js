const GitHubStrategy = require("passport-github2").Strategy;


const User = require("../models/User");

module.exports = new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },

  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
  }
);
