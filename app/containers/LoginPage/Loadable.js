/**
 *
 * Asynchronously loads the component for LoginPage
 *
 */

import loadable from '../../utils/loadable';
import Loading from '../../components/common/Loading';

export default loadable(() => import('./index'), {
  fallback: Loading,
});
