import { Presence, Socket } from 'phoenix';
import warning from 'warning';
import _ from 'lodash';
import { push } from 'connected-react-router';
import {
  AGENT_ID,
  channelActionTypes,
  channelStatuses,
  NO_ACTION,
  PHOENIX_TOKEN,
  phoenixChannelStatuses,
  phoenixSocketStatuses,
  SOCKET_CONNECTION_ATTEMPTS,
  SOCKET_DOMAIN,
  SOCKET_URL,
  socketActionTypes,
  CHANNEL_NAME_PREFIX,
} from './constants';
import {
  endProgress,
  unAuthenticate,
  updateLoadingStatus,
} from '../containers/App/actions';
import { routePaths } from '../route-paths';
import { UPDATE_ERROR } from '../containers/App/constants';
import {
  isNullOrEmpty,
  getLocalStorageItem,
  formatSocketDomain,
  removeLocalStorageItem,
} from './utils';
import messages from '../containers/App/messages';
import { defaultLoad } from '../containers/LoginPage/actions';

const syncPresentUsers = (dispatch, presences) => {
  const presentUsers = [];
  Presence.list(presences, (id, { metas: [first] }) => first.user).map((user) =>
    presentUsers.push(user),
  );
  dispatch({ type: channelActionTypes.CHANNEL_PRESENCE_UPDATE, presentUsers });
};

/**
 * Returns the domain saved in local storage else the default production domain
 * @returns {string}
 */
export function getDomain() {
  return getLocalStorageItem(SOCKET_DOMAIN);
}

/**
 * Disconnects the socket and forces the user to logout and redirect to the login screen
 * @param{function} dispatch
 * @param{Object} socket
 * @param{Object} location - router location
 */
export function disconnectSocketAndLogout({
  dispatch,
  socket,
  location = null,
}) {
  removeLocalStorageItem(SOCKET_DOMAIN);
  removeLocalStorageItem(SOCKET_URL);
  dispatch(unAuthenticate());
  dispatch(defaultLoad());
  if (!isNullOrEmpty(location)) {
    dispatch(push(`${routePaths.LOGIN_PAGE}${_.get(location, 'search', '')}`));
  } else {
    dispatch(push(routePaths.LOGIN_PAGE));
  }
  dispatch(disconnectSocket(socket));
}

/**
 * Attempts to connect the socket and subscribes the socket events
 * to the corresponding phoenix reducer actions
 * @param{function} dispatch
 * @param{?boolean} useAuthentication - determines if the socket needs authentication params
 * @returns {{socket: Socket, type: string}|{type: string}}
 */
export function connectSocket({ dispatch, useAuthentication = true }) {
  const token = localStorage.getItem(PHOENIX_TOKEN);
  const agentId = localStorage.getItem(AGENT_ID);
  const domain = getDomain();
  const domainUrl = formatSocketDomain({ domainString: domain });
  let socket = false;
  if (!isNullOrEmpty(domainUrl)) {
    socket = new Socket(
      domainUrl,
      useAuthentication && token && agentId
        ? { params: { token, agent_id: agentId } }
        : {},
    );
    socket.connect();
    socket.onError((error) => {
      const connectionState = _.get(socket, 'conn.readyState');
      console.info(`Error on socket. Socket state: ${connectionState}`);
      console.error(error);
      if (
        _.isEqual(connectionState, phoenixSocketStatuses.CLOSED) ||
        _.isEqual(connectionState, phoenixSocketStatuses.CLOSING)
      ) {
        if (_.isFunction(dispatch)) {
          console.info('Connection to server lost.');
          dispatch(
            errorSocket(
              'Connection to server lost.',
              dispatch,
              connectionState,
            ),
          );
          disconnectSocketAndLogout({ socket, dispatch });
        }
      }
    });
    socket.onOpen(() => {
      localStorage.removeItem(SOCKET_CONNECTION_ATTEMPTS);
      dispatch(openSocket());
      console.info(`socket Open State: ${_.get(socket, 'conn.readyState')}`);
    });
    socket.onClose(() => dispatch(closeSocket()));
    return {
      type: socketActionTypes.SOCKET_CONNECT,
      socket,
    };
  }
  return disconnectSocket(socket);
}

/**
 * disconnects the socket and removes the socket from the phoenix reducer
 * @param socket
 * @returns {{type: string}}
 */
export function disconnectSocket(socket) {
  if (socket && !isNullOrEmpty(socket) && socket.disconnect) {
    console.info('disconnecting socket ...');
    socket.disconnect();
  }
  return {
    type: socketActionTypes.SOCKET_DISCONNECT,
  };
}

/**
 * Should the socket attempt to close, this action is dispatched to the
 * phoenix reducer
 * @returns {{type: string}}
 */
export function closeSocket() {
  return {
    type: socketActionTypes.SOCKET_CLOSE,
  };
}

/**
 * Should the socket attempt to open, this action is dispatched to the
 * phoenix reducer
 * @returns {{type: string}}
 */
