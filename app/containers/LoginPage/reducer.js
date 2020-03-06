/*
 *
 * LoginPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  DEFAULT_LOAD,
  REQUEST_LOGIN,
  REQUEST_LOGIN_FAILURE,
  REQUEST_LOGIN_SUCCESS,
  REQUEST_LOGIN_TIMEOUT,
} from './constants';

export const initialState = fromJS({
  response: {
    errors: false,
    success: false,
    warnings: false,
  },
  isLoggingIn: false,
});

function loginPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case DEFAULT_LOAD:
      return state
        .setIn(['response', 'errors'], false)
        .setIn(['response', 'warnings'], false)
        .setIn(['response', 'success'], false)
        .set('isLoggingIn', false);
    case REQUEST_LOGIN_TIMEOUT:
      return state
        .setIn(['response', 'errors'], action.error)
        .set('isLoggingIn', false);
    case REQUEST_LOGIN_SUCCESS:
      return state.set('progressMessage', false).set('isLoggingIn', false);
    case REQUEST_LOGIN_FAILURE:
      return state.set('isLoggingIn', false);
    case REQUEST_LOGIN:
      return state.set('isLoggingIn', true);
    default:
      return state;
  }
}

export default loginPageReducer;
