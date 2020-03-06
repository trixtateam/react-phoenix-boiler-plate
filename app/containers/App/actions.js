import {
  AUTHENTICATION_FAILED,
  AUTHENTICATION_REQUEST,
  END_PROGRESS,
  LOADING,
  LOGGING_IN,
  RESET_ERROR,
  SAVING,
  SIGN_OUT,
  UPDATE_CURRENT_USER,
  UPDATE_ERROR,
  UPDATE_LOADING_STATUS,
} from './constants';
import { isNullOrEmpty, setLocalStorageItem } from '../../phoenix/utils';
import { AGENT_ID, PHOENIX_TOKEN } from '../../phoenix/constants';

export function loggingIn(loadingType) {
  return {
    type: LOGGING_IN,
    data: {
      loadingType,
    },
  };
}

export function loading(loadingType) {
  return {
    type: LOADING,
    data: {
      loadingType,
    },
  };
}

export function updateLoadingStatus({ loadingStatusKey }) {
  return {
    type: UPDATE_LOADING_STATUS,
    data: { loadingStatusKey },
  };
}

export function saving(loadingType) {
  return {
    type: SAVING,
    data: {
      loadingType,
    },
  };
}

export function resetError() {
  return {
    type: RESET_ERROR,
  };
}

export function endProgress({ loadingStatusKey }) {
  return {
    type: END_PROGRESS,
    data: {
      loadingStatusKey,
    },
  };
}

export function updateError({ error }) {
  return {
    type: UPDATE_ERROR,
    error,
  };
}

// eslint-disable-next-line camelcase
export function updateCurrentUser({ agent_id, identity, jwt }) {
  if (!isNullOrEmpty(agent_id) || !isNullOrEmpty(jwt)) {
    setLocalStorageItem(PHOENIX_TOKEN, jwt);
    setLocalStorageItem(AGENT_ID, agent_id);
  }
  return {
    type: UPDATE_CURRENT_USER,
    data: {
      user: identity,
    },
  };
}

export function signOut(dispatch) {
  return {
    type: SIGN_OUT,
    dispatch,
  };
}

export function authenticate({ dispatch }) {
  return {
    type: AUTHENTICATION_REQUEST,
    dispatch,
  };
}

export function unAuthenticate() {
  localStorage.removeItem(PHOENIX_TOKEN);
  localStorage.removeItem(AGENT_ID);
  return {
    type: AUTHENTICATION_FAILED,
  };
}