export function openSocket() {
  return {
    type: socketActionTypes.SOCKET_OPEN,
  };
}

export function errorSocket(message, dispatch, socketState) {
  return {
    type: socketActionTypes.SOCKET_ERROR,
    error: message,
    data: {
      socketState,
    },
    dispatch,
  };
}

/**
 * Helper method to connect to channel within socket. Only used internally.
 * @param {Object} socket - phoenix socket
 * @param{string} channelName - Name of channel/Topic
 * @param dispatch - React dispatcher
 */
const connectToChannel = ({ socket, channelName, dispatch }) => {
  if (!hasValidSocket(socket)) {
    disconnectSocketAndLogout({ socket, dispatch });
    return null;
  }

  const channel = socket.channel(channelName);
  let presences = {};

  channel.on(phoenixChannelStatuses.CHANNEL_PRESENCE_STATE, (state) => {
    presences = Presence.syncState(presences, state);
    syncPresentUsers(dispatch, presences);
  });

  channel.on(phoenixChannelStatuses.CHANNEL_PRESENCE_CHANGE, (diff) => {
    presences = Presence.syncDiff(presences, diff);
    syncPresentUsers(dispatch, presences);
  });
  return channel;
};

/**
 * Checks to see if we have a valid socket object
 * @param {Object} socket - phoenix socket
 * @returns {boolean}
 */
export function hasValidSocket(socket) {
  if (socket === false) {
    warning(
      socket,
      'Socket requires initialization before connecting to a channel for an event',
    );
    return false;
  }
  if (_.isNull(socket)) {
    warning(
      socket,
      'Socket requires initialization before connecting to a channel for an event',
    );
    return false;
  }
  if (_.isUndefined(socket)) {
    warning(
      socket,
      'Socket requires initialization before connecting to a channel for an event',
    );
    return false;
  }

  return true;
}

/**
 * Connects to given channel name and listens on eventNames and dispatches response to given corresponding eventActionTypes,
 *
 * @param{function} dispatch
 * @param{string} channelName - Name of channel/Topic
 * @param {Array}  eventArrayMap - [{eventName, eventActionType}, ...] event map to listen to on channel
 * @param {String} responseActionType - on connection of the channel action type to dispatch to
 * @param {Object} socket - phoenix socket
 * @returns {Object}
 */
export function connectToChannelForEvents({
  dispatch,
  channelName,
  eventArrayMap,
  responseActionType,
  socket,
}) {
  if (!hasValidSocket(socket)) {
    disconnectSocketAndLogout({ socket, dispatch });
    return { type: NO_ACTION };
  }
  if (!Array.isArray(eventArrayMap)) {
    warning(
      Array.isArray(eventArrayMap),
      'connectToChannelForEvents requires an array of events to listen and react to',
    );
    return { type: NO_ACTION };
  }

  let channel = findChannelByName({ channelName, socket });
  if (!channel) {
    channel = connectToChannel({ socket, channelName, dispatch });
    channel
      .join()
      .receive(channelStatuses.CHANNEL_OK, (response) => {
        dispatch({
          type: channelActionTypes.CHANNEL_JOIN,
          dispatch,
          response,
          channel,
        });
        dispatch(endProgress({}));
      })
      .receive(channelStatuses.CHANNEL_ERROR, (response) => {
        dispatch({
          type: UPDATE_ERROR,
          error: messageForChannelJoinError(channelName, response.reason),
        });
        dispatch(endProgress({}));
      })
      .receive(channelStatuses.CHANNEL_TIMEOUT, (response) => {
        dispatch({
          type: channelActionTypes.CHANNEL_TIMEOUT,
          dispatch,
          response,
        });
        dispatch(endProgress({}));
      });
  }

  eventArrayMap.forEach(({ eventName, eventActionType }) => {
    if (!_.find(_.get(channel, 'bindings', []), { event: eventName })) {
      channel.on(eventName, (data) => {
        dispatch({ type: eventActionType, data, eventName });
      });
    }
  });
  return {
    type: responseActionType,
    channel,
  };
}

/**
 * Returns a friendly channel join error message
 * @param channelName
 * @param reason
 * @returns {string}
 */
function messageForChannelJoinError(channelName, reason) {
  if (reason === 'unauthorized') {
    return `You do not have permission to join the "${channelName.replace(
      CHANNEL_NAME_PREFIX,
      '',
    )}" channel . Please contact a domain administrator.`;
  }
  return `Could not join channel "${channelName.replace(
    CHANNEL_NAME_PREFIX,
    '',
  )}" . Reason: ${reason}`;
}

/**
 * Disconnects the channel by removing it from the socket
 *
 * @param {Function} dispatch
 * @param{string} channelName - Name of channel/Topic
 * @param {Object} socket - phoenix socket
 */
