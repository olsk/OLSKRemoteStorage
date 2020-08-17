const { throws, rejects, deepEqual } = require('assert');

const mainModule = require('./main.js');

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
			'OLSKChangeDelegateConflict',
		]);
	});

});

describe('OLSKRemoteStorageChangeDelegateProperty', function test_OLSKRemoteStorageChangeDelegateProperty() {

	it('returns undefined', function() {
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateProperty(), undefined);
	});

	it('returns undefined if window', function() {
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateProperty(StubChangeObjectWindow()), undefined);
	});

	it('returns undefined if local init', function() {
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateProperty(StubChangeObjectLocalInit()), undefined);
	});

	it('returns string if remote create', function() {
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateProperty(StubChangeObjectRemoteCreate()), 'OLSKChangeDelegateCreate');
	});

	it('returns string if remote update', function() {
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateProperty(StubChangeObjectRemoteUpdate()), 'OLSKChangeDelegateUpdate');
	});

	it('returns string if remote delete', function() {
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateProperty(StubChangeObjectRemoteDelete()), 'OLSKChangeDelegateDelete');
	});

	it('returns string if conflict', function() {
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateProperty(StubChangeObjectConflict()), 'OLSKChangeDelegateConflict');
	});

});

describe('OLSKRemoteStorageChangeDelegateInput', function test_OLSKRemoteStorageChangeDelegateInput() {

	it('throws if not valid', function() {
		throws(function () {
			mainModule.OLSKRemoteStorageChangeDelegateInput('alfa');
		}, /OLSKErrorInputNotValid/);
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

describe('OLSKRemoteStorageChangeDelegateData', function test_OLSKRemoteStorageChangeDelegateData() {

	it('throws if param1 not valid', function() {
		throws(function () {
			mainModule.OLSKRemoteStorageChangeDelegateData('alfa', StubChangeObjectRemoteCreate());
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not valid', function() {
		throws(function () {
			mainModule.OLSKRemoteStorageChangeDelegateData('alfa', Object.assign(StubChangeObjectRemoteCreate(), {
				origin: null,
			}));
		}, /OLSKErrorInputNotValid/);
	});

	it('returns newValue if OLSKChangeDelegateCreate', function() {
		const item = StubChangeObjectRemoteCreate();
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateData('OLSKChangeDelegateCreate', item), item.newValue);
	});

	it('returns newValue if OLSKChangeDelegateUpdate', function() {
		const item = StubChangeObjectRemoteUpdate();
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateData('OLSKChangeDelegateUpdate', item), item.newValue);
	});

	it('returns oldValue if OLSKChangeDelegateDelete', function() {
		const item = StubChangeObjectRemoteDelete();
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateData('OLSKChangeDelegateDelete', item), item.oldValue);
	});

	it('returns param2 if OLSKChangeDelegateConflict', function() {
		const item = StubChangeObjectConflict();
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateData('OLSKChangeDelegateConflict', item), item);
	});

});

describe('OLSKRemoteStorageChangeDelegateConflictSelectRecent', function test_OLSKRemoteStorageChangeDelegateConflictSelectRecent() {

	it('throws if not valid', function() {
		throws(function () {
			mainModule.OLSKRemoteStorageChangeDelegateConflictSelectRecent(StubChangeObjectRemoteCreate());
		}, /OLSKErrorInputNotValid/);
	});

	it('returns newValue if no *ModificationDate', function() {
		const item = JSON.parse(JSON.stringify(StubChangeObjectConflict()).split('ModificationDate').join('AlfaDate'));
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateConflictSelectRecent(item), item.newValue);
	});

	it('returns newValue if *ModificationDate and newer', function() {
		const item = StubChangeObjectConflict();

		item.newValue.KVCNoteModificationDate = (new Date()).toJSON();
		
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateConflictSelectRecent(item), item.newValue);
	});

	it('returns oldValue if *ModificationDate and newer', function() {
		const item = StubChangeObjectConflict();
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateConflictSelectRecent(item), item.oldValue);
	});

});

