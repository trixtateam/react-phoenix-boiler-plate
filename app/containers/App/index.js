/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';

import HomePage from '../HomePage/Loadable';
import NotFoundPage from '../NotFoundPage/Loadable';
import LoginPage from '../LoginPage/Loadable';
import AppHeader from '../../components/layout/AppHeader/Loadable';
import PrivateRoute from '../../components/layout/PrivateRoute';
import { routePaths } from '../../route-paths';

export default function App() {
  return (
    <div>
      <AppHeader />
      <Switch>
        <PrivateRoute exact path={routePaths.HOME_PAGE} component={HomePage} />
        <Route component={LoginPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
}
