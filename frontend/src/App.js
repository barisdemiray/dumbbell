import React, { useState, useEffect } from 'react';
import './App.css';

import SearchBox from './components/searchbox.component';
import * as PackageTools from './tools/package';

function App() {
  // Let's show a feedback while getting data from backend
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState({});
  const [packageName, setPackageName] = useState('');

  useEffect(() => {
    if (packageName) {
      fetch('http://localhost:8080/?package=' + packageName)
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          setResult(response);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [packageName]);

  const handleChange = (val) => {
    console.debug('search value', val);

    // Clear any previous results
    setResult({});

    const result = PackageTools.isPackageNameValid(val);
    if (result.valid === false) {
      setError(result.reason);
    } else {
      setError('');
    }
  };

  const handleSubmit = (val) => {
    if (val.length === 0) {
      setError('Package name cannot be empty');
    } else {
      setLoading(true);
      setPackageName(val);
    }
  };

  const renderError = () => {
    return <div className="SearchError">{error}</div>;
  };

  const renderLoadingFeedback = () => {
    let loadingFeedbackElement = null;
    if (loading) {
      loadingFeedbackElement = <p>Loading</p>;
    }

    return <div className="LoadingFeedback">{loadingFeedbackElement}</div>;
  };

  return (
    <div className="App">
      <div className="SearchContainer">
        <SearchBox handleChange={handleChange} handleSubmit={handleSubmit} />
        {renderError()}
      </div>
      <div className="ResultContainer">
        <div className="ResultFeedback">{renderLoadingFeedback()}</div>
        <div className="Result">{JSON.stringify(result)}</div>
      </div>
    </div>
  );
}

export default App;
