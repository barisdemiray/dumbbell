import React from 'react';
import PropTypes from 'prop-types';

import './overall-size.styles.css';

/**
 * A component that renders the overall size info with given data.
 */
function OverallSize({ data }) {
  /**
   * Renders a table with overall size information
   */
  console.debug('data in overall size', data);
  if (data) {
    const minifiedBundleSizeInKiloBytes = (data.minifiedBundleSizeInBytes / 1024.0).toFixed(2);
    const minifiedAndGzippedBundleSizeInKiloBytes = (
      data.minifiedAndGzippedBundleSizeInBytes / 1024
    ).toFixed(2);

    return (
      <div className="OverallSizeContainer">
        <div className="OverallSizeInfo">
          <div className="OverallSizeTitle">Bundle size</div>
          <div className="OverallSizeDisplayedVersion">v{data.version}</div>
        </div>
        <div className="OverallSize">
          <div>
            <span className="OverallSizeValue">{minifiedBundleSizeInKiloBytes}</span>
            <span className="OverallSizeValueUnit">KiB</span>
          </div>
          <span className="OverallSizeDefinition">minified</span>
        </div>
        <div className="OverallSize">
          <div>
            <span className="OverallSizeValue">{minifiedAndGzippedBundleSizeInKiloBytes}</span>
            <span className="OverallSizeValueUnit">KiB</span>
          </div>
          <span className="OverallSizeDefinition">minified + gzipped</span>
        </div>
      </div>
    );
  }
}

// Check props
OverallSize.propTypes = {
  data: PropTypes.object.isRequired,
};

export default OverallSize;
