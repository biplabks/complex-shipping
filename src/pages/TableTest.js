import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import React from 'react';
import { Container } from 'react-bootstrap';

// const products = [
//     { id: 1, name: "apple", price: 1 },
//     { id: 2, name: "orange", price: 2 },
//     { id: 3, name: "banana", price: 3 },
//     { id: 4, name: "peach", price: 2 },
//     { id: 5, name: "carrot", price: 1 },
//     { id: 6, name: "grapes", price: 4 },
//     { id: 7, name: "mango", price: 1 },
//     { id: 8, name: "potatoe", price: 3 },
//     { id: 9, name: "onion", price: 3 }
//   ];

// const products = [
//   { item: 2035129-1, order_qty: 1 },
//   { item: 2035129-2, order_qty: 2 },
//   { item: 2035129-3, order_qty: 3 },
//   { item: 2035129-4, order_qty: 2 },
//   { item: 2035129-5, order_qty: 1 },
//   { item: 2035129-6, order_qty: 4 },
//   { item: 2035129-7, order_qty: 1 },
//   { item: 2035129-8, order_qty: 3 },
//   { item: 2035129-9, order_qty: 3 }
// ];

const columns = [
  {
    dataField: 'id',
    text: 'Id'
  },
  {
    dataField: 'item',
    text: 'Item',
    validator: (newValue, row, column) => {
      // console.log("this.state.items in validator: ", this.state.items);
      // var exists = Object.keys(this.props.orderDetails).some(function(k) {
      //   return this.props.orderDetails[k]['item'] === newValue;
      // });

      // console.log("exists: ", exists)
    
      // if (exists) {
      //   return {
      //     valid: false,
      //     message: "Duplicated entry found!"
      //   };
      // }
      return true;
    }
  },
  {
    dataField: 'order_qty',
    text: 'Order Quantity',
    validator: (newValue, row, column) => {
      if (isNaN(newValue)) {
        return {
          valid: false,
          message: "Order quantity should be numeric"
        };
      }
      if (newValue > 1000) {
        return {
          valid: false,
          message: "Order quantity should less than 1000"
        };
      }
      return true;
    }
  }
];

class TableTest extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     error: null,
  //     isLoaded: false,
  //     items: []
  //   };
  // }

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      columns: [
        {
          dataField: 'id',
          text: 'Id'
        },
        {
          dataField: 'item',
          text: 'Item',
          validator: this.validatorFormatter
          // validator: (newValue, row, column) => {
          //   // console.log("this.state.items in validator: ", this.state.items);
          //   // var exists = Object.keys(this.props.orderDetails).some(function(k) {
          //   //   return this.props.orderDetails[k]['item'] === newValue;
          //   // });
      
          //   // console.log("exists: ", exists)
          
          //   // if (exists) {
          //   //   return {
          //   //     valid: false,
          //   //     message: "Duplicated entry found!"
          //   //   };
          //   // }
          //   return true;
          // }
        },
        {
          dataField: 'order_qty',
          text: 'Order Quantity',
          validator: (newValue, row, column) => {
            if (isNaN(newValue)) {
              return {
                valid: false,
                message: "Order quantity should be numeric"
              };
            }
            if (newValue > 1000) {
              return {
                valid: false,
                message: "Order quantity should less than 1000"
              };
            }
            return true;
          }
        }
      ]
    };
  }

  validatorFormatter = (newValue, row, column) => {
    // console.log("this.state.items in validator: ", Object.keys(this.state.items));
    // var exists = Object.keys(this.state.items).some(function(k) {
    //   return this.state.items[k]['item'] === newValue;
    // });
    var exists = false;
    for (let index = 0; index < this.state.items.length; index++) {
      if (this.state.items[index]['item'] === newValue) {
        exists = true;
        break;
      }
    }
    if (exists) {
      return {
        valid: false,
        message: "Duplicated entry found!"
      };
    }
    return true;
    // console.log("exists: ", exists);
  };

  componentDidMount() {
    console.log("calling from componentDidMount in TableTest")
    this.setState({
      items: this.props.orderDetails
    });
  }

  componentDidUpdate(prevProps) {
    console.log("calling from componentDidUpdate in TableTest")
    if(prevProps.orderDetails !== this.props.orderDetails){
      console.log("calling from componentDidUpdate in TableTest, this.props.orderDetails : ", this.props.orderDetails)
      this.setState({
        items: this.props.orderDetails
      });
    }
  }

  // static getDerivedStateFromProps(props, state) {
  //   return {orderNumber: props.orderNumber };
  // }
  // componentDidMount() {
  //   // fetch("https://vanna.zh.if.atcsg.net:453/api/v1/get-qad-sales-order-info/L210636")

  //   fetch("https://vanna.zh.if.atcsg.net:453/api/v1/get-qad-sales-order-info/"+this.props.orderNumber)
  //     .then(res => res.json())
  //     .then(
  //       (result) => {
  //         // console.log("result: ", result.result.L210636.line_details);
  //         console.log("result: ", result['result'][this.props.orderNumber]['line_details']);
  //         this.setState({
  //           isLoaded: true,
  //           items: result['result'][this.props.orderNumber]['line_details']
  //         });
  //       },
  //       (error) => {
  //         this.setState({
  //           isLoaded: true,
  //           error
  //         });
  //       }
  //     )

  //   // this.setState({
  //   //   isLoaded: true,
  //   //   items: products
  //   // });
  // }
  render() {
    // const {error, isLoaded, items } = this.state;
    // const { items } = this.state;

    // if (error) {
    //   return <div>Error: {error.message}</div>;
    // } else if (!isLoaded) {
    //   return <div>Loading...</div>;
    // } else {
    //   return (
    //     <Container className="p-3">
    //       <BootstrapTable
    //           keyField="item"
    //           // data={ items }
    //           data={ this.props.orderDetails }
    //           columns={ columns }
    //           cellEdit={ cellEditFactory({ mode: 'dbclick' }) }
    //       />
    //     </Container>
    //   );
      return (
        <Container className="p-3">
          <BootstrapTable
            keyField="id"
            // data={ items }
            data={ this.props.orderDetails }
            columns={ this.state.columns }
            cellEdit={ cellEditFactory({ mode: 'dbclick' }) }
            noDataIndication="Table is Empty"
          />
        </Container>
      );
    }
    
    // return (
    //     <Container className="p-3">
    //         <BootstrapTable
    //             keyField="id"
    //             data={ products }
    //             columns={ columns }
    //             cellEdit={ cellEditFactory({ mode: 'dbclick' }) }
    //         />
    //     </Container>
    // );
};



export default TableTest;