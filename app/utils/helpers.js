import _ from 'lodash';
import { PHOENIX_TOKEN } from '../config';

/**
 * Checks if email address is valid
 * @param emailAddress
 * @returns {boolean}
 */
export const isValidEmail = (emailAddress) => {
  // eslint-disable-next-line no-useless-escape
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return regex.test(emailAddress);
};

export const toString = (id = '') => `${id}`;

/*
 * Returns true if the value if null or undefined or empty
 * @param value
 * @returns {boolean}
 */
function isNullOrEmpty(value) {
  if (_.isNull(value)) {
    return true;
  }
  if (_.isUndefined(value)) {
    return true;
  }
  if (_.isArray(value) && _.isEmpty(value)) {
    return true;
  }
  if (!Number.isInteger(value) && Object.keys(value).length === 0) {
    return true;
  }
  if (value.length === 0) {
    return true;
  }

  return false;
}

/**
 * Returns true if there is a PHOENIX_TOKEN present in local storage
 */
export function isAuthenticated() {
  return !isNullOrEmpty(getLocalStorageItem(PHOENIX_TOKEN));
}

/**
 * Based on the contents of the error object will attempt to return a message
 * @param error
 * @returns {string|*}
 */
export function getMessageFromError(error) {
  if (error.message) {
    return error.message;
  }
  if (error.reason) {
    return error.reason;
  }
  return JSON.stringify(error);
}

/**
 * Returns errors for the given errorKey, section, index
 * @param{Object} errors - object with error keys with their associated error message
 * @param{Object?} errorKey - { id , defaultMessage }
 * @param{null || string?} section - tab section or sub tab section
 * @param{null || number?} index - index of the errors for the section
 * @returns {boolean}
 */
function getErrorsForKey({ errors, errorKey, section = null, index = null }) {
  if (!isNullOrEmpty(index)) {
    if (errorKey) {
      return _.get(
        errors,
        `${section}.[${index}].${_.get(errorKey, 'id', '')}`,
        false,
      );
    }
    return _.get(errors, `${section}.[${index}]`, false);
  }

  if (section) {
    if (errorKey) {
      return _.get(errors, `${section}.${_.get(errorKey, 'id', '')}`, false);
    }
    return _.get(errors, `${section}`, false);
  }
  if (errorKey) {
    return _.get(errors, `${_.get(errorKey, 'id', '')}`, false);
  }
  return false;
}

/**
 * This removes the error from the current object of errors
 * @param{Object} errors - object with error keys with their associated error message
 * @param{Object? || Array} errorKey - { id , defaultMessage }
 */
function removeErrorsForKey({ errors, errorKey }) {
  if (_.isArray(errorKey)) {
    _.forEach(errorKey, (errorKeyItem) => {
      if (getErrorsForKey({ errors, errorKeyItem })) {
        return _.omit(errors, _.get(errorKey, 'id', ''), false);
      }
      return false;
    });
  }
  if (getErrorsForKey({ errors, errorKey })) {
    return _.omit(errors, _.get(errorKey, 'id', ''), false);
  }
  return false;
}

/**
 * Returns the url with params intended to navigate to if unable to reach due to not being authenticated
 * @param routeLocation
 * @param defaultUrl
 * @returns {string|*}
 */
function getAuthenticationRedirectUrl({ routeLocation, defaultUrl }) {
  const hasRedirect = routeLocation && routeLocation.state;
  if (hasRedirect) {
    const redirectPath = routeLocation.state.from.pathname;
    const redirectSearchParams = routeLocation.state.from.search;
    if (redirectPath && redirectSearchParams) {
      return `${redirectPath}${redirectSearchParams}`;
    }
    return redirectPath;
  }

  return defaultUrl;
}

/* Remove a local storage value for the given
* @param key - the key that we wish to remove
*/
function removeLocalStorageItem(key) {
  localStorage.removeItem(key);
}

/* Sets a local storage value for the given
* @param key - the key that we wish to set
* @param{any} value - the value of the key we want to set in local storage
*/
function setLocalStorageItem(key, value) {
  if (_.isObject(value) || _.isArray(value)) {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    localStorage.setItem(key, value);
  }
}

function isJsonString(stringValue) {
  try {
    JSON.parse(stringValue);
  } catch (e) {
    return false;
  }
  return true;
}

/* Gets a local storage value for the given and returns the defaultValue if not found
* @param key
* @param defaultValue
* @returns {string|*}
*/
function getLocalStorageItem(key, defaultValue = null) {
  const localStorageValue = localStorage.getItem(key);
  if (isNullOrEmpty(localStorageValue)) {
    return defaultValue;
  }

  if (isJsonString(localStorageValue)) {
    return JSON.parse(localStorageValue);
  }

  return localStorageValue;
}

export {
  isNullOrEmpty,
  getAuthenticationRedirectUrl,
  getErrorsForKey,
  getLocalStorageItem,
  setLocalStorageItem,
  removeLocalStorageItem,
  removeErrorsForKey,
};
