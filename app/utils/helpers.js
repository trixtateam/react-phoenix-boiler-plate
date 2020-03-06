import _ from 'lodash';

/**
 * Checks if email address is valid
 * @param emailAddress
 * @returns {boolean}
 */
export const isValidEmail = (emailAddress) => {
  // eslint-disable-next-line no-useless-escape
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return regex.test(emailAddress);
};

export const toString = (id = '') => `${id}`;

/*
 * Returns true if the value if null or undefined or empty
 * @param value
 * @returns {boolean}
 */
function isNullOrEmpty(value) {
  if (_.isNull(value)) {
    return true;
  }
  if (_.isUndefined(value)) {
    return true;
  }
  if (_.isArray(value) && _.isEmpty(value)) {
    return true;
  }
  if (!Number.isInteger(value) && Object.keys(value).length === 0) {
    return true;
  }
  if (value.length === 0) {
    return true;
  }

  return false;
}

/**
 * returns the immutableType to object or array
 * @param immutableType
 */
function transformImmutableToRelativeType(immutableType) {
  return immutableType && immutableType.toJS
    ? immutableType.toJS()
    : immutableType;
}

/**
 * Returns errors for the given errorKey, section, index
 * @param{Object} errors - object with error keys with their associated error message
 * @param{Object?} errorKey - { id , defaultMessage }
 * @param{null || string?} section - tab section or sub tab section
 * @param{null || number?} index - index of the errors for the section
 * @returns {boolean}
 */
function getErrorsForKey({ errors, errorKey, section = null, index = null }) {
  if (!isNullOrEmpty(index)) {
    if (errorKey) {
      return _.get(
        errors,
        `${section}.[${index}].${_.get(errorKey, 'id', '')}`,
        false,
      );
    }
    return _.get(errors, `${section}.[${index}]`, false);
  }

  if (section) {
    if (errorKey) {
      return _.get(errors, `${section}.${_.get(errorKey, 'id', '')}`, false);
    }
    return _.get(errors, `${section}`, false);
  }
  if (errorKey) {
    return _.get(errors, `${_.get(errorKey, 'id', '')}`, false);
  }
  return false;
}

/**
 * This removes the error from the current object of errors
 * @param{Object} errors - object with error keys with their associated error message
 * @param{Object? || Array} errorKey - { id , defaultMessage }
 */
function removeErrorsForKey({ errors, errorKey }) {
  if (_.isArray(errorKey)) {
    _.forEach(errorKey, (errorKeyItem) => {
      if (getErrorsForKey({ errors, errorKeyItem })) {
        return _.omit(errors, _.get(errorKey, 'id', ''), false);
      }
      return false;
    });
  }
  if (getErrorsForKey({ errors, errorKey })) {
    return _.omit(errors, _.get(errorKey, 'id', ''), false);
  }
  return false;
}

export {
  isNullOrEmpty,
  transformImmutableToRelativeType,
  getErrorsForKey,
  removeErrorsForKey,
};
