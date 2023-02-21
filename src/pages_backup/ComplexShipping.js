import { Container, Button, Spinner } from 'react-bootstrap';
import React from 'react';
import SearchForm from './SearchForm';
import MyContext from './MyContext';
import LoadingSpinner from "./LoadingSpinner";
import BootstrapTable from './BootstrapTable';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons'

const ComplexShipping = () => (
  <MyContext.Consumer>
    {context => (
      <React.Fragment>
        {/* <div> */}
          <Container fluid>
            <h1 className="text-center">Welcome To Sales Order Editor</h1>
            <SearchForm setOrderNumber={context.setOrderNumber} searchOrderDetails={context.searchOrderDetails}/>
            {
              context.orderStatus.length !== 0 &&
              <>
                <h2>Order Status</h2>
                <h4>{context.orderStatus}</h4>
              </>
            }

            <br />
            {
              context.isLoaded && context.itemsByDueDate.length !== 0 &&
              <h2>Order by Due Date</h2>
            }

            <>
            {
              !context.isLoaded &&
              <LoadingSpinner />
            }
            {
              context.isLoaded && context.error.length !== 0 &&
              <p>{context.error}</p>
            }

            {
              context.isLoaded && context.error.length === 0 &&
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
              <div className='text-center mx-2'>
                {
                  !context.isFormDisabled && !context.isSubmitButtonLoading && context.isLoaded && context.itemsByDueDate.length !== 0 &&
                  <Button disabled={context.isFormDisabled} onClick={context.submitOrderDetailsToQAD} variant="primary" size="lg">
                    Save to QAD <FontAwesomeIcon icon={faFloppyDisk} />
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
              </div>
            </>
          </Container>
      </React.Fragment>
    )}
  </MyContext.Consumer>
)

  export default ComplexShipping;