import React from 'react';
import PropTypes from 'prop-types';

import './barchart-element.styles.css';

/**
 * A component that renders a bar chart element with data.
 */
function BarChartElement({ data, normalizedValue }) {
  /**
   * Renders a barchart element, i.e. a bar.
   */
  const renderBar = () => {
    // Do not render before we receive the normalized value
    if (!normalizedValue) {
      return null;
    }

    const barStyle = {
      height: normalizedValue.toFixed(2) + '%',
    };

    console.debug('barStyle', barStyle);

    return (
      <div className="BarChartElement" style={barStyle}>
        <div className="BarChartElementBar"></div>
        <div className="BarChartElementLabel">{data.version}</div>
        {/* <div className="BarChartElementLabel">{data.minifiedBundleSizeInBytes}</div>
        <div className="BarChartElementLabel">{normalizedValue}</div> */}
      </div>
    );
  };

  return <div className="BarChartElementContainer">{renderBar()}</div>;
}

// Check props
BarChartElement.propTypes = {
  data: PropTypes.object.isRequired,
  normalizedValue: PropTypes.number.isRequired,
};

export default BarChartElement;
