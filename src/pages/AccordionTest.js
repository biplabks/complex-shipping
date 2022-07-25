import { Accordion, Container, Button } from 'react-bootstrap';
import React from 'react';
import TableTest from './TableTest';
import AccordionData from './AccordionData';
import MyContext from './MyContext';

// class AccordionTest extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       error: null,
//       isLoaded: false,
//       items: [],
//       itemsByDueDate: new Map(),
//       orderNumber: ''
//     };
//   }

//   // childToParent = (event) => {
//   //   console.log("calling from accordionTest, childToParent")
//   // };

//   // childToParent(due_date, list_of_items) {
//   childToParent = (due_date, list_of_items) => {
//     console.log("calling from childToParent in accordionTest, due_date: ", due_date, " list_of_items: ", list_of_items)

//     // var data = this.state.itemsByDueDate.get(due_date)

//     try {
//       //const {error, isLoaded, items, itemsByDueDate, orderNumber} = this.state;
//       var existingData = this.state.itemsByDueDate;
//       let dateArray = []
//       const keys = [...this.state.itemsByDueDate.keys()];
//       for (let index = 0; index < keys.length; index++) {
//           // const element = moment(keys[index].utc.format('MM/DD/YYYY'));
//           const element = new Date(keys[index]);
//           dateArray.push(element);
//       }

//       const maxDate = new Date(Math.max.apply(null, dateArray));
//       var nextAvailableDate = new Date(maxDate);
//       nextAvailableDate.setDate(maxDate.getDate()+1);

//       existingData.set(nextAvailableDate, list_of_items)
//       this.setState({itemsByDueDate: existingData}, () => { console.log("Added new data") })
//       console.log("calling from childToParent in accordionTest, data: ", this.state.itemsByDueDate)  
//     } catch (error) {
//       console.log("error: ", error.message);
//     }

//     //"2022-02-14T00:00:00.000Z"

//     // map.set(element['shipping_date'], arr);

//     // this.setState({itemsByDueDate: });

//     // this.setState({itemsByDueDate: [...this.state.itemsByDueDate, {shipping_date: this.state.tracker, item: '', order_qty: 0}]});
//   };

//   destructureItems(resultData) {
//     const map = new Map();

//     resultData.forEach(element => {    
//         if (map.has(element['shipping_date'])) {
//             let arr = []
//             arr = map.get(element['shipping_date'])
//             arr.push(element)
//             map.set(element['shipping_date'], arr);
//         }
//         else {
//             let arr = []
//             arr = [element];
//             map.set(element['shipping_date'], arr);
//         }
//     })

//     this.setState({ itemsByDueDate: map }, () => console.log("calling from destructureItems in AccordionTest, map: ", this.state.itemsByDueDate));
//   }

//   dataFetch() {
//     fetch("https://vanna.zh.if.atcsg.net:453/api/v1/get-qad-sales-order-info/"+this.props.orderNumber)
//       .then(res => res.json())
//       .then(
//         (result) => {
//           var resultData = result['result'][this.props.orderNumber]['line_details'];

//           console.log("calling from dataFetch in AccordionTest, resultData: ", resultData)

//           this.destructureItems(resultData);

//           this.setState({
//             isLoaded: true,
//             items: result['result'][this.props.orderNumber]['line_details'],
//             orderNumber: this.props.orderNumber
//           });
//         },
//         (error) => {
//           this.setState({
//             isLoaded: true,
//             error
//           });
//         }
//       )
//   }

//   componentDidUpdate(prevProps) {
//     console.log("calling from componentDidUpdate in AccordinTest, this.props.orderNumber: ", this.props.orderNumber)
//     if(prevProps.orderNumber !== this.props.orderNumber){
//       // console.log("Hello, I am here for update testing: ", this.props.orderDetails)
//       this.setState({
//         orderNumber: this.props.orderNumber
//       });

//       this.dataFetch();
//     }
//   }

//   componentDidMount() {
//     console.log("calling from componentDidMount in AccordionTest, this.props.orderNumber: ", this.props.orderNumber)
//     if (this.props.orderNumber.length !== 7) {
//       return;
//     }
//     this.dataFetch();
//   }
//   render() {
//     // const {error, isLoaded, items, itemsByDueDate, tracker, orderNumber} = this.state;
//     const {error, isLoaded, items, itemsByDueDate, orderNumber} = this.state;
//     // console.log("calling from render in AccordionTest, error:", error, ", isLoaded: ", isLoaded, ", items: ", items, ", orderNumber: ", orderNumber)

//     const result = Array.from(itemsByDueDate).map(([key, value]) => ({key, value}))

//     if (error) {
//       return <div>Error: {error.message}</div>;
//     } else if (!isLoaded) {
//       return <div>Loading...</div>;
//     } else {
//       return (
//         <div>
//           {
//             result.map(element => {
//               return <AccordionData orderNumber={orderNumber} dueDate={element.key} items={element.value} accordionCount="0" childToParent={this.childToParent}/>
//             })
//           }
//         </div>
//       );
//     }
//   }
// }

const AccordionTest = () => (
  <MyContext.Consumer>
    {context => (
      <React.Fragment>
        <div>
          {/* <p>{context.orderNumber}</p> */}
          {
            // context.items.map(element => {
            //   <p>{element}</p>
            // })

            // <AccordionData orderNumber={orderNumber} dueDate={element.key} items={element.value} accordionCount="0" childToParent={this.childToParent}/>

            // context.itemsByDueDate.map(element => {
            //   return <p>{element.key}</p>;
            // })

            <AccordionData />
          }
        </div>
      </React.Fragment>
    )}
  </MyContext.Consumer>
)

export default AccordionTest;