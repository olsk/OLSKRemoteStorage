const uFlatten = function (inputData) {
	return [].concat.apply([], inputData);
};

const mod = {

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

		const _this = this;

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
						
						__OLSKRemoteStoragePrivateClient () {
							return privateClient;
						},
						
						__OLSKRemoteStoragePublicClient () {
							return publicClient;
						},
						
					};

					const __HOTFIX = {

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
						}, Object.assign(options.OLSKOptionIncludeDebug ? { __DEBUG } : {}, { __HOTFIX }, {
							OLSKRemoteStorageEnableCrypto () {
								return _this._OLSKRemoteStorageEnableCrypto(...[privateClient].concat(...arguments));
							},
						})),
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

	_OLSKRemoteStorageEnableCrypto (privateClient, encrypt, decrypt) {
		if (!privateClient.storeFile) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof encrypt !== 'function') {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof decrypt !== 'function') {
			throw new Error('OLSKErrorInputNotValid');
		}

		return Object.assign(privateClient, {
			_OLSKBackupStoreFile: privateClient.storeFile,
			_OLSKBackupGetFile: privateClient.getFile,
			_OLSKBackupStoreObject: privateClient.storeObject,
			_OLSKBackupGetObject: privateClient.getObject,
			_OLSKBackupGetAll: privateClient.getAll,

			storeFile (mimetype, path, body) {
				return privateClient._OLSKBackupStoreFile('multipart/encrypted', path, encrypt(JSON.stringify({
					type: mimetype,
					data: body,
				})));
			},

			async getFile () {
				const item = await privateClient._OLSKBackupGetFile(...arguments);

				const decrypted = item.contentType !== 'multipart/encrypted' ? {} : JSON.parse(decrypt(item.data));

				return Object.assign(item, {
					contentType: decrypted.type,
					data: decrypted.data,
				})
			},

			storeObject (type, path, data) {
				return privateClient._OLSKBackupStoreFile('multipart/encrypted', path, encrypt(JSON.stringify({
					type,
					data: JSON.stringify(data),
				})));
			},

			async getObject () {
				const item = await privateClient._OLSKBackupGetFile(...arguments);

				const decrypted = item.contentType !== 'multipart/encrypted' ? {} : JSON.parse(decrypt(item.data));

				return !decrypted.data ? null : JSON.parse(decrypted.data);
			},

			async getAll () {
				const item = await privateClient._OLSKBackupGetAll(...arguments);

				return Object.entries(item).reduce(function (coll, [key, value]) {
					if (value === true) {
						return coll;
					}

					return Object.assign(coll, {
						[key]: value,
					});
				}, {})

				const decrypted = item.contentType !== 'multipart/encrypted' ? {} : JSON.parse(decrypt(item.data));

				return decrypted.data;
			},

		});
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
