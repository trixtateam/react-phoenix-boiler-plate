import { fromJS } from 'immutable';
import _ from 'lodash';
import { socketActionTypes } from '../../phoenix/constants';
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

// The initial state of the App
export const initialState = fromJS({
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
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_LOADING_STATUS:
      return state.set(
        'loadingStatus',
        fromJS(
          state.get('loadingStatus').update((status) =>
            status.set(_.get(action, 'data.loadingStatusKey', ''), {
              status: true,
            }),
          ),
        ),
      );
    case END_PROGRESS:
      return state
        .set('progressMessage', false)
        .set('loadingType', false)
        .set(
          'loadingStatus',
          fromJS(
            state
              .get('loadingStatus')
              .delete(_.get(action, 'data.loadingStatusKey', '')),
          ),
        );
    case LOADING:
      return state
        .set('progressMessage', fromJS({ ...messages.loading }))
        .set(
          'loadingType',
          _.get(action, 'data.loadingType', LOADING_TYPE.logo),
        );
    case LOGGING_IN:
      return state
        .set('progressMessage', fromJS({ ...messages.loggingIn }))
        .set(
          'loadingType',
          _.get(action, 'data.loadingType', LOADING_TYPE.logo),
        );
    case UPDATE_ERROR:
      return state
        .set(
          'error',
          fromJS(
            _.isObjectLike(action.error)
              ? JSON.stringify(action.error)
              : action.error,
          ),
        )
        .set('progressMessage', false)
        .set('loadingType', false);
    case RESET_ERROR:
      return state
        .set('error', null)
        .set('progressMessage', false)
        .set('loadingType', false);
    case UPDATE_CURRENT_USER:
      return state.setIn(
        ['currentSession', 'currentUser', 'username'],
        fromJS(_.get(action, 'data.user', '')),
      );
    case SIGN_OUT:
      return initialState;
    case AUTHENTICATION_FAILED:
      return state
        .setIn(['currentSession', 'authenticated'], false)
        .set('progressMessage', false)
        .set('loadingType', false);
    case socketActionTypes.SOCKET_ERROR:
      return state.set('progressMessage', false).set('loadingType', false);
    case socketActionTypes.SOCKET_CONNECT:
      return state.set('progressMessage', false).set('loadingType', false);
    default:
      return state;
  }
}

export default appReducer;
