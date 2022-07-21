import { Container, Button } from 'react-bootstrap';
import React from 'react';
import AccordionTest from './AccordionTest';
import SearchForm from './SearchForm';

class ComplexShipping extends React.Component {
    constructor(props) {
        super(props);
        this.state = {orderNumber1: ''};

        // this.childToParent = this.childToParent.bind(this);
    }
    
    // this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    // }

    // handleFilterTextChange(filterText) {
    //     this.setState({
    //         filterText: filterText
    //     });
    // }

    // childToParent(event, data){
    //     event.preventDefault();
    //     console.log("This is an alert from the Child Component: ", data);
    //     this.setState({orderNumber: data});
    //     console.log("Hey dude, state is hit: ", this.state.orderNumber);
    // };

    // childToParent(event){
    //     // event.preventDefault();
    //     console.log("This is an alert from the Child Component: ",  event.target.order_number.value);
    //     this.setState({orderNumber:  event.target.order_number.value});
    //     console.log("Hey dude, state is hit: ",  event.target.order_number.value, ", state: ", this.state.orderNumber);
    // };

    childToParent = (event) => {
        // event.preventDefault();
        // console.log("This is an alert from the Child Component: ",  event.target.order_number.value);
        // this.setState({orderNumber1:  event.target.order_number.value});

        this.setState({ orderNumber1: event.target.order_number.value }, () => console.log("state value:", this.state.orderNumber1));

        // console.log("Hey dude, state is hit: ",  event.target.order_number.value, ", state: ", this.state.orderNumber1);
    };
    
    render() {
      const { orderNumber1 } = this.state;
    //   console.log("calling from complexshipping render, orderNumber1: ", orderNumber1)

      let accordinTest;
      if (orderNumber1.length === 7) {
        accordinTest = <AccordionTest orderNumber={this.state.orderNumber1}/>;
      }

    //   let accordinTest = [];
    //   if (orderNumber1.length === 7) {
    //     accordinTest.push(<AccordionTest orderNumber={this.state.orderNumber1}/>);
    //     accordinTest.push(<AccordionTest orderNumber={this.state.orderNumber1}/>);
    //   }
      
      return (
        // <div>
        //     <SearchForm
        //         filterText={this.state.filterText}
        //         onFilterTextChange={this.handleFilterTextChange}
        //     />

        //     <ProductTable
        //         products={this.props.products}
        //         filterText={this.state.filterText}
        //         inStockOnly={this.state.inStockOnly}
        //     />
        // </div>
        <div>
            <Container className="p-3">
                <h1 className="header">Welcome To Complex Shipping</h1>
            </Container>
            <SearchForm childToParent={this.childToParent}/>
            {/* <AccordionTest orderNumber="L210636"/> */}
            {/* <AccordionTest orderNumber={this.state.orderNumber1}/> */}
            { accordinTest }
            {/* <div className="d-grid gap-2">
                <Button variant="primary" size="lg">
                    Submit Data
                </Button>
            </div> */}
            <Button variant="primary" size="lg">
                Submit Data
            </Button>
        </div>
      );
    }
  }

  export default ComplexShipping;