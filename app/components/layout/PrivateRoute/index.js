/**
 *
 * PrivateRoute
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import { routePaths } from '../../../route-paths';
import { PHOENIX_TOKEN } from '../../../phoenix/constants';

/**
 * The private route that will determine if things are allowed to be viewed and redirected to or not
 * @param {*} component The component in question
 */
const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem(PHOENIX_TOKEN) !== null;
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...rest} />
        ) : (
          <Redirect
            to={{
              pathname: routePaths.LOGIN_PAGE,
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.any,
  location: PropTypes.any,
};

export default PrivateRoute;
