/* eslint-disable jsx-quotes */
/**
 *
 * AppHeader
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import _ from 'lodash';
import { toast, ToastContainer } from 'react-toastify';
import { createStructuredSelector } from 'reselect';
import { Button, Menu } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { isAuthenticated } from '@trixta/phoenix-to-redux';
import {
  makeSelectCurrentUser,
  makeSelectGlobalError,
  makeSelectHasAuthenticated,
  makeSelectLocation,
  makeSelectProgressMessage,
  makeSelectLoadingType,
  makeSelectSuccessMessage,
  makeSelectHeaderMenu,
} from '../../../containers/App/selectors';
import {
  authenticate,
  resetError,
  signOut,
} from '../../../containers/App/actions';
import messages from './messages';
import { isNullOrEmpty } from '../../../utils/helpers';
import Loading from '../../common/Loading';
import MenuLinks from '../../menus/MenuLinks';

class AppHeader extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {};

    this.signOut = this.signOut.bind(this);
    this.renderActivityProgress = this.renderActivityProgress.bind(this);
  }

  /**
   * After component is done rendering and finish with all life cycle methods
   */
  componentDidMount() {
    const {
      // eslint-disable-next-line no-shadow
      dispatchAuthenticate,
    } = this.props;
    dispatchAuthenticate();
  }

  /**
   * Pass props of updated values when component changes
   * @param {object} error error messages
   * @param {object} currentUser the current user
   */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps({ error, successMessage }) {
    const prevProps = this.props;
    if (!_.isEqual(prevProps.error, error) && !isNullOrEmpty(error)) {
      if (_.isArray(error)) {
        _.forEach(error, (errMsg) => {
          if (errMsg) {
            toast.error(errMsg, { position: toast.POSITION.TOP_CENTER });
          }
        });
      } else {
        toast.error(error, { position: toast.POSITION.TOP_CENTER });
      }

      prevProps.dispatchResetError();
    }
    if (
      successMessage &&
      !_.isEqual(_.get(prevProps, 'successMessage', ''), successMessage)
    ) {
      toast.success(successMessage, {
        position: toast.POSITION.TOP_CENTER,
        className: 'toast--positive-feedback',
      });
    }
  }

  /**
   * logout of the application
   */
  signOut() {
    // eslint-disable-next-line no-shadow
    const { dispatchSignOut } = this.props;
    dispatchSignOut();
  }

  renderActivityProgress() {
    const { progressMessage, loadingType } = this.props;
    if (progressMessage) {
      const values = _.get(progressMessage, 'values', false);
      if (values) {
        return (
          <FormattedMessage {...progressMessage} values={values}>
            {(text) => (
              <Loading
                loadingText={text}
                isLoading
                loaderType={loadingType}
                semanticDimmerProps={{ page: true }}
              />
            )}
          </FormattedMessage>
        );
      }
      return (
        <FormattedMessage {...progressMessage}>
          {(text) => (
            <Loading
              loadingText={text}
              isLoading
              loaderType={loadingType}
              semanticDimmerProps={{ page: true }}
            />
          )}
        </FormattedMessage>
      );
    }

    return null;
  }

  render() {
    const { headerMenu } = this.props;
    return (
      <div>
        {this.renderActivityProgress()}
        <ToastContainer newestOnTop />
        <Menu size="large">
          <Menu.Menu position="left">
            <MenuLinks
              menuItems={headerMenu}
              isUserAuthenticated={isAuthenticated()}
            />
          </Menu.Menu>
          <Menu.Menu position="right">
            {isAuthenticated() && (
              <Menu.Item>
                <Button onClick={this.signOut} primary>
                  <FormattedMessage {...messages.logOut} />
                </Button>
              </Menu.Item>
            )}
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}

AppHeader.propTypes = {
  currentUser: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.bool,
  ]),
  error: PropTypes.any,
  successMessage: PropTypes.any,
  history: PropTypes.object,
  dispatchSignOut: PropTypes.func,
  dispatchAuthenticate: PropTypes.func,
  location: PropTypes.object,
  dispatchResetError: PropTypes.func,
  progressMessage: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  loadingType: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  intl: intlShape.isRequired,
  headerMenu: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
  error: makeSelectGlobalError(),
  successMessage: makeSelectSuccessMessage(),
  location: makeSelectLocation(),
  hasAuthenticated: makeSelectHasAuthenticated(),
  progressMessage: makeSelectProgressMessage(),
  loadingType: makeSelectLoadingType(),
  headerMenu: makeSelectHeaderMenu(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    dispatchAuthenticate: () => dispatch(authenticate({})),
    dispatchSignOut: () => dispatch(signOut()),
    dispatchResetError: () => dispatch(resetError()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default compose(
  withRouter,
  withConnect,
  injectIntl,
)(AppHeader);
