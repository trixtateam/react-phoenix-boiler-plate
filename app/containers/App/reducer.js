import produce from 'immer';
import _ from 'lodash';
import {
  socketActionTypes,
  PHOENIX_CHANNEL_END_PROGRESS,
  PHOENIX_CHANNEL_LOADING_STATUS,
} from '@trixta/phoenix-to-redux';
import {
  AUTHENTICATION_FAILED,
  END_PROGRESS,
  LOADING,
  LOGGING_IN,
  RESET_ERROR,
  SIGN_OUT,
  UPDATE_CURRENT_USER,
  UPDATE_ERROR,
  UPDATE_LOADING_STATUS,
} from './constants';
import { LOADING_TYPE } from '../../components/common/Loading/constants';
import messages from './messages';
import { routePaths } from '../../route-paths';
import { getMessageFromError } from '../../utils/helpers';

// The initial state of the App
export const initialState = {
  loading: false,
  loadingStatus: {},
  loadingType: false,
  error: false,
  headerMenu: [
    { label: messages.homeMenu, path: routePaths.HOME_PAGE },
    { label: messages.loginMenu, path: routePaths.LOGIN_PAGE },
  ],
  successMessage: false,
  progressMessage: false,
  currentSession: {
    authenticated: false,
    currentUser: {},
  },
  // this will be sent from the server as users current role permission to certain parts
};
/* eslint-disable default-case, no-param-reassign, consistent-return */
const appReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case UPDATE_LOADING_STATUS:
      case PHOENIX_CHANNEL_LOADING_STATUS:
        draft.loadingStatus[_.get(action, 'data.loadingStatusKey', '')] = {
          status: true,
        };
        break;
      case PHOENIX_CHANNEL_END_PROGRESS:
      case END_PROGRESS:
        {
          const loadingStatusKey = _.get(
            action,
            'data.loadingStatusKey',
            false,
          );
          if (!loadingStatusKey) {
            draft.progressMessage = false;
            draft.loadingType = false;
          } else {
            delete draft.loadingStatus[loadingStatusKey];
          }
        }
        break;
      case LOADING:
        draft.progressMessage = { ...messages.loading };
        draft.loadingType = _.get(
          action,
          'data.loadingType',
          LOADING_TYPE.logo,
        );
        break;
      case LOGGING_IN:
        draft.progressMessage = { ...messages.loggingIn };
        draft.loadingType = _.get(
          action,
          'data.loadingType',
          LOADING_TYPE.logo,
        );
        break;
      case UPDATE_ERROR:
        draft.error = _.isObjectLike(action.error)
          ? getMessageFromError(action.error)
          : action.error;
        draft.progressMessage = false;
        draft.loadingType = false;
        break;
      case RESET_ERROR:
        draft.error = null;
        draft.progressMessage = false;
        draft.loadingType = false;
        break;
      case UPDATE_CURRENT_USER:
        draft.currentSession.currentUser.username = _.get(
          action,
          'data.user',
          '',
        );
        break;
      case SIGN_OUT:
        return initialState;
      case AUTHENTICATION_FAILED:
        draft.currentSession.authenticated = false;
        draft.progressMessage = false;
        draft.loadingType = false;
        break;
      case socketActionTypes.SOCKET_ERROR:
      case socketActionTypes.SOCKET_CONNECT:
        draft.progressMessage = false;
        draft.loadingType = false;
        break;
      default:
        return state;
    }
  });
export default appReducer;
