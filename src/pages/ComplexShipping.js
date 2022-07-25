import { Container, Button } from 'react-bootstrap';
import React from 'react';
import AccordionTest from './AccordionTest';
import SearchForm from './SearchForm';
import MyContext from './MyContext';
import AccordionData from './AccordionData';

// class ComplexShipping extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {orderNumber1: ''};
//     }

//     childToParent = (event) => {
//         this.setState({ orderNumber1: event.target.order_number.value }, () => console.log("state value:", this.state.orderNumber1));
//      };
    
//     render() {
//       const { orderNumber1 } = this.state;

//       let accordinTest;
//       if (orderNumber1.length === 7) {
//         accordinTest = <AccordionTest orderNumber={this.state.orderNumber1}/>;
//       }
      
//       return (
//         <div>
//           <Container className="p-3">
//               <h1 className="header">Welcome To Complex Shipping</h1>
//           </Container>
//           <SearchForm childToParent={this.childToParent}/>
//           { accordinTest }
//           <Button variant="primary" size="lg">
//               Submit Data
//           </Button>
//         </div>

//         // <MyContext.Consumer>
//         //   {context => (
//         //       <React.Fragment>
//                 // <div>
//                 //   <Container className="p-3">
//                 //       <h1 className="header">Welcome To Complex Shipping</h1>
//                 //   </Container>
//                 //   <SearchForm childToParent={this.childToParent}/>
//                 //   { accordinTest }
//                 //   <Button variant="primary" size="lg">
//                 //       Submit Data
//                 //   </Button>
//                 // </div>
    
//         //       </React.Fragment>
//         //   )}
//         // </MyContext.Consumer>
        
//       );
//     }
//   }

  const ComplexShipping = () => (
    // if (context.error) {
    //   <div>Error: {context.error}</div>
    // } else if (!context.isLoaded) {
    //   <div>Loading...</div>
    // } else {
    //   <AccordionTest orderNumber={context.orderNumber} />
    // }

    <MyContext.Consumer>
      {context => (
        <React.Fragment>
          <div>
            <Container className="p-3">
              <h1 className="header">Welcome To Complex Shipping</h1>
            </Container>
            {/* <SearchForm setOrderNumber={() => context.setOrderNumber(context.orderNumber)} searchOrderDetails={context.searchOrderDetails}/> */}
            <SearchForm setOrderNumber={context.setOrderNumber} searchOrderDetails={context.searchOrderDetails}/>
            {/* <AccordionTest /> */}
            <AccordionData />
            <Button onClick={context.submitOrderDetailsToQAD} variant="primary" size="lg">
                Submit Data
            </Button>
          </div>
        </React.Fragment>
      )}
    </MyContext.Consumer>
  )

  export default ComplexShipping;