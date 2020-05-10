import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './barchart.styles.css';
import BarChartElement from './barchart-element.component';

/**
 * A component that renders a bar chart with given data.
 */
function BarChart({ data }) {
  const [normalizedValueList, setNormalizedValueList] = useState([]);

  /**
   * When props are received, find normalized size for each of them.
   * This is to show a corresponding height with a percentage for each bar item on the bar chart.
   * For example, largest value will be at its 100% height, and then it will decrease.
   */
  useEffect(() => {
    console.table(data);

    // Normalize data w.r.t. minified values, then we'll show gzipped inside that bar.
    let normalizedValues = [];

    // Find max first, which will serve as 100% value
    const max = Math.max.apply(
      null,
      data.map((item) => item.minifiedBundleSizeInBytes)
    );

    for (const dataItem of data) {
      console.debug(dataItem);
      const currentValue = dataItem.minifiedBundleSizeInBytes;

      // We want values in range [0, 100]
      const normalizedValue = (currentValue * 100.0) / max;
      normalizedValues.push(normalizedValue);
    }

    // Update state with this info
    setNormalizedValueList(normalizedValues);
  }, [data]);

  // Renders all the elements in given data
  const renderElements = () => {
    if (!data) {
      return null;
    }

    // console.table(data);
    return data.map((dataElement, index) => (
      <BarChartElement
        key={index}
        data={dataElement}
        normalizedValue={normalizedValueList[index]}
      />
    ));
  };

  return <div className="BarChartContainer">{renderElements()}</div>;
}

// Check props
BarChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default BarChart;
