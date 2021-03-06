const RemoteStorage = require('remotestoragejs');

const mod = require('./main.js');

(function OLSKMochaStorage() {
	const storageModule = mod.OLSKRemoteStorageDataModuleGenerator('test_rs_module')([function (privateClient, publicClient, changeDelegate) {
		const uFlatten = function (inputData) {
			return [].concat.apply([], inputData);
		};

		const mod = {
			async XYZListing (inputData) {
				return uFlatten(await Promise.all(uFlatten([inputData]).map(async function (path) {
					if (typeof path !== 'string') {
						return Promise.reject(new Error('OLSKErrorInputNotValid'));
					}

					try {
						return await Object.keys(await privateClient.getListing(path, false)).map(function (e) {
							return path + e;
						});
					} catch {}

					return [];
				})));
			},
			async XYZRecursive (inputData) {
				return uFlatten(await Promise.all((await mod.XYZListing(inputData)).map(async function (e) {
					return e.slice(-1) == '/' ? await mod.XYZRecursive(e) : e;
				})));
			},
			XYZPrivateClient () {
				return privateClient;
			},
			async XYZReset () {
				return await Promise.all((await mod.XYZRecursive('')).map(async function (path) {
					return await privateClient.remove(path);
				}));
			},
		};
		return {
			OLSKRemoteStorageCollectionName: 'xyz_documents',
			OLSKRemoteStorageCollectionExports: mod,
		};
	}]);

	before(function() {
		global.OLSKTestingStorageClient = new RemoteStorage({ modules: [ storageModule ] });

		global.OLSKTestingStorageClient.access.claim(storageModule.name, 'rw');
		global.OLSKTestingStorageModule = OLSKTestingStorageClient.test_rs_module;

		global.OLSKTestingStorageModuleFresh = function () {
			const client = new RemoteStorage({ modules: [ storageModule ] });
			client.access.claim(storageModule.name, 'rw');
			return client.test_rs_module;
		};
		
	});

	beforeEach(function() {
		return global.OLSKTestingStorageModule.xyz_documents.XYZReset();
	});
})();

