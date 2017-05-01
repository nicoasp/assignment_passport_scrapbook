const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");


module.exports = new LocalStrategy(function(username, password, done) {
	User.findOne({ username }, (err, user) => {
		if (err) return done(err);
		if (!user) {
			let newUser = new User({ username, password });
			newUser.save((err, savedUser) => {
				if (err) return done(err);
				done(null, savedUser);
			})
		} else {
			if (!user.passwordHash) {
				user.password = password;
				user.save((err, updatedUser) => {
					if (err) return done(err);
					done(null, updatedUser);
				})
			} else {
				if (user.validatePassword(password)) {
					done(null, user);
				} else {
					done(null, false, { message: "Wrong password" });
				}				
			}			
		}
	})
})