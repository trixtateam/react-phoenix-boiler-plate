/**
 *
 * Loader
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Dimmer, Loader } from 'semantic-ui-react';
import { LOADING_TYPE } from './constants';

/**
 * @param {string} loadingText Props - The loading text to display
 * @param {LOADING_TYPE} loaderType Props - The string passed as props to use line/logo loader
 * @param {boolean} isLoading Props - Bool that enables or disables the loader
 * @param {Object} semanticLoaderProps
 * @param {Object} semanticDimmerProps
 */
function Loading({
  loadingText,
  loaderType,
  isLoading,
  semanticLoaderProps,
  semanticDimmerProps,
}) {
  if (_.isEqual(loaderType, LOADING_TYPE.line)) {
    return (
      <div className="line-loader-wrapper">
        <div className="line-loading">
          <div className="line-bar" />
          <div className="line-bar" />
          <div className="line-bar" />
        </div>
      </div>
    );
  }
  return (
    <Dimmer active={isLoading || loadingText} {...semanticDimmerProps}>
      <Loader {...semanticLoaderProps} />
    </Dimmer>
  );
}

Loading.defaultProps = {
  loaderType: LOADING_TYPE.logo,
  isLoading: true,
  loadingText: false,
  semanticLoaderProps: {
    size: 'large',
    indeterminate: true,
    inline: 'centered',
  },
  semanticDimmerProps: { page: true },
};

Loading.propTypes = {
  loaderType: PropTypes.string,
  isLoading: PropTypes.bool,
  semanticLoaderProps: PropTypes.any,
  semanticDimmerProps: PropTypes.any,
  loadingText: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

export default Loading;
