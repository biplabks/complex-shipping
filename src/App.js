// import logo from './logo.svg';
// import AlertDismissible from './pages/AlertDismissible';
// import TableTest from './pages/TableTest';
// import Game from './pages/Game';
import './App.css';
import AccordionTest from './pages/AccordionTest';
import SearchForm from './pages/SearchForm';
import ComplexShipping from './pages/ComplexShipping';
// import 'bootstrap/dist/css/bootstrap.min.css';

import { Container } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      
      {/* <Game /> */}
      {/* <AccordionTest /> */}
      
      {/* <Container className="p-3">
        <h1 className="header">Welcome To Complex Shipping</h1>
      </Container>
      <SearchForm />
      <AccordionTest orderNumber="L210636"/> */}

      {/* <Container>
      <AlertDismissible />
      </Container> */}
      
      {/* <TableTest orderNumber="L210636" />
      <TableTest orderNumber="L201258" /> */}

      <ComplexShipping />

    </div>
  );
}

export default App;
