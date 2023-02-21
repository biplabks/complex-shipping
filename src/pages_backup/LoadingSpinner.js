import Spinner from 'react-bootstrap/Spinner';

function LoadingSpinner() {
  return (
    <Spinner animation="border" role="status" size="lg">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}

export default LoadingSpinner;