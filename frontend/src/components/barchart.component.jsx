import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './barchart.styles.css';
import BarChartElement from './barchart-element.component';

/**
 * A component that renders a bar chart with given data.
 */
function BarChart({ data }) {
  // Renders all the elements in given data
  const renderElements = () => {
    return data.map((dataElement) => <BarChartElement data={dataElement} />);
  };

  return <div className="BarChartContainer">{renderElements()}</div>;
}

// Check props
BarChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default BarChart;
