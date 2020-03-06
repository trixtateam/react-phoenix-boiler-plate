import { put, select, takeLatest } from 'redux-saga/effects';
import {
  AUTHENTICATION_REQUEST,
  SIGN_OUT,
} from '../../../containers/App/constants';
import { PHOENIX_TOKEN, AGENT_ID } from '../../../phoenix/constants';
import {
  unAuthenticate,
  updateCurrentUser,
} from '../../../containers/App/actions';
import { makeSelectSocket } from '../../../containers/App/selectors';
import {
  connectSocket,
  disconnectSocketAndLogout,
} from '../../../phoenix/actions';
import { getLocalStorageItem, isNullOrEmpty } from '../../../phoenix/utils';

export function* signOutSaga({ dispatch }) {
  const socket = yield select(makeSelectSocket());
  disconnectSocketAndLogout({ socket, dispatch });
}

/**
 * Checks the auth token if valid and see if socket is still available. If there is a token will attempt to load the profile details for the user
 * @returns {IterableIterator<*>}
 */
export function* authenticateSaga({ dispatch }) {
  try {
    const socket = yield select(makeSelectSocket());
    if (!socket || !socket.conn) {
      yield put(connectSocket({ dispatch }));
    }
    const token = getLocalStorageItem(PHOENIX_TOKEN);
    if (!isNullOrEmpty(token)) {
      // eslint-disable-next-line camelcase
      const agent_id = getLocalStorageItem(AGENT_ID);
      // eslint-disable-next-line camelcase
      yield put(updateCurrentUser({ jwt: token, agent_id, dispatch }));
    }
  } catch (e) {
    yield put(unAuthenticate());
  }
}

// Individual exports for testing
export default function* defaultSaga() {
  yield takeLatest(SIGN_OUT, signOutSaga);
  yield takeLatest(AUTHENTICATION_REQUEST, authenticateSaga);
}
