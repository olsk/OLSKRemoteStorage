exports.OLSKRemoteStorageJSONSchema = function(inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw 'OLSKErrorInputInvalid'
	}

	return {
		type: 'object',
		properties: Object.entries(inputData).reduce(function (coll, [key, val]) {
			coll[key] = {};

			coll[key].type = exports._OLSKRemoteStorageInferredType([...val].shift()).replace('filled', 'string');

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
};

exports._OLSKRemoteStorageInferredType = function(inputData) {
	if (typeof inputData !== 'string') {
		throw 'OLSKErrorInputInvalid'
	}

	return inputData.replace(/\w+ErrorNot/, '').toLowerCase();
};

exports.OLSKRemoteStorageChangeDelegateMethods = function() {
	return [
		'OLSKChangeDelegateCreate',
		'OLSKChangeDelegateUpdate',
		'OLSKChangeDelegateDelete',
		];
};

exports.OLSKRemoteStorageChangeDelegateProperty = function(inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return;
	}

	if (inputData.origin === 'remote' && typeof inputData.oldValue === 'undefined' && typeof inputData.newValue !== 'undefined') {
		return 'OLSKChangeDelegateCreate';
	};

	if (inputData.origin === 'remote' && typeof inputData.oldValue !== 'undefined' && typeof inputData.newValue !== 'undefined') {
		return 'OLSKChangeDelegateUpdate';
	};

	if (inputData.origin === 'remote' && typeof inputData.oldValue !== 'undefined' && typeof inputData.newValue === 'undefined') {
		return 'OLSKChangeDelegateDelete';
	};

	return;
};

exports.OLSKRemoteStorageChangeDelegateInput = function(inputData) {
	if (exports.OLSKRemoteStorageChangeDelegateMethods().indexOf(inputData) === -1) {
		throw new Error('LCHErrorInputInvalid');
	}

	return inputData === 'OLSKChangeDelegateDelete' ? 'oldValue' : 'newValue';
};
