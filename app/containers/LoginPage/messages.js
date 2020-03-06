/*
 * LoginPage Messages
 *
 * This contains all the text for the LoginPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.LoginPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Log-in to your account',
  },
  login: {
    id: `${scope}.login`,
    defaultMessage: 'Login',
  },
  loggingIn: {
    id: `${scope}.loggingIn`,
    defaultMessage: 'Logging in...',
  },
  username: {
    id: `${scope}.username`,
    defaultMessage: 'Username',
  },
  emailAddress: {
    id: `${scope}.emailAddress`,
    defaultMessage: 'Email Address',
  },
  password: {
    id: `${scope}.password`,
    defaultMessage: 'Password',
  },
  signUpQuestion: {
    id: `${scope}.signUpQuestion`,
    defaultMessage:
      'Don\'t have an account yet? <a href="{signUpLink}">Sign up</a>',
  },
  signUp: {
    id: `${scope}.signUp`,
    defaultMessage: 'Sign up',
  },
  usernameValidation: {
    id: `${scope}.usernameValidation`,
    defaultMessage: 'Email Address required',
  },
  domainValidation: {
    id: `${scope}.domainValidation`,
    defaultMessage: 'Domain required',
  },
  passwordValidation: {
    id: `${scope}.passwordValidation`,
    defaultMessage: 'Password required',
  },
  loginConnectionAttemptFailure: {
    id: `${scope}.loginAttemptFailure`,
    defaultMessage:
      'Please confirm your domain address is correct, otherwise issues logging in right now are known and we are working to resolve it as soon as we can',
  },
});
