import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './resultbox.styles.css';
import BarChart from './barchart.component';

/**
 * A component that renders package bundle size result.
 */
function ResultBox({ resultData: incomingResultData }) {
  // TODO this is for tests, replace it with real 'resultData'
  const [resultData, setResultData] = useState([
    {
      bundleSizeInBytes: 96212,
      minifiedBundleSizeInBytes: 30377,
      minifiedAndGzippedBundleSizeInBytes: 9897,
      version: '16.11.0',
    },
    {
      bundleSizeInBytes: 96149,
      minifiedBundleSizeInBytes: 30377,
      minifiedAndGzippedBundleSizeInBytes: 9898,
      version: '16.12.0',
    },
    {
      bundleSizeInBytes: 82394,
      minifiedBundleSizeInBytes: 30182,
      minifiedAndGzippedBundleSizeInBytes: 9907,
      version: '16.13.0',
    },
    {
      bundleSizeInBytes: 82394,
      minifiedBundleSizeInBytes: 30182,
      minifiedAndGzippedBundleSizeInBytes: 9908,
      version: '16.13.1',
    },
  ]);

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
