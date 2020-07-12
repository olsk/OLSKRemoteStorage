const RemoteStorage = require('remotestoragejs');

const mainModule = require('./main.js');

(function OLSKMochaStorage() {
	const storageModule = mainModule.OLSKRemoteStorageDataModuleGenerator('test_module', {
		OLSKOptionIncludeDebug: true,
	})([]);

	before(function() {
		global.OLSKTestingStorageClient = new RemoteStorage({ modules: [ storageModule ] });

		global.OLSKTestingStorageClient.access.claim(storageModule.name, 'rw');
		global.OLSKTestingStorageModule = OLSKTestingStorageClient.test_module;
	});

	beforeEach(function() {
		return mainModule._OLSKRemoteStorageReset(global.OLSKTestingStorageModule);
	});
})();
