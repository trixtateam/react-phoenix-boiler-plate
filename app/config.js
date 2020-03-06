export const ENVIRONMENT = process.env.NODE_ENV;
export const DOMAIN =
  process.env.NODE_ENV === 'development'
    ? 'analytics.test.trixta.io'
    : 'app.analytics.trixta.io';
export const DOMAIN_PREFIX =
  process.env.NODE_ENV === 'development' ? 'analytics.test' : 'app.analytics';
export const DOMAIN_NAME = '.trixta.io/socket';
export const DEFAULT_DOMAIN_SUFFIX = '.trixta.io';
export const SOCKET_URI = 'socket';
export const SOCKET_PROTOCOL_SECURE = 'wss:';
export const SOCKET_PROTOCOL_UNSECURE = 'ws:';
export const GOOGLE_RECAPTURE_KEY = process.env.GOOGLE_RECAPTURE_KEY || '';
