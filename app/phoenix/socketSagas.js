/* eslint-disable no-console */
import _ from 'lodash';
import { put, select } from 'redux-saga/effects';
import warning from 'warning';
import { connectSocket, connectToChannelForEvents, getDomain } from './actions';
import {
  makeSelectRouteLocation,
} from '../containers/App/selectors';
import {
  formatSocketDomain,
  getUrlParameter,
  isNullOrEmpty,
  setLocalStorageItem,
} from './utils';
import { channelActionTypes, SOCKET_DOMAIN } from './constants';
import { makeSelectSocket } from './selectors';

/**
 * Will attempt to create a connection to the socket for the given channel,
 * if there is a space parameter in the url will attempt to connect to that space using the same
 * agent and token
 * @param {Function} dispatch - store.dispatch for receiving the callbacks from the channel
 * @param{string} channelName - Name of channel/Topic
 * @param {?Array}  eventArrayMap - [{eventName, eventActionType}, ...] event map to listen to on channel
 * @param{?string} responseActionType - on connection of the channel action type to dispatch to
 * @returns {IterableIterator<*>}
 */
export function* getChannel({
  dispatch,
  channelName,
  eventArrayMap = [],
  responseActionType = channelActionTypes.CHANNEL_JOIN,
}) {
  let socket = yield select(makeSelectSocket());
  const routeLocation = yield select(makeSelectRouteLocation());
  const socketDomain = socket.endPoint;
  const domain = getUrlParameter({
    search: _.get(routeLocation, 'search', ''),
    parameterName: 'domain',
  });
  if (!isNullOrEmpty(domain)) {
    setLocalStorageItem(
      SOCKET_DOMAIN,
      formatSocketDomain({ domainString: domain }),
    );
  }

  const loginDomain = `${getDomain()}/websocket`;
  if (!_.isEqual(socketDomain, loginDomain)) {
    socket = false;
    console.info('re-initializing socket due to domain change');
  }
  if (!socket || !socket.conn) {
    warning('re-initializing socket', socket);
    const socketConnectionResult = yield put(connectSocket({ dispatch }));
    socket = socketConnectionResult.socket;
  }
  yield put(
    connectToChannelForEvents({
      dispatch,
      channelName,
      eventArrayMap,
      responseActionType,
      socket,
    }),
  );
  return socket;
}

/**
 * Will attempt to create a connection to the socket for the given channel,
 * if there is a space parameter in the url will attempt to connect to that space using the same
 * agent and token
 * @param {Function} dispatch - store.dispatch for receiving the callbacks from the channel
 * @param{string} channelName - Name of channel/Topic
 * @param{?string} responseActionType - on connection of the channel action type to dispatch to
 * @returns {IterableIterator<*>}
 */
export function* getAnonymousChannel({
  dispatch,
  channelName,
  responseActionType = channelActionTypes.CHANNEL_JOIN,
}) {
  const routeLocation = yield select(makeSelectRouteLocation());
  const domain = getUrlParameter({
    search: _.get(routeLocation, 'search', ''),
    parameterName: 'domain',
  });
  if (!isNullOrEmpty(domain)) {
    setLocalStorageItem(
      SOCKET_DOMAIN,
      formatSocketDomain({ domainString: domain }),
    );
  }

  const socketConnectionResult = yield put(
    connectSocket({ dispatch, useAuthentication: false }),
  );
  const { socket } = socketConnectionResult;
  yield put(
    connectToChannelForEvents({
      dispatch,
      channelName,
      eventArrayMap: [],
      responseActionType,
      socket,
    }),
  );
  return socket;
}