describe('OLSKRemoteStorageStatus', function test_OLSKRemoteStorageStatus() {

	it('throws error if param1 not object', function() {
		throws(function() {
			mainModule.OLSKRemoteStorageStatus(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param1 no event method', function() {
		throws(function() {
			mainModule.OLSKRemoteStorageStatus({});
		}, /OLSKErrorInputNotValid/);
	});

	it('throws error if param2 not function', function() {
		throws(function() {
			mainModule.OLSKRemoteStorageStatus(StubEventListener(), null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns undefined', function() {
		deepEqual(mainModule.OLSKRemoteStorageStatus(StubEventListener(), function () {}), undefined);
	});

	it('returns string on connected', function() {
		let item;
		mainModule.OLSKRemoteStorageStatus(StubEventListener('connected'), function (inputData) {
			item = inputData;
		});
		deepEqual(item, 'OLSKRemoteStorageStatusOnline');
	});

	it('returns string on network-offline', function() {
		let item;
		mainModule.OLSKRemoteStorageStatus(StubEventListener('network-offline'), function (inputData) {
			item = inputData;
		});
		deepEqual(item, 'OLSKRemoteStorageStatusNetworkOffline');
	});

	it('returns string on network-online', function() {
		let item;
		mainModule.OLSKRemoteStorageStatus(StubEventListener('network-online'), function (inputData) {
			item = inputData;
		});
		deepEqual(item, 'OLSKRemoteStorageStatusOnline');
	});

	it('returns string on error', function() {
		let item;
		mainModule.OLSKRemoteStorageStatus(StubEventListener('error'), function (inputData) {
			item = inputData;
		});
		deepEqual(item, 'OLSKRemoteStorageStatusError');
	});

	it('ignores SyncError on network-offline', function() {
		let item = [];
		mainModule.OLSKRemoteStorageStatus({
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
		mainModule.OLSKRemoteStorageStatus({
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
		mainModule.OLSKRemoteStorageStatus({
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
		mainModule.OLSKRemoteStorageStatus(StubEventListener('disconnected'), function (inputData) {
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
		deepEqual(mainModule.OLSKRemoteStorageIsCollection(Object.assign(StubCollectionObjectValid(), {
			OLSKRemoteStorageCollectionName: null,
		})), false);
	});

	it('returns false if OLSKRemoteStorageCollectionName not filled', function() {
		deepEqual(mainModule.OLSKRemoteStorageIsCollection(Object.assign(StubCollectionObjectValid(), {
			OLSKRemoteStorageCollectionName: ' ',
		})), false);
	});

	it('returns false if OLSKRemoteStorageCollectionType not string', function() {
		deepEqual(mainModule.OLSKRemoteStorageIsCollection(Object.assign(StubCollectionObjectValid(), {
			OLSKRemoteStorageCollectionType: null,
		})), false);
	});

	it('returns false if OLSKRemoteStorageCollectionType not filled', function() {
		deepEqual(mainModule.OLSKRemoteStorageIsCollection(Object.assign(StubCollectionObjectValid(), {
			OLSKRemoteStorageCollectionType: ' ',
		})), false);
	});

	it('returns false if OLSKRemoteStorageCollectionModelErrors not object', function() {
		deepEqual(mainModule.OLSKRemoteStorageIsCollection(Object.assign(StubCollectionObjectValid(), {
			OLSKRemoteStorageCollectionModelErrors: null,
		})), false);
	});

	it('returns false if OLSKRemoteStorageCollectionExports not object', function() {
		deepEqual(mainModule.OLSKRemoteStorageIsCollection(Object.assign(StubCollectionObjectValid(), {
			OLSKRemoteStorageCollectionExports: null,
		})), false);
	});

	it('returns true', function() {
		deepEqual(mainModule.OLSKRemoteStorageIsCollection(StubCollectionObjectValid()), true);
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

					it('calls param1.declareType', function () {
						const item = [];
						
						generator([function () {
							return Object.assign(StubCollectionObjectValid(), {
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
								return Object.assign(StubCollectionObjectValid(), {
									OLSKRemoteStorageCollectionName: 'bravo',
									OLSKRemoteStorageCollectionExports: {
										charlie: 'delta'
									},
								});
							}]).builder(uInputValid()).exports.bravo, {
								charlie: 'delta',
							})
						});
						
						it('sets excludes __DEBUG if no option.OLSKOptionIncludeDebug', function () {
							deepEqual(typeof mainModule.OLSKRemoteStorageDataModuleGenerator('alfa')([function () {
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

describe('OLSKRemoteStorageListing', function test_OLSKRemoteStorageListing() {

	let privateClient;

	before(function () {
		privateClient = mainModule._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule);
	});

	it('rejects if not path', async function() {
		await rejects(mainModule.OLSKRemoteStorageListing(privateClient, null), /OLSKErrorInputNotValid/);
	});

	it('returns array', async function() {
		deepEqual(await mainModule.OLSKRemoteStorageListing(privateClient, 'alfa'), []);
	});

	it('includes document at root', async function() {
		await mainModule._TestWrite(OLSKTestingStorageModule, 'alfa', 'bravo');

		deepEqual(await mainModule.OLSKRemoteStorageListing(privateClient, ''), ['alfa']);
	});

	it('includes folder at root', async function() {
		await mainModule._TestWrite(OLSKTestingStorageModule, 'alfa/bravo', 'charlie');

		deepEqual(await mainModule.OLSKRemoteStorageListing(privateClient, ''), ['alfa/']);
	});

	it('accepts array', async function() {
		await mainModule._TestWrite(OLSKTestingStorageModule, 'alfa/bravo', 'charlie');
		await mainModule._TestWrite(OLSKTestingStorageModule, 'alfa/bravo/charlie', 'delta');

		deepEqual(await mainModule.OLSKRemoteStorageListing(privateClient, await mainModule.OLSKRemoteStorageListing(privateClient, '')), [
			'alfa/bravo',
			'alfa/bravo/'
			]);
	});

});

describe('OLSKRemoteStorageListingRecursive', function test_OLSKRemoteStorageListingRecursive() {

	let privateClient;

	before(function () {
		privateClient = mainModule._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule);
	});

	it('rejects if not path', async function() {
		await rejects(mainModule.OLSKRemoteStorageListingRecursive(privateClient, null), /OLSKErrorInputNotValid/);
	});

	it('returns array', async function() {
		deepEqual(await mainModule.OLSKRemoteStorageListingRecursive(privateClient, 'alfa'), []);
	});

	it('includes document at root', async function() {
		await mainModule._TestWrite(OLSKTestingStorageModule, 'alfa', 'bravo');

		deepEqual(await mainModule.OLSKRemoteStorageListingRecursive(privateClient, ''), ['alfa']);
	});

	it('includes document at subfolder', async function() {
		await mainModule._TestWrite(OLSKTestingStorageModule, 'alfa/bravo', 'charlie');

		deepEqual(await mainModule.OLSKRemoteStorageListingRecursive(privateClient, ''), ['alfa/bravo']);
	});

});

describe('_TestWrite', function test__TestWrite() {

	it('rejects if param1 not path', async function() {
		await rejects(mainModule._TestWrite(OLSKTestingStorageModule, null, 'alfa'), /OLSKErrorInputNotValid/);
	});

	it('rejects if param2 not string', async function() {
		await rejects(mainModule._TestWrite(OLSKTestingStorageModule, 'alfa', null), /OLSKErrorInputNotValid/);
	});

	it('returns undefined', async function() {
		deepEqual(typeof await mainModule._TestWrite(OLSKTestingStorageModule, 'alfa', 'bravo'), 'undefined');
	});

});

describe('_TestRead', function test__TestRead() {

	it('rejects if not path', async function() {
		await rejects(mainModule._TestRead(OLSKTestingStorageModule, null), /OLSKErrorInputNotValid/);
	});

	it('returns null if no data', async function() {
		deepEqual(await mainModule._TestRead(OLSKTestingStorageModule, 'alfa'), null);
	});

	it('returns data', async function() {
		await mainModule._TestWrite(OLSKTestingStorageModule, 'alfa', 'bravo')

		deepEqual(await mainModule._TestRead(OLSKTestingStorageModule, 'alfa'), 'bravo');
	});

});

describe('_TestReset', function test__TestReset() {

	it('returns array', async function() {
		deepEqual(await mainModule._TestReset(OLSKTestingStorageModule), []);
	});

	it('deletes document at root', async function() {
		await mainModule._TestWrite(OLSKTestingStorageModule, 'alfa', 'bravo');

		await mainModule._TestReset(OLSKTestingStorageModule)

		deepEqual(await mainModule.OLSKRemoteStorageListing(mainModule._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule), ''), []);
	});

	it('deletes document at folder', async function() {
		await mainModule._TestWrite(OLSKTestingStorageModule, 'alfa/bravo', 'charlie');

		await mainModule._TestReset(OLSKTestingStorageModule)

		deepEqual(await mainModule.OLSKRemoteStorageListing(mainModule._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule), ''), []);
	});

	it('deletes document at subfolder', async function() {
		await mainModule._TestWrite(OLSKTestingStorageModule, 'alfa/bravo/charlie', 'delta');

		await mainModule._TestReset(OLSKTestingStorageModule)

		deepEqual(await mainModule.OLSKRemoteStorageListing(mainModule._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule), 'alfa/'), []);
	});

});

describe('_OLSKRemoteStoragePrivateClient', function test__OLSKRemoteStoragePrivateClient() {

	it('returns object', function() {
		deepEqual(typeof mainModule._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule), 'object');
		deepEqual(mainModule._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModule), OLSKTestingStorageModule.__DEBUG.__OLSKRemoteStoragePrivateClient());
	});
});

describe('_OLSKRemoteStoragePublicClient', function test__OLSKRemoteStoragePublicClient() {

	it('returns object', function() {
		deepEqual(typeof mainModule._OLSKRemoteStoragePublicClient(OLSKTestingStorageModule), 'object');
		deepEqual(mainModule._OLSKRemoteStoragePublicClient(OLSKTestingStorageModule), OLSKTestingStorageModule.__DEBUG.__OLSKRemoteStoragePublicClient());
	});

});

describe('OLSKRemoteStorageSafeCopy', function test_OLSKRemoteStorageSafeCopy() {

	const item = {
		alfa: 'bravo',
		$charlie: 'delta',
	};
	
	it('returns object', function () {
		deepEqual(mainModule.OLSKRemoteStorageSafeCopy(item).alfa, 'bravo');
	});

	it('creates copy', function () {
		deepEqual(mainModule.OLSKRemoteStorageSafeCopy(item) !== item, true);
	});
	
	it('ignores $dynamic fields', function () {
		deepEqual(mainModule.OLSKRemoteStorageSafeCopy(item).$charlie, undefined);
	});

});

describe('OLSKRemoteStoragePreJSONSchemaValidate', function test_OLSKRemoteStoragePreJSONSchemaValidate() {

	it('returns input', function() {
		deepEqual(mainModule.OLSKRemoteStoragePreJSONSchemaValidate({}), {});
	});

	it('returns input with *Date as string', function() {
		deepEqual(mainModule.OLSKRemoteStoragePreJSONSchemaValidate({
			alfaDate: new Date('2018-12-09T19:07:01.902Z'),
		}), {
			alfaDate: '2018-12-09T19:07:01.902Z',
		});
	});

	it('returns input with Array *Date as string', function() {
		deepEqual(mainModule.OLSKRemoteStoragePreJSONSchemaValidate({
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
		deepEqual(mainModule.OLSKRemoteStoragePostJSONParse(null), null);
	});

	it('returns input object', function() {
		deepEqual(mainModule.OLSKRemoteStoragePostJSONParse({}), {});
	});

	it('returns input with *Date as date', function() {
		deepEqual(mainModule.OLSKRemoteStoragePostJSONParse({
			alfaDate: '2018-12-09T19:07:01.902Z',
		}), {
			alfaDate: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

	it('returns input with Array *Date as date', function() {
		deepEqual(mainModule.OLSKRemoteStoragePostJSONParse({
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

});
