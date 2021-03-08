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

						context('OLSKRemoteStorageEnableCrypto', function () {

							it('calls _OLSKRemoteStorageEnableCrypto', function () {
								const item = Date.now().toString();

								deepEqual(Object.assign(Object.assign({}, mod), {
									_OLSKRemoteStorageEnableCrypto: (function () {
										return [...arguments];
									}),
								}).OLSKRemoteStorageDataModuleGenerator(Math.random().toString())([function () {
									return StubCollectionObjectValid();
								}]).builder(uInputValid()).exports.OLSKRemoteStorageEnableCrypto(item).slice(1), [item]);
							});
						
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

describe('_OLSKRemoteStorageEnableCrypto', function test__OLSKRemoteStorageEnableCrypto() {

	const uEncrypt = function (inputData) {
		return inputData + 'ENCRYPTED';
	};

	const uDecrypt = function (inputData) {
		return inputData.split('ENCRYPTED').join('');
	};

	const __OLSKRemoteStorageEnableCrypto = function () {
		return mod._OLSKRemoteStorageEnableCrypto(mod._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModuleFresh()), uEncrypt, uDecrypt);
	};

	it('throws if param1 not privateClient', function () {
		throws(function () {
			mod._OLSKRemoteStorageEnableCrypto({}, uEncrypt, uDecrypt);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param2 not function', function () {
		throws(function () {
			mod._OLSKRemoteStorageEnableCrypto(mod._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModuleFresh()), null, uDecrypt);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if param3 not function', function () {
		throws(function () {
			mod._OLSKRemoteStorageEnableCrypto(mod._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModuleFresh()), uEncrypt, null);
		}, /OLSKErrorInputNotValid/);
	});

	it('backs up data operations', function () {
		const privateClient = mod._OLSKRemoteStoragePrivateClient(OLSKTestingStorageModuleFresh());

		const backup = {
			storeFile: privateClient.storeFile,
			getFile: privateClient.getFile,
			storeObject: privateClient.storeObject,
			getObject: privateClient.getObject,
			getAll: privateClient.getAll,
		};

		const item = mod._OLSKRemoteStorageEnableCrypto(privateClient, uEncrypt, uDecrypt);

		deepEqual(item._OLSKBackupStoreFile, backup.storeFile);
		deepEqual(item._OLSKBackupGetFile, backup.getFile);
		deepEqual(item._OLSKBackupStoreObject, backup.storeObject);
		deepEqual(item._OLSKBackupGetObject, backup.getObject);
		deepEqual(item._OLSKBackupGetAll, backup.getAll);
	});

	context('storeFile', function () {
		
		it('calls param2', async function () {
			const privateClient = __OLSKRemoteStorageEnableCrypto();
			const contentType = Math.random().toString();
			const path = Math.random().toString();
			const data = Math.random().toString();
			await privateClient.storeFile(contentType, path, data);

			deepEqual(await privateClient._OLSKBackupGetFile(path), {
				contentType: 'multipart/encrypted',
				data: uEncrypt(JSON.stringify({
					type: contentType,
					data,
				})),
				revision: undefined,
			});
		});
	
	});

	context('getFile', function () {
		
		it('calls param3', async function () {
			const privateClient = __OLSKRemoteStorageEnableCrypto();
			const contentType = Math.random().toString();
			const path = Math.random().toString();
			const data = Math.random().toString();
			await privateClient.storeFile(contentType, path, data);

			deepEqual(await privateClient.getFile(path), {
				contentType,
				data,
				revision: undefined,
			});
		});

		it('passes if not encrypted', async function () {
			const privateClient = __OLSKRemoteStorageEnableCrypto();
			const path = Math.random().toString();
			await privateClient._OLSKBackupStoreFile(Math.random().toString(), path, Math.random().toString());

			deepEqual(await privateClient.getFile(path), {
				contentType: undefined,
				data: undefined,
				revision: undefined,
			});
		});
	
	});

	context('storeObject', function () {
		
		it('calls param2', async function () {
			const privateClient = __OLSKRemoteStorageEnableCrypto();
			const type = Math.random().toString();
			const path = Math.random().toString();
			const data = {
				[Math.random().toString()]: Math.random().toString(),
			};
			await privateClient.storeObject(type, path, data);

			deepEqual(await privateClient._OLSKBackupGetFile(path), {
				contentType: 'multipart/encrypted',
				data: uEncrypt(JSON.stringify({
					type,
					data: JSON.stringify(data),
				})),
				revision: undefined,
			});
		});
	
	});

	context('getObject', function () {
		
		it('calls param3', async function () {
			const privateClient = __OLSKRemoteStorageEnableCrypto();
			const type = Math.random().toString();
			const path = Math.random().toString();
			const data = {
				[Math.random().toString()]: Math.random().toString(),
			};
			await privateClient.storeObject(type, path, data);

			deepEqual(await privateClient.getObject(path, false), data);
		});

		it('excludes if not encrypted', async function () {
			const privateClient = __OLSKRemoteStorageEnableCrypto();
			const path = Math.random().toString();
			await privateClient._OLSKBackupStoreFile(Math.random().toString(), path, Math.random().toString());

			deepEqual(await privateClient.getObject(path, false), undefined);
		});
	
	});

	context('getAll', function () {
		
		it.skip('calls param3', async function () {
			const privateClient = __OLSKRemoteStorageEnableCrypto();
			const path = Math.random().toString() + '/';
			const data = Math.random().toString();
			await privateClient.storeFile(Date.now().toString(), path + Math.random().toString(), data);

			deepEqual(Object.values(await privateClient.getAll(path, false)), [data]);
		});

		it('excludes if not encrypted', async function () {
			const privateClient = __OLSKRemoteStorageEnableCrypto();
			const path = Math.random().toString() + '/';
			await privateClient._OLSKBackupStoreFile(Math.random().toString(), path + Math.random().toString(), Math.random().toString());

			deepEqual(await privateClient.getAll(path, false), {});
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
