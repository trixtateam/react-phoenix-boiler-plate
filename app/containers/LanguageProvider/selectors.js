import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { appLocales } from '../../i18n';

const selectLocales = () => appLocales;
/**
 * Direct selector to the languageToggle state domain
 */
const selectLanguage = (state) => state.get('language', initialState);

/**
 * Select the language locale
 */

const makeSelectLocale = () =>
  createSelector(selectLanguage, (languageState) =>
    languageState.get('locale'),
  );

const makeSelectLocalesForDropDown = () =>
  createSelector(
    selectLocales,
    (locales) =>
      locales &&
      locales.map((value) => ({
        key: value,
        text: value,
        value,
      })),
  );

export { selectLanguage, makeSelectLocalesForDropDown, makeSelectLocale };
