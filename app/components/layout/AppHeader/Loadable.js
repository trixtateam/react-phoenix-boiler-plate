/**
 *
 * Asynchronously loads the component for Header
 *
 */

import loadable from '../../../utils/loadable';
import Loading from '../../common/Loading';

export default loadable(() => import('./index'), {
  fallback: Loading,
});
