import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './searchbox.styles.css';

/**
 * A component that renders a package search input. Keeps an internal state as well.
 *
 * It submits user input to parent component following two events,
 * - A click on the magnifier icon
 * - Enter key in the input box
 */
function SearchBox({ handleChange, handleSubmit }) {
  // Internal state for the user-provided query
  const [query, setQuery] = useState('');

  // This is internal, it only updates internal state
  const updateChange = (query) => {
    setQuery(query);
    // Also let parent component know for possible error messages
    handleChange(query);
  };

  // This is where we elevate the query to parent component
  const submitChange = () => {
    handleSubmit(query);
  };

  // Better user experience by handling enter key on the search box
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(query);
    }
  };

  return (
    <div className="SearchBoxContainer">
      <input
        id="SearchBox"
        className="SearchBoxInput"
        type="text"
        onChange={(e) => updateChange(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e)}
        placeholder="Package name, e.g. lodash"
        autoFocus
      />
      <img
        id="SearchBoxIcon"
        src="./static/images/noun_Search_3179535.svg"
        className="SearchBoxIcon"
        onClick={() => submitChange()}
        alt=""
      />
    </div>
  );
}

// Check props
SearchBox.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default SearchBox;
