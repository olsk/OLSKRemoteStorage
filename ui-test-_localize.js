const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguages.forEach(function (languageCode) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, languageCode);
	};

	describe(`OLSKRemoteStorage_Localize-${ languageCode }`, function () {

		before(function () {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage: languageCode,
			});
		});

		it('localizes OLSKRemoteStorageLauncherItemOpenLoginLink', function () {
			return browser.assert.OLSKLauncherItemText('OLSKRemoteStorageLauncherItemOpenLoginLink', uLocalized('OLSKRemoteStorageLauncherItemOpenLoginLinkText'));
		});

		context('OLSKRemoteStorageLauncherItemOpenLoginLink', function () {
			
			before(function () {
				return browser.pressButton('.OLSKAppToolbarLauncherButton');
			});

			before(async function () {
				return browser.fill('.LCHLauncherFilterInput', 'OLSKRemoteStorageLauncherItemOpenLoginLink');
			});
			
			it('localizes OLSKRemoteStorageLauncherItemOpenLoginLinkPrompt', function () {
				browser.assert.OLSKPromptQuestion(function () {
					return browser.click('.LCHLauncherPipeItem');
				}, uLocalized('OLSKRemoteStorageLauncherItemOpenLoginLinkPromptText'));
			});
		
		});

	});

});
