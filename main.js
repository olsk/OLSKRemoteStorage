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

		if (!inputData.OLSKRemoteStorageCollectionName.trim()) {
			return false;
		}

		if (typeof inputData.OLSKRemoteStorageCollectionExports !== 'object' || inputData.OLSKRemoteStorageCollectionExports === null) {
			return false;
		}

		return true;
	},

	_OLSKRemoteStorageIsPath (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('OLSKErrorInputNotValid');
		}

		return !!inputData.trim();
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

	OLSKRemoteStorageLauncherItemOpenLoginLink (params, debug = {}) {
		if (typeof params !== 'object' || params === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (!params.ParamStorage.remote) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof params.OLSKLocalized !== 'function') {
			throw new Error('OLSKErrorInputNotValid');
		}

		return {
			LCHRecipeSignature: 'OLSKRemoteStorageLauncherItemOpenLoginLink',
			LCHRecipeName: params.OLSKLocalized('OLSKRemoteStorageLauncherItemOpenLoginLinkText'),
			LCHRecipeCallback () {
				const item = (debug.DebugWindow || window).prompt(params.OLSKLocalized('OLSKRemoteStorageLauncherItemOpenLoginLinkPromptText'));

				if (!item) {
					return;
				}

				(debug.DebugWindow || window).location.href = item;
				(debug.DebugWindow || window).location.reload();
			},
			LCHRecipeIsExcluded () {
				return !!params.ParamStorage.connected;
			},
		};
	},

	OLSKRemoteStorageLauncherItemCopyLoginLink (params, debug = {}) {
		if (typeof params !== 'object' || params === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (!params.ParamStorage.remote) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof params.OLSKLocalized !== 'function') {
			throw new Error('OLSKErrorInputNotValid');
		}

		return {
			LCHRecipeSignature: 'OLSKRemoteStorageLauncherItemCopyLoginLink',
			LCHRecipeName: params.OLSKLocalized('OLSKRemoteStorageLauncherItemCopyLoginLinkText'),
			LCHRecipeCallback () {
				return this.api.LCHCopyToClipboard(`${ (debug.DebugWindow || window).location.href }#remotestorage=${ params.ParamStorage.remote.userAddress }&access_token=${ params.ParamStorage.remote.token }`.replace(/#+/g, '#'));
			},
			LCHRecipeIsExcluded () {
				return !params.ParamStorage.connected;
			},
		};
	},

	OLSKRemoteStorageLauncherItemDebugFlushData (params, debug = {}) {
		if (typeof params !== 'object' || params === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (!params.ParamStorage.remote) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof params.OLSKLocalized !== 'function') {
			throw new Error('OLSKErrorInputNotValid');
		}

		return {
			LCHRecipeSignature: 'OLSKRemoteStorageLauncherItemDebugFlushData',
			LCHRecipeName: params.OLSKLocalized('OLSKRemoteStorageLauncherItemDebugFlushDataText'),
			async LCHRecipeCallback () {
				if (!(debug.DebugWindow || window).confirm(params.OLSKLocalized('OLSKRemoteStorageLauncherItemDebugFlushDataConfirmText'))) {
					return;
				}

				await Promise.all(Object.getOwnPropertyNames(params.ParamStorage).filter(function (e) {
					return params.ParamStorage[e].__HOTFIX;
				}).map(function (e) {
					return params.ParamStorage[e].__HOTFIX.__OLSKRemoteStorageHotfixFlushData();
				}));

				return new Promise(function (res, rej) {
					setTimeout(function() {
						res((debug.DebugWindow || window).location.reload());
					}, 1000);
				});
			},
			LCHRecipeIsExcluded () {
				return !params.ParamStorage.connected;
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
			mod.OLSKRemoteStorageLauncherItemOpenLoginLink(params),
			mod.OLSKRemoteStorageLauncherItemCopyLoginLink(params),
			mod.OLSKRemoteStorageLauncherItemDebugFlushData(params),
		].filter(function (e) {
			if (params.ParamSpecUI) {
				return true;
			}

			return !(e.LCHRecipeSignature || e.LCHRecipeName).match(/Fake/);
		});
	},

};

Object.assign(exports, mod);
