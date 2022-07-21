import { Accordion, Container, Button } from 'react-bootstrap';
import React from 'react';
import TableTest from './TableTest';
import AccordionData from './AccordionData';

class AccordionTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      itemsByDueDate: new Map(),
      tracker: 0,
      orderNumber: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault();
    this.setState({tracker: this.state.tracker+1});
    console.log("this.state.tracker: ", this.state.tracker);
    this.setState({items: [...this.state.items, {id: this.state.tracker, item: '', order_qty: 0}]});
    console.log('A name was submitted: ' + this.state.items.length);
  }

  destructureItems(resultData) {
    const map = new Map();

    resultData.forEach(element => {    
        if (map.has(element['shipping_date'])) {
            let arr = []
            arr = map.get(element['shipping_date'])
            arr.push(element)
            map.set(element['shipping_date'], arr);
        }
        else {
            let arr = []
            arr = [element];
            map.set(element['shipping_date'], arr);
        }
    })

    this.setState({ itemsByDueDate: map }, () => console.log("calling from destructureItems in AccordionTest, map: ", this.state.itemsByDueDate));

    // console.log("calling from destructureItems in AccordionTest, map: ", this.state.itemsByDueDate);
  }

  dataFetch() {
    fetch("https://vanna.zh.if.atcsg.net:453/api/v1/get-qad-sales-order-info/"+this.props.orderNumber)
      .then(res => res.json())
      .then(
        (result) => {
          // console.log("result: ", result.result.L210636.line_details);
          var resultData = result['result'][this.props.orderNumber]['line_details'];
          
          // console.log("result: ", result['result'][this.props.orderNumber]['line_details']);
          for (let index = 0; index < resultData.length; index++) {
            //console.log("test: ", testData[index])
            resultData[index]["id"] = index
          }

          this.destructureItems(resultData);

          this.setState({
            isLoaded: true,
            items: result['result'][this.props.orderNumber]['line_details'],
            tracker: resultData.length,
            orderNumber: this.props.orderNumber
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  componentDidUpdate(prevProps) {
    console.log("calling from AccordinTest, componentDidUpdate, this.props.orderNumber: ", this.props.orderNumber)
    if(prevProps.orderNumber !== this.props.orderNumber){
      // console.log("Hello, I am here for update testing: ", this.props.orderDetails)
      this.setState({
        orderNumber: this.props.orderNumber
      });

      this.dataFetch();
    }
  }

  componentDidMount() {
    console.log("calling from componentDidMount in AccordionTest, this.props.orderNumber: ", this.props.orderNumber)
    if (this.props.orderNumber.length !== 7) {
      return;
    }
    this.dataFetch();
  }
  render() {
    const {error, isLoaded, items, itemsByDueDate, tracker, orderNumber} = this.state;
    console.log("calling from render in AccordionTest, error:", error, ", isLoaded: ", isLoaded, ", items: ", items, ", orderNumber: ", orderNumber)

    // let accordionData = [];
    // var count = 0;
    // itemsByDueDate.forEach (function(value, key) {
    //   accordionData.push(<AccordionData orderNumber={orderNumber} dueDate={count} items={value}/>);
    //   count += 1;
    // })

    // console.log("calling from render in AccordionTest, itemsByDueDate: ", itemsByDueDate)

    // let accordionData = [];
    // var count = 0;
    // itemsByDueDate.forEach((value, key) => {
    //   var dueDateKey = key;
    //   var items = [];
    //   items = value;
    //   console.log("dueDateKey: ", dueDateKey, ", items: ", items)
    //   accordionData.push(<AccordionData orderNumber={orderNumber} dueDate={dueDateKey} items={items}/>);
    // })

    let value1;
    let key1;
    let key2 = "2021-12-11T00:00:00.000Z"
    itemsByDueDate.forEach((value, key) => {
      console.log("value: ", value);
      console.log("key: ", key);
      value1 = value;
      key1 = key;
    });

    console.log("value1: ", value1, ", key1: ", key1);

    const result = Array.from(itemsByDueDate).map(([key, value]) => ({key, value}))

    // result.map(element => {
    //   console.log("key: " + element.key + ", value: " + element.value)
    // })

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        // { accordionData }
        
        <div>
          {/* {
            itemsByDueDate.forEach(function(value, key) {
              return <AccordionData orderNumber={orderNumber} dueDate={key} items={value} accordionCount="0"/>;
            })
          } */}

          {
            result.map(element => {
              return <AccordionData orderNumber={orderNumber} dueDate={element.key} items={element.value} accordionCount="0"/>
            })
          }

          {/* {
            result.map(element => {
              console.log("key: " + element.key + ", value: " + element.value)
            })
          }
          

          <AccordionData orderNumber={orderNumber} dueDate={key1} items={value1} accordionCount="0"/>
          <AccordionData orderNumber={orderNumber} dueDate={key2} items={value1} accordionCount="1"/> */}

        </div>

        // <Container className="p-3">
        //   <Accordion defaultActiveKey="0">
        //     <Accordion.Item eventKey="0">
        //       <Accordion.Header>Accordion Item #1</Accordion.Header>
        //       <Accordion.Body>
        //           <div className='d-flex justify-content-end me-3'>
        //             <form onSubmit={this.handleSubmit}>
        //               <Button type="submit">
        //                 Submit
        //               </Button>
        //             </form>
        //           </div>
        //           <TableTest orderDetails={items}/>
        //       </Accordion.Body>
        //     </Accordion.Item>
        //   </Accordion>
        // </Container>
      );
    }
  }
}

export default AccordionTest;