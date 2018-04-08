module.exports = {
  '@tags': ['core'],
  before: function(browser) {
    browser.installDrupal('core/tests/Drupal/TestSite/TestSiteInstallTestScript.php');
  },
  after: function(browser, done) {
    browser.uninstallDrupal(done);
  },
  'Test page': (browser) => {
    browser
      .relativeURL('/test-page')
      .waitForElementVisible('body', 1000)
      .assert.containsText('body', 'Test page text')
      .end();
  },
};
