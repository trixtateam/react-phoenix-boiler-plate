/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const DEFAULT_LOCALE = 'en';
export const RESET_ERROR = 'app/RESET_ERROR';
export const UPDATE_ERROR = 'app/UPDATE_ERROR';
export const AUTHENTICATION_REQUEST = 'app/AUTHENTICATION_REQUEST';
export const AUTHENTICATION_FAILED = 'app/AUTHENTICATION_FAILED';
export const SIGN_OUT = 'app/SIGN_OUT';
export const UPDATE_CURRENT_USER = 'app/UPDATE_CURRENT_USER';
export const UPDATE_LOADING_STATUS = 'app/UPDATE_LOADING_STATUS';
export const LOADING = 'app/LOADING';
export const SAVING = 'app/SAVING';
export const LOGGING_IN = 'app/LOGGING_IN';
export const END_PROGRESS = 'app/END_PROGRESS';
