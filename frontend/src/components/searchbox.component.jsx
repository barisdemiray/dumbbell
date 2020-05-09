import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import './searchbox.styles.css';

function SearchBox({ handleChange }) {
  const [query, setQuery] = useState('');

  /* This is internal, it only updates internal state */
  const updateChange = (query) => {
    setQuery(query);
  };

  /* This is where we elevate the query to parent component */
  const submitChange = () => {
    handleChange(query);
  };

  return (
    <div className="SearchBoxContainer">
      <input
        id="SearchBox"
        className="SearchBoxInput"
        type="text"
        onChange={(e) => updateChange(e.target.value)}
        placeholder="Package name, e.g. react"
      />
      <img
        src="./static/images/noun_Search_3179535.svg"
        className="SearchBoxIcon"
        onClick={() => submitChange()}
      />
    </div>
  );
}

SearchBox.propTypes = {
  handleChange: PropTypes.func.isRequired,
};

export default SearchBox;
