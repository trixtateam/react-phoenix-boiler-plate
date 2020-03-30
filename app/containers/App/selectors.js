import { createSelector } from 'reselect';
import { transformImmutableToRelativeType } from '../../utils/helpers';

const selectRouter = (state) => state.get('router');
const selectRouteLocation = (state) => state.getIn(['router', 'location']);
const selectGlobal = (state) => state.get('global');
const selectError = (state) => state.getIn(['global', 'error']);
const selectSuccessMessage = (state) =>
  state.getIn(['global', 'successMessage']);
const selectCurrentSession = (state) =>
  state.getIn(['global', 'currentSession']);
const selectCurrentUser = (state) =>
  state.getIn(['global', 'currentSession', 'currentUser']);
const selectHeaderMenu = (state) => state.getIn(['global', 'headerMenu']);
const selectCurrentUserName = (state) =>
  state.getIn(['global', 'currentSession', 'currentUser', 'username']);
const selectHasAuthenticated = (state) =>
  state.getIn(['global', 'currentSession', 'authenticated']);
const selectProgressMessage = (state) =>
  state.getIn(['global', 'progressMessage']);
const selectLoadingType = (state) => state.getIn(['global', 'loadingType']);
const selectLoadingStatus = (state) => state.getIn(['global', 'loadingStatus']);
const selectLoadingStatusForKey = (state, props) =>
  state.getIn(['global', 'loadingStatus', props.loadingStatusKey]);

const makeSelectLocation = () =>
  createSelector(selectRouter, (routerState) =>
    routerState.get('location').toJS(),
  );

const makeSelectHeaderMenu = () =>
  createSelector(selectHeaderMenu, (menu) =>
    transformImmutableToRelativeType(menu),
  );

const makeSelectRouteLocation = () =>
  createSelector(selectRouteLocation, (routeLocation) =>
    transformImmutableToRelativeType(routeLocation),
  );

const makeSelectGlobalError = () =>
  createSelector(selectError, (error) =>
    transformImmutableToRelativeType(error),
  );

const makeSelectSuccessMessage = () =>
  createSelector(selectSuccessMessage, (successMessage) =>
    transformImmutableToRelativeType(successMessage),
  );

const makeSelectCurrentSession = () =>
  createSelector(selectCurrentSession, (currentSession) =>
    transformImmutableToRelativeType(currentSession),
  );

const makeSelectCurrentUser = () =>
  createSelector(selectCurrentUser, (currentUser) =>
    transformImmutableToRelativeType(currentUser),
  );

const makeSelectHasAuthenticated = () =>
  createSelector(
    selectHasAuthenticated,
    (hasAuthenticated) => hasAuthenticated,
  );

const makeSelectProgressMessage = () =>
  createSelector(selectProgressMessage, (message) =>
    transformImmutableToRelativeType(message),
  );

const makeSelectLoadingType = () =>
  createSelector(selectLoadingType, (message) =>
    transformImmutableToRelativeType(message),
  );

const makeSelectLoadingStatus = () =>
  createSelector(selectLoadingStatus, (status) =>
    transformImmutableToRelativeType(status),
  );

const makeSelectLoadingStatusForKey = () =>
  createSelector(selectLoadingStatusForKey, (status) =>
    transformImmutableToRelativeType(status),
  );

export {
  selectCurrentSession,
  selectCurrentUser,
  selectCurrentUserName,
  selectError,
  selectGlobal,
  selectHasAuthenticated,
  selectLoadingStatus,
  selectLoadingStatusForKey,
  selectLoadingType,
  selectProgressMessage,
  selectRouteLocation,
  selectRouter,
  selectSuccessMessage,
  makeSelectLocation,
  makeSelectCurrentSession,
  makeSelectCurrentUser,
  makeSelectGlobalError,
  makeSelectHasAuthenticated,
  makeSelectLoadingStatus,
  makeSelectLoadingStatusForKey,
  makeSelectLoadingType,
  makeSelectProgressMessage,
  makeSelectRouteLocation,
  makeSelectSuccessMessage,
  makeSelectHeaderMenu,
};
