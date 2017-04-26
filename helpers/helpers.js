function connectModule(user, accessToken, moduleName, username = "") {
	let index = user.passportModules.findIndex((module) => {
		return module.name === moduleName;
	})
	user.passportModules[index].connected = true;
	user.passportModules[index].token = accessToken;
	if (moduleName === "Github") {
		user.passportModules[index].username = username;
	}
}


module.exports = {connectModule};