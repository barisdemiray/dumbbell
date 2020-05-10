import React from 'react';
import PropTypes from 'prop-types';

import './resultbox.styles.css';
import BarChart from './barchart.component';
import OverallSize from './overall-size.component';

/**
 * A component that renders package bundle size result.
 */
function ResultBox({ resultData }) {
  // Only the most recent version's result data will be displayed in detail
  const [lastResultData] = resultData.slice(-1);

  return (
    <div className="ResultBoxContainer">
      <OverallSize data={lastResultData} />
      <BarChart data={resultData} />
    </div>
  );
}

// Check props
ResultBox.propTypes = {
  resultData: PropTypes.array.isRequired,
};

export default ResultBox;
