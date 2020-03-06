/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage container.
 */
import { defineMessages } from 'react-intl';

export const scope = 'app.containers.LanguageProvider';

export default defineMessages({
  en: {
    id: `${scope}.en`,
    defaultMessage: 'en',
  },
  de: {
    id: `${scope}.de`,
    defaultMessage: 'de',
  },
});
