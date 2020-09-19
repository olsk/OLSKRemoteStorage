const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('OLSKRemoteStorage_Access', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	it('shows OLSKRemoteStorageLauncherFakeItemProxy', function () {
		return browser.assert.OLSKLauncherItems('OLSKRemoteStorageLauncherFakeItemProxy', 1);
	});

	it('shows OLSKRemoteStorageLauncherItemOpenLoginLink', function () {
		return browser.assert.OLSKLauncherItems('OLSKRemoteStorageLauncherItemOpenLoginLink', 1);
	});

	context('storageClient.connected', function () {

		before(function () {
			return browser.OLSKLauncherRun('OLSKRemoteStorageLauncherFakeItemConnected');
		});

		it('hides OLSKRemoteStorageLauncherItemOpenLoginLink', function () {
			return browser.assert.OLSKLauncherItems('OLSKRemoteStorageLauncherItemOpenLoginLink', 0);
		});		
	
	});

});
