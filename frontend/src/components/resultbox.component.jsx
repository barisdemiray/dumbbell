import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import './resultbox.styles.css';
import BarChart from './barchart/barchart.component';
import OverallSize from './overall-size.component';

/**
 * A component that renders package bundle size results in two basic parts.
 *
 * 1) An overall and more detailed view of the last version's bundle size information.
 * 2) Historical bundle size information of past versions.
 */
function ResultBox({ resultData }) {
  const [mostRecentBundlesResultData, setMostRecentBundlesResultData] = useState({});
  const [allBundleResultData, setAllBundleResultData] = useState([]);

  // Act only when we have incoming data
  useEffect(() => {
    // Set internal state with incoming data
    setAllBundleResultData(resultData);

    // Only the most recent version's result data will be displayed in detail
    const [lastResultData] = resultData.slice(0, 1);
    setMostRecentBundlesResultData(lastResultData);
  }, [resultData]);

  if (allBundleResultData) {
    return (
      <div className="ResultBoxContainer">
        <OverallSize data={mostRecentBundlesResultData} />
        <BarChart data={resultData} />
      </div>
    );
  }
}

// Check props and especially the result data that it has proper objects
ResultBox.propTypes = {
  resultData: PropTypes.arrayOf(
    PropTypes.shape({
      bundleSizeInBytes: PropTypes.number.isRequired,
      minifiedBundleSizeInBytes: PropTypes.number.isRequired,
      minifiedAndGzippedBundleSizeInBytes: PropTypes.number.isRequired,
      version: PropTypes.string.isRequired,
    })
  ),
};

export default ResultBox;
