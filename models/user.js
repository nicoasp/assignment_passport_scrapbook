const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = mongoose.Schema({
  displayName: { type: String, required: true },
  facebookId: { type: String, require: true, unique: true },
  passportModules: { 
  	type: [],
  	default: [{name: "Facebook", connected: false }] 
  }
});

UserSchema.plugin(uniqueValidator);

const User = mongoose.model("User", UserSchema);

module.exports = User;