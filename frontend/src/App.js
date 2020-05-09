import React, { useState, useEffect } from 'react';
import './App.css';

import SearchBox from './components/searchbox.component';

function App() {
  // Let's show a feedback while getting data from backend
  const [loading, setLoading] = useState(false);
  const [packageName, setPackageName] = useState('');

  // todo grab backend response here
  useEffect(() => {}, []);

  const handleChange = (val) => {
    console.debug('search value', val);
  };

  return (
    <div className="App">
      <div className="SearchBoxContainer">
        <SearchBox handleChange={handleChange} />
      </div>
    </div>
  );
}

export default App;
