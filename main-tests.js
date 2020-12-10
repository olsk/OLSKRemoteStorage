const { throws, rejects, deepEqual } = require('assert');

const mod = require('./main.js');

const uWindow = function (inputData = {}) {
	return Object.assign({
		prompt () {},
		confirm () {},
		location: {
			reload () {},
		},
	}, inputData);
};

const uStorage = function (inputData = {}) {
	return Object.assign({
		access: {
			scopes: [{
				name: Math.random().toString(),
			}],
		},
		remote: {},
	}, inputData);
};

const uLocalized = function (inputData) {
	return inputData + 'LOCALIZED';
};

describe('OLSKRemoteStorageJSONSchema', function OLSKRemoteStorageJSONSchema() {

	it('throws error if not object', function() {
		throws(function() {
			mod.OLSKRemoteStorageJSONSchema(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns object', function() {
		deepEqual(mod.OLSKRemoteStorageJSONSchema({}), {
			type: 'object',
			properties: {},
			required: [],
		});
	});

	context('properties', function() {
		
		it('declares string', function() {
			deepEqual(mod.OLSKRemoteStorageJSONSchema({
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
			deepEqual(mod.OLSKRemoteStorageJSONSchema({
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
			deepEqual(mod.OLSKRemoteStorageJSONSchema({
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
			deepEqual(mod.OLSKRemoteStorageJSONSchema({
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
			deepEqual(mod.OLSKRemoteStorageJSONSchema({
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
			deepEqual(mod.OLSKRemoteStorageJSONSchema({
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
			mod._OLSKRemoteStorageInferredType(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('converts if string', function() {
		deepEqual(mod._OLSKRemoteStorageInferredType('XYZErrorNotString'), 'string');
	});

	it('converts if boolean', function() {
		deepEqual(mod._OLSKRemoteStorageInferredType('XYZErrorNotBoolean'), 'boolean');
	});

	it('converts if date', function() {
		deepEqual(mod._OLSKRemoteStorageInferredType('XYZErrorNotDate'), 'date');
	});

	it('converts variable prefix', function() {
		deepEqual(mod._OLSKRemoteStorageInferredType('ABCErrorNotDate'), 'date');
	});

});

describe('OLSKRemoteStorageChangeDelegateMethods', function test_OLSKRemoteStorageChangeDelegateMethods() {

	it('returns array', function() {
		deepEqual(mod.OLSKRemoteStorageChangeDelegateMethods(), [
			'OLSKChangeDelegateCreate',
			'OLSKChangeDelegateUpdate',
			'OLSKChangeDelegateDelete',
			'OLSKChangeDelegateConflict',
		]);
	});

});

describe('OLSKRemoteStorageChangeDelegateProperty', function test_OLSKRemoteStorageChangeDelegateProperty() {

	it('returns undefined', function() {
		deepEqual(mod.OLSKRemoteStorageChangeDelegateProperty(), undefined);
	});

	it('returns undefined if window', function() {
		deepEqual(mod.OLSKRemoteStorageChangeDelegateProperty(StubChangeObjectWindow()), undefined);
	});

	it('returns undefined if local init', function() {
		deepEqual(mod.OLSKRemoteStorageChangeDelegateProperty(StubChangeObjectLocalInit()), undefined);
	});

	it('returns string if remote create', function() {
		deepEqual(mod.OLSKRemoteStorageChangeDelegateProperty(StubChangeObjectRemoteCreate()), 'OLSKChangeDelegateCreate');
	});

	it('returns string if remote update', function() {
		deepEqual(mod.OLSKRemoteStorageChangeDelegateProperty(StubChangeObjectRemoteUpdate()), 'OLSKChangeDelegateUpdate');
	});

	it('returns string if remote delete', function() {
		deepEqual(mod.OLSKRemoteStorageChangeDelegateProperty(StubChangeObjectRemoteDelete()), 'OLSKChangeDelegateDelete');
	});

	it('returns string if conflict', function() {
		deepEqual(mod.OLSKRemoteStorageChangeDelegateProperty(StubChangeObjectConflict()), 'OLSKChangeDelegateConflict');
	});

});

describe('OLSKRemoteStorageChangeDelegateInput', function test_OLSKRemoteStorageChangeDelegateInput() {

	it('throws if not valid', function() {
		throws(function () {
			mod.OLSKRemoteStorageChangeDelegateInput('alfa');
		}, /OLSKErrorInputNotValid/);
	});

	it('returns newValue if OLSKChangeDelegateCreate', function() {
		deepEqual(mod.OLSKRemoteStorageChangeDelegateInput('OLSKChangeDelegateCreate'), 'newValue');
	});

	it('returns newValue if OLSKChangeDelegateUpdate', function() {
		deepEqual(mod.OLSKRemoteStorageChangeDelegateInput('OLSKChangeDelegateUpdate'), 'newValue');
	});

	it('returns oldValue if OLSKChangeDelegateDelete', function() {
		deepEqual(mod.OLSKRemoteStorageChangeDelegateInput('OLSKChangeDelegateDelete'), 'oldValue');
	});

});

describe('OLSKRemoteStorageChangeDelegateData', function test_OLSKRemoteStorageChangeDelegateData() {

	it('throws if param1 not valid', function() {
		throws(function () {
			mod.OLSKRemoteStorageChangeDelegateData('alfa', StubChangeObjectRemoteCreate());
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not valid', function() {
		throws(function () {
			mod.OLSKRemoteStorageChangeDelegateData('alfa', Object.assign(StubChangeObjectRemoteCreate(), {
				origin: null,
			}));
		}, /OLSKErrorInputNotValid/);
	});

	it('returns newValue if OLSKChangeDelegateCreate', function() {
		const item = StubChangeObjectRemoteCreate();
		deepEqual(mod.OLSKRemoteStorageChangeDelegateData('OLSKChangeDelegateCreate', item), item.newValue);
	});

	it('returns newValue if OLSKChangeDelegateUpdate', function() {
		const item = StubChangeObjectRemoteUpdate();
		deepEqual(mod.OLSKRemoteStorageChangeDelegateData('OLSKChangeDelegateUpdate', item), item.newValue);
	});

	it('returns oldValue if OLSKChangeDelegateDelete', function() {
		const item = StubChangeObjectRemoteDelete();
		deepEqual(mod.OLSKRemoteStorageChangeDelegateData('OLSKChangeDelegateDelete', item), item.oldValue);
	});

	it('returns param2 if OLSKChangeDelegateConflict', function() {
		const item = StubChangeObjectConflict();
		deepEqual(mod.OLSKRemoteStorageChangeDelegateData('OLSKChangeDelegateConflict', item), item);
	});

});

describe('OLSKRemoteStorageChangeDelegateConflictSelectRecent', function test_OLSKRemoteStorageChangeDelegateConflictSelectRecent() {

	it('throws if not valid', function() {
		throws(function () {
			mod.OLSKRemoteStorageChangeDelegateConflictSelectRecent(StubChangeObjectRemoteCreate());
		}, /OLSKErrorInputNotValid/);
	});

	it('returns newValue if no *ModificationDate', function() {
		const item = JSON.parse(JSON.stringify(StubChangeObjectConflict()).split('ModificationDate').join('AlfaDate'));
		deepEqual(mod.OLSKRemoteStorageChangeDelegateConflictSelectRecent(item), item.newValue);
	});

	it('returns newValue if *ModificationDate and newer', function() {
		const item = StubChangeObjectConflict();

		item.newValue.KVCNoteModificationDate = (new Date()).toJSON();
		
		deepEqual(mod.OLSKRemoteStorageChangeDelegateConflictSelectRecent(item), item.newValue);
	});

	it('returns oldValue if *ModificationDate and newer', function() {
		const item = StubChangeObjectConflict();
		deepEqual(mod.OLSKRemoteStorageChangeDelegateConflictSelectRecent(item), item.oldValue);
	});

});

describe('OLSKRemoteStorageStatus', function test_OLSKRemoteStorageStatus() {

	it('throws error if param1 not object', function() {
		throws(function() {
			mod.OLSKRemoteStorageStatus(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param1 no event method', function() {
		throws(function() {
			mod.OLSKRemoteStorageStatus({});
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param2 not function', function() {
		throws(function() {
			mod.OLSKRemoteStorageStatus(StubEventListener(), null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns undefined', function() {
		deepEqual(mod.OLSKRemoteStorageStatus(StubEventListener(), function () {}), undefined);
	});

	it('returns string on connected', function() {
		let item;
		mod.OLSKRemoteStorageStatus(StubEventListener('connected'), function (inputData) {
			item = inputData;
		});
		deepEqual(item, 'OLSKRemoteStorageStatusOnline');
	});

	it('returns string on network-offline', function() {
		let item;
		mod.OLSKRemoteStorageStatus(StubEventListener('network-offline'), function (inputData) {
			item = inputData;
		});
		deepEqual(item, 'OLSKRemoteStorageStatusNetworkOffline');
	});

	it('returns string on network-online', function() {
		let item;
		mod.OLSKRemoteStorageStatus(StubEventListener('network-online'), function (inputData) {
			item = inputData;
		});
		deepEqual(item, 'OLSKRemoteStorageStatusOnline');
	});

	it('returns string on error', function() {
		let item;
		mod.OLSKRemoteStorageStatus(StubEventListener('error'), function (inputData) {
			item = inputData;
		});
		deepEqual(item, 'OLSKRemoteStorageStatusError');
	});

	it('ignores SyncError on network-offline', function() {
		let item = [];
		mod.OLSKRemoteStorageStatus({
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
		mod.OLSKRemoteStorageStatus({
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
		mod.OLSKRemoteStorageStatus({
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
		mod.OLSKRemoteStorageStatus(StubEventListener('disconnected'), function (inputData) {
			item = inputData;
		});
		deepEqual(item, '');
	});

});

describe('OLSKRemoteStorageIsCollection', function test_OLSKRemoteStorageIsCollection() {

	it('throws error if not object', function() {
		throws(function() {
			mod.OLSKRemoteStorageIsCollection(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns false if OLSKRemoteStorageCollectionName not string', function() {
		deepEqual(mod.OLSKRemoteStorageIsCollection(Object.assign(StubCollectionObjectValid(), {
			OLSKRemoteStorageCollectionName: null,
		})), false);
	});

	it('returns false if OLSKRemoteStorageCollectionName not filled', function() {
		deepEqual(mod.OLSKRemoteStorageIsCollection(Object.assign(StubCollectionObjectValid(), {
			OLSKRemoteStorageCollectionName: ' ',
		})), false);
	});

	it('returns false if OLSKRemoteStorageCollectionExports not object', function() {
		deepEqual(mod.OLSKRemoteStorageIsCollection(Object.assign(StubCollectionObjectValid(), {
			OLSKRemoteStorageCollectionExports: null,
		})), false);
	});

	it('returns true', function() {
		deepEqual(mod.OLSKRemoteStorageIsCollection(StubCollectionObjectValid()), true);
	});

});

describe('OLSKRemoteStorageDataModuleGenerator', function test_OLSKRemoteStorageDataModuleGenerator() {

	it('throws error if not string', function() {
		throws(function() {
			mod.OLSKRemoteStorageDataModuleGenerator(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if not filled', function() {
		throws(function() {
			mod.OLSKRemoteStorageDataModuleGenerator(' ');
		}, /OLSKErrorInputNotValid/);
	});

	it('returns function', function () {
		deepEqual(typeof mod.OLSKRemoteStorageDataModuleGenerator('alfa'), 'function');
	});

	context('function', function () {
		
		const generator = mod.OLSKRemoteStorageDataModuleGenerator('alfa');

		it('throws if not array', function () {
			throws(function () {
				generator(null);
			}, /OLSKErrorInputNotValid/);
		});

		it('returns object', function () {
			deepEqual(typeof generator([]), 'object');
		});

		context('object', function () {
			
			const _mod = generator([]);

			context('name', function () {
				
				it('sets to inputData', function () {
					deepEqual(_mod.name, 'alfa');
				});
			
			});

			context('builder', function () {

				const uInputValid = function () {
					return { cache () {}, declareType () {} };
				};
				
				it('sets to function', function () {
					deepEqual(typeof _mod.builder, 'function');
				});

				context('function', function () {
					
					it('throws if collection not valid', function () {
						throws(function () {
							generator([function () {
								return {};
							}]).builder(uInputValid());
						}, /OLSKErrorInputNotValid/);
					});

					it('returns object', function () {
						deepEqual(typeof _mod.builder(uInputValid()), 'object');
					});

					context('object.exports', function () {
						
						it('sets exports to OLSKRemoteStorageCollectionExports', function () {
							deepEqual(generator([function () {
								return Object.assign(StubCollectionObjectValid(), {
									OLSKRemoteStorageCollectionName: 'bravo',
									OLSKRemoteStorageCollectionExports: {
										charlie: 'delta'
									},
								});
							}]).builder(uInputValid()).exports.bravo, {
								charlie: 'delta',
							});
						});
						
						it('sets excludes __DEBUG if no option.OLSKOptionIncludeDebug', function () {
							deepEqual(typeof mod.OLSKRemoteStorageDataModuleGenerator('alfa')([function () {
								return StubCollectionObjectValid();
							}]).builder(uInputValid()).exports.__DEBUG, 'undefined');
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
			mod._OLSKRemoteStorageIsPath(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns false if not filled', function() {
		deepEqual(mod._OLSKRemoteStorageIsPath(' '), false);
	});

	it('returns true', function() {
		deepEqual(mod._OLSKRemoteStorageIsPath('alfa'), true);
	});

});

describe('OLSKRemoteStorageListing', function test_OLSKRemoteStorageListing() {

	let privateClient;

	before(function () {
		privateClient = mod._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule);
	});

	it('rejects if not path', async function() {
		await rejects(mod.OLSKRemoteStorageListing(privateClient, null), /OLSKErrorInputNotValid/);
	});

	it('returns array', async function() {
		deepEqual(await mod.OLSKRemoteStorageListing(privateClient, 'alfa'), []);
	});

	it('includes document at root', async function() {
		await mod._TestWriteFileText(OLSKTestingStorageModule, 'alfa', 'bravo');

		deepEqual(await mod.OLSKRemoteStorageListing(privateClient, ''), ['alfa']);
	});

	it('includes folder at root', async function() {
		await mod._TestWriteFileText(OLSKTestingStorageModule, 'alfa/bravo', 'charlie');

		deepEqual(await mod.OLSKRemoteStorageListing(privateClient, ''), ['alfa/']);
	});

	it('accepts array', async function() {
		await mod._TestWriteFileText(OLSKTestingStorageModule, 'alfa/bravo', 'charlie');
		await mod._TestWriteFileText(OLSKTestingStorageModule, 'alfa/bravo/charlie', 'delta');

		deepEqual(await mod.OLSKRemoteStorageListing(privateClient, await mod.OLSKRemoteStorageListing(privateClient, '')), [
			'alfa/bravo',
			'alfa/bravo/'
		]);
	});

});

describe('OLSKRemoteStorageListingRecursive', function test_OLSKRemoteStorageListingRecursive() {

	let privateClient;

	before(function () {
		privateClient = mod._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule);
	});

	it('rejects if not path', async function() {
		await rejects(mod.OLSKRemoteStorageListingRecursive(privateClient, null), /OLSKErrorInputNotValid/);
	});

	it('returns array', async function() {
		deepEqual(await mod.OLSKRemoteStorageListingRecursive(privateClient, 'alfa'), []);
	});

	it('includes document at root', async function() {
		await mod._TestWriteFileText(OLSKTestingStorageModule, 'alfa', 'bravo');

		deepEqual(await mod.OLSKRemoteStorageListingRecursive(privateClient, ''), ['alfa']);
	});

	it('includes document at subfolder', async function() {
		await mod._TestWriteFileText(OLSKTestingStorageModule, 'alfa/bravo', 'charlie');

		deepEqual(await mod.OLSKRemoteStorageListingRecursive(privateClient, ''), ['alfa/bravo']);
	});

});

describe('OLSKRemoteStorageObjects', function test_OLSKRemoteStorageObjects() {

	let privateClient;

	before(function () {
		privateClient = mod._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule);
	});

	it('rejects if not path', async function() {
		await rejects(mod.OLSKRemoteStorageObjects(privateClient, null), /OLSKErrorInputNotValid/);
	});

	it('returns object', async function() {
		deepEqual(await mod.OLSKRemoteStorageObjects(privateClient, ''), {
			objects: [],
			folders: [],
		});
	});

	it('includes object', async function() {
		await mod._TestWriteObject(OLSKTestingStorageModule, 'alfa', {
			bravo: 'charlie',
		});

		deepEqual(await mod.OLSKRemoteStorageObjects(privateClient, ''), {
			objects: [await mod._TestReadObject(OLSKTestingStorageModule, 'alfa')],
			folders: [],
		});
	});

	it('ignores folder', async function() {
		await mod._TestWriteObject(OLSKTestingStorageModule, 'alfa/bravo', {
			charlie: 'delta',
		});
		
		deepEqual(await mod.OLSKRemoteStorageObjects(privateClient, ''), {
			objects: [],
			folders: ['alfa/'],
		});
	});

});

describe('OLSKRemoteStorageObjectsRecursive', function test_OLSKRemoteStorageObjectsRecursive() {

	let privateClient;

	before(function () {
		privateClient = mod._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule);
	});

	it('rejects if not path', async function() {
		await rejects(mod.OLSKRemoteStorageObjectsRecursive(privateClient, null), /OLSKErrorInputNotValid/);
	});

	it('returns object', async function() {
		deepEqual(await mod.OLSKRemoteStorageObjectsRecursive(privateClient, ''), {});
	});

	it('includes object at root', async function() {
		await mod._TestWriteObject(OLSKTestingStorageModule, 'alfa', {
			bravo: 'charlie',
		});

		deepEqual(await mod.OLSKRemoteStorageObjectsRecursive(privateClient, ''), {
			'alfa': await mod._TestReadObject(OLSKTestingStorageModule, 'alfa'),
		});
	});

	it('includes object in folder', async function() {
		await mod._TestWriteObject(OLSKTestingStorageModule, 'alfa/bravo', {
			charlie: 'delta',
		});
		
		deepEqual(await mod.OLSKRemoteStorageObjectsRecursive(privateClient, ''), {
			'alfa/bravo': await mod._TestReadObject(OLSKTestingStorageModule, 'alfa/bravo'),
		});
	});

	it('traverses multiple depths', async function() {
		await mod._TestWriteObject(OLSKTestingStorageModule, 'alfa/bravo', {
			charlie: 'delta',
		});
		await mod._TestWriteObject(OLSKTestingStorageModule, 'alfa/bravo/charlie', {
			delta: 'echo',
		});
		
		deepEqual(await mod.OLSKRemoteStorageObjectsRecursive(privateClient, ''), {
			'alfa/bravo': await mod._TestReadObject(OLSKTestingStorageModule, 'alfa/bravo'),
			'alfa/bravo/charlie': await mod._TestReadObject(OLSKTestingStorageModule, 'alfa/bravo/charlie'),
		});
	});

});

describe('_TestWriteFileText', function test__TestWriteFileText() {

	it('throws if param1 not path', function () {
		throws(function () {
			mod._TestWriteFileText(OLSKTestingStorageModule, null, 'alfa');
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not string', function () {
		throws(function () {
			mod._TestWriteFileText(OLSKTestingStorageModule, 'alfa', null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns undefined', async function() {
		deepEqual(typeof await mod._TestWriteFileText(OLSKTestingStorageModule, 'alfa', 'bravo'), 'undefined');
	});

	it('writes param2 to param1', async function() {
		await mod._TestWriteFileText(OLSKTestingStorageModule, 'alfa', 'bravo');

		deepEqual(await mod._TestReadFileText(OLSKTestingStorageModule, 'alfa'), 'bravo');
	});

});

describe('_TestReadFileText', function test__TestReadFileText() {

	it('rejects if not path', async function() {
		await rejects(mod._TestReadFileText(OLSKTestingStorageModule, null), /OLSKErrorInputNotValid/);
	});

	it('returns null if no data', async function() {
		deepEqual(await mod._TestReadFileText(OLSKTestingStorageModule, 'alfa'), null);
	});

	it('returns data', async function() {
		await mod._TestWriteFileText(OLSKTestingStorageModule, 'alfa', 'bravo');

		deepEqual(await mod._TestReadFileText(OLSKTestingStorageModule, 'alfa'), 'bravo');
	});

});

describe('_TestWriteObject', function test__TestWriteObject() {

	it('throws if param1 not path', function () {
		throws(function () {
			mod._TestWriteObject(OLSKTestingStorageModule, null, 'alfa');
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not object', function () {
		throws(function () {
			mod._TestWriteObject(OLSKTestingStorageModule, 'alfa', null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns input', async function() {
		const item = {
			bravo: 'charlie',
		};

		deepEqual(await mod._TestWriteObject(OLSKTestingStorageModule, 'alfa', item), item);
	});

	it('writes object to param1', async function() {
		const item = {
			bravo: 'charlie',
		};

		await mod._TestWriteObject(OLSKTestingStorageModule, 'alfa', item);

		deepEqual(await mod._TestReadObject(OLSKTestingStorageModule, 'alfa'), item);
	});

});

describe('_TestReadObject', function test__TestReadObject() {

	it('rejects if not path', async function() {
		await rejects(mod._TestReadObject(OLSKTestingStorageModule, null), /OLSKErrorInputNotValid/);
	});

	it('returns null if no data', async function() {
		deepEqual(await mod._TestReadObject(OLSKTestingStorageModule, 'alfa'), null);
	});

	it('returns data', async function() {
		await mod._TestWriteObject(OLSKTestingStorageModule, 'alfa', {
			bravo: 'charlie',
		});

		deepEqual(await mod._TestReadObject(OLSKTestingStorageModule, 'alfa'), {
			bravo: 'charlie',
		});
	});

});

describe('_TestReset', function test__TestReset() {

	it('returns array', async function() {
		deepEqual(await mod._TestReset(OLSKTestingStorageModule), []);
	});

	it('deletes document at root', async function() {
		await mod._TestWriteFileText(OLSKTestingStorageModule, 'alfa', 'bravo');

		await mod._TestReset(OLSKTestingStorageModule);

		deepEqual(await mod.OLSKRemoteStorageListing(mod._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule), ''), []);
	});

	it('deletes document at folder', async function() {
		await mod._TestWriteFileText(OLSKTestingStorageModule, 'alfa/bravo', 'charlie');

		await mod._TestReset(OLSKTestingStorageModule);

		deepEqual(await mod.OLSKRemoteStorageListing(mod._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule), ''), []);
	});

	it('deletes document at subfolder', async function() {
		await mod._TestWriteFileText(OLSKTestingStorageModule, 'alfa/bravo/charlie', 'delta');

		await mod._TestReset(OLSKTestingStorageModule);

		deepEqual(await mod.OLSKRemoteStorageListing(mod._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule), 'alfa/'), []);
	});

});

describe('_OLSKRemoteStoragePrivateClient', function test__OLSKRemoteStoragePrivateClient() {

	it('returns object', function() {
		deepEqual(typeof mod._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule), 'object');
		deepEqual(mod._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule), OLSKTestingStorageModule.__DEBUG.__OLSKRemoteStoragePrivateClient());
	});
});

describe('_OLSKRemoteStoragePublicClient', function test__OLSKRemoteStoragePublicClient() {

	it('returns object', function() {
		deepEqual(typeof mod._OLSKRemoteStoragePublicClient(OLSKTestingStorageModule), 'object');
		deepEqual(mod._OLSKRemoteStoragePublicClient(OLSKTestingStorageModule), OLSKTestingStorageModule.__DEBUG.__OLSKRemoteStoragePublicClient());
	});

});

describe('OLSKRemoteStorageSafeCopy', function test_OLSKRemoteStorageSafeCopy() {

	const item = {
		alfa: 'bravo',
		$charlie: 'delta',
	};
	
	it('returns object', function () {
		deepEqual(mod.OLSKRemoteStorageSafeCopy(item).alfa, 'bravo');
	});

	it('creates copy', function () {
		deepEqual(mod.OLSKRemoteStorageSafeCopy(item) !== item, true);
	});
	
	it('ignores $dynamic fields', function () {
		deepEqual(mod.OLSKRemoteStorageSafeCopy(item).$charlie, undefined);
	});

});

describe('OLSKRemoteStoragePreJSONSchemaValidate', function test_OLSKRemoteStoragePreJSONSchemaValidate() {

	it('returns input', function() {
		deepEqual(mod.OLSKRemoteStoragePreJSONSchemaValidate({}), {});
	});

	it('returns passes string', function() {
		deepEqual(mod.OLSKRemoteStoragePreJSONSchemaValidate({
			alfaDate: '2018-12-09T19:07:01.902Z',
		}), {
			alfaDate: '2018-12-09T19:07:01.902Z',
		});
	});

	it('returns input with *Date as string', function() {
		deepEqual(mod.OLSKRemoteStoragePreJSONSchemaValidate({
			alfaDate: new Date('2018-12-09T19:07:01.902Z'),
		}), {
			alfaDate: '2018-12-09T19:07:01.902Z',
		});
	});

	it('returns input with Array *Date as string', function() {
		deepEqual(mod.OLSKRemoteStoragePreJSONSchemaValidate({
			alfa: [
				{
					bravoDate: new Date('2018-12-09T19:07:01.902Z'),
				}
			],
		}), {
			alfa: [
				{
					bravoDate: '2018-12-09T19:07:01.902Z',
				}
			],
		});
	});

});

describe('OLSKRemoteStoragePostJSONParse', function test_OLSKRemoteStoragePostJSONParse() {

	it('returns input null', function() {
		deepEqual(mod.OLSKRemoteStoragePostJSONParse(null), null);
	});

	it('returns input object', function() {
		deepEqual(mod.OLSKRemoteStoragePostJSONParse({}), {});
	});

	it('returns input with *Date as date', function() {
		deepEqual(mod.OLSKRemoteStoragePostJSONParse({
			alfaDate: '2018-12-09T19:07:01.902Z',
		}), {
			alfaDate: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

	it('returns input with Array *Date as date', function() {
		deepEqual(mod.OLSKRemoteStoragePostJSONParse({
			alfa: [
				{
					bravoDate: '2018-12-09T19:07:01.902Z',
				}
			],
		}), {
			alfa: [
				{
					bravoDate: new Date('2018-12-09T19:07:01.902Z'),
				}
			],
		});
	});

	it('returns input with object *Date as date', function() {
		deepEqual(mod.OLSKRemoteStoragePostJSONParse({
			alfa: {
				bravoDate: '2018-12-09T19:07:01.902Z',
			},
		}), {
			alfa: {
				bravoDate: new Date('2018-12-09T19:07:01.902Z'),
			},
		});
	});

	it('returns input array with objects parsed', function() {
		deepEqual(mod.OLSKRemoteStoragePostJSONParse([{
			alfaDate: '2018-12-09T19:07:01.902Z',
		}]), [{
			alfaDate: new Date('2018-12-09T19:07:01.902Z'),
		}]);
	});

});

describe('OLSKRemoteStorageWriteObject', function test_OLSKRemoteStorageWriteObject() {

	const uObj = function (inputData) {
		return {
			bravoDate: inputData || new Date(),
		};
	};
	
	it('rejects if param1 not path', async function() {
		await rejects(mod.OLSKRemoteStorageWriteObject(mod._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule), null, 'alfa'), /OLSKErrorInputNotValid/);
	});

	it('rejects if param2 not object', async function() {
		await rejects(mod.OLSKRemoteStorageWriteObject(mod._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule), 'alfa', null), /OLSKErrorInputNotValid/);
	});

	it('returns param2', async function() {
		const item = uObj();
		deepEqual(await mod.OLSKRemoteStorageWriteObject(mod._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule), 'alfa', item) === item, true);
	});

	it('leaves param2 unmodified', async function() {
		const item = new Date();
		deepEqual(await mod.OLSKRemoteStorageWriteObject(mod._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule), 'alfa', uObj(item)), uObj(item));
	});

	it('writes stringified param2 to param1', async function() {
		const item = uObj(new Date());

		await mod.OLSKRemoteStorageWriteObject(mod._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule), 'alfa', item);

		deepEqual(await mod.OLSKRemoteStorageReadObject(mod._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule), 'alfa'), item);
	});
	
	it('ignores $dynamic fields', async function () {
		const item = uObj(new Date());

		await mod.OLSKRemoteStorageWriteObject(mod._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule), 'alfa', Object.assign({
			$charlie: 'delta',
		}, item));

		deepEqual(await mod.OLSKRemoteStorageReadObject(mod._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule), 'alfa'), item);
	});

});

describe('OLSKRemoteStorageReadObject', function test_OLSKRemoteStorageReadObject() {

	const uObj = function () {
		return {
			bravoDate: new Date(),
		};
	};
	
	it('rejects if not path', async function() {
		await rejects(mod.OLSKRemoteStorageReadObject(mod._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule), null), /OLSKErrorInputNotValid/);
	});

	it('returns null if no data', async function() {
		deepEqual(await mod.OLSKRemoteStorageReadObject(mod._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule), 'alfa'), null);
	});

	it('returns data', async function() {
		const item = uObj();

		await mod.OLSKRemoteStorageWriteObject(mod._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule), 'alfa', item);

		deepEqual(await mod.OLSKRemoteStorageReadObject(mod._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule), 'alfa'), item);
	});

});

describe('OLSKRemoteStorageQueryFunction', function test_OLSKRemoteStorageQueryFunction() {

	const uStorage = function (inputData = {}) {
		return function () {
			Object.assign(this, {
				access: {
					claim () {},
				},
				stopSync () {},
				on () {},
				connect () {},
				disconnect () {},
			}, inputData);
		};
	};

	const uModule = function () {
		return {
			name: 'alfa',
		};
	};

	it('throws if param1 not remotestoragejs', function () {
		throws(function () {
			mod.OLSKRemoteStorageQueryFunction({}, uModule(), '', '');
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not storagemodule', function () {
		throws(function () {
			mod.OLSKRemoteStorageQueryFunction(uStorage(), {}, '', '');
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param3 not string', function () {
		throws(function () {
			mod.OLSKRemoteStorageQueryFunction(uStorage(), uModule(), null, '');
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param4 not string', function () {
		throws(function () {
			mod.OLSKRemoteStorageQueryFunction(uStorage(), uModule(), '', null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns function', function () {
		deepEqual(typeof mod.OLSKRemoteStorageQueryFunction(uStorage(), uModule(), '', ''), 'function');
	});

	context('function', function () {

		const uQueryFunction = function (param1 = uStorage(), param2 = uModule(), param3 = '', param4 = '') {
			return mod.OLSKRemoteStorageQueryFunction(param1, uModule(), param3, param4);
		};

		it('throws if not function', function () {
			throws(function () {
				uQueryFunction()();
			}, /OLSKErrorInputNotValid/);
		});
		
		it('initializes param1', function () {
			const item = [];
			const remotestoragejs = function () {
			  item.push([...arguments]);

			  Object.assign(this, new (uStorage()));
			};
			const storagemodule = uModule();

			uQueryFunction(remotestoragejs, storagemodule)(function () {});

			deepEqual(item, [[{
				cache: false,
				modules: [storagemodule],
			}]]);
		});

		it('calls access.claim', function () {
			const item = [];
			uQueryFunction(uStorage({
				access: {
					claim () {
					  item.push([...arguments]);
					},
				},
			}))(function () {});

			deepEqual(item, [[uModule().name, 'rw']]);
		});

		it('calls stopSync', function () {
			const item = [];
			uQueryFunction(uStorage({
				stopSync () {
				  item.push([...arguments]);
				},
			}))(function () {});

			deepEqual(item, [[]]);
		});

		it('rejects on error', async function () {
			const item = new Error('whoops');
			const map = {};
			await rejects(uQueryFunction(uStorage({
				on (param1, param2) {
					map[param1] = param2;
				},
				connect () {
				  map.connected();
				},
			}))(function () {
				throw item;
			}), item);
		});

		it('rejects on storage error', async function () {
			const item = new Error('whoops');
			const map = {};
			await rejects(uQueryFunction(uStorage({
				on (param1, param2) {
					map[param1] = param2;
				},
				connect () {
				  map.connected();
				},
			}))(function (inputData) {
				map.error(item);
			}), item);
		});

		it('calls connect with param3, param4', function () {
			const item = [];
			uQueryFunction(uStorage({
				connect () {
				  item.push([...arguments]);
				},
			}), uModule(), 'alfa', 'bravo')(function () {});

			deepEqual(item, [['alfa', 'bravo']]);
		});

		it('calls inputData on connected', async function () {
			const item = [];

			const map = {};
			deepEqual(await uQueryFunction(uStorage({
				on (param1, param2) {
					map[param1] = param2;
				},
				connect () {
				  map.connected();
				},
			}))(function () {
				return 'alfa';
			}), 'alfa');
		});

		it('calls connect with param3, param4', function () {
			const item = [];
			uQueryFunction(uStorage({
				connect () {
				  item.push([...arguments]);
				},
			}), uModule(), 'alfa', 'bravo')(function () {});

			deepEqual(item, [['alfa', 'bravo']]);
		});

		it('calls disconnect', async function () {
			const item = [];
			const map = {};
			await uQueryFunction(uStorage({
				on (param1, param2) {
					map[param1] = param2;
				},
				connect () {
				  map.connected();
				},
				disconnect () {
				  item.push([...arguments]);
				},
			}))(function () {});

			deepEqual(item, [[]]);
		});
	
	});

});

describe('OLSKRemoteStorageLauncherFakeItemProxy', function test_OLSKRemoteStorageLauncherFakeItemProxy() {

	it('returns object', function () {
		const item = mod.OLSKRemoteStorageLauncherFakeItemProxy();
		deepEqual(item, {
			LCHRecipeName: 'OLSKRemoteStorageLauncherFakeItemProxy',
			LCHRecipeCallback: item.LCHRecipeCallback,
		});
	});

	context('LCHRecipeCallback', function () {
		
		it('returns undefined', function () {
			deepEqual(mod.OLSKRemoteStorageLauncherFakeItemProxy().LCHRecipeCallback(), undefined);
		});

	});

});

describe('OLSKRemoteStorageLauncherItemFakeFlipConnected', function test_OLSKRemoteStorageLauncherItemFakeFlipConnected() {

	it('throws if not object', function () {
		throws(function () {
			mod.OLSKRemoteStorageLauncherItemFakeFlipConnected(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns object', function () {
		const item = mod.OLSKRemoteStorageLauncherItemFakeFlipConnected({});
		deepEqual(item, {
			LCHRecipeName: 'OLSKRemoteStorageLauncherItemFakeFlipConnected',
			LCHRecipeCallback: item.LCHRecipeCallback,
		});
	});

	context('LCHRecipeCallback', function () {
		
		it('moves _ValueOLSKRemoteStorage to __ValueOLSKRemoteStorage', function () {
			const _ValueOLSKRemoteStorage = uStorage();

			const item = {
				_ValueOLSKRemoteStorage,
				OLSKRemoteStorageLauncherItemFakeFlipConnectedDidFinish: (function () {}),
			};

			mod.OLSKRemoteStorageLauncherItemFakeFlipConnected(item).LCHRecipeCallback();

			deepEqual(item.__ValueOLSKRemoteStorage, _ValueOLSKRemoteStorage);
		});
		
		it('sets _ValueOLSKRemoteStorage', function () {
			const _mod = {
				_ValueOLSKRemoteStorage: uStorage(),
				OLSKRemoteStorageLauncherItemFakeFlipConnectedDidFinish: (function () {}),
			};

			mod.OLSKRemoteStorageLauncherItemFakeFlipConnected(_mod).LCHRecipeCallback();

			deepEqual(_mod._ValueOLSKRemoteStorage, _mod.__ValueOLSKRemoteStorage.access.scopes.reduce(function (coll, item) {
					return Object.assign(coll, {
						[item.name]: _mod.__ValueOLSKRemoteStorage[item.name],
					});
				}, uStorage({
				access: _mod.__ValueOLSKRemoteStorage.access,
				connected: true,
				remote: {
					userAddress: 'OLSK_REMOTE_STORAGE_FAKE_REMOTE_ADDRESS',
					token: 'OLSK_REMOTE_STORAGE_FAKE_REMOTE_TOKEN',
				},
			})));
		});
		
		it('unsets _ValueOLSKRemoteStorage if __ValueOLSKRemoteStorage', function () {
			const __ValueOLSKRemoteStorage =uStorage();
			const item = {
				__ValueOLSKRemoteStorage,
				OLSKRemoteStorageLauncherItemFakeFlipConnectedDidFinish: (function () {}),
			};

			mod.OLSKRemoteStorageLauncherItemFakeFlipConnected(item).LCHRecipeCallback();

			deepEqual(item._ValueOLSKRemoteStorage, __ValueOLSKRemoteStorage);
		});

	});

});

describe('OLSKRemoteStorageLauncherItemOpenLoginLink', function test_OLSKRemoteStorageLauncherItemOpenLoginLink() {

	it('throws if param1 not window', function () {
		throws(function () {
			mod.OLSKRemoteStorageLauncherItemOpenLoginLink({}, uStorage(), uLocalized);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not storageClient', function () {
		throws(function () {
			mod.OLSKRemoteStorageLauncherItemOpenLoginLink(uWindow(), {}, uLocalized);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param3 not OLSKLocalized', function () {
		throws(function () {
			mod.OLSKRemoteStorageLauncherItemOpenLoginLink(uWindow(), uStorage(), null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns object', function () {
		const item = mod.OLSKRemoteStorageLauncherItemOpenLoginLink(uWindow(), uStorage(), uLocalized);

		deepEqual(item, {
			LCHRecipeSignature: 'OLSKRemoteStorageLauncherItemOpenLoginLink',
			LCHRecipeName: uLocalized('OLSKRemoteStorageLauncherItemOpenLoginLinkText'),
			LCHRecipeCallback: item.LCHRecipeCallback,
			LCHRecipeIsExcluded: item.LCHRecipeIsExcluded,
		});
	});

	context('LCHRecipeCallback', function () {

		it('returns undefined', function () {
			deepEqual(mod.OLSKRemoteStorageLauncherItemOpenLoginLink(uWindow(), uStorage(), uLocalized).LCHRecipeCallback(), undefined);
		});

		it('calls prompt', function () {
			const item = [];

			mod.OLSKRemoteStorageLauncherItemOpenLoginLink(uWindow({
				prompt () {
					item.push(...arguments);
				},
			}), uStorage(), uLocalized).LCHRecipeCallback();

			deepEqual(item, [uLocalized('OLSKRemoteStorageLauncherItemOpenLoginLinkPromptText')]);
		});

		it('skips set location if prompt empty', function () {
			const item = {};

			mod.OLSKRemoteStorageLauncherItemOpenLoginLink(uWindow({
				location: item,
			}), uStorage(), uLocalized).LCHRecipeCallback();

			deepEqual(item, {});
		});

		it('sets location to prompt then calls reload', function () {
			const item = {};

			mod.OLSKRemoteStorageLauncherItemOpenLoginLink(uWindow({
				prompt () {
					return 'bravo';
				},
				location: {
					href: 'alfa',
					reload () {
						item.charlie = this.href;
					},
				},
			}), uStorage(), uLocalized).LCHRecipeCallback();

			deepEqual(item, {
				charlie: 'bravo',
			});
		});

	});

	context('LCHRecipeIsExcluded', function () {

		it('returns true if storageClient.connected', function () {
			deepEqual(mod.OLSKRemoteStorageLauncherItemOpenLoginLink(uWindow(), uStorage({
				connected: true,
			}), uLocalized).LCHRecipeIsExcluded(), true);
		});

		it('returns false', function () {
			deepEqual(mod.OLSKRemoteStorageLauncherItemOpenLoginLink(uWindow(), uStorage(), uLocalized).LCHRecipeIsExcluded(), false);
		});

	});

});

describe('OLSKRemoteStorageLauncherItemCopyLoginLink', function test_OLSKRemoteStorageLauncherItemCopyLoginLink() {

	it('throws if param1 not window', function () {
		throws(function () {
			mod.OLSKRemoteStorageLauncherItemCopyLoginLink({}, uStorage(), uLocalized);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not storageClient', function () {
		throws(function () {
			mod.OLSKRemoteStorageLauncherItemCopyLoginLink(uWindow(), {}, uLocalized);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param3 not OLSKLocalized', function () {
		throws(function () {
			mod.OLSKRemoteStorageLauncherItemCopyLoginLink(uWindow(), uStorage(), null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns object', function () {
		const item = mod.OLSKRemoteStorageLauncherItemCopyLoginLink(uWindow(), uStorage(), uLocalized);

		deepEqual(item, {
			LCHRecipeSignature: 'OLSKRemoteStorageLauncherItemCopyLoginLink',
			LCHRecipeName: uLocalized('OLSKRemoteStorageLauncherItemCopyLoginLinkText'),
			LCHRecipeCallback: item.LCHRecipeCallback,
			LCHRecipeIsExcluded: item.LCHRecipeIsExcluded,
		});
	});

	context('LCHRecipeCallback', function () {

		it('returns LCHCopyToClipboard with link', function () {
			deepEqual(mod.OLSKRemoteStorageLauncherItemCopyLoginLink(uWindow({
				location: {
					href: 'alfa######',
				},
			}), uStorage({
				remote: {
					userAddress: 'bravo',
					token: 'charlie',
				},
			}), uLocalized).LCHRecipeCallback.call({
				api: {
					LCHCopyToClipboard () {
						return [...arguments];
					},
				},
			}), ['alfa#remotestorage=bravo&access_token=charlie']);
		});

	});

	context('LCHRecipeIsExcluded', function () {

		it('returns false if storageClient.connected', function () {
			deepEqual(mod.OLSKRemoteStorageLauncherItemCopyLoginLink(uWindow(), uStorage({
				connected: true,
			}), uLocalized).LCHRecipeIsExcluded(), false);
		});

		it('returns true', function () {
			deepEqual(mod.OLSKRemoteStorageLauncherItemCopyLoginLink(uWindow(), uStorage(), uLocalized).LCHRecipeIsExcluded(), true);
		});

	});

});

describe('OLSKRemoteStorageLauncherItemDebugFlushData', function test_OLSKRemoteStorageLauncherItemDebugFlushData() {

	it('throws if param1 not window', function () {
		throws(function () {
			mod.OLSKRemoteStorageLauncherItemDebugFlushData({}, uStorage(), uLocalized);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not storageClient', function () {
		throws(function () {
			mod.OLSKRemoteStorageLauncherItemDebugFlushData(uWindow(), {}, uLocalized);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param3 not OLSKLocalized', function () {
		throws(function () {
			mod.OLSKRemoteStorageLauncherItemOpenLoginLink(uWindow(), uStorage(), null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns object', function () {
		const item = mod.OLSKRemoteStorageLauncherItemDebugFlushData(uWindow(), uStorage(), uLocalized);

		deepEqual(item, {
			LCHRecipeSignature: 'OLSKRemoteStorageLauncherItemDebugFlushData',
			LCHRecipeName: uLocalized('OLSKRemoteStorageLauncherItemDebugFlushDataText'),
			LCHRecipeCallback: item.LCHRecipeCallback,
			LCHRecipeIsExcluded: item.LCHRecipeIsExcluded,
		});
	});

	context('LCHRecipeCallback', function () {

		it('calls confirm', function () {
			const item = [];

			mod.OLSKRemoteStorageLauncherItemDebugFlushData(uWindow({
				confirm () {
					item.push(...arguments);
				},
			}), uStorage(), uLocalized).LCHRecipeCallback();

			deepEqual(item, [uLocalized('OLSKRemoteStorageLauncherItemDebugFlushDataConfirmText')]);
		});

		it('skips flush if confirm false', function () {
			const item = {};

			mod.OLSKRemoteStorageLauncherItemDebugFlushData(uWindow(), uStorage({
				alfa: {
					__HOTFIX: {
						__OLSKRemoteStorageHotfixFlushData: (function () {
							item.bravo = 'charlie';
						}),
					},
				},
			}), uLocalized).LCHRecipeCallback();

			deepEqual(item, {});
		});

		it('calls flush then reload', async function () {
			const item = {};

			await mod.OLSKRemoteStorageLauncherItemDebugFlushData(uWindow({
				confirm () {
					return true;
				},
				location: {
					reload () {
						item.delta = item.bravo;
					},
				},
			}), uStorage({
				alfa: {
					__HOTFIX: {
						__OLSKRemoteStorageHotfixFlushData: (async function () {
							item.bravo = 'charlie';
						}),
					},
				},
			}), uLocalized).LCHRecipeCallback();

			deepEqual(item, {
				bravo: 'charlie',
				delta: 'charlie',
			});
		});

	});

	context('LCHRecipeIsExcluded', function () {

		it('returns false if storageClient.connected', function () {
			deepEqual(mod.OLSKRemoteStorageLauncherItemDebugFlushData(uWindow(), uStorage({
				connected: true,
			}), uLocalized).LCHRecipeIsExcluded(), false);
		});

		it('returns true', function () {
			deepEqual(mod.OLSKRemoteStorageLauncherItemDebugFlushData(uWindow(), uStorage(), uLocalized).LCHRecipeIsExcluded(), true);
		});

	});

});

describe('OLSKRemoteStorageRecipes', function test_OLSKRemoteStorageRecipes() {

	const _OLSKRemoteStorageRecipes = function (inputData = {}) {
		return mod.OLSKRemoteStorageRecipes(Object.assign({
			ParamWindow: uWindow(),
			ParamStorage: uStorage(),
			OLSKLocalized: uLocalized,
			ParamMod: {},
			ParamSpecUI: false,
		}, inputData))
	};

	it('throws if not object', function () {
		throws(function () {
			mod.OLSKRemoteStorageRecipes(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if ParamMod not object', function () {
		throws(function () {
			_OLSKRemoteStorageRecipes({
				ParamMod: null,
			});
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if ParamSpecUI not boolean', function () {
		throws(function () {
			_OLSKRemoteStorageRecipes({
				ParamSpecUI: null,
			});
		}, /OLSKErrorInputNotValid/);
	});

	it('includes production recipes', function () {
		deepEqual(_OLSKRemoteStorageRecipes().map(function (e) {
			return e.LCHRecipeSignature || e.LCHRecipeName;
		}), Object.keys(mod).filter(function (e) {
			return e.match(/Launcher/) && !e.match(/Fake/);
		}));
	});

	context('ParamSpecUI', function () {

		it('includes all recipes', function () {
			deepEqual(_OLSKRemoteStorageRecipes({
				ParamSpecUI: true,
			}).map(function (e) {
				return e.LCHRecipeSignature || e.LCHRecipeName;
			}), Object.keys(mod).filter(function (e) {
				return e.match(/Launcher/);
			}));
		});
	
	});

});