export function removeChannel({ dispatch, channelName, socket }) {
  if (!hasValidSocket(socket)) {
    disconnectSocketAndLogout({ socket, dispatch });
    return { type: NO_ACTION };
  }
  const channel = findChannelByName({ channelName, socket });
  leaveChannel(channelName, socket);
  if (channel) {
    socket.remove(channel);
    dispatch({ type: channelActionTypes.CHANNEL_LEAVE });
  }
  return {
    type: channelActionTypes.CHANNEL_LEAVE,
    channel,
  };
}

/**
 * Searches the connected socket channels by the channelName and returns the found channel
 * @param{string} channelName - Name of channel/Topic
 * @param {Object} socket - phoenix socket
 * @returns {T} Channel
 */
export function findChannelByName({ channelName, socket }) {
  if (!hasValidSocket(socket)) {
    return null;
  }
  return (
    socket.channels &&
    socket.channels.find((channel) => channel.topic === channelName)
  );
}

/**
 * Searches the connected socket channels by the channelName and removes the channel by un-subscribing for the given topic
 * @param{string} channelName - Name of channel/Topic
 * @param {Object} socket - phoenix socket
 */
export function leaveChannel(channelName, socket) {
  const channel = findChannelByName({ channelName, socket });
  if (channel) {
    channel.leave();
  }
}

/**
 * Will attempt to find a channel by name and topic on the given socket and push the data to the found channel,
 * on any CHANNEL_OK,CHANNEL_ERROR, CHANNEL_TIMEOUT the endProgress for the given loadingStatusKey will be dispatched
 * @param{function} dispatch
 * @param{string} channelName - Name of channel/Topic
 * @param{number} loaderTimeout - timeout in milliseconds if you want to delay the end progress of the loading indicator
 * @param{string} eventName - the name of the event on channel to push to
 * @param{?string} customOKResponseEvent - action type to dispatch to on response from pushing to channel
 * @param{?string} customErrorResponseEvent -  action type to dispatch to on error from pushing to channel
 * @param{object} requestData - data payload to push on the channel
 * @param{object} socket - phoenix socket
 * @param{?object} extraData - this object will merge with the response data object received from the channel
 * for you to use on later note
 * @param{?boolean} dispatchGlobalError - false by default, determines if should an
 * on channel error occur show it to the user via a toast
 * @param{?number} defaultTimeout - timeout in milliseconds for pushing to the channel, default is 1500
 * @param{?boolean || string} customTimeoutEvent - action type to dispatch to on timeout from pushing to channel
 * @param{?string} loadingStatusKey - key to push to app reducer to set loading status on
 */
export function pushToChannel({
  dispatch,
  channelName,
  loaderTimeout,
  eventName,
  customOKResponseEvent = null,
  customErrorResponseEvent = null,
  requestData,
  socket,
  extraData = null,
  dispatchGlobalError = false,
  defaultTimeout = 15000,
  customTimeoutEvent = false,
  loadingStatusKey = null,
}) {
  if (hasValidSocket(socket)) {
    const channel = findChannelByName({ channelName, socket });
    if (channel) {
      if (!isNullOrEmpty(loadingStatusKey)) {
        dispatch(updateLoadingStatus({ loadingStatusKey }));
      }
      channel
        .push(eventName, requestData, defaultTimeout)
        .receive(channelStatuses.CHANNEL_OK, (data) => {
          if (customOKResponseEvent) {
            if (extraData) {
              dispatch({
                type: customOKResponseEvent,
                data: _.merge(data, extraData),
                dispatch,
              });
            } else {
              dispatch({ type: customOKResponseEvent, data, dispatch });
            }
          }
          if (loaderTimeout) {
            setTimeout(() => {
              dispatch(endProgress({ loadingStatusKey }));
            }, loaderTimeout);
          } else {
            dispatch(endProgress({ loadingStatusKey }));
          }
          dispatch({ type: channelActionTypes.CHANNEL_PUSH, data });
        })
        .receive(channelStatuses.CHANNEL_ERROR, (data) => {
          if (customErrorResponseEvent) {
            if (extraData) {
              dispatch({
                type: customErrorResponseEvent,
                error: _.merge(data, extraData),
                dispatch,
              });
            } else {
              dispatch({
                type: customErrorResponseEvent,
                error: data,
                dispatch,
              });
            }
          }
          if (dispatchGlobalError) {
            dispatch({ type: UPDATE_ERROR, error: data });
          }
          dispatch(endProgress({ loadingStatusKey }));
          dispatch({
            type: channelActionTypes.CHANNEL_PUSH_ERROR,
            error: data,
          });
        })
        .receive(channelStatuses.CHANNEL_TIMEOUT, (data) => {
          if (customTimeoutEvent) {
            const timeoutMessageObject = messages.requestTimeout;
            dispatch({
              type: customTimeoutEvent,
              error: extraData
                ? _.merge(timeoutMessageObject, extraData)
                : timeoutMessageObject,
            });
          }
          dispatch({
            type: channelActionTypes.CHANNEL_TIMEOUT,
            error: data,
          });
          dispatch(endProgress({ loadingStatusKey }));
        });
    }
  } else {
    disconnectSocketAndLogout({ socket, dispatch });
  }
}
