import { put, select, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import _ from 'lodash';
import {
  getAnonymousPhoenixChannel,
  pushToPhoenixChannel,
} from '@trixta/phoenix-to-redux';
import {
  REQUEST_LOGIN,
  REQUEST_LOGIN_FAILURE,
  REQUEST_LOGIN_SUCCESS,
  REQUEST_LOGIN_TIMEOUT,
} from './constants';
import {
  loggingIn,
  updateCurrentUser,
  updateError,
  authenticate,
} from '../App/actions';
import { routePaths } from '../../route-paths';
import { defaultLoad, loginFailed } from './actions';
import { socketChannels, authenticationEvents } from '../../phoenix/constants';
import { makeSelectRouteLocation } from '../App/selectors';
import {
  getAuthenticationRedirectUrl,
  setLocalStorageItem,
} from '../../utils/helpers';
import {
  PHOENIX_SOCKET_DOMAIN,
  PHOENIX_TOKEN,
  PHOENIX_AGENT_ID,
} from '../../config';
/**
 *
 * @param dispatch
 * @param data
 * @returns {IterableIterator<IterableIterator<*>|void|*>}
 */
export function* loginSaga({ data }) {
  try {
    yield put(loggingIn());
    const channelTopic = socketChannels.AUTHENTICATION;
    const domainUrl = _.get(data, 'domain', '');
    setLocalStorageItem(PHOENIX_SOCKET_DOMAIN, domainUrl);
    yield put(
      getAnonymousPhoenixChannel({
        domainUrl,
        channelTopic,
      }),
    );
    yield put(
      pushToPhoenixChannel({
        channelTopic,
        eventName: authenticationEvents.LOGIN,
        channelResponseEvent: REQUEST_LOGIN_SUCCESS,
        channelErrorResponseEvent: REQUEST_LOGIN_FAILURE,
        requestData: data,
        dispatchChannelError: false,
        channelTimeOutEvent: REQUEST_LOGIN_TIMEOUT,
        channelPushTimeOut: 5000,
      }),
    );
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
    setLocalStorageItem(PHOENIX_TOKEN, jwt);
    setLocalStorageItem(PHOENIX_AGENT_ID, agent_id);
    yield put(updateCurrentUser(loginResponse));
    yield put(authenticate());
    // Reset/Upgrade socket to latest authorization
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
