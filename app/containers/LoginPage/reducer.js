/*
 *
 * LoginPage reducer
 *
 */

import produce from 'immer';
import {
  DEFAULT_ACTION,
  DEFAULT_LOAD,
  REQUEST_LOGIN,
  REQUEST_LOGIN_FAILURE,
  REQUEST_LOGIN_SUCCESS,
  REQUEST_LOGIN_TIMEOUT,
} from './constants';

export const initialState = {
  response: {
    errors: false,
    success: false,
    warnings: false,
  },
  isLoggingIn: false,
};
/* eslint-disable default-case, no-param-reassign, consistent-return */
const loginPageReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case DEFAULT_ACTION:
        return state;
      case DEFAULT_LOAD:
        draft.response.errors = false;
        draft.response.warnings = false;
        draft.response.success = false;
        draft.isLoggingIn = false;
        break;
      case REQUEST_LOGIN_TIMEOUT:
        draft.response.errors = action.error;
        draft.isLoggingIn = false;
        break;
      case REQUEST_LOGIN_SUCCESS:
        draft.isLoggingIn = false;
        draft.progressMessage = false;
        break;
      case REQUEST_LOGIN_FAILURE:
        draft.isLoggingIn = false;
        break;
      case REQUEST_LOGIN:
        draft.isLoggingIn = true;
        break;
    }
  });

export default loginPageReducer;
