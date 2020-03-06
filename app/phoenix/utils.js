import _ from 'lodash';
import {
  SOCKET_PROTOCOL_SECURE,
  SOCKET_PROTOCOL_UN_SECURE,
  SOCKET_URI,
} from './constants';

/**
 * Searches the object and returns the value associated for the given parameterName
 * @param{Object} search - search object of the location
 * @param{string} parameterName - name of parameter
 * @param defaultValue - default value to return if not found
 * @returns {string}
 */
function getUrlParameter({ search, parameterName, defaultValue = '' }) {
  // eslint-disable-next-line no-useless-escape
  const parameter = parameterName.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp(`[\\?&]${parameter}=([^&#]*)`);
  const results = regex.exec(search);
  return results === null
    ? defaultValue
    : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/**
 * Returns true if the value is null or undefined or empty
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

/**
 * Based on the given domain parameter will format and return the correct space domain format
 * @param{string} domainString - domain string
 * @returns string
 */
function formatSocketDomain({ domainString }) {
  let domainUrl = domainString;
  if (!domainUrl) {
    return '';
  }
  // connection should end in '/socket'
  if (!domainUrl.includes(`/${SOCKET_URI}`)) {
    domainUrl = `${domainUrl}/${SOCKET_URI}`;
  }
  // check if the domain string contains socketProtocol and should add it or not
  // check secure vs un secure
  if (
    !domainUrl.includes(SOCKET_PROTOCOL_SECURE) &&
    !domainUrl.includes(SOCKET_PROTOCOL_UN_SECURE)
  ) {
    if (_.startsWith(domainUrl, 'localhost')) {
      domainUrl = `${SOCKET_PROTOCOL_UN_SECURE}${domainUrl}`;
    } else {
      domainUrl = `${SOCKET_PROTOCOL_SECURE}${domainUrl}`;
    }
  }

  return domainUrl;
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

export {
  isNullOrEmpty,
  isJsonString,
  getAuthenticationRedirectUrl,
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
  formatSocketDomain,
  getUrlParameter,
};
