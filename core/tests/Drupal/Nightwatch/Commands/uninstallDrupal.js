import { execSync } from 'child_process';
import { commandAsWebserver } from '../globals';

/**
 * Uninstalls a test Drupal site.
 *
 * @param {string} dbPrefix
 *   (optional_ The database prefix, which should be teared down.
 * @param {function} callback
 *   A callback which will be called, when the uninstallation is finished.
 * @return {object}
 *   The 'browser' object.
 */
exports.command = function uninstallDrupal(dbPrefix = '', callback) {
  const self = this;

  const dbOption = process.env.DRUPAL_TEST_DB_URL.length > 0 ? `--db_url ${process.env.DRUPAL_TEST_DB_URL}` : '';
  try {
    execSync(commandAsWebserver(`php ./scripts/test-site.php tear-down ${dbOption} ${dbPrefix}`));
  }
  catch(error) {
    this.assert.fail(error);
    // Nightwatch doesn't like it when no actions are added in command file.
    this.pause(200);
  }

  if (typeof callback === 'function') {
    callback.call(self, dbPrefix);
  }
  return this;
};
