import { put, select, takeLatest, takeEvery } from 'redux-saga/effects';
import _ from 'lodash';
import { push } from 'connected-react-router';
import {
  connectPhoenix,
  disconnectPhoenix,
  socketActionTypes,
  PHOENIX_AGENT_ID,
  channelActionTypes,
  isAuthenticated,
  getLocalStorageItem,
} from '@trixta/phoenix-to-redux';
import { AUTHENTICATION_REQUEST, SIGN_OUT } from './constants';
import { unAuthenticate, updateCurrentUser, updateError } from './actions';
import { makeSelectRouteLocation } from './selectors';
import { routePaths } from '../../route-paths';
import { isNullOrEmpty } from '../../utils/helpers';
import { defaultLoad } from '../LoginPage/actions';

export function* signOutSaga() {
  yield put(disconnectPhoenix({ clearPhoenixDetails: true }));
}

/**
 * Checks the auth token if valid and see if socket is still available. If there is a token will attempt to load the profile details for the user
 * @returns {IterableIterator<*>}
 */
export function* authenticateSaga() {
  try {
    yield put(connectPhoenix());
    if (isAuthenticated()) {
      // eslint-disable-next-line camelcase
      const agent_id = getLocalStorageItem(PHOENIX_AGENT_ID);

      // eslint-disable-next-line camelcase
      yield put(updateCurrentUser({ identity: agent_id }));
    }
  } catch (e) {
    yield put(unAuthenticate());
  }
}

/**
 * When a socket disconnection happens
 * and redirect to login page
 */
export function* socketDisconnectionSaga({ socket }) {
  const location = yield select(makeSelectRouteLocation());
  yield put(defaultLoad());
  const isAnonymous = socket && socket.params && !socket.params().token;
  if (!isAnonymous) {
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
