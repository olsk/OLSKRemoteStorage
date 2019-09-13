const { throws, deepEqual } = require('assert');

const mainModule = require('./main.js');

const kTesting = {
	StubChangeObjectWindow () {
		return {
	   path: '/public/design/color.txt',
	   relativePath: 'color.txt',
	   origin: 'window',
	   oldValue: 'white',
	   newValue: 'blue',
	   oldContentType: 'text/plain',
	   newContentType: 'text/plain'
	 };
	},
	StubChangeObjectConflict () {
		return {
	   path: '/public/design/color.txt',
	   relativePath: 'color.txt',
	   origin: 'conflict',
	   oldValue: 'blue',
	   newValue: 'red',
	   oldContentType: 'text/plain',
	   newContentType: 'text/plain',
	   // Most recent known common ancestor body of local and remote
	   lastCommonValue: 'white',
	   // Most recent known common ancestor contentType of local and remote
	   lastCommonContentType: 'text/plain'
	 };
	},
	StubChangeObjectLocalInit () {
		return {
			origin: 'local',
			path: '/remotestorage_quantity_test/xyz_documents/01DKQBS2PY79VJRZ80T54EA3YV',
			oldValue: undefined,
			oldContentType: undefined,
			newValue: {XYZDocumentName: '', XYZDocumentModificationDate: '2019-09-01T21:30:29.470Z', XYZDocumentID: '01DKQBS2PY79VJRZ80T54EA3YV', XYZDocumentCreationDate: '2019-09-01T21:30:29.470Z', '@context': 'http://remotestorage.io/spec/modules/remotestorage_quantity_test/xyz_document'},
			newContentType: 'application/json; charset=UTF-8',
			relativePath: 'xyz_documents/01DKQBS2PY79VJRZ80T54EA3YV',
	 };
	},
	StubChangeObjectRemoteCreate () {
		return {
			origin: 'remote',
			path: '/remotestorage_quantity_test/xyz_documents/01DKQBS2PY79VJRZ80T54EA3YV',
			oldValue: undefined,
			oldContentType: undefined,
			newValue: {XYZDocumentName: '', XYZDocumentModificationDate: '2019-09-01T21:30:29.470Z', XYZDocumentID: '01DKQBS2PY79VJRZ80T54EA3YV', XYZDocumentCreationDate: '2019-09-01T21:30:29.470Z', '@context': 'http://remotestorage.io/spec/modules/remotestorage_quantity_test/xyz_document'},
			newContentType: 'application/json; charset=UTF-8',
			relativePath: 'xyz_documents/01DKQBS2PY79VJRZ80T54EA3YV',
	 };
	},
	StubChangeObjectRemoteUpdate () {
		return {
			origin: 'remote',
			path: '/remotestorage_quantity_test/xyz_documents/01DKQBS2PY79VJRZ80T54EA3YV',
			oldValue: {XYZDocumentName: '', XYZDocumentModificationDate: '2019-09-01T21:30:29.470Z', XYZDocumentID: '01DKQBS2PY79VJRZ80T54EA3YV', XYZDocumentCreationDate: '2019-09-01T21:30:29.470Z', '@context': 'http://remotestorage.io/spec/modules/remotestorage_quantity_test/xyz_document'},
			oldContentType: 'application/json; charset=UTF-8',
			newValue: {XYZDocumentName: 'test', XYZDocumentModificationDate: '2019-09-01T21:32:29.470Z', XYZDocumentID: '01DKQBS2PY79VJRZ80T54EA3YV', XYZDocumentCreationDate: '2019-09-01T21:30:29.470Z', '@context': 'http://remotestorage.io/spec/modules/remotestorage_quantity_test/xyz_document'},
			newContentType: 'application/json; charset=UTF-8',
			relativePath: 'xyz_documents/01DKQBS2PY79VJRZ80T54EA3YV',
	 };
	},
	StubChangeObjectRemoteDelete () {
		return {
			origin: 'remote',
			path: '/remotestorage_quantity_test/xyz_documents/01DKQBS2PY79VJRZ80T54EA3YV',
			oldValue: {XYZDocumentName: 'test', XYZDocumentModificationDate: '2019-09-01T21:32:59.908Z', XYZDocumentID: '01DKQBS2PY79VJRZ80T54EA3YV', XYZDocumentCreationDate: '2019-09-01T21:30:29.470Z', '@context': 'http://remotestorage.io/spec/modules/remotestorage_quantity_test/xyz_document'},
			oldContentType: 'application/json; charset=UTF-8',
			newValue: undefined,
			newContentType: undefined,
			relativePath: 'xyz_documents/01DKQBS2PY79VJRZ80T54EA3YV',
	 };
	},
};

describe('OLSKRemoteStorageJSONSchema', function OLSKRemoteStorageJSONSchema() {

	it('throws error if not object', function() {
		throws(function() {
			mainModule.OLSKRemoteStorageJSONSchema(null);
		}, /OLSKErrorInputInvalid/);
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

describe('OLSKRemoteStorageChangeDelegateMethods', function testOLSKRemoteStorageChangeDelegateMethods() {

	it('returns array', function() {
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateMethods(), [
			'OLSKChangeDelegateCreate',
			'OLSKChangeDelegateUpdate',
			'OLSKChangeDelegateDelete',
			]);
	})

});

describe('OLSKRemoteStorageChangeDelegateProperty', function testOLSKRemoteStorageChangeDelegateProperty() {

	it('returns undefined', function() {
		deepEqual(typeof mainModule.OLSKRemoteStorageChangeDelegateProperty(), 'undefined');
	});

	it('returns undefined if window', function() {
		deepEqual(typeof mainModule.OLSKRemoteStorageChangeDelegateProperty(kTesting.StubChangeObjectWindow()), 'undefined');
	});

	it('returns undefined if conflict', function() {
		deepEqual(typeof mainModule.OLSKRemoteStorageChangeDelegateProperty(kTesting.StubChangeObjectConflict()), 'undefined');
	});

	it('returns undefined if local init', function() {
		deepEqual(typeof mainModule.OLSKRemoteStorageChangeDelegateProperty(kTesting.StubChangeObjectLocalInit()), 'undefined');
	});

	it('returns string if remote create', function() {
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateProperty(kTesting.StubChangeObjectRemoteCreate()), 'OLSKChangeDelegateCreate');
	});

	it('returns string if remote update', function() {
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateProperty(kTesting.StubChangeObjectRemoteUpdate()), 'OLSKChangeDelegateUpdate');
	});

	it('returns string if remote delete', function() {
		deepEqual(mainModule.OLSKRemoteStorageChangeDelegateProperty(kTesting.StubChangeObjectRemoteDelete()), 'OLSKChangeDelegateDelete');
	});

});

describe('OLSKRemoteStorageChangeDelegateInput', function testOLSKRemoteStorageChangeDelegateInput() {

	it('throws if not valid', function() {
		throws(function () {
			mainModule.OLSKRemoteStorageChangeDelegateInput('alfa');
		}, /LCHErrorInputInvalid/);
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
