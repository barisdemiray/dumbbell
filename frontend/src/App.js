import React, { useState, useEffect } from 'react';
import './App.css';

import SearchBox from './components/searchbox.component';
import ResultBox from './components/resultbox.component';
import Spinner from './components/spinner.component';
import * as PackageTools from './tools/package';

function App() {
  // Let's show a feedback while getting data from backend
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [resultData, setResultData] = useState([]);
  const [packageName, setPackageName] = useState('');

  console.log('API is at', process.env.REACT_APP_API_URL);

  /**
   * Initiates server connection when there is a package name to query.
   */
  useEffect(() => {
    if (packageName) {
      fetch(process.env.REACT_APP_API_URL + '/?package=' + packageName)
        .then((response) => response.json())
        .then((response) => {
          // When bundling fails we receive an empty array, I know it's sad
          if (Array.isArray(response)) {
            if (response.length === 0) {
              setError(
                "Internal error, package bundling must have failed. Hint: try with 'lodash'."
              );
            } else if (response.length > 0 && response.length < 4) {
              setWarning('Failed to retrieve bundle size info of some versions.');
            }
          }
          setResultData(response);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setError(
            'Internal error, cannot talk to the server. Would you be so kind to let me know about this at baris.demiray@gmail.com, please? :)'
          );
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
      setWarning('');
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
   * Renders the error message if there is one. Note that the div is always rendered with a min-height to keep the layout.
   */
  const renderError = () => {
    return <div className="SearchError">{error}</div>;
  };

  /**
   * Renders the warning message if there is one. Note that the div is always rendered with a min-height to keep the layout.
   */
  const renderWarning = () => {
    return <div className="SearchWarning">{warning}</div>;
  };

  /**
   * Renders a loading feedback when we're waiting for server response.
   */
  const renderLoadingFeedback = () => {
    if (loading) {
      return (
        <div className="LoadingFeedback">
          <Spinner />
        </div>
      );
    }
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
      <div className="Header">
        <img className="HeaderIcon" src="./static/images/noun_Weight_9409.svg" alt="" />
        <span className="HeaderTitle">dumbbell</span>
      </div>
      <div className="SearchContainer">
        <SearchBox handleChange={handleChange} handleSubmit={handleSubmit} />
        {renderError()}
        {renderWarning()}
      </div>
      <div className="ResultContainer">
        <div className="ResultFeedback">{renderLoadingFeedback()}</div>
        {renderResults()}
      </div>
    </div>
  );
}

export default App;
