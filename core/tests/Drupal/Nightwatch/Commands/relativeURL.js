
/**
 * Concatenate a DRUPAL_TEST_BASE_URL variable and a pathname.
 *
 * This provides a custom command, .relativeURL()
 *
 * @param  {string} pathname
 *   The relative path to append to DRUPAL_TEST_BASE_URL
 * @return {object}
 *   The 'browser' object.
 */
exports.command = function relativeURL(pathname, callback) {
  const self = this;
  this.url(`${process.env.DRUPAL_TEST_BASE_URL}${pathname}`);

  if (typeof callback === 'function') {
    callback.call(self);
  }
  return this;
};
