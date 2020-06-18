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
export function updateCurrentUser({ identity }) {
  return {
    type: UPDATE_CURRENT_USER,
    data: {
      user: identity,
    },
  };
}

export function signOut() {
  return {
    type: SIGN_OUT,
  };
}

export function authenticate() {
  return {
    type: AUTHENTICATION_REQUEST,
  };
}

export function unAuthenticate() {
  return {
    type: AUTHENTICATION_FAILED,
  };
}
