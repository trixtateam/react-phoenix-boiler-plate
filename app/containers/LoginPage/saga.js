import { put, select, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import _ from 'lodash';
import {
  REQUEST_LOGIN,
  REQUEST_LOGIN_FAILURE,
  REQUEST_LOGIN_SUCCESS,
  REQUEST_LOGIN_TIMEOUT,
} from './constants';
import { loggingIn, updateCurrentUser, updateError } from '../App/actions';
import { makeSelectRouteLocation, makeSelectSocket } from '../App/selectors';
import { disconnectSocket, pushToChannel } from '../../phoenix/actions';
import { routePaths } from '../../route-paths';
import { defaultLoad, loginFailed } from './actions';
import {
  authenticationEvents,
  SOCKET_DOMAIN,
  SOCKET_URL,
  socketChannels,
} from '../../phoenix/constants';
import {
  getAuthenticationRedirectUrl,
  setLocalStorageItem,
  formatSocketDomain,
} from '../../phoenix/utils';
import { getAnonymousChannel } from '../../phoenix/socketSagas';

/**
 *
 * @param dispatch
 * @param data
 * @returns {IterableIterator<IterableIterator<*>|void|*>}
 */
export function* loginSaga({ dispatch, data }) {
  try {
    yield put(loggingIn());
    const channelName = socketChannels.AUTHENTICATION;
    const domainDetails = _.get(data, 'domain', '');
    const domain = formatSocketDomain({ domainString: domainDetails });
    setLocalStorageItem(SOCKET_DOMAIN, domain);
    const socketUrl = domain
      .replace(/(wss?:\/\/|wss?:)/g, '')
      .replace('/socket', '');
    setLocalStorageItem(SOCKET_URL, socketUrl);
    const socket = yield getAnonymousChannel({ dispatch, channelName });
    yield pushToChannel({
      dispatch,
      channelName,
      eventName: authenticationEvents.LOGIN,
      customOKResponseEvent: REQUEST_LOGIN_SUCCESS,
      customErrorResponseEvent: REQUEST_LOGIN_FAILURE,
      requestData: data,
      socket,
      dispatchGlobalError: true,
      customerTimeoutEvent: REQUEST_LOGIN_TIMEOUT,
    });
  } catch (error) {
    yield put(loginFailed(error));
    yield put(updateError({ error: error.toString() }));
  }
}

/**
 *
 * @param data
 * @param dispatch
 * @returns {IterableIterator<*>}
 */
export function* handleLoginSuccessSaga({ data }) {
  if (data) {
    const routeLocation = yield select(makeSelectRouteLocation());
    const redirectUrl = getAuthenticationRedirectUrl({
      routeLocation,
      defaultUrl: routePaths.HOME_PAGE,
    });
    // eslint-disable-next-line camelcase
    const agent_id = _.get(data, 'agent_id', '');
    const identity = _.get(data, 'identity', '');
    const jwt = _.get(data, 'jwt', '');
    // eslint-disable-next-line camelcase
    const role_ids = _.get(data, 'role_ids', '');
    const loginResponse = {
      agent_id,
      identity,
      jwt,
      role_ids,
    };
    yield put(updateCurrentUser(loginResponse));
    // Reset/Upgrade socket to latest authorization
    const socket = yield select(makeSelectSocket());
    disconnectSocket(socket);
    yield put(push(redirectUrl));
  } else {
    yield put(loginFailed());
  }
}

export function* handleLoginFailureSaga(error) {
  yield put(
    updateError({
      error: _.get(error.data, 'reason', 'Authentication Failed'),
    }),
  );
  yield put(defaultLoad());
}

export function* handleLoginTimeoutSaga() {
  yield put(
    updateError({
      error:
        'Server is taking longer than expected to respond. Please try again later .',
    }),
  );
}

// Individual exports for testing
export default function* loginPageSaga() {
  yield takeLatest(REQUEST_LOGIN, loginSaga);
  yield takeLatest(REQUEST_LOGIN_TIMEOUT, handleLoginTimeoutSaga);
  yield takeLatest(REQUEST_LOGIN_SUCCESS, handleLoginSuccessSaga);
  yield takeLatest(REQUEST_LOGIN_FAILURE, handleLoginFailureSaga);
}
