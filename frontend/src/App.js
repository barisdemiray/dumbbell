import React, { useState, useEffect } from 'react';
import './App.css';

import SearchBox from './components/searchbox.component';

function App() {
  // Let's show a feedback while getting data from backend
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState({});
  const [packageName, setPackageName] = useState('');

  // todo grab backend response here
  useEffect(() => {
    fetch('http://localhost:8080/?package=' + packageName)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setResult(response);
      })
      .catch((error) => console.error(error));
  }, [packageName]);

  const handleChange = (val) => {
    console.debug('search value', val);

    // Clear any previous results
    setResult({});

    // Package name should not have spaces
    if (val.indexOf(' ') >= 0) {
      setError('Package names should not have spaces');
    } else if (val.length === 0) {
      setError('Package name cannot be empty');
    } else {
      // Reset error when user starts typing again
      setError('');
    }
  };

  const handleSubmit = (val) => {
    if (val.length === 0) {
      setError('Package name cannot be empty');
    } else {
      setPackageName(val);
    }
  };

  const renderError = () => {
    return <div className="SearchError">{error}</div>;
  };

  return (
    <div className="App">
      <div className="SearchContainer">
        <SearchBox handleChange={handleChange} handleSubmit={handleSubmit} />
        {renderError()}
      </div>
      <div className="ResultContainer">{JSON.stringify(result)}</div>
    </div>
  );
}

export default App;
