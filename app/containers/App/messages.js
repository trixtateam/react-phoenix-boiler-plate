/*
 * App Messages
 *
 */
import { defineMessages } from 'react-intl';

export const scope = 'app';

export default defineMessages({
  loading: {
    id: `${scope}.loading`,
    defaultMessage: 'Loading..',
  },
  validating: {
    id: `${scope}.validating`,
    defaultMessage: 'Validating..',
  },
  saving: {
    id: `${scope}.saving`,
    defaultMessage: 'Saving..',
  },
  sending: {
    id: `${scope}.sending`,
    defaultMessage: 'sending..',
  },
  loggingIn: {
    id: `${scope}.loggingIn`,
    defaultMessage: 'Logging in...',
  },
  signingUp: {
    id: `${scope}.signingUp`,
    defaultMessage: 'Signing up...',
  },
  deleting: {
    id: `${scope}.deleting`,
    defaultMessage: 'Deleting...',
  },
  no: {
    id: `${scope}.no`,
    defaultMessage: 'No',
  },
  yes: {
    id: `${scope}.yes`,
    defaultMessage: 'Yes',
  },
  requestTimeout: {
    id: `${scope}.requestTimeout`,
    defaultMessage: 'Request time out',
  },
  homeMenu: {
    id: `${scope}.homeMenu`,
    defaultMessage: 'Home',
  },
  loginMenu: {
    id: `${scope}.loginMenu`,
    defaultMessage: 'Login',
  },
});
