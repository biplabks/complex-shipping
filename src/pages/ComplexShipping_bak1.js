import { Container, Button, Spinner } from 'react-bootstrap';
import React from 'react';
import SearchForm from './SearchForm';
import MyContext from './MyContext';
// import AccordionData from './AccordionData';
import LoadingSpinner from "./LoadingSpinner";
import BootstrapTable from './BootstrapTable';

  const ComplexShipping = () => (
    <MyContext.Consumer>
      {context => (
        <React.Fragment>
          <div>
            <Container fluid className="p-3">
              <h1 className="header">Welcome To Sales Order Editor</h1>
            </Container>

            <SearchForm setOrderNumber={context.setOrderNumber} searchOrderDetails={context.searchOrderDetails}/>
            
            <Container fluid style={{ textAlign: 'left' }}>
              {
                context.orderStatus.length != 0 &&
                <>
                  <h2>Order Status</h2>
                  <h4>{context.orderStatus}</h4>
                </>
              }
            </Container>
            <br />
            {
              context.isLoaded && context.itemsByDueDate.length != 0 &&
              <Container fluid className="d-flex justify-content-between">
                <h2>Order by Due Date</h2>
              </Container>
            }
            <>
              {
                !context.isLoaded &&
                <LoadingSpinner />
              }
              {
                context.isLoaded && context.error.length != 0 &&
                <p>{context.error}</p>
              }

              {
                context.isLoaded && context.error.length == 0 &&
                context.formattedItemsByDueDate.length > 0 &&
                <BootstrapTable
                  orderDetails={context.formattedItemsByDueDate}
                  listOfPromiseDates={context.listOfPromiseDates}
                  listOfUniqueDates={context.listOfUniqueDates}
                  listOfUniqueDueDates={context.listOfUniqueDueDates}
                />
              }
            </>
            <>
              <Container fluid className='pb-3'>
                {
                  !context.isConfirmed && !context.isSubmitButtonLoading && context.isLoaded && context.itemsByDueDate.length != 0 &&
                  <Button disabled={context.isConfirmed} onClick={context.submitOrderDetailsToQAD} variant="primary" size="lg">
                    Save to QAD
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
              </Container>
            </>
          </div>
        </React.Fragment>
      )}
    </MyContext.Consumer>
  )

  export default ComplexShipping;