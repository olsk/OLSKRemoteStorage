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

		return;
	},

	OLSKRemoteStorageChangeDelegateInput (inputData) {
		if (mod.OLSKRemoteStorageChangeDelegateMethods().indexOf(inputData) === -1) {
			throw new Error('LCHErrorInputNotValid');
		}

		return inputData === 'OLSKChangeDelegateDelete' ? 'oldValue' : 'newValue';
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

		if (!Array.isArray(inputData.OLSKRemoteStorageCollectionModelErrors)) {
			return false;
		}

		if (typeof inputData.OLSKRemoteStorageCollectionExports !== 'object' || inputData.OLSKRemoteStorageCollectionExports === null) {
			return false;
		}

		return true;
	},

	OLSKRemoteStorageDataModuleGenerator (kModuleName) {
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
					privateClient.cache(kModuleName + '/');

					return {
						exports: inputData.reduce(function (coll, item) {
							if (!mod.OLSKRemoteStorageIsCollection(item)) {
								throw new Error('OLSKErrorInputNotValid');
							}
							
							return coll;
						}, {}),
					};
				},
			};
		};
	},

};

Object.assign(exports, mod);
