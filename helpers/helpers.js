function connectModule(user, moduleName) {
	let index = user.passportModules.findIndex((module) => {
		return module.name === moduleName;
	})
	user.passportModules[index].connected = true;
}


module.exports = {connectModule};