import { Accordion, Container, Button } from 'react-bootstrap';
import React from 'react';
import TableTest from './TableTest';

class AccordionData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      tracker: 0,
      orderNumber: '',
      dueDate: '',
      accordionCount: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault();
    this.setState({tracker: this.state.tracker+1});
    this.setState({items: [...this.state.items, {id: this.state.tracker, item: '', order_qty: 0}]});
  }

  // componentDidUpdate(prevProps) {
  //   console.log("calling from AccordionData, componentDidUpdate, this.props.orderNumber: ", this.props.orderNumber)
  //   if(prevProps.orderNumber !== this.props.orderNumber){
  //     // console.log("Hello, I am here for update testing: ", this.props.orderDetails)
  //     this.setState({
  //       orderNumber: this.props.orderNumber
  //     });

  //     this.dataFetch();
  //   }
  // }

  componentDidMount() {
    this.setState({ items: this.props.items, orderNumber: this.props.orderNumber, dueDate: this.props.dueDate, accordionCount: this.props.accordionCount, tracker: this.props.items.length }, 
      () => console.log("calling from componentDidMount in AccordionData, items: ", this.state.items, ", orderNumber: ", this.state.orderNumber, ", due date: ", this.state.dueDate));  
  }

  // componentDidMount() {
  //   console.log("calling from componentDidMount in AccordionData, this.props.orderNumber: ", this.props.items)
  //   // if (this.props.orderNumber.length !== 7) {
  //   //   return;
  //   // }

  //   // this.setState({ items: this.props.items, orderNumber: this.props.orderNumber, dueDate: this.props.dueDate, accordionCount: this.props.accordionCount, tracker: this.props.items.length }, 
  //   //   () => console.log("calling from componentDidMount in AccordionData, items: ", this.state.items, ", orderNumber: ", this.state.orderNumber, ", due date: ", this.state.dueDate));  

  //   var itemsData = this.props.items;

  //   for (let index = 0; index < itemsData.length; index++) {
  //     //console.log("test: ", testData[index])
  //     itemsData[index]["id"] = index
  //   }

  //   this.setState({items: itemsData}, () => console.log("calling from componentDidMount in AccordionData, items: ", this.state.items));

  //   this.setState({ orderNumber: this.props.orderNumber, dueDate: this.props.dueDate, accordionCount: this.props.accordionCount, tracker: this.props.items.length }, 
  //     () => console.log("calling from componentDidMount in AccordionData, orderNumber: ", this.state.orderNumber, ", due date: ", this.state.dueDate));  
  // }

  render() {
    const {items, tracker, orderNumber, dueDate, accordionCount } = this.state;
    console.log("calling from render in AccordionData, items:", items, ", tracker: ", tracker, ", orderNumber: ", orderNumber, ", dueDate: ", dueDate, ", accordionCount: ", accordionCount);

    return (
      <Container className="p-3">
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey={accordionCount}>
            <Accordion.Header>{dueDate}</Accordion.Header>
            <Accordion.Body>
                <div className='d-flex justify-content-end me-3'>
                  <form onSubmit={this.handleSubmit}>
                    <Button type="submit">
                      Submit
                    </Button>
                  </form>
                </div>
                <TableTest orderDetails={items}/>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
    );
  }
}

export default AccordionData;