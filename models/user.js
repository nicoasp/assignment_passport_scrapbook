const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema({
  facebookId: { type: String, unique: true },
  githubId: { type: String, unique: true },
  passportModules: { 
  	type: [{ name: String, connected: Boolean, token: String, username: String}],
  	default: [{name: "Facebook", connected: false }, {name: "Github", connected: false}] 
  },
  username: { type: String, unique: true },
  passwordHash: { type: String }
});

UserSchema.plugin(uniqueValidator);

UserSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 8);
});

UserSchema.methods.validatePassword = function(value) {
  return bcrypt.compareSync(value, this.passwordHash);
}

UserSchema.methods.getModuleInfo = function(moduleName) {
    return this.passportModules.find((module) => {
			return module.name === moduleName;
		});
};



const User = mongoose.model("User", UserSchema);

module.exports = User;