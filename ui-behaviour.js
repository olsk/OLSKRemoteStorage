(function() {
	const mod = {

		// VALUE

		_ValueOLSKRemoteStorage: undefined,

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
				LCHOptionRecipes: exports.OLSKRemoteStorageRecipes({
					ParamStorage: mod._ValueOLSKRemoteStorage,
					OLSKLocalized: window.OLSKLocalized,
					ParamMod: mod,
					ParamSpecUI: true,
				}),
			});
		},

		// SETUP

		SetupEverything () {
			mod._ValueOLSKRemoteStorage = mod.DataFakeStorageClient();
		},

		// LIFECYCLE

		LifecycleModuleDidLoad() {
			mod.SetupEverything();
		},

	};

	mod.LifecycleModuleDidLoad();

	window.OLSKRemoteStorageBehaviour = mod;
})();
