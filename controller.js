const mod = {

	OLSKControllerRoutes  () {
		return [{
			OLSKRoutePath: '/stub/OLSKRemoteStorage',
			OLSKRouteMethod: 'get',
			OLSKRouteSignature: 'OLSKRemoteStorageStubRoute',
			OLSKRouteFunction(req, res, next) {
				return res.render(require('path').join(__dirname, 'stub-view'));
			},
			OLSKRouteLanguageCodes: ['en', 'fr', 'es'],
		}];
	},

	OLSKControllerStaticAssetFiles () {
		return [
			'main.js',
		];
	},

	OLSKControllerSharedStaticAssetFolders () {
		return [
			'_shared/__external',
		];
	},

};

Object.assign(exports, mod);
