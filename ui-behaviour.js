window.OLSKRemoteStorageBehaviour = {

	// DATA

	DataFakeStorageClient (inputData = {}) {
		return Object.assign({
			access: {
				claim () {},
			},
			stopSync () {},
			on () {},
			connect () {},
			disconnect () {},
			remote: {},
		}, inputData);
	},

	// INTERFACE

	InterfaceLauncherButtonDidClick () {
		window.Launchlet.LCHSingletonCreate({
			LCHOptionRecipes: exports.OLSKRemoteStorageRecipes(window, this.DataFakeStorageClient(), window.OLSKLocalized),
		});
	},

};
