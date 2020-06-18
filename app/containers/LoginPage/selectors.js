import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the loginPage state domain
 */

const selectLoginPageDomain = (state) => state.loginPage || initialState;
const selectErrors = (state) =>
  state.loginPage.response.errors || initialState.response.errors;
const selectWarnings = (state) =>
  state.loginPage.response.warnings || initialState.response.warnings;
const selectSuccess = (state) =>
  state.loginPage.response.success || initialState.response.success;
const selectIsLoggingIn = (state) =>
  state.loginPage.isLoggingIn || initialState.isLoggingIn;
/**
 * Other specific selectors
 */

/**
 * Default selector used by LoginPage
 */

const makeSelectLoginPage = () =>
  createSelector(selectLoginPageDomain, (substate) => substate);

const makeSelectErrors = () => createSelector(selectErrors, (errors) => errors);

const makeSelectWarnings = () =>
  createSelector(selectWarnings, (warnings) => warnings);

const makeSelectSuccess = () =>
  createSelector(selectSuccess, (success) => success);

const makeSelectIsLoggingIn = () =>
  createSelector(selectIsLoggingIn, (loggingIn) => loggingIn);

export default makeSelectLoginPage;
export {
  selectLoginPageDomain,
  selectErrors,
  selectIsLoggingIn,
  selectSuccess,
  selectWarnings,
  makeSelectErrors,
  makeSelectIsLoggingIn,
  makeSelectSuccess,
  makeSelectWarnings,
};
