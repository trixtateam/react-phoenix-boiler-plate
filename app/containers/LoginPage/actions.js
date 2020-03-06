/*
 *
 * LoginPage actions
 *
 */

import {
  DEFAULT_ACTION,
  DEFAULT_LOAD,
  REQUEST_LOGIN,
  REQUEST_LOGIN_FAILURE,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function defaultLoad() {
  return {
    type: DEFAULT_LOAD,
  };
}

export function requestAuthentication({ dispatch, data }) {
  return {
    type: REQUEST_LOGIN,
    dispatch,
    data,
  };
}

export function loginFailed(error) {
  return {
    type: REQUEST_LOGIN_FAILURE,
    error,
  };
}
