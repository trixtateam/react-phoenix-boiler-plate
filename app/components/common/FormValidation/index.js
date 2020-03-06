/**
 *
 * FormValidation
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { injectIntl, intlShape } from 'react-intl';
import _ from 'lodash';
import { Message } from 'semantic-ui-react';
import { isNullOrEmpty } from '../../../utils/helpers';

function renderMessages(messages, intl) {
  return _.map(
    messages,
    (message) => (_.isObject(message) ? intl.formatMessage(message) : message),
  );
}

/**
 * Shows the error,warning or success messages in a card
 * @param{Array || String} warningMessages
 * @param{Array || String} errorMessages
 * @param{Array || String} successMessage
 * @param intl - formattedMessage intl
 * @returns {*}
 * @constructor
 * @return {null}
 */
function FormValidation({
  warningMessages,
  errorMessages,
  successMessage,
  intl,
}) {
  if (
    isNullOrEmpty(warningMessages) &&
    isNullOrEmpty(errorMessages) &&
    isNullOrEmpty(successMessage)
  ) {
    return null;
  }
  return (
    <React.Fragment>
      {!isNullOrEmpty(successMessage) && (
        <Message
          success
          list={
            _.isArray(successMessage)
              ? renderMessages(successMessage, intl)
              : renderMessages([successMessage], intl)
          }
        />
      )}
      {!isNullOrEmpty(errorMessages) && (
        <Message
          error
          list={
            _.isArray(errorMessages)
              ? renderMessages(errorMessages, intl)
              : renderMessages([errorMessages], intl)
          }
        />
      )}
      {!isNullOrEmpty(warningMessages) && (
        <Message
          warning
          list={
            _.isArray(warningMessages)
              ? renderMessages(warningMessages, intl)
              : renderMessages([warningMessages], intl)
          }
        />
      )}
    </React.Fragment>
  );
}

FormValidation.defaultProps = {
  warningMessages: false,
  errorMessages: false,
  successMessage: false,
};

FormValidation.propTypes = {
  warningMessages: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
  ]),
  intl: intlShape.isRequired,
  errorMessages: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
  ]),
  successMessage: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
  ]),
};

export default compose(injectIntl)(FormValidation);
