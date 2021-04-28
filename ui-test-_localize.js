const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguageCodes.forEach(function (OLSKRoutingLanguage) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, OLSKRoutingLanguage);
	};

	describe('OLSKRemoteStorage_Localize-' + OLSKRoutingLanguage, function () {

		before(function () {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage,
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

		context('storageClient.connected', function () {

			before(function () {
				return browser.OLSKLauncherRun('OLSKRemoteStorageLauncherItemFakeFlipConnected');
			});

			it('localizes OLSKRemoteStorageLauncherItemCopyLoginLink', function () {
				return browser.assert.OLSKLauncherItemText('OLSKRemoteStorageLauncherItemCopyLoginLink', uLocalized('OLSKRemoteStorageLauncherItemCopyLoginLinkText'));
			});

			it('localizes OLSKRemoteStorageLauncherItemDebugFlushData', function () {
				return browser.assert.OLSKLauncherItemText('OLSKRemoteStorageLauncherItemDebugFlushData', uLocalized('OLSKRemoteStorageLauncherItemDebugFlushDataText'));
			});

			context('OLSKRemoteStorageLauncherItemDebugFlushData', function () {
				
				before(function () {
					return browser.pressButton('.OLSKAppToolbarLauncherButton');
				});

				before(async function () {
					return browser.fill('.LCHLauncherFilterInput', 'OLSKRemoteStorageLauncherItemDebugFlushData');
				});
				
				it('localizes OLSKRemoteStorageLauncherItemDebugFlushDataConfirm', function () {
					browser.assert.OLSKConfirmQuestion(function () {
						return browser.click('.LCHLauncherPipeItem');
					}, uLocalized('OLSKRemoteStorageLauncherItemDebugFlushDataConfirmText'));
				});
			
			});
		
		});

	});

});
