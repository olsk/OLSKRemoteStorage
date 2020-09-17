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

});
