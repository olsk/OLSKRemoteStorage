const uFlatten = function (inputData) {
	return [].concat.apply([], inputData);
};

const mod = {

	OLSKRemoteStorageJSONSchema (inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		return {
			type: 'object',
			properties: Object.entries(inputData).reduce(function (coll, [key, val]) {
				coll[key] = {};

				coll[key].type = mod._OLSKRemoteStorageInferredType([...val].shift()).replace('filled', 'string');

				if (coll[key].type === 'date') {
					coll[key].type = 'string';
					coll[key].format = 'date-time';
				}

				return coll;
			}, {}),
			required: Object.entries(inputData).filter(function ([key, val]) {
				return !val.includes('__RSOptional');
			}).map(function ([key, val]) {
				return key;
			}),
		};
	},

	_OLSKRemoteStorageInferredType (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		return inputData.replace(/\w+ErrorNot/, '').toLowerCase();
	},

	OLSKRemoteStorageChangeDelegateMethods () {
		return [
			'OLSKChangeDelegateCreate',
			'OLSKChangeDelegateUpdate',
			'OLSKChangeDelegateDelete',
			'OLSKChangeDelegateConflict',
		];
	},

	OLSKRemoteStorageChangeDelegateProperty (inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return;
		}

		if (inputData.origin === 'remote' && typeof inputData.oldValue === 'undefined' && typeof inputData.newValue !== 'undefined') {
			return 'OLSKChangeDelegateCreate';
		}

		if (inputData.origin === 'remote' && typeof inputData.oldValue !== 'undefined' && typeof inputData.newValue !== 'undefined') {
			return 'OLSKChangeDelegateUpdate';
		}

		if (inputData.origin === 'remote' && typeof inputData.oldValue !== 'undefined' && typeof inputData.newValue === 'undefined') {
			return 'OLSKChangeDelegateDelete';
		}

		if (inputData.origin === 'conflict') {
			return 'OLSKChangeDelegateConflict';
		}

		return;
	},

	OLSKRemoteStorageChangeDelegateInput (inputData) {
		console.log('OLSKRemoteStorageChangeDelegateInput DEPRECATED: use OLSKRemoteStorageChangeDelegateData');
		
		if (!mod.OLSKRemoteStorageChangeDelegateMethods().includes(inputData)) {
			throw new Error('OLSKErrorInputNotValid');
		}

		return inputData === 'OLSKChangeDelegateDelete' ? 'oldValue' : 'newValue';
	},

	OLSKRemoteStorageChangeDelegateData (param1, param2) {
		if (!mod.OLSKRemoteStorageChangeDelegateMethods().includes(param1)) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (!param2.origin) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (param1 === 'OLSKChangeDelegateConflict') {
			return param2;
		}

		return param2[param1 === 'OLSKChangeDelegateDelete' ? 'oldValue' : 'newValue'];
	},

	OLSKRemoteStorageChangeDelegateConflictSelectRecent (inputData) {
		if (inputData.origin !== 'conflict') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (Object.entries(inputData.oldValue).filter(function (e) {
			if (!e[0].match('ModificationDate')) {
				return false;
			}

			return e[1] > inputData.newValue[e[0]];
		}).length) {
			return inputData.oldValue;
		}

		return inputData.newValue;
	},

	OLSKRemoteStorageStatus (param1, param2, OLSKLocalized = function (inputData) {
		return inputData;
	}) {
		if (typeof param1 !== 'object' || param1 === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param1.on !== 'function') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param2 !== 'function') {
			throw new Error('OLSKErrorInputNotValid');
		}

		param1.on('connected', function () {
			param2(OLSKLocalized('OLSKRemoteStorageStatusOnline'));
		});

		let isOffline;
		param1.on('network-offline', function () {
			param2(OLSKLocalized('OLSKRemoteStorageStatusNetworkOffline'));

			isOffline = true;
		});

		param1.on('network-online', function () {
			param2(OLSKLocalized('OLSKRemoteStorageStatusOnline'));

			isOffline = false;
		});

		param1.on('error', function (inputData) {
			if (isOffline && inputData.message === 'Sync failed: Network request failed.') {
				return;
			}

			param2(OLSKLocalized('OLSKRemoteStorageStatusError'));
		});

		param1.on('disconnected', function () {
			param2('');
		});
	},

	OLSKRemoteStorageIsCollection (inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof inputData.OLSKRemoteStorageCollectionName !== 'string') {
			return false;
		}

		if (inputData.OLSKRemoteStorageCollectionName.trim() === '') {
			return false;
		}

		if (typeof inputData.OLSKRemoteStorageCollectionExports !== 'object' || inputData.OLSKRemoteStorageCollectionExports === null) {
			return false;
		}

		return true;
	},

	OLSKRemoteStorageDataModuleGenerator (kModuleName, options = {}) {
		if (typeof kModuleName !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (!kModuleName.trim()) {
			throw new Error('OLSKErrorInputNotValid');
		}

		return function (inputData) {
			if (!Array.isArray(inputData)) {
				throw new Error('OLSKErrorInputNotValid');
			}

			return {
				name: kModuleName,
				builder (privateClient, publicClient) {
					const __DEBUG = {

						__TestWriteFileText (param1, param2) {
							if (!mod._OLSKRemoteStorageIsPath(param1)) {
								throw new Error('OLSKErrorInputNotValid');
							}

							if (typeof param2 !== 'string') {
								throw new Error('OLSKErrorInputNotValid');
							}

							return privateClient.storeFile('text/plain', param1, param2);
						},
						
						async __TestReadFileText (inputData) {
							if (!mod._OLSKRemoteStorageIsPath(inputData)) {
								return Promise.reject(new Error('OLSKErrorInputNotValid'));
							}

							return (await privateClient.getFile(inputData, false)).data;
						},
						
						__TestWriteObject (param1, param2) {
							if (!mod._OLSKRemoteStorageIsPath(param1)) {
								throw new Error('OLSKErrorInputNotValid');
							}

							if (typeof param2 !== 'object' || param2 === null) {
								throw new Error('OLSKErrorInputNotValid');
							}

							return mod.OLSKRemoteStorageWriteObject(privateClient, param1, param2);
						},
						
						async __TestReadObject (inputData) {
							if (!mod._OLSKRemoteStorageIsPath(inputData)) {
								return Promise.reject(new Error('OLSKErrorInputNotValid'));
							}

							return await privateClient.getObject(inputData, false);
						},
						
						async __OLSKRemoteStorageReset () {
							return await Promise.all((await mod.OLSKRemoteStorageListingRecursive(privateClient, '')).map(async function (path) {
								return await privateClient.remove(path);
							}));
						},
						
						__OLSKRemoteStoragePrivateClient () {
							return privateClient;
						},
						
						__OLSKRemoteStoragePublicClient () {
							return publicClient;
						},
						
					};

					const __HOTFIX = {

						__OLSKRemoteStorageHotfixPlungeData () {
							return mod.OLSKRemoteStorageObjectsRecursive(privateClient, '', 0);
						},

						__OLSKRemoteStorageHotfixFlushData () {
							return privateClient.flush(`/${ kModuleName }/`)
						},
						
					};

					return {
						exports: inputData.reduce(function (coll, item) {
							const collection = item(privateClient, publicClient, item.OLSKChangeDelegate);

							if (!mod.OLSKRemoteStorageIsCollection(collection)) {
								throw new Error('OLSKErrorInputNotValid');
							}

							coll[collection.OLSKRemoteStorageCollectionName] = collection.OLSKRemoteStorageCollectionExports;

							return coll;
						}, Object.assign(options.OLSKOptionIncludeDebug ? { __DEBUG } : {}, { __HOTFIX })),
					};
				},
			};
		};
	},

	_OLSKRemoteStorageIsPath (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		return !!inputData.trim();
	},

	async OLSKRemoteStorageListing (privateClient, inputData) {
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

	async OLSKRemoteStorageListingRecursive (privateClient, inputData) {
		return uFlatten(await Promise.all((await mod.OLSKRemoteStorageListing(privateClient, inputData)).map(async function (e) {
			return e.slice(-1) == '/' ? await mod.OLSKRemoteStorageListingRecursive(privateClient, e) : e;
		})));
	},

	async OLSKRemoteStorageObjects (privateClient, inputData) {
		if (typeof inputData !== 'string') {
			return Promise.reject(new Error('OLSKErrorInputNotValid'));
		}

		return Object.entries(await privateClient.getAll(inputData, false)).reduce(function (coll, item) {
			if (item[0].includes('/')) {
				coll.folders.push(item[0]);
			} else {
				coll.objects.push(item[1]);
			}

			return coll;
		}, {
			objects: [],
			folders: [],
		});
	},

	async OLSKRemoteStorageObjectsRecursive (privateClient, inputData, cacheAge = false) {
		if (typeof inputData !== 'string') {
			return Promise.reject(new Error('OLSKErrorInputNotValid'));
		}

		return await Object.entries(await privateClient.getAll(inputData, cacheAge)).reduce(async function (coll, item) {
			const _coll = await coll;

			if (item[0].includes('/')) {
				return Promise.resolve(Object.assign(_coll, await mod.OLSKRemoteStorageObjectsRecursive(privateClient, inputData + item[0])));
			}

			if (item[1] !== true) { // #remotestorage-cache-true
				_coll[inputData + item[0]] = item[1];
			}

			return Promise.resolve(_coll);
		}, Promise.resolve({}))
	},

	_TestWriteFileText (storageModule, param1, param2) {
		return storageModule.__DEBUG.__TestWriteFileText(param1, param2);
	},

	_TestReadFileText (storageModule, inputData) {
		return storageModule.__DEBUG.__TestReadFileText(inputData);
	},

	_TestWriteObject (storageModule, param1, param2) {
		return storageModule.__DEBUG.__TestWriteObject(param1, param2);
	},

	_TestReadObject (storageModule, param1, param2) {
		return storageModule.__DEBUG.__TestReadObject(param1, param2);
	},

	_TestReset (storageModule) {
		return storageModule.__DEBUG.__OLSKRemoteStorageReset();
	},

	_OLSKRemoteStoragePrivateClient (storageModule) {
		return storageModule.__DEBUG.__OLSKRemoteStoragePrivateClient();
	},

	_OLSKRemoteStoragePublicClient (storageModule) {
		return storageModule.__DEBUG.__OLSKRemoteStoragePublicClient();
	},

	OLSKRemoteStorageSafeCopy (inputData) {
		return Object.keys(inputData).reduce(function (coll, item) {
			if (item[0] !== '$') {
				coll[item] = inputData[item];
			}

			return coll
		}, {});
	},

	OLSKRemoteStoragePreJSONSchemaValidate (inputData) {
		for (const key in inputData) {
			if (key.slice(-4) === 'Date') {
				if (inputData[key] instanceof Date) {
					inputData[key] = inputData[key].toISOString();
				} else {
					console.error('! OLSKRemoteStoragePreJSONSchemaValidateNotDate', key, inputData[key]);
				}
			} else if (Array.isArray(inputData[key])) {
				inputData[key].map(mod.OLSKRemoteStoragePreJSONSchemaValidate);
			}
		}

		return inputData;
	},

	OLSKRemoteStoragePostJSONParse (inputData) {
		if (!inputData) {
			return inputData;
		}

		if (Array.isArray(inputData)) {
			return inputData.map(mod.OLSKRemoteStoragePostJSONParse);
		}

		for (const key in inputData) {
			if (key.slice(-4) === 'Date') {
				inputData[key] = new Date(inputData[key]);
			} else if (Array.isArray(inputData[key])) {
				inputData[key].map(mod.OLSKRemoteStoragePostJSONParse);
			} else if (typeof inputData[key] === 'object') {
				mod.OLSKRemoteStoragePostJSONParse(inputData[key]);
			}
		}

		return inputData;
	},

	async OLSKRemoteStorageWriteObject (privateClient, param1, param2) {
		if (!mod._OLSKRemoteStorageIsPath(param1)) {
			return Promise.reject(new Error('OLSKErrorInputNotValid'));
		}

		if (typeof param2 !== 'object' || param2 === null) {
			return Promise.reject(new Error('OLSKErrorInputNotValid'));
		}

		await privateClient.storeFile('application/json', param1, JSON.stringify(mod.OLSKRemoteStorageSafeCopy(param2)));

		return param2;
	},

	async OLSKRemoteStorageReadObject (privateClient, inputData) {
		if (!mod._OLSKRemoteStorageIsPath(inputData)) {
			return Promise.reject(new Error('OLSKErrorInputNotValid'));
		}

		return mod.OLSKRemoteStoragePostJSONParse(await privateClient.getObject(inputData, false));
	},

	OLSKRemoteStorageQueryFunction (param1, param2, param3, param4) {
		if (typeof param1 !== 'function' || !param1.prototype) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param2 !== 'object' || param2 === null || !param2.name) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param3 !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof param4 !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		return function (inputData) {
			if (typeof inputData !== 'function') {
				throw new Error('OLSKErrorInputNotValid');
			}
			const storageClient = new (param1)({
				cache: false,
				modules: [param2],
			});

			storageClient.access.claim(param2.name, 'rw');

			storageClient.stopSync();

			return new Promise(function (res, rej) {
				let didReject, outputData;

				storageClient.on('error', function (err) {
					if (didReject) {
						return;
					}

					didReject = true;
					return rej(err);
				});

				storageClient.on('connected', async function () {
					try {
						outputData = await inputData(storageClient);
					} catch (e) {
						didReject = true;
						return rej(e);
					}

					res(outputData);
					
					return storageClient.disconnect();
				});

				storageClient.connect(param3, param4);
			});
		};
	},

	OLSKRemoteStorageLauncherFakeItemProxy () {
		return {
			LCHRecipeName: 'OLSKRemoteStorageLauncherFakeItemProxy',
			LCHRecipeCallback () {},
		};
	},

	OLSKRemoteStorageLauncherItemFakeFlipConnected (inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		return {
			LCHRecipeName: 'OLSKRemoteStorageLauncherItemFakeFlipConnected',
			LCHRecipeCallback () {
				if (inputData.__ValueOLSKRemoteStorage) {
					inputData._ValueOLSKRemoteStorage = inputData.__ValueOLSKRemoteStorage;
					
					delete inputData.__ValueOLSKRemoteStorage;

					return inputData.OLSKRemoteStorageLauncherItemFakeFlipConnectedDidFinish();
				}
				inputData.__ValueOLSKRemoteStorage = inputData._ValueOLSKRemoteStorage;

				inputData._ValueOLSKRemoteStorage = (inputData.__ValueOLSKRemoteStorage.access.scopes || []).reduce(function (coll, item) {
					return Object.assign(coll, {
						[item.name]: inputData.__ValueOLSKRemoteStorage[item.name],
					});
				}, Object.assign({}, inputData.__ValueOLSKRemoteStorage));
				inputData._ValueOLSKRemoteStorage.connected = true;
				inputData._ValueOLSKRemoteStorage.remote = Object.assign(inputData._ValueOLSKRemoteStorage.remote, {
					userAddress: 'OLSK_REMOTE_STORAGE_FAKE_REMOTE_ADDRESS',
					token: 'OLSK_REMOTE_STORAGE_FAKE_REMOTE_TOKEN',
				});

				inputData.OLSKRemoteStorageLauncherItemFakeFlipConnectedDidFinish();

				if (typeof window !== 'undefined') {
					window.FakeOLSKConnected = true;
				}
			},
		};
	},

	OLSKRemoteStorageLauncherItemOpenLoginLink (param1, param2, OLSKLocalized) {
		if (!param1.location) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (!param2.remote) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof OLSKLocalized !== 'function') {
			throw new Error('OLSKErrorInputNotValid');
		}

		return {
			LCHRecipeSignature: 'OLSKRemoteStorageLauncherItemOpenLoginLink',
			LCHRecipeName: OLSKLocalized('OLSKRemoteStorageLauncherItemOpenLoginLinkText'),
			LCHRecipeCallback () {
				const item = param1.prompt(OLSKLocalized('OLSKRemoteStorageLauncherItemOpenLoginLinkPromptText'));

				if (!item) {
					return;
				}

				param1.location.href = item;
				param1.location.reload();
			},
			LCHRecipeIsExcluded () {
				return !!param2.connected;
			},
		};
	},

	OLSKRemoteStorageLauncherItemCopyLoginLink (param1, param2, OLSKLocalized) {
		if (!param1.location) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (!param2.remote) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof OLSKLocalized !== 'function') {
			throw new Error('OLSKErrorInputNotValid');
		}

		return {
			LCHRecipeSignature: 'OLSKRemoteStorageLauncherItemCopyLoginLink',
			LCHRecipeName: OLSKLocalized('OLSKRemoteStorageLauncherItemCopyLoginLinkText'),
			LCHRecipeCallback () {
				return this.api.LCHCopyToClipboard(`${ param1.location.href }#remotestorage=${ param2.remote.userAddress }&access_token=${ param2.remote.token }`.replace(/#+/g, '#'));
			},
			LCHRecipeIsExcluded () {
				return !param2.connected;
			},
		};
	},

	OLSKRemoteStorageLauncherItemDebugFlushData (param1, param2, OLSKLocalized) {
		if (!param1.location) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (!param2.remote) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof OLSKLocalized !== 'function') {
			throw new Error('OLSKErrorInputNotValid');
		}

		return {
			LCHRecipeSignature: 'OLSKRemoteStorageLauncherItemDebugFlushData',
			LCHRecipeName: OLSKLocalized('OLSKRemoteStorageLauncherItemDebugFlushDataText'),
			async LCHRecipeCallback () {
				if (!param1.confirm(OLSKLocalized('OLSKRemoteStorageLauncherItemDebugFlushDataConfirmText'))) {
					return;
				}

				await Promise.all(Object.getOwnPropertyNames(param2).filter(function (e) {
					return param2[e].__HOTFIX;
				}).map(function (e) {
					return param2[e].__HOTFIX.__OLSKRemoteStorageHotfixFlushData();
				}));

				return new Promise(function (res, rej) {
					setTimeout(function() {
						res(param1.location.reload());
					}, 1000);
				});
			},
			LCHRecipeIsExcluded () {
				return !param2.connected;
			},
		};
	},

	OLSKRemoteStorageRecipes (params) {
		if (typeof params !== 'object' || params === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof params.ParamMod !== 'object' || params.ParamMod === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof params.ParamSpecUI !== 'boolean') {
			throw new Error('OLSKErrorInputNotValid');
		}

		return [
			mod.OLSKRemoteStorageLauncherFakeItemProxy(),
			mod.OLSKRemoteStorageLauncherItemFakeFlipConnected(params.ParamMod),
			mod.OLSKRemoteStorageLauncherItemOpenLoginLink(params.ParamWindow, params.ParamStorage, params.OLSKLocalized),
			mod.OLSKRemoteStorageLauncherItemCopyLoginLink(params.ParamWindow, params.ParamStorage, params.OLSKLocalized),
			mod.OLSKRemoteStorageLauncherItemDebugFlushData(params.ParamWindow, params.ParamStorage, params.OLSKLocalized),
		].filter(function (e) {
			if (params.ParamSpecUI) {
				return true;
			}

			return !(e.LCHRecipeSignature || e.LCHRecipeName).match(/Fake/);
		});
	},

};

Object.assign(exports, mod);
