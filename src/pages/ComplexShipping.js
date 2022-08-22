import { Container, Button } from 'react-bootstrap';
import React from 'react';
import AccordionTest from './AccordionTest';
import SearchForm from './SearchForm';
import MyContext from './MyContext';
import AccordionData from './AccordionData';

  const ComplexShipping = () => (
    // if (context.error) {
    //   <div>Error: {context.error}</div>
    // } else if (!context.isLoaded) {
    //   <div>Loading...</div>
    // } else {
    //   <AccordionTest orderNumber={context.orderNumber} />
    // }

    <MyContext.Consumer>
      {context => (
        <React.Fragment>
          <div>
            <Container className="p-3">
              <h1 className="header">Welcome To Complex Shipping</h1>
            </Container>
            
            {/* <SearchForm setOrderNumber={() => context.setOrderNumber(context.orderNumber)} searchOrderDetails={context.searchOrderDetails}/> */}
            <SearchForm setOrderNumber={context.setOrderNumber} searchOrderDetails={context.searchOrderDetails}/>
            
            <Container style={{ textAlign: 'left' }}>
              <h2>Order Status</h2>
              <>
              {
                context.isConfirmed && 
                <h4>Order modification is not possible because Order is already confirmed!</h4>
              }
              {
                !context.isConfirmed && context.itemsByDueDate.length != 0 &&
                <h4>Order modification is possible because Order is not confirmed yet!</h4>
              }
              </>
            </Container>
            <br />
            <Container className="d-flex justify-content-between">
              <h2>Order by Shipping Date</h2>
            </Container>
            <br />
            <Container className="d-flex justify-content-between">
              <Button onClick={context.addNewTableByDueDate} variant="primary">
                Add New Table
              </Button>
            </Container>
            
            <br />
            {/* <AccordionTest /> */}
            <>
              {
                !context.isLoaded && context.orderNumber.length == 7 &&
                <p>Waiting for data from QAD...</p>
              }
            </>
            <AccordionData />
            <Button onClick={context.submitOrderDetailsToQAD} variant="primary" size="lg">
              Submit Data
            </Button>
          </div>
        </React.Fragment>
      )}
    </MyContext.Consumer>
  )

  export default ComplexShipping;