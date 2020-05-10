import React, { useState, useEffect } from 'react';
import './App.css';

import SearchBox from './components/searchbox.component';
import ResultBox from './components/resultbox.component';
import * as PackageTools from './tools/package';

function App() {
  // Let's show a feedback while getting data from backend
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultData, setResultData] = useState([]);
  const [packageName, setPackageName] = useState('');

  /**
   * Initiates server connection when there is a package name to query.
   */
  useEffect(() => {
    if (packageName) {
      fetch('http://localhost:8080/?package=' + packageName)
        .then((response) => response.json())
        .then((response) => {
          // When bundling fails we receive an empty array, I know it's sad
          if (Array.isArray(response) && response.length === 0) {
            setError("Internal error, package bundling must have failed. Hint: try with 'select'.");
          }
          setResultData(response);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [packageName]);

  /**
   * Event handler for the change of SearchBox component. This is where we validate user input.
   */
  const handleChange = (val) => {
    // Clear any previous results, i.e. if there had been errors with previous user input, etc.
    setResultData([]);

    const result = PackageTools.isPackageNameValid(val);
    if (result.valid === false) {
      setError(result.reason);
    } else {
      setError('');
    }
  };

  /**
   * Handles requests submitted by the user. This is where we initiate package bundle queries.
   */
  const handleSubmit = (val) => {
    if (val.length === 0) {
      setError('Package name cannot be empty');
    } else {
      setLoading(true);
      setPackageName(val);
    }
  };

  /**
   * Renders an error if there is any. Note that the div is always rendered with a min-height to keep the layout.
   */
  const renderError = () => {
    return <div className="SearchError">{error}</div>;
  };

  /**
   * Renders a loading feedback when we're waiting for server response.
   */
  const renderLoadingFeedback = () => {
    let loadingFeedbackElement = null;
    if (loading) {
      loadingFeedbackElement = <p>Loading</p>;
    }

    return <div className="LoadingFeedback">{loadingFeedbackElement}</div>;
  };

  /**
   * Renders results in hopefully nice graphs.
   */
  const renderResults = () => {
    if (Array.isArray(resultData) && resultData.length !== 0) {
      return <ResultBox resultData={resultData} />;
    }
  };

  return (
    <div className="App">
      <div className="SearchContainer">
        <SearchBox handleChange={handleChange} handleSubmit={handleSubmit} />
        {renderError()}
      </div>
      <div className="ResultContainer">
        <div className="ResultFeedback">{renderLoadingFeedback()}</div>
        {renderResults()}
      </div>
    </div>
  );
}

export default App;
