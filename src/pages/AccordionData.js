import { Accordion, Card, Container, Form } from 'react-bootstrap';
import React from 'react';
import TableTest from './TableTest';
import BootstrapTable from './BootstrapTable';
import moment from 'moment';
import MyContext from './MyContext';

const AccordionData = () => (
  <MyContext.Consumer>
    {context => (
      <React.Fragment>
        <div>
        {
          context.itemsByDueDate.map(element => {
            return <Container className="p-3" key={element.key}>
              <BootstrapTable
                due_date={element.key}
                isDateEditable={element.isDateEditable} 
                orderDetails={element.value}
              />
            </Container>
          })
        }
        </div>
      </React.Fragment>
    )}
  </MyContext.Consumer>
)

export default AccordionData;