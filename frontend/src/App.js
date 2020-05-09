import React, { useState, useEffect } from 'react';
import './App.css';

import SearchBox from './components/searchbox.component';

function App() {
  // Let's show a feedback while getting data from backend
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [packageName, setPackageName] = useState('');

  // todo grab backend response here
  useEffect(() => {
    fetch('http://localhost:8080/?package=' + packageName)
      .then((response) => response.json())
      .then((data) => console.log(data));
  }, [packageName]);

  const handleChange = (val) => {
    console.debug('search value', val);

    // Package name should not have spaces
    if (val.indexOf(' ') >= 0) {
      setError('Package names should not have spaces');
    } else {
      setPackageName(val);
    }
  };

  const renderError = () => {
    if (error) {
      return <span className="SearchError">{error}</span>;
    }

    return null;
  };

  return (
    <div className="App">
      <div className="SearchContainer">
        <SearchBox handleChange={handleChange} />
        {renderError()}
      </div>
      <div className="ResultContainer">No results yet</div>
    </div>
  );
}

export default App;
