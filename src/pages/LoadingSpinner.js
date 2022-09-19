// import React from "react";
// import "./spinner.css";

// export default function LoadingSpinner() {
//   return (
//     <div className="spinner-container">
//       <div className="loading-spinner"></div>
//     </div>
//   );
// }

import Spinner from 'react-bootstrap/Spinner';

function LoadingSpinner() {
  return (
    <Spinner animation="border" role="status" size="lg">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}

export default LoadingSpinner;