/**
 *
 * Menu
 *
 */

import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { injectIntl, intlShape } from 'react-intl';

/**
 * Link generator to navigate between application routes
 * @return {null}
 */
function MenuLinks({ isUserAuthenticated, menuItems, intl }) {
  if (isUserAuthenticated) {
    return (
      menuItems &&
      menuItems.map((item) => (
        <NavLink
          key={_.get(item, 'label.id', '')}
          to={_.get(item, 'path', '')}
          className="item"
          exact
          activeClassName="active"
        >
          {' '}
          {intl.formatMessage(_.get(item, 'label', ''))}
        </NavLink>
      ))
    );
  }
  return null;
}

MenuLinks.propTypes = {
  intl: intlShape.isRequired,
  isUserAuthenticated: PropTypes.bool,
  menuItems: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
};

export default injectIntl(MenuLinks);
