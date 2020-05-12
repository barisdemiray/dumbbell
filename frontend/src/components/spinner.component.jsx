import React from 'react';

import './spinner.styles.css';

/**
 * A component that renders a simple spinner as a visual cue for better UX.
 */
function Spinner() {
  return (
    <div className="SpinnerContainer">
      <div className="Spinner"></div>
      <div className="SpinnerNote">Please be patient, this takes up to 2-3 minutes.</div>
    </div>
  );
}

export default Spinner;
