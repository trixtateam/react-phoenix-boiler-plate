/**
 *
 * Asynchronously loads the component for Menu
 *
 */

import loadable from '../../../utils/loadable';
import Loading from '../../common/Loading';

export default loadable(() => import('./index'), {
  fallback: Loading,
});
