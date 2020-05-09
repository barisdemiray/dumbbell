import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './searchbox.styles.css';

function SearchBox({ handleChange }) {
  return (
    <input
      className="SearchBox"
      type="text"
      onChange={(e) => handleChange(e.target.value)}
      placeholder="Package name, e.g. react"
    />
  );
}

SearchBox.propTypes = {
  handleChange: PropTypes.func.isRequired,
};

export default SearchBox;
