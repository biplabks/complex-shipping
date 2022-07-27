import { Accordion, Container, Button, Form } from 'react-bootstrap';
import React from 'react';
import TableTest from './TableTest';
import moment from 'moment';
import MyContext from './MyContext';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';

// class AccordionData extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       items: [],
//       tracker: 0,
//       orderNumber: '',
//       dueDate: '',
//       accordionCount: ''
//     };
//     this.handleInsert = this.handleInsert.bind(this);
//     this.handleCopyAccordion = this.handleCopyAccordion.bind(this);
//   }
//   handleInsert(event) {
//     event.preventDefault();
//     this.setState({tracker: this.state.tracker+1});
//     this.setState({items: [...this.state.items, {id: this.state.tracker, item: '', order_qty: 0}]});
//   }

//   handleCopyAccordion(event) {
//     console.log("calling from AccordionData in handleCopyAccordion")
//     this.props.childToParent(this.state.dueDate, this.state.items);
//     event.preventDefault();
//   }

//   componentDidMount() {
//     // console.log("calling from componentDidMount in AccordionData, this.props.orderNumber: ", this.props.items)

//     var itemsData = this.props.items;

//     for (let index = 0; index < itemsData.length; index++) {
//       //console.log("test: ", testData[index])
//       itemsData[index]["id"] = index
//     }

//     this.setState({items: itemsData, tracker: itemsData.length}, () => console.log("calling from componentDidMount in AccordionData, items: " + this.state.items + ", tracker: ", this.state.tracker));

//     this.setState({ orderNumber: this.props.orderNumber, dueDate: this.props.dueDate, accordionCount: this.props.accordionCount }, 
//       () => console.log("calling from componentDidMount in AccordionData, orderNumber: ", this.state.orderNumber, ", due date: ", this.state.dueDate));  
//   }

//   render() {
//     const {items, tracker, orderNumber, dueDate, accordionCount } = this.state;
//     // console.log("calling from render in AccordionData, items:", items, ", tracker: ", tracker, ", orderNumber: ", orderNumber, ", dueDate: ", dueDate, ", accordionCount: ", accordionCount);

//     return (
//       <Container className="p-3">
//         <Accordion defaultActiveKey="0">
//           <Accordion.Item eventKey={accordionCount}>
//             {/* <Accordion.Header>{dueDate}</Accordion.Header> */}
//             <Accordion.Header>
//               <Form>
//                 <Form.Group className="mb-3" controlId="formGroupEmail">
//                   <Form.Control disabled type="date" value={moment(dueDate).utc().format('YYYY-MM-DD')} placeholder="Enter email" />
//                 </Form.Group>
//               </Form>
//             </Accordion.Header>
//             <Accordion.Body>
//                 <div className='d-flex justify-content-end me-3'>
//                   <form onSubmit={this.handleInsert}>
//                     <Button type="submit">
//                       Insert Record
//                     </Button>
//                   </form>
//                   <form onSubmit={this.handleCopyAccordion}>
//                     <Button type="submit">
//                       Copy Record
//                     </Button>
//                   </form>
//                 </div>
//                 <TableTest orderDetails={items}/>
//             </Accordion.Body>
//           </Accordion.Item>
//         </Accordion>
//       </Container>
//     );
//   }
// }

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
                    <Form>
                      <Form.Group className="mb-3" controlId="formGroupEmail">
                        {/* <Form.Control disabled={!element.isDateEditable} type="date" value={moment(element.key).utc().format('YYYY-MM-DD')} placeholder="Enter date" /> */}
                        {/* <Form.Control disabled={!element.isDateEditable} type="date" readOnly value={moment(element.key).utc().format('YYYY-MM-DD')} placeholder="Enter date" /> */}
                        <Form.Control onChange={event => context.setDueDate(event, element.key)} disabled={!element.isDateEditable} type="date" value={moment(element.key).utc().format('YYYY-MM-DD')} placeholder="Enter date" />
                      </Form.Group>
                    </Form>
                  </Accordion.Header>
                  <Accordion.Body>
                    {
                      !context.isConfirmed &&
                      <div className='d-flex justify-content-between me-3'>
                        {/* <form>
                          <Button onClick={() => context.copyItemsByDueDate(element.key)}>
                            Copy 1 Record
                          </Button>
                        </form> */}
                        <form>
                          <Button onClick={() => context.insertItemByDueDate(element.key)}>
                            Insert Record
                          </Button>
                        </form>
                        <form>
                          <Button onClick={() => context.copyItemsByDueDate(element.key)}>
                            Copy Record
                          </Button>
                        </form>
                      </div>
                    }
                      {/* <div className='d-flex justify-content-between me-3'>
                        <form>
                          <Button onClick={() => context.insertItemByDueDate(element.key)}>
                            Insert Record
                          </Button>
                        </form>
                        <form>
                          <Button onClick={() => context.copyItemsByDueDate(element.key)}>
                            Copy Record
                          </Button>
                        </form>
                      </div> */}
                    <TableTest
                      // key={element.key} 
                      // copyItemsByDueDate={() => context.copyItemsByDueDate(element.key)}
                      orderDetails={element.value}
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