(function() {
	const mod = {

		// VALUE

		_ValueStorageClient: undefined,

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
				LCHOptionRecipes: exports.OLSKRemoteStorageRecipes(window, mod._ValueStorageClient, window.OLSKLocalized, true),
			});
		},

		// SETUP

		SetupEverything () {
			mod._ValueStorageClient = mod.DataFakeStorageClient();
		},

		// LIFECYCLE

		LifecycleModuleDidLoad() {
			mod.SetupEverything();
		},

	};

	mod.LifecycleModuleDidLoad();

	window.OLSKRemoteStorageBehaviour = mod;
})();