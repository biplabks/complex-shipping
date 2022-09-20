import { Accordion, Container, Form } from 'react-bootstrap';
import React from 'react';
import TableTest from './TableTest';
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
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <div>
                      <Form>
                        <Form.Group className="mb-3" controlId="formGroupEmail">
                          <Form.Control onChange={event => context.setDueDate(event, element.key)} disabled={true} type="date" value={moment(element.key).utc().format('YYYY-MM-DD')} placeholder="Enter date" />
                        </Form.Group>
                      </Form>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <TableTest
                      due_date={element.key}
                      isDateEditable={element.isDateEditable} 
                      orderDetails={element.value}
                      validItems={context.validItems}
                    />
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Container>
          })
        }
        </div>
        
      </React.Fragment>
    )}
  </MyContext.Consumer>
)

export default AccordionData;