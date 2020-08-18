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

		if (typeof inputData.OLSKRemoteStorageCollectionType !== 'string') {
			return false;
		}

		if (inputData.OLSKRemoteStorageCollectionType.trim() === '') {
			return false;
		}

		if (typeof inputData.OLSKRemoteStorageCollectionModelErrors !== 'object' || inputData.OLSKRemoteStorageCollectionModelErrors === null) {
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
								return Promise.reject(new Error('OLSKErrorInputNotValid'));
							}

							if (typeof param2 !== 'string') {
								return Promise.reject(new Error('OLSKErrorInputNotValid'));
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
								return Promise.reject(new Error('OLSKErrorInputNotValid'));
							}

							if (typeof param2 !== 'object' || param2 === null) {
								return Promise.reject(new Error('OLSKErrorInputNotValid'));
							}

							return privateClient.storeObject('xyz_document', param1, param2);
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

							privateClient.declareType(collection.OLSKRemoteStorageCollectionType, mod.OLSKRemoteStorageJSONSchema(collection.OLSKRemoteStorageCollectionModelErrors));

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

			_coll[inputData + item[0]] = item[1];

			return Promise.resolve(_coll);
		}, Promise.resolve({}))
	},

	async _TestWriteFileText (storageModule, param1, param2) {
		return await storageModule.__DEBUG.__TestWriteFileText(param1, param2);
	},

	async _TestReadFileText (storageModule, inputData) {
		return await storageModule.__DEBUG.__TestReadFileText(inputData);
	},

	async _TestWriteObject (storageModule, param1, param2) {
		return await storageModule.__DEBUG.__TestWriteObject(param1, param2);
	},

	async _TestReadObject (storageModule, param1, param2) {
		return await storageModule.__DEBUG.__TestReadObject(param1, param2);
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
				inputData[key] = inputData[key].toISOString();
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

		for (const key in inputData) {
			if (key.slice(-4) === 'Date') {
				inputData[key] = new Date(inputData[key]);
			} else if (Array.isArray(inputData[key])) {
				inputData[key].map(mod.OLSKRemoteStoragePostJSONParse);
			}
		}

		return inputData;
	},

};

Object.assign(exports, mod);
