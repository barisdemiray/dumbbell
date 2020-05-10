import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './barchart-element.styles.css';

/**
 * A component that renders a bar chart element with data.
 */
function BarChartElement({ data }) {
  /**
   * Renders a barchart element, i.e. a bar.
   */
  const renderBar = () => {
    return (
      <div className="BarChartElement">
        <div className="BarChartElementBar"></div>
        <div className="BarChartElementLabel">{data.version}</div>
      </div>
    );
  };

  return <div className="BarChartElementContainer">{renderBar()}</div>;
}

// Check props
BarChartElement.propTypes = {
  data: PropTypes.object.isRequired,
};

export default BarChartElement;
