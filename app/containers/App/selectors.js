import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectRouter = (state) => state.router;
const selectRouteLocation = (state) => state.router.location;
const selectGlobal = (state) => state.global || initialState;
const selectError = (state) => state.global.error || initialState.error;
const selectSuccessMessage = (state) =>
  state.global.successMessage || initialState.successMessage;
const selectCurrentSession = (state) =>
  state.global.currentSession || initialState.currentSession;
const selectCurrentUser = (state) =>
  state.global.currentSession.currentUser ||
  initialState.currentSession.currentUser;
const selectCurrentUserName = (state) =>
  state.global.currentSession.currentUser.username ||
  initialState.currentSession.currentUser.username;
const selectHeaderMenu = (state) =>
  state.global.headerMenu || initialState.headerMenu;
const selectHasAuthenticated = (state) =>
  state.global.currentSession.authenticated ||
  initialState.currentSession.authenticated;
const selectProgressMessage = (state) =>
  state.global.progressMessage || initialState.progressMessage;
const selectLoadingType = (state) =>
  state.global.loadingType || initialState.loadingType;
const selectLoadingStatus = (state) =>
  state.global.loadingStatus || initialState.loadingStatus;
const selectLoadingStatusForKey = (state, props) =>
  state.global.loadingStatus[props.loadingStatusKey] ||
  initialState.loadingStatus;

const makeSelectLocation = () =>
  createSelector(selectRouter, (routerState) => routerState.location);

const makeSelectHeaderMenu = () =>
  createSelector(selectHeaderMenu, (menu) => menu);

const makeSelectRouteLocation = () =>
  createSelector(selectRouteLocation, (routeLocation) => routeLocation);

const makeSelectGlobalError = () =>
  createSelector(selectError, (error) => error);

const makeSelectSuccessMessage = () =>
  createSelector(selectSuccessMessage, (successMessage) => successMessage);

const makeSelectCurrentSession = () =>
  createSelector(selectCurrentSession, (currentSession) => currentSession);

const makeSelectCurrentUser = () =>
  createSelector(selectCurrentUser, (currentUser) => currentUser);

const makeSelectHasAuthenticated = () =>
  createSelector(
    selectHasAuthenticated,
    (hasAuthenticated) => hasAuthenticated,
  );

const makeSelectProgressMessage = () =>
  createSelector(selectProgressMessage, (message) => message);

const makeSelectLoadingType = () =>
  createSelector(selectLoadingType, (type) => type);

const makeSelectLoadingStatus = () =>
  createSelector(selectLoadingStatus, (status) => status);

const makeSelectLoadingStatusForKey = () =>
  createSelector(selectLoadingStatusForKey, (status) => status);

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
