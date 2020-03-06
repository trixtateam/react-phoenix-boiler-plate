/*
 * Header Messages
 *
 * This contains all the text for the Header component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'app.components.Header';

export default defineMessages({
  home: {
    id: `${scope}.home`,
    defaultMessage: 'Home',
  },
  logOut: {
    id: `${scope}.logOut`,
    defaultMessage: 'Log Out',
  },
});
