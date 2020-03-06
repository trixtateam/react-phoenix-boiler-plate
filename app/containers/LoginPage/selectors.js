import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { transformImmutableToRelativeType } from '../../utils/helpers';

/**
 * Direct selector to the loginPage state domain
 */

const selectLoginPageDomain = (state) => state.get('loginPage', initialState);
const selectErrors = (state) =>
  state.getIn(['loginPage', 'response', 'errors']);
const selectWarnings = (state) =>
  state.getIn(['loginPage', 'response', 'warnings']);
const selectSuccess = (state) =>
  state.getIn(['loginPage', 'response', 'success']);
const selectIsLoggingIn = (state) => state.getIn(['loginPage', 'isLoggingIn']);
/**
 * Other specific selectors
 */

/**
 * Default selector used by LoginPage
 */

const makeSelectLoginPage = () =>
  createSelector(selectLoginPageDomain, (substate) => substate.toJS());

const makeSelectErrors = () =>
  createSelector(selectErrors, (errors) =>
    transformImmutableToRelativeType(errors),
  );

const makeSelectWarnings = () =>
  createSelector(selectWarnings, (warnings) =>
    transformImmutableToRelativeType(warnings),
  );

const makeSelectSuccess = () =>
  createSelector(selectSuccess, (success) =>
    transformImmutableToRelativeType(success),
  );

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
