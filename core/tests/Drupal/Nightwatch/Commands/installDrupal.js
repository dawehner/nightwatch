import { execSync } from 'child_process';
import { commandAsWebserver } from '../globals';

/**
 * Installs a Drupal test site.
 *
 * @param {string} setupClass
 *   (optional) The setup class.
 * @param {function} callback
 *   A callback which will be called, when the installation is finished.
 * @return {object}
 *   The 'browser' object.
 */
exports.command = function installDrupal(setupClass = '', callback) {
  const self = this;

  // Allow to skip the setupClass.
  if (typeof setupClass === 'function') {
    callback = setupClass;
    setupClass = '';
  }

  const dbOption = process.env.DRUPAL_TEST_DB_URL.length > 0 ? `--db_url ${process.env.DRUPAL_TEST_DB_URL}` : '';
  let dbPrefix = '';

  try {
    // Single slash is replaced with 2 slashes because it will get printed on the command line,
    // which will be escaped again by the PHP script.
    setupClass = setupClass ? `--setup_class ${setupClass.replace(/\\\\/g, '\\\\\\\\')}` : '';
    const install = execSync(commandAsWebserver(`php ./scripts/test-site.php install ${setupClass} --base_url ${process.env.DRUPAL_TEST_BASE_URL} ${dbOption} --json`));
    const installData = JSON.parse(install.toString());
    dbPrefix = installData.db_prefix;
    const matches = process.env.DRUPAL_TEST_BASE_URL.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    const domain = matches[1];
    const path = matches[2];
    this
      .url(process.env.DRUPAL_TEST_BASE_URL)
      .setCookie({
        name: 'SIMPLETEST_USER_AGENT',
        // Colons need to be URL encoded to be valid.
        value: encodeURIComponent(installData.user_agent),
        path,
        domain,
      });
  }
  catch(error) {
    this.assert.fail(error);
    // Nightwatch doesn't like it when no actions are added in command file.
    this.pause(200);
  }

  this.drupalDbPrefix = dbPrefix;
  if (typeof callback === 'function') {
    callback.call(self, dbPrefix);
  }
  return this;
};