(function OLSKMochaStubs() {
	Object.entries({
		
		StubChangeObjectWindow () {
			return {
		   path: '/public/design/color.txt',
		   relativePath: 'color.txt',
		   origin: 'window',
		   oldValue: 'white',
		   newValue: 'blue',
		   oldContentType: 'text/plain',
		   newContentType: 'text/plain'
		 };
		},
		StubChangeObjectConflict () {
			return {
		   path: '/public/design/color.txt',
		   relativePath: 'color.txt',
		   origin: 'conflict',
		   oldValue: 'blue',
		   newValue: 'red',
		   oldContentType: 'text/plain',
		   newContentType: 'text/plain',
		   // Most recent known common ancestor body of local and remote
		   lastCommonValue: 'white',
		   // Most recent known common ancestor contentType of local and remote
		   lastCommonContentType: 'text/plain'
		 };
		},
		StubChangeObjectLocalInit () {
			return {
				origin: 'local',
				path: '/remotestorage_quantity_test/xyz_documents/01DKQBS2PY79VJRZ80T54EA3YV',
				relativePath: 'xyz_documents/01DKQBS2PY79VJRZ80T54EA3YV',
				oldValue: undefined,
				oldContentType: undefined,
				newValue: {XYZDocumentName: '', XYZDocumentModificationDate: '2019-09-01T21:30:29.470Z', XYZDocumentID: '01DKQBS2PY79VJRZ80T54EA3YV', XYZDocumentCreationDate: '2019-09-01T21:30:29.470Z', '@context': 'http://remotestorage.io/spec/modules/remotestorage_quantity_test/xyz_document'},
				newContentType: 'application/json; charset=UTF-8',
		 };
		},
		StubChangeObjectRemoteCreate () {
			return {
				origin: 'remote',
				path: '/remotestorage_quantity_test/xyz_documents/01DKQBS2PY79VJRZ80T54EA3YV',
				relativePath: 'xyz_documents/01DKQBS2PY79VJRZ80T54EA3YV',
				oldValue: undefined,
				oldContentType: undefined,
				newValue: {XYZDocumentName: '', XYZDocumentModificationDate: '2019-09-01T21:30:29.470Z', XYZDocumentID: '01DKQBS2PY79VJRZ80T54EA3YV', XYZDocumentCreationDate: '2019-09-01T21:30:29.470Z', '@context': 'http://remotestorage.io/spec/modules/remotestorage_quantity_test/xyz_document'},
				newContentType: 'application/json; charset=UTF-8',
		 };
		},
		StubChangeObjectRemoteUpdate () {
			return {
				origin: 'remote',
				path: '/remotestorage_quantity_test/xyz_documents/01DKQBS2PY79VJRZ80T54EA3YV',
				relativePath: 'xyz_documents/01DKQBS2PY79VJRZ80T54EA3YV',
				oldValue: {XYZDocumentName: '', XYZDocumentModificationDate: '2019-09-01T21:30:29.470Z', XYZDocumentID: '01DKQBS2PY79VJRZ80T54EA3YV', XYZDocumentCreationDate: '2019-09-01T21:30:29.470Z', '@context': 'http://remotestorage.io/spec/modules/remotestorage_quantity_test/xyz_document'},
				oldContentType: 'application/json; charset=UTF-8',
				newValue: {XYZDocumentName: 'test', XYZDocumentModificationDate: '2019-09-01T21:32:29.470Z', XYZDocumentID: '01DKQBS2PY79VJRZ80T54EA3YV', XYZDocumentCreationDate: '2019-09-01T21:30:29.470Z', '@context': 'http://remotestorage.io/spec/modules/remotestorage_quantity_test/xyz_document'},
				newContentType: 'application/json; charset=UTF-8',
		 };
		},
		StubChangeObjectRemoteDelete () {
			return {
				origin: 'remote',
				path: '/remotestorage_quantity_test/xyz_documents/01DKQBS2PY79VJRZ80T54EA3YV',
				relativePath: 'xyz_documents/01DKQBS2PY79VJRZ80T54EA3YV',
				oldValue: {XYZDocumentName: 'test', XYZDocumentModificationDate: '2019-09-01T21:32:59.908Z', XYZDocumentID: '01DKQBS2PY79VJRZ80T54EA3YV', XYZDocumentCreationDate: '2019-09-01T21:30:29.470Z', '@context': 'http://remotestorage.io/spec/modules/remotestorage_quantity_test/xyz_document'},
				oldContentType: 'application/json; charset=UTF-8',
				newValue: undefined,
				newContentType: undefined,
		 };
		},
		StubChangeObjectConflict () {
			return {
				origin: 'conflict',
				path: '/wikiavec/kvc_notes/2020-06-30/01EC2QANYW93VS50P3JCCHH5EW/main',
				relativePath: 'kvc_notes/2020-06-30/01EC2QANYW93VS50P3JCCHH5EW/main',
				oldValue: {KVCNoteBody: 'echo-3', KVCNoteID: '01EC2QANYW93VS50P3JCCHH5EW', KVCNoteCreationDate: '2020-06-30T13:40:43.100Z', KVCNoteModificationDate: '2020-06-30T13:42:08.514Z', '@context': 'http://remotestorage.io/spec/modules/wikiavec/kvc_note'},
				oldContentType: 'application/json; charset=UTF-8',
				newValue: {KVCNoteBody: 'echo-2', KVCNoteID: '01EC2QANYW93VS50P3JCCHH5EW', KVCNoteCreationDate: '2020-06-30T13:40:43.100Z', KVCNoteModificationDate: '2020-06-30T13:42:06.557Z', '@context': 'http://remotestorage.io/spec/modules/wikiavec/kvc_note'},
				newContentType: 'application/json; charset=UTF-8',
				lastCommonValue: {KVCNoteBody: 'echo-1', KVCNoteID: '01EC2QANYW93VS50P3JCCHH5EW', KVCNoteCreationDate: '2020-06-30T13:40:43.100Z', KVCNoteModificationDate: '2020-06-30T13:41:36.608Z', '@context': 'http://remotestorage.io/spec/modules/wikiavec/kvc_note'},
				lastCommonContentType: 'application/json; charset=UTF-8',
			};
		},

		StubEventListener: function(inputData) {
			return {
				on (param1, param2) {
					if (param1 === inputData) {
						param2();
					}
				},
			};
		},

		StubCollectionObjectValid () {
			return {
				OLSKRemoteStorageCollectionName: 'alfa',
				OLSKRemoteStorageCollectionExports: [],
			};
		},
		
	}).map(function (e) {
		return global[e.shift()]  = e.pop();
	});
})();
