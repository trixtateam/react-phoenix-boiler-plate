import { put, select, takeLatest, takeEvery } from 'redux-saga/effects';
import _ from 'lodash';
import { push } from 'connected-react-router';
import {
  connectPhoenix,
  disconnectPhoenix,
  socketActionTypes,
  channelActionTypes,
  makeSelectPhoenixSocket,
} from '@trixta/phoenix-to-redux';
import { AUTHENTICATION_REQUEST, SIGN_OUT } from './constants';
import { unAuthenticate, updateCurrentUser, updateError } from './actions';
import { makeSelectRouteLocation } from './selectors';
import { routePaths } from '../../route-paths';
import {
  isNullOrEmpty,
  isAuthenticated,
  getLocalStorageItem,
  removeLocalStorageItem,
} from '../../utils/helpers';
import { defaultLoad } from '../LoginPage/actions';
import {
  PHOENIX_AGENT_ID,
  PHOENIX_TOKEN,
  PHOENIX_SOCKET_DOMAIN,
} from '../../config';

export function* signOutSaga() {
  const socket = yield select(makeSelectPhoenixSocket());
  if (socket) {
    yield put(disconnectPhoenix());
  } else {
    removeLocalStorageItem(PHOENIX_SOCKET_DOMAIN);
    removeLocalStorageItem(PHOENIX_TOKEN);
    removeLocalStorageItem(PHOENIX_AGENT_ID);
    yield put(push(routePaths.LOGIN_PAGE));
  }
}

/**
 * Checks the auth token if valid and see if socket is still available. If there is a token will attempt to load the profile details for the user
 * @returns {IterableIterator<*>}
 */
export function* authenticateSaga() {
  try {
    const token = getLocalStorageItem(PHOENIX_TOKEN);
    // eslint-disable-next-line camelcase
    const agentId = getLocalStorageItem(PHOENIX_AGENT_ID);
    const domainUrl = getLocalStorageItem(PHOENIX_SOCKET_DOMAIN);
    if (isAuthenticated()) {
      yield put(connectPhoenix({ token, agentId, domainUrl }));
      // eslint-disable-next-line camelcase
      yield put(updateCurrentUser({ identity: agentId }));
    }
  } catch (e) {
    yield put(unAuthenticate());
  }
}

/**
 * When a socket disconnection happens
 * and redirect to login page
 */
export function* socketDisconnectionSaga({ isAnonymous }) {
  const location = yield select(makeSelectRouteLocation());
  if (!isAnonymous) {
    yield put(defaultLoad());
    removeLocalStorageItem(PHOENIX_SOCKET_DOMAIN);
    removeLocalStorageItem(PHOENIX_TOKEN);
    removeLocalStorageItem(PHOENIX_AGENT_ID);
    if (!isNullOrEmpty(location)) {
      yield put(
        push(`${routePaths.LOGIN_PAGE}${_.get(location, 'search', '')}`),
      );
    } else {
      yield put(push(routePaths.LOGIN_PAGE));
    }
  }
}

/**
 * If an error happens on joining a phoenix channel
 * @param {Object} params
 * @param {Object} params.error - error response
 * @param {string} params.channelTopic - name of phoenix channel
 */
export function* channelJoinErrorSaga({ error, channelTopic }) {
  // eslint-disable-next-line no-console
  console.error(error, channelTopic);
  yield put(updateError({ error }));
}

/**
 * If an error happens on a phoenix channel
 * @param {Object} params
 * @param {Object} params.error - error response
 * @param {string} params.channelTopic - name of phoenix channel
 */
export function* channelErrorSaga({ error }) {
  yield put(updateError({ error }));
}

/**
 * After the socket is connected,
 * @param {*} params
 */
export function* socketConnectedSaga() {
  // handle connection response
}

// Individual exports for testing
export default function* defaultSaga() {
  yield takeLatest(SIGN_OUT, signOutSaga);
  yield takeLatest(AUTHENTICATION_REQUEST, authenticateSaga);
  yield takeLatest(
    socketActionTypes.SOCKET_DISCONNECT,
    socketDisconnectionSaga,
  );
  yield takeLatest(channelActionTypes.CHANNEL_PUSH_ERROR, channelErrorSaga);
  yield takeLatest(channelActionTypes.CHANNEL_JOIN_ERROR, channelJoinErrorSaga);
  yield takeEvery(socketActionTypes.SOCKET_OPEN, socketConnectedSaga);
}
