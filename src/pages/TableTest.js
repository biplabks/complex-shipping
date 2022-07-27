import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import React from 'react';
import { Container, Button } from 'react-bootstrap';

class TableTest extends React.Component {
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
        },
        // {
        //   dataField: "movieId",
        //   text: 'Order Quantity',
        //   formatter: (rowContent, row) => {
        //       return (
        //         // <button onClick={() => deleteMovie(data[0].movieId)}>delete</button>
        //         <button onClick={() => this.deleteMovie()}>delete</button>
        //       );
        //   }
        // }
      ]
    };
  }
  // deleteMovie() {
  //   console.log("clicking on deleteMovie")
  // }
  validatorFormatter = (newValue, row, column) => {
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
    // console.log("calling from componentDidMount in TableTest")
    this.setState({
      items: this.props.orderDetails
    });
  }

  componentDidUpdate(prevProps) {
    // console.log("calling from componentDidUpdate in TableTest")
    if(prevProps.orderDetails !== this.props.orderDetails){
      // console.log("calling from componentDidUpdate in TableTest, this.props.orderDetails : ", this.props.orderDetails)
      this.setState({
        items: this.props.orderDetails
      });
    }
  }
  selectRowProp = {
    mode: 'checkbox'
  };

  render() {
      return (
        <Container className="p-3">
          <BootstrapTable
            keyField="id"
            // data={ items }
            data={ this.props.orderDetails }
            columns={ this.state.columns }
            cellEdit={ cellEditFactory({ mode: 'dbclick' }) }
            noDataIndication="Table is Empty"
            selectRow={this.selectRowProp}
          />
        </Container>
      );
    }
};


export default TableTest;