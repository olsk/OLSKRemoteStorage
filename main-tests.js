const { throws, rejects, deepEqual } = require('assert');

const mainModule = require('./main.js');

const kTesting = {
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
			oldValue: undefined,
			oldContentType: undefined,
			newValue: {XYZDocumentName: '', XYZDocumentModificationDate: '2019-09-01T21:30:29.470Z', XYZDocumentID: '01DKQBS2PY79VJRZ80T54EA3YV', XYZDocumentCreationDate: '2019-09-01T21:30:29.470Z', '@context': 'http://remotestorage.io/spec/modules/remotestorage_quantity_test/xyz_document'},
			newContentType: 'application/json; charset=UTF-8',
			relativePath: 'xyz_documents/01DKQBS2PY79VJRZ80T54EA3YV',
	 };
	},
	StubChangeObjectRemoteCreate () {
		return {
			origin: 'remote',
			path: '/remotestorage_quantity_test/xyz_documents/01DKQBS2PY79VJRZ80T54EA3YV',
			oldValue: undefined,
			oldContentType: undefined,
			newValue: {XYZDocumentName: '', XYZDocumentModificationDate: '2019-09-01T21:30:29.470Z', XYZDocumentID: '01DKQBS2PY79VJRZ80T54EA3YV', XYZDocumentCreationDate: '2019-09-01T21:30:29.470Z', '@context': 'http://remotestorage.io/spec/modules/remotestorage_quantity_test/xyz_document'},
			newContentType: 'application/json; charset=UTF-8',
			relativePath: 'xyz_documents/01DKQBS2PY79VJRZ80T54EA3YV',
	 };
	},
	StubChangeObjectRemoteUpdate () {
		return {
			origin: 'remote',
			path: '/remotestorage_quantity_test/xyz_documents/01DKQBS2PY79VJRZ80T54EA3YV',
			oldValue: {XYZDocumentName: '', XYZDocumentModificationDate: '2019-09-01T21:30:29.470Z', XYZDocumentID: '01DKQBS2PY79VJRZ80T54EA3YV', XYZDocumentCreationDate: '2019-09-01T21:30:29.470Z', '@context': 'http://remotestorage.io/spec/modules/remotestorage_quantity_test/xyz_document'},
			oldContentType: 'application/json; charset=UTF-8',
			newValue: {XYZDocumentName: 'test', XYZDocumentModificationDate: '2019-09-01T21:32:29.470Z', XYZDocumentID: '01DKQBS2PY79VJRZ80T54EA3YV', XYZDocumentCreationDate: '2019-09-01T21:30:29.470Z', '@context': 'http://remotestorage.io/spec/modules/remotestorage_quantity_test/xyz_document'},
			newContentType: 'application/json; charset=UTF-8',
			relativePath: 'xyz_documents/01DKQBS2PY79VJRZ80T54EA3YV',
	 };
	},
	StubChangeObjectRemoteDelete () {
		return {
			origin: 'remote',
			path: '/remotestorage_quantity_test/xyz_documents/01DKQBS2PY79VJRZ80T54EA3YV',
			oldValue: {XYZDocumentName: 'test', XYZDocumentModificationDate: '2019-09-01T21:32:59.908Z', XYZDocumentID: '01DKQBS2PY79VJRZ80T54EA3YV', XYZDocumentCreationDate: '2019-09-01T21:30:29.470Z', '@context': 'http://remotestorage.io/spec/modules/remotestorage_quantity_test/xyz_document'},
			oldContentType: 'application/json; charset=UTF-8',
			newValue: undefined,
			newContentType: undefined,
			relativePath: 'xyz_documents/01DKQBS2PY79VJRZ80T54EA3YV',
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
			OLSKRemoteStorageCollectionType: 'bravo',
			OLSKRemoteStorageCollectionModelErrors: {},
			OLSKRemoteStorageCollectionExports: [],
		};
	},
};

describe('OLSKRemoteStorageJSONSchema', function OLSKRemoteStorageJSONSchema() {

	it('throws error if not object', function() {
		throws(function() {
			mainModule.OLSKRemoteStorageJSONSchema(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns object', function() {
		deepEqual(mainModule.OLSKRemoteStorageJSONSchema({}), {
			type: 'object',
			properties: {},
			required: [],
		});
	});

	context('properties', function() {
		
		it('declares string', function() {
			deepEqual(mainModule.OLSKRemoteStorageJSONSchema({
				alfa: ['XYZErrorNotString']
			}), {
				type: 'object',
				properties: {
					alfa: {
						type: 'string',
					},
				},
				required: [
					'alfa',
				],
			});
		});
		
		it('declares boolean', function() {
			deepEqual(mainModule.OLSKRemoteStorageJSONSchema({
				alfa: ['XYZErrorNotBoolean']
			}), {
				type: 'object',
				properties: {
					alfa: {
						type: 'boolean',
					},
				},
				required: [
					'alfa',
				],
			});
		});
		
		it('declares date', function() {
			deepEqual(mainModule.OLSKRemoteStorageJSONSchema({
				alfa: ['XYZErrorNotDate']
			}), {
				type: 'object',
				properties: {
					alfa: {
						type: 'string',
						format: 'date-time',
					},
				},
				required: [
					'alfa',
				],
			});
		});
		
		it('declares filled', function() {
			deepEqual(mainModule.OLSKRemoteStorageJSONSchema({
				alfa: ['XYZErrorNotFilled']
			}), {
				type: 'object',
				properties: {
					alfa: {
						type: 'string',
					},
				},
				required: [
					'alfa',
				],
			});
		});
		
	});

	context('required', function() {
		
		it('declares if required', function() {
			deepEqual(mainModule.OLSKRemoteStorageJSONSchema({
				alfa: ['XYZErrorNotString']
			}), {
				type: 'object',
				properties: {
					alfa: {
						type: 'string',
					},
				},
				required: [
					'alfa',
				],
			});
		});

		it('ignores', function() {
			deepEqual(mainModule.OLSKRemoteStorageJSONSchema({
				alfa: ['XYZErrorNotString', '__RSOptional']
			}), {
				type: 'object',
				properties: {
					alfa: {
						type: 'string',
					},
				},
				required: [],
			});
		});
		
	});

});

describe('_OLSKRemoteStorageInferredType', function test_OLSKRemoteStorageInferredType() {

	it('throws error if not string', function() {
		throws(function() {
			mainModule._OLSKRemoteStorageInferredType(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('converts if string', function() {
		deepEqual(mainModule._OLSKRemoteStorageInferredType('XYZErrorNotString'), 'string');
	});

	it('converts if boolean', function() {
		deepEqual(mainModule._OLSKRemoteStorageInferredType('XYZErrorNotBoolean'), 'boolean');
	});

	it('converts if date', function() {
		deepEqual(mainModule._OLSKRemoteStorageInferredType('XYZErrorNotDate'), 'date');
	});

	it('converts variable prefix', function() {
		deepEqual(mainModule._OLSKRemoteStorageInferredType('ABCErrorNotDate'), 'date');
	});

});

describe('OLSKRemoteStorageChangeDelegateMethods', function test_OLSKRemoteStorageChangeDelegateMethods() {

	it('returns array', function() {
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateMethods(), [
			'OLSKChangeDelegateCreate',
			'OLSKChangeDelegateUpdate',
			'OLSKChangeDelegateDelete',
		]);
	});

});

describe('OLSKRemoteStorageChangeDelegateProperty', function test_OLSKRemoteStorageChangeDelegateProperty() {

	it('returns undefined', function() {
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateProperty(), undefined);
	});

	it('returns undefined if window', function() {
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateProperty(kTesting.StubChangeObjectWindow()), undefined);
	});

	it('returns undefined if conflict', function() {
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateProperty(kTesting.StubChangeObjectConflict()), undefined);
	});

	it('returns undefined if local init', function() {
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateProperty(kTesting.StubChangeObjectLocalInit()), undefined);
	});

	it('returns string if remote create', function() {
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateProperty(kTesting.StubChangeObjectRemoteCreate()), 'OLSKChangeDelegateCreate');
	});

	it('returns string if remote update', function() {
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateProperty(kTesting.StubChangeObjectRemoteUpdate()), 'OLSKChangeDelegateUpdate');
	});

	it('returns string if remote delete', function() {
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateProperty(kTesting.StubChangeObjectRemoteDelete()), 'OLSKChangeDelegateDelete');
	});

});

describe('OLSKRemoteStorageChangeDelegateInput', function test_OLSKRemoteStorageChangeDelegateInput() {

	it('throws if not valid', function() {
		throws(function () {
			mainModule.OLSKRemoteStorageChangeDelegateInput('alfa');
		}, /LCHErrorInputNotValid/);
	});

	it('returns newValue if OLSKChangeDelegateCreate', function() {
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateInput('OLSKChangeDelegateCreate'), 'newValue');
	});

	it('returns newValue if OLSKChangeDelegateUpdate', function() {
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateInput('OLSKChangeDelegateUpdate'), 'newValue');
	});

	it('returns oldValue if OLSKChangeDelegateDelete', function() {
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateInput('OLSKChangeDelegateDelete'), 'oldValue');
	});

});

const { OLSKRemoteStorageStatus } = require('./main.js');

describe('OLSKRemoteStorageStatus', function test_OLSKRemoteStorageStatus() {

	it('throws error if param1 not object', function() {
		throws(function() {
			OLSKRemoteStorageStatus(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param1 no event method', function() {
		throws(function() {
			OLSKRemoteStorageStatus({});
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param2 not function', function() {
		throws(function() {
			OLSKRemoteStorageStatus(kTesting.StubEventListener(), null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns undefined', function() {
		deepEqual(OLSKRemoteStorageStatus(kTesting.StubEventListener(), function () {}), undefined);
	});

	it('returns string on connected', function() {
		let item;
		OLSKRemoteStorageStatus(kTesting.StubEventListener('connected'), function (inputData) {
			item = inputData;
		});
		deepEqual(item, 'OLSKRemoteStorageStatusOnline');
	});

	it('returns string on network-offline', function() {
		let item;
		OLSKRemoteStorageStatus(kTesting.StubEventListener('network-offline'), function (inputData) {
			item = inputData;
		});
		deepEqual(item, 'OLSKRemoteStorageStatusNetworkOffline');
	});

	it('returns string on network-online', function() {
		let item;
		OLSKRemoteStorageStatus(kTesting.StubEventListener('network-online'), function (inputData) {
			item = inputData;
		});
		deepEqual(item, 'OLSKRemoteStorageStatusOnline');
	});

	it('returns string on error', function() {
		let item;
		OLSKRemoteStorageStatus(kTesting.StubEventListener('error'), function (inputData) {
			item = inputData;
		});
		deepEqual(item, 'OLSKRemoteStorageStatusError');
	});

	it('ignores SyncError on network-offline', function() {
		let item = [];
		OLSKRemoteStorageStatus({
			on (param1, param2) {
				if (param1 === 'network-offline') {
					param2();
				}

				if (param1 === 'error') {
					param2(new Error('Sync failed: Network request failed.'));
				}
			},
		}, function (inputData) {
			item.push(inputData);
		});
		deepEqual(item, ['OLSKRemoteStorageStatusNetworkOffline']);
	});

	it('allows other errors on network-offline', function() {
		const item = [];
		OLSKRemoteStorageStatus({
			on (param1, param2) {
				if (param1 === 'network-offline') {
					param2();
				}

				if (param1 === 'error') {
					param2(new Error('Sync failed: Network request failed.x'));
				}
			},
		}, function (inputData) {
			item.push(inputData);
		});
		deepEqual(item, [
			'OLSKRemoteStorageStatusNetworkOffline',
			'OLSKRemoteStorageStatusError',
		]);
	});

	it('allows SyncError after network-online', function() {
		const item = [];
		OLSKRemoteStorageStatus({
			on (param1, param2) {
				if (param1 === 'network-offline') {
					param2();
				}

				if (param1 === 'network-online') {
					param2();
				}

				if (param1 === 'error') {
					param2(new Error('Sync failed: Network request failed.'));
				}
			},
		}, function (inputData) {
			item.push(inputData);
		});
		deepEqual(item, ['OLSKRemoteStorageStatusNetworkOffline', 'OLSKRemoteStorageStatusOnline', 'OLSKRemoteStorageStatusError']);
	});

	it('returns string on disconnected', function() {
		let item;
		OLSKRemoteStorageStatus(kTesting.StubEventListener('disconnected'), function (inputData) {
			item = inputData;
		});
		deepEqual(item, '');
	});

});

describe('OLSKRemoteStorageIsCollection', function test_OLSKRemoteStorageIsCollection() {

	it('throws error if not object', function() {
		throws(function() {
			mainModule.OLSKRemoteStorageIsCollection(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns false if OLSKRemoteStorageCollectionName not string', function() {
		deepEqual(mainModule.OLSKRemoteStorageIsCollection(Object.assign(kTesting.StubCollectionObjectValid(), {
			OLSKRemoteStorageCollectionName: null,
		})), false);
	});

	it('returns false if OLSKRemoteStorageCollectionName not filled', function() {
		deepEqual(mainModule.OLSKRemoteStorageIsCollection(Object.assign(kTesting.StubCollectionObjectValid(), {
			OLSKRemoteStorageCollectionName: ' ',
		})), false);
	});

	it('returns false if OLSKRemoteStorageCollectionType not string', function() {
		deepEqual(mainModule.OLSKRemoteStorageIsCollection(Object.assign(kTesting.StubCollectionObjectValid(), {
			OLSKRemoteStorageCollectionType: null,
		})), false);
	});

	it('returns false if OLSKRemoteStorageCollectionType not filled', function() {
		deepEqual(mainModule.OLSKRemoteStorageIsCollection(Object.assign(kTesting.StubCollectionObjectValid(), {
			OLSKRemoteStorageCollectionType: ' ',
		})), false);
	});

	it('returns false if OLSKRemoteStorageCollectionModelErrors not object', function() {
		deepEqual(mainModule.OLSKRemoteStorageIsCollection(Object.assign(kTesting.StubCollectionObjectValid(), {
			OLSKRemoteStorageCollectionModelErrors: null,
		})), false);
	});

	it('returns false if OLSKRemoteStorageCollectionExports not object', function() {
		deepEqual(mainModule.OLSKRemoteStorageIsCollection(Object.assign(kTesting.StubCollectionObjectValid(), {
			OLSKRemoteStorageCollectionExports: null,
		})), false);
	});

	it('returns true', function() {
		deepEqual(mainModule.OLSKRemoteStorageIsCollection(kTesting.StubCollectionObjectValid()), true);
	});

});

describe('OLSKRemoteStorageDataModuleGenerator', function test_OLSKRemoteStorageDataModuleGenerator() {

	it('throws error if not string', function() {
		throws(function() {
			mainModule.OLSKRemoteStorageDataModuleGenerator(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if not filled', function() {
		throws(function() {
			mainModule.OLSKRemoteStorageDataModuleGenerator(' ');
		}, /OLSKErrorInputNotValid/);
	});

	it('returns function', function () {
		deepEqual(typeof mainModule.OLSKRemoteStorageDataModuleGenerator('alfa'), 'function');
	});

	context('function', function () {
		
		const generator = mainModule.OLSKRemoteStorageDataModuleGenerator('alfa');

		it('throws if not array', function () {
			throws(function () {
				generator(null)
			}, /OLSKErrorInputNotValid/);
		});

		it('returns object', function () {
			deepEqual(typeof generator([]), 'object');
		});

		context('object', function () {
			
			const mod = generator([])

			context('name', function () {
				
				it('sets to inputData', function () {
					deepEqual(mod.name, 'alfa')
				});
			
			});

			context('builder', function () {

				const uInputValid = function () {
					return { cache () {}, declareType () {} };
				};
				
				it('sets to function', function () {
					deepEqual(typeof mod.builder, 'function')
				});

				context('function', function () {
					
					it('throws if collection not valid', function () {
						throws(function () {
							generator([function () {
								return {};
							}]).builder(uInputValid());
						}, /OLSKErrorInputNotValid/);
					});

					it('calls param1.cache', function () {
						let item;
						
						mod.builder(Object.assign(uInputValid, {
							cache (inputData) {
								item = inputData;
							},
						}));
						
						deepEqual(item, 'alfa/')
					});

					it('calls param1.declareType', function () {
						const item = [];
						
						generator([function () {
							return Object.assign(kTesting.StubCollectionObjectValid(), {
								OLSKRemoteStorageCollectionType: 'bravo',
								OLSKRemoteStorageCollectionModelErrors: {
									charlie: ['XYZErrorNotString'],
								},
							});
						}]).builder(Object.assign(uInputValid, {
							declareType (param1, param2) {
								item.push(param1);
								item.push(param2);
							},
						}));
						
						deepEqual(item, ['bravo', mainModule.OLSKRemoteStorageJSONSchema({
							charlie: ['XYZErrorNotString'],
						})])
					});

					it('returns object', function () {
						deepEqual(typeof mod.builder(uInputValid()), 'object');
					});

					context('object.exports', function () {
						
						it('sets exports to OLSKRemoteStorageCollectionExports', function () {
							deepEqual(generator([function () {
								return Object.assign(kTesting.StubCollectionObjectValid(), {
									OLSKRemoteStorageCollectionName: 'bravo',
									OLSKRemoteStorageCollectionExports: {
										charlie: 'delta'
									},
								});
							}]).builder(uInputValid()).exports.bravo, {
								charlie: 'delta',
							})
						});
					
					});
				
				});
			
			});
		
		});
	
	});

});

describe('_OLSKRemoteStorageIsPath', function test__OLSKRemoteStorageIsPath() {

	it('throws if not string', function() {
		throws(function() {
			mainModule._OLSKRemoteStorageIsPath(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns false if not filled', function() {
		deepEqual(mainModule._OLSKRemoteStorageIsPath(' '), false);
	});

	it('returns true', function() {
		deepEqual(mainModule._OLSKRemoteStorageIsPath('alfa'), true);
	});

});

describe('_OLSKRemoteStorageWrite', function test__OLSKRemoteStorageWrite() {

	it('rejects if param1 not path', async function() {
		await rejects(mainModule._OLSKRemoteStorageWrite(OLSKTestingStorageModule, null, 'alfa'), /OLSKErrorInputNotValid/);
	});

	it('rejects if param2 not string', async function() {
		await rejects(mainModule._OLSKRemoteStorageWrite(OLSKTestingStorageModule, 'alfa', null), /OLSKErrorInputNotValid/);
	});

	it('returns undefined', async function() {
		deepEqual(typeof await mainModule._OLSKRemoteStorageWrite(OLSKTestingStorageModule, 'alfa', 'bravo'), 'undefined');
	});

});

describe('_OLSKRemoteStorageRead', function test__OLSKRemoteStorageRead() {

	it('rejects if not path', async function() {
		await rejects(mainModule._OLSKRemoteStorageRead(OLSKTestingStorageModule, null), /OLSKErrorInputNotValid/);
	});

	it('returns null if no data', async function() {
		deepEqual(await mainModule._OLSKRemoteStorageRead(OLSKTestingStorageModule, 'alfa'), null);
	});

	it('returns data', async function() {
		await mainModule._OLSKRemoteStorageWrite(OLSKTestingStorageModule, 'alfa', 'bravo')

		deepEqual(await mainModule._OLSKRemoteStorageRead(OLSKTestingStorageModule, 'alfa'), 'bravo');
	});

});

describe('_OLSKRemoteStorageList', function test__OLSKRemoteStorageList() {

	it('rejects if not path', async function() {
		await rejects(mainModule._OLSKRemoteStorageList(OLSKTestingStorageModule, null), /OLSKErrorInputNotValid/);
	});

	it('returns array', async function() {
		deepEqual(await mainModule._OLSKRemoteStorageList(OLSKTestingStorageModule, 'alfa'), []);
	});

	it('includes document at root', async function() {
		await mainModule._OLSKRemoteStorageWrite(OLSKTestingStorageModule, 'alfa', 'bravo');

		deepEqual(await mainModule._OLSKRemoteStorageList(OLSKTestingStorageModule, ''), ['alfa']);
	});

	it('includes folder at root', async function() {
		await mainModule._OLSKRemoteStorageWrite(OLSKTestingStorageModule, 'alfa/bravo', 'charlie');

		deepEqual(await mainModule._OLSKRemoteStorageList(OLSKTestingStorageModule, ''), ['alfa/']);
	});

	it('accepts array', async function() {
		await mainModule._OLSKRemoteStorageWrite(OLSKTestingStorageModule, 'alfa/bravo', 'charlie');
		await mainModule._OLSKRemoteStorageWrite(OLSKTestingStorageModule, 'alfa/bravo/charlie', 'delta');

		deepEqual(await mainModule._OLSKRemoteStorageList(OLSKTestingStorageModule, await mainModule._OLSKRemoteStorageList(OLSKTestingStorageModule, '')), [
			'alfa/bravo',
			'alfa/bravo/'
			]);
	});

});

describe('_OLSKRemoteStorageListObjectsRecursive', function test__OLSKRemoteStorageListObjectsRecursive() {

	it('rejects if not path', async function() {
		await rejects(mainModule._OLSKRemoteStorageListObjectsRecursive(OLSKTestingStorageModule, null), /OLSKErrorInputNotValid/);
	});

	it('returns array', async function() {
		deepEqual(await mainModule._OLSKRemoteStorageListObjectsRecursive(OLSKTestingStorageModule, 'alfa'), []);
	});

	it('includes document at root', async function() {
		await mainModule._OLSKRemoteStorageWrite(OLSKTestingStorageModule, 'alfa', 'bravo');

		deepEqual(await mainModule._OLSKRemoteStorageListObjectsRecursive(OLSKTestingStorageModule, ''), ['alfa']);
	});

	it('includes document at subfolder', async function() {
		await mainModule._OLSKRemoteStorageWrite(OLSKTestingStorageModule, 'alfa/bravo', 'charlie');

		deepEqual(await mainModule._OLSKRemoteStorageListObjectsRecursive(OLSKTestingStorageModule, ''), ['alfa/bravo']);
	});

});

describe('_OLSKRemoteStorageReset', function test__OLSKRemoteStorageReset() {

	it('returns array', async function() {
		deepEqual(await mainModule._OLSKRemoteStorageReset(OLSKTestingStorageModule), []);
	});

	it('deletes document at root', async function() {
		await mainModule._OLSKRemoteStorageWrite(OLSKTestingStorageModule, 'alfa', 'bravo');

		await mainModule._OLSKRemoteStorageReset(OLSKTestingStorageModule)

		deepEqual(await mainModule._OLSKRemoteStorageList(OLSKTestingStorageModule, ''), []);
	});

	it('deletes document at folder', async function() {
		await mainModule._OLSKRemoteStorageWrite(OLSKTestingStorageModule, 'alfa/bravo', 'charlie');

		await mainModule._OLSKRemoteStorageReset(OLSKTestingStorageModule)

		deepEqual(await mainModule._OLSKRemoteStorageList(OLSKTestingStorageModule, ''), []);
	});

	it('deletes document at subfolder', async function() {
		await mainModule._OLSKRemoteStorageWrite(OLSKTestingStorageModule, 'alfa/bravo/charlie', 'delta');

		await mainModule._OLSKRemoteStorageReset(OLSKTestingStorageModule)

		deepEqual(await mainModule._OLSKRemoteStorageList(OLSKTestingStorageModule, 'alfa/'), []);
	});

});
