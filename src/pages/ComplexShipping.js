import { Container, Button, Spinner } from 'react-bootstrap';
import React from 'react';
import SearchForm from './SearchForm';
import MyContext from './MyContext';
import AccordionData from './AccordionData';
import LoadingSpinner from "./LoadingSpinner";

  const ComplexShipping = () => (
    <MyContext.Consumer>
      {context => (
        <React.Fragment>
          <div>
            <Container className="p-3">
              <h1 className="header">Welcome To Complex Shipping</h1>
            </Container>
            
            <SearchForm setOrderNumber={context.setOrderNumber} searchOrderDetails={context.searchOrderDetails}/>
            
            <Container style={{ textAlign: 'left' }}>
              <h2>Order Status</h2>
              <>
              {/* {
                context.isConfirmed && 
                <h4>Order modification is not possible because Order is already confirmed!</h4>
              }
              {
                !context.isConfirmed && context.itemsByDueDate.length != 0 &&
                <h4>Order modification is possible because Order is not confirmed yet!</h4>
              } */}
              <h4>{context.orderStatus}</h4>
              </>
            </Container>
            <br />
            <Container className="d-flex justify-content-between">
              <h2>Order by Shipping Date</h2>
            </Container>
            <br />
            {
              !context.isConfirmed && context.itemsByDueDate.length != 0 &&
              <Container className="d-flex justify-content-between">
                <Button disabled={context.isSubmitButtonLoading} onClick={context.addNewTableByDueDate} variant="primary">
                  Add New Table
                </Button>
              </Container>
            }
            <br />
            <>
              {/* {
                !context.isLoaded && context.orderNumber.length == 7 &&
                <LoadingSpinner />
              } */}
              {
                !context.isLoaded &&
                <LoadingSpinner />
              }
              {/* {
                context.isLoaded && context.orderNumber.length == 7 && context.error.length != 0 &&
                <p>{context.error}</p>
              }
              {
                context.isLoaded && context.error.length != 0 &&
                <p>{context.error}</p>
              } */}
              {
                context.isLoaded && context.error.length != 0 &&
                <p>{context.error}</p>
              }
            </>
            <AccordionData />
            <>
              {
                !context.isConfirmed && !context.isSubmitButtonLoading &&
                <Button disabled={context.isConfirmed} onClick={context.submitOrderDetailsToQAD} variant="primary" size="lg">
                  Submit Data
                </Button>
              }
              {
                context.isSubmitButtonLoading &&
                <Button variant="primary" disabled>
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Submitting...
                </Button>
              }
            </>
          </div>
        </React.Fragment>
      )}
    </MyContext.Consumer>
  )

  export default ComplexShipping;