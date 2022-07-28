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
      ],
      selected: [] 
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

  handleBtnClick = () => {

    console.log("calling from handleBtnClick in TableTest, this.state.items: ", this.state.items);
    console.log("calling from handleBtnClick in TableTest, this.state.selected: ", this.state.selected);

    var existingItem = this.state.items;
    var selectedItems = this.state.selected;

    var modifiedData = [];
    existingItem.forEach(element => {
        if (!selectedItems.includes(element.id)) {
          modifiedData.push(element);
        }
    })

    for (let index = 0; index < modifiedData.length; index++) {
      modifiedData[index]['id'] = index
    }

    this.setState({items: modifiedData, selected: []})
  }

  handleOnSelect = (row, isSelect) => {
    if (isSelect) {
      this.setState(() => ({
        selected: [...this.state.selected, row.id]
      }));
    } else {
      this.setState(() => ({
        selected: this.state.selected.filter(x => x !== row.id)
      }));
    }
  }

  // version 1
  // handleOnSelectAll = (isSelect, rows) => {
  //   const ids = rows.map(r => r.id);
  //   console.log("calling from handleOnSelectAll, ids: ", ids)
  //   if (isSelect) {
  //     this.setState(() => ({
  //       selected: ids
  //     }, () => console.log("Selected all: ", this.state.selected)));
  //   } else {
  //     this.setState(() => ({
  //       selected: []
  //     }));
  //   }
  // }

  // version 2
  handleOnSelectAll = (isSelect, rows) => {
    const ids = rows.map(r => r.id);
    if (isSelect) {
      this.setState(() => ({
        selected: ids
      }));
    } else {
      this.setState(() => ({
        selected: []
      }));
    }
  }

  render() {
    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,
      selected: this.state.selected,
      onSelect: this.handleOnSelect,
      onSelectAll: this.handleOnSelectAll
    };
      return (
        <Container className="p-3">
          <button className="btn btn-success" onClick={ this.handleBtnClick }>Select/UnSelect 3rd row</button>
          <BootstrapTable
            keyField="id"
            // data={ items }
            // data={ this.props.orderDetails }
            data={ this.state.items }
            columns={ this.state.columns }
            cellEdit={ cellEditFactory({ mode: 'dbclick' }) }
            noDataIndication="Table is Empty"
            selectRow={selectRow}
          />
        </Container>
      );
    }
};


export default TableTest;