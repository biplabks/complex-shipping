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
        <div>
        {/* {
          context.itemsByDueDate.map(element => {
            return <Container className="p-3" key={element.key}>
              <BootstrapTable2
                due_date={element.key}
                isDateEditable={element.isDateEditable} 
                orderDetails={element.value}
              />
            </Container>
          })
        } */}

          {/* {
            context.itemsByDueDate.length > 0 &&
            <Container className="p-3">
              <BootstrapTable2
                orderDetails={context.itemsByDueDate}
              />
            </Container>
          } */}

          {
            context.formattedItemsByDueDate.length > 0 &&
            <Container className="p-3">
              <BootstrapTable2
                orderDetails={context.formattedItemsByDueDate}
                listOfUniqueItems={context.listOfUniqueItems}
                listOfUniqueDates={context.listOfUniqueDates}
              />
            </Container>
          }
          
        </div>
      </React.Fragment>
    )}
  </MyContext.Consumer>
)

export default AccordionData;