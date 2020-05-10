import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './resultbox.styles.css';
import BarChart from './barchart.component';

/**
 * A component that renders package bundle size result.
 */
function ResultBox({ resultData }) {
  return (
    <div className="ResultBoxContainer">
      <BarChart data={resultData} />
    </div>
  );
}

// Check props
ResultBox.propTypes = {
  resultData: PropTypes.array.isRequired,
};

export default ResultBox;
