import logo from './logo.svg';
// import AlertDismissible from './pages/AlertDismissible';
// import TableTest from './pages/TableTest';
// import Game from './pages/Game';
import './App.css';
import AccordionTest from './pages/AccordionTest';
import SearchForm from './pages/SearchForm';
import ComplexShipping from './pages/ComplexShipping';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';

import MyProvider from './pages/MyProvider';
import ProductList from './pages/ProductList';

function App() {
  return (
    <div className="App">
      
      {/* <ComplexShipping /> */}

      

      <MyProvider>
        <div className="App">
          {/* <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to my web store</h1>
          </header> */}
          {/* <Container className="p-3">        
            <Form>
              <Row>
                <Col>
                  <Form.Control placeholder="Order Number" name="order_number" value=""/>
                </Col>
                <Col className='d-flex'>
                  <Button type="submit">
                    Search
                  </Button>
                </Col>
              </Row>
            </Form>
          </Container> */}
        
          {/* <ProductList /> */}
          
          <ComplexShipping />

        </div>
      </MyProvider>

    </div>
  );
}

export default App;
