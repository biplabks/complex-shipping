import { Accordion, Card, Container, Form } from 'react-bootstrap';
import React from 'react';
import TableTest from './TableTest';
import BootstrapTable2 from './BootstrapTable2';
import moment from 'moment';
import MyContext from './MyContext';

const AccordionData = () => (
  <MyContext.Consumer>
    {context => (
      <React.Fragment>
        {/* <div>
          {
            context.formattedItemsByDueDate.length > 0 &&
            <Container className="p-3">
              <BootstrapTable2
                orderDetails={context.formattedItemsByDueDate}
                listOfPromiseDates={context.listOfPromiseDates}
                listOfUniqueDates={context.listOfUniqueDates}
                listOfUniqueDueDates={context.listOfUniqueDueDates}
              />
            </Container>
          }
        </div> */}
          {
            context.formattedItemsByDueDate.length > 0 &&
            <div>
              <BootstrapTable2
                orderDetails={context.formattedItemsByDueDate}
                listOfPromiseDates={context.listOfPromiseDates}
                listOfUniqueDates={context.listOfUniqueDates}
                listOfUniqueDueDates={context.listOfUniqueDueDates}
              />
            </div>
          }
      </React.Fragment>
    )}
  </MyContext.Consumer>
)

export default AccordionData;