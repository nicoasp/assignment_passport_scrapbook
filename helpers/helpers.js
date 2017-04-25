function connectModule(user, accessToken, moduleName) {
	let index = user.passportModules.findIndex((module) => {
		return module.name === moduleName;
	})
	user.passportModules[index].connected = true;
	user.passportModules[index].token = accessToken;
}


module.exports = {connectModule};