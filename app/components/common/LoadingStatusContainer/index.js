/**
 *
 * Loader
 *
 */

import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Dimmer, Divider, Loader } from 'semantic-ui-react';
import { makeSelectLoadingStatusForKey } from '../../../containers/App/selectors';

class LoadingStatusContainer extends React.PureComponent {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  render() {
    const {
      loadingStatus,
      children,
      loadingText,
      semanticLoaderProps,
      semanticDimmerProps,
      includeSpace,
    } = this.props;
    const isLoading = _.get(loadingStatus, 'status', false);
    if (children) {
      if (isLoading) {
        return (
          <Dimmer active={isLoading} {...semanticDimmerProps}>
            {includeSpace && <Divider hidden />}
            <Loader inline="centered" {...semanticLoaderProps} indeterminate>
              {loadingText && <FormattedMessage {...loadingText} />}
            </Loader>
          </Dimmer>
        );
      }
      return children;
    }
    return (
      <Dimmer active={isLoading} {...semanticDimmerProps}>
        <Loader inline="centered" {...semanticLoaderProps} indeterminate>
          {loadingText && <FormattedMessage {...loadingText} />}
        </Loader>
      </Dimmer>
    );
  }
}

const mapStateToProps = (state, props) =>
  createStructuredSelector({
    loadingStatus: makeSelectLoadingStatusForKey(state, props),
  });

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

LoadingStatusContainer.defaultProps = {
  loadingText: false,
  includeSpace: false,
  semanticLoaderProps: { size: 'medium' },
  semanticDimmerProps: { page: false },
};

LoadingStatusContainer.propTypes = {
  semanticLoaderProps: PropTypes.any,
  semanticDimmerProps: PropTypes.any,
  children: PropTypes.any,
  loadingStatusKey: PropTypes.string,
  className: PropTypes.string,
  loadingStatus: PropTypes.object,
  includeSpace: PropTypes.bool,
  loadingText: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(LoadingStatusContainer);
