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

	const _OLSKRemoteStorageLauncherItemOpenLoginLink = function (inputData = {}) {
		return mod.OLSKRemoteStorageLauncherItemOpenLoginLink(Object.assign({
			ParamStorage: uStorage(),
			OLSKLocalized: uLocalized,
		}, inputData), {
			DebugWindow: inputData.DebugWindow || uWindow(),
		});
	};

	it('throws if not object', function () {
		throws(function () {
			mod.OLSKRemoteStorageLauncherItemOpenLoginLink(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if ParamStorage not storageClient', function () {
		throws(function () {
			_OLSKRemoteStorageLauncherItemOpenLoginLink({
				ParamStorage: {},
			});
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if OLSKLocalized not function', function () {
		throws(function () {
			_OLSKRemoteStorageLauncherItemOpenLoginLink({
				OLSKLocalized: null,
			});
		}, /OLSKErrorInputNotValid/);
	});

	it('returns object', function () {
		const item = _OLSKRemoteStorageLauncherItemOpenLoginLink();

		deepEqual(item, {
			LCHRecipeSignature: 'OLSKRemoteStorageLauncherItemOpenLoginLink',
			LCHRecipeName: uLocalized('OLSKRemoteStorageLauncherItemOpenLoginLinkText'),
			LCHRecipeCallback: item.LCHRecipeCallback,
			LCHRecipeIsExcluded: item.LCHRecipeIsExcluded,
		});
	});

	context('LCHRecipeCallback', function () {

		it('returns undefined', function () {
			deepEqual(_OLSKRemoteStorageLauncherItemOpenLoginLink().LCHRecipeCallback(), undefined);
		});

		it('calls prompt', function () {
			const item = [];

			_OLSKRemoteStorageLauncherItemOpenLoginLink({
				DebugWindow: uWindow({
					prompt () {
						item.push(...arguments);
					},
				}),
			}).LCHRecipeCallback();

			deepEqual(item, [uLocalized('OLSKRemoteStorageLauncherItemOpenLoginLinkPromptText')]);
		});

		it('skips set location if prompt empty', function () {
			const item = {};

			_OLSKRemoteStorageLauncherItemOpenLoginLink({
				DebugWindow: uWindow({
					location: item,
				}),
			}).LCHRecipeCallback();

			deepEqual(item, {});
		});

		it('sets location to prompt then calls reload', function () {
			const item = {};

			_OLSKRemoteStorageLauncherItemOpenLoginLink({
				DebugWindow: uWindow({
					prompt () {
						return 'bravo';
					},
					location: {
						href: 'alfa',
						reload () {
							item.charlie = this.href;
						},
					},
				}),
			}).LCHRecipeCallback();

			deepEqual(item, {
				charlie: 'bravo',
			});
		});

	});

	context('LCHRecipeIsExcluded', function () {

		it('returns true if storageClient.connected', function () {
			deepEqual(_OLSKRemoteStorageLauncherItemOpenLoginLink({
				ParamStorage: uStorage({
					connected: true,
				}),
			}).LCHRecipeIsExcluded(), true);
		});

		it('returns false', function () {
			deepEqual(_OLSKRemoteStorageLauncherItemOpenLoginLink().LCHRecipeIsExcluded(), false);
		});

	});

});

describe('OLSKRemoteStorageLauncherItemCopyLoginLink', function test_OLSKRemoteStorageLauncherItemCopyLoginLink() {

	const _OLSKRemoteStorageLauncherItemCopyLoginLink = function (inputData = {}) {
		return mod.OLSKRemoteStorageLauncherItemCopyLoginLink(Object.assign({
			ParamStorage: uStorage(),
			OLSKLocalized: uLocalized,
		}, inputData), {
			DebugWindow: inputData.DebugWindow || uWindow(),
		});
	};

	it('throws if not object', function () {
		throws(function () {
			mod.OLSKRemoteStorageLauncherItemCopyLoginLink(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if ParamStorage not storageClient', function () {
		throws(function () {
			_OLSKRemoteStorageLauncherItemCopyLoginLink({
				ParamStorage: {},
			});
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if OLSKLocalized not function', function () {
		throws(function () {
			_OLSKRemoteStorageLauncherItemCopyLoginLink({
				OLSKLocalized: null,
			});
		}, /OLSKErrorInputNotValid/);
	});

	it('returns object', function () {
		const item = _OLSKRemoteStorageLauncherItemCopyLoginLink();

		deepEqual(item, {
			LCHRecipeSignature: 'OLSKRemoteStorageLauncherItemCopyLoginLink',
			LCHRecipeName: uLocalized('OLSKRemoteStorageLauncherItemCopyLoginLinkText'),
			LCHRecipeCallback: item.LCHRecipeCallback,
			LCHRecipeIsExcluded: item.LCHRecipeIsExcluded,
		});
	});

	context('LCHRecipeCallback', function () {

		it('returns LCHCopyToClipboard with link', function () {
			deepEqual(_OLSKRemoteStorageLauncherItemCopyLoginLink({
				ParamStorage: uStorage({
					remote: {
						userAddress: 'bravo',
						token: 'charlie',
					},
				}),
				DebugWindow: uWindow({
					location: {
						href: 'alfa######',
					},
				}),
			}).LCHRecipeCallback.call({
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
			deepEqual(_OLSKRemoteStorageLauncherItemCopyLoginLink({
				ParamStorage: uStorage({
					connected: true,
				}),
			}).LCHRecipeIsExcluded(), false);
		});

		it('returns true', function () {
			deepEqual(_OLSKRemoteStorageLauncherItemCopyLoginLink().LCHRecipeIsExcluded(), true);
		});

	});

});

describe('OLSKRemoteStorageLauncherItemDebugFlushData', function test_OLSKRemoteStorageLauncherItemDebugFlushData() {

	const _OLSKRemoteStorageLauncherItemDebugFlushData = function (inputData = {}) {
		return mod.OLSKRemoteStorageLauncherItemDebugFlushData(Object.assign({
			ParamStorage: uStorage(),
			OLSKLocalized: uLocalized,
		}, inputData), {
			DebugWindow: inputData.DebugWindow || uWindow(),
		});
	};

	it('throws if not object', function () {
		throws(function () {
			mod.OLSKRemoteStorageLauncherItemDebugFlushData(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if ParamStorage not storageClient', function () {
		throws(function () {
			_OLSKRemoteStorageLauncherItemDebugFlushData({
				ParamStorage: {},
			});
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if OLSKLocalized not function', function () {
		throws(function () {
			_OLSKRemoteStorageLauncherItemDebugFlushData({
				OLSKLocalized: null,
			});
		}, /OLSKErrorInputNotValid/);
	});

	it('returns object', function () {
		const item = _OLSKRemoteStorageLauncherItemDebugFlushData();

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

			_OLSKRemoteStorageLauncherItemDebugFlushData({
				DebugWindow: uWindow({
					confirm () {
						item.push(...arguments);
					},
				}),
			}).LCHRecipeCallback();

			deepEqual(item, [uLocalized('OLSKRemoteStorageLauncherItemDebugFlushDataConfirmText')]);
		});

		it('skips flush if confirm false', function () {
			const item = {};

			_OLSKRemoteStorageLauncherItemDebugFlushData({
				ParamStorage: uStorage({
					alfa: {
						__HOTFIX: {
							__OLSKRemoteStorageHotfixFlushData: (function () {
								item.bravo = 'charlie';
							}),
						},
					},
				}),
			}).LCHRecipeCallback();

			deepEqual(item, {});
		});

		it('calls flush then reload', async function () {
			const item = {};

			await _OLSKRemoteStorageLauncherItemDebugFlushData({
				ParamStorage: uStorage({
					alfa: {
						__HOTFIX: {
							__OLSKRemoteStorageHotfixFlushData: (async function () {
								item.bravo = 'charlie';
							}),
						},
					},
				}),
				DebugWindow: uWindow({
					confirm () {
						return true;
					},
					location: {
						reload () {
							item.delta = item.bravo;
						},
					},
				}),
			}).LCHRecipeCallback();

			deepEqual(item, {
				bravo: 'charlie',
				delta: 'charlie',
			});
		});

	});

	context('LCHRecipeIsExcluded', function () {

		it('returns false if storageClient.connected', function () {
			deepEqual(_OLSKRemoteStorageLauncherItemDebugFlushData({
				ParamStorage: uStorage({
					connected: true,
				}),
			}).LCHRecipeIsExcluded(), false);
		});

		it('returns true', function () {
			deepEqual(_OLSKRemoteStorageLauncherItemDebugFlushData().LCHRecipeIsExcluded(), true);
		});

	});

});

describe('OLSKRemoteStorageRecipes', function test_OLSKRemoteStorageRecipes() {

	const _OLSKRemoteStorageRecipes = function (inputData = {}) {
		return mod.OLSKRemoteStorageRecipes(Object.assign({
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
