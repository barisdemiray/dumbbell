import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './barchart-element.styles.css';

/**
 * A component that renders a bar chart element with data.
 */
function BarChartElement({ data }) {
  return (
    <div className="BarChartElementContainer">hello bar chart element {JSON.stringify(data)}</div>
  );
}

// Check props
BarChartElement.propTypes = {
  data: PropTypes.object.isRequired,
};

export default BarChartElement;
