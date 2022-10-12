import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import React from 'react';
import { Container, Button, Form, Row, Col, ButtonGroup } from 'react-bootstrap';
import MyContext from './MyContext';
import moment from 'moment';

class TableTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      due_date: '',
      items: [],
      validItems: [],
      isDateEditable: false,
      columns: [
        {
          dataField: 'id',
          text: 'Id',
          hidden: true
        },
        {
          dataField: 'item',
          text: 'Item',
          validator: this.validatorFormatter,
          style: {
            width: '500px',
            textAlign: 'center'
          },
          editable: this.isConfirmedOrder,
          // formatter: (cellContent, row) => {
          //   return (
          //     <input type="text" value={row.item} />
          //   );
          // }
          // editor: {
          //   type: Type.TEXT
          // }
          // formatter: this.priceFormatter
        },
        {
          dataField: 'order_qty',
          text: 'Quantity',
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
            if (newValue < 0) {
              return {
                valid: false,
                message: "Order quantity can not be negative"
              };
            }
            return true;
          },
          editable: this.isConfirmedOrder,
          style: {
            width: '140px',
            textAlign: 'center'
          },
          // formatter: (cellContent, row) => {
          //   return (
          //     <input type="text" value={row.order_qty} />
          //   );
          // }
        },
        {
          dataField: "remove",
          text: "Delete",
          editable: this.isConfirmedOrder,
          /*
          formatter: (cellContent, row) => {
            return (
              <button
                className="btn btn-danger btn-xs"
                onClick={() => this.handleDelete(row)}
              >
                Delete
              </button>
            );
          }
          */
          formatter: (cellContent, row) => {
            return (
              <button
                className="btn btn-danger btn-xs"
                onClick={() => this.handleDelete(row)}
                disabled={!this.isConfirmedOrder()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
              </button>
            );
          },
          style: {
            width: '140px',
            textAlign: 'center'
          },
        }
      ],
      selected: [] 
    };
  }

  // priceFormatter(cell, row) {
  //   // if (row.onSale) {
  //   //   return (
  //   //     <span>
  //   //       <strong style={ { color: 'red' } }>$ { cell } NTD(Sales!!)</strong>
  //   //     </span>
  //   //   );
  //   // }
  
  //   return (
  //     // <span>$ { cell } NTD</span>
  //     // <span>
  //     //   <input type="text" value={cell} />
  //     // </span>

  //     <input type="text" disabled={false} value={cell} />
  //   );
  // }
  priceFormatter(cell, row) {
    return (
      <input type="text" value={cell} />
    );
  }
  isConfirmedOrder = () => {
    return !this.context.isConfirmed;
  }

  handleDelete = (row) => {
    var existingItem = this.state.items;
    console.log("calling from handleDelete, row: ", row)
    var modifiedData = [];
    existingItem.forEach(element => {
      if (element.id != row.id) {
        modifiedData.push(element);
      }
    })

    for (let index = 0; index < modifiedData.length; index++) {
      modifiedData[index]['id'] = index
    }

    var existingItemByDueDate = this.context['itemsByDueDate']
    for (let index = 0; index < existingItemByDueDate.length; index++) {
      if(existingItemByDueDate[index]['key'] == this.state.due_date) {
        existingItemByDueDate[index]['value'] = Object.assign([], modifiedData);
        break
      }
    }

    this.context['itemsByDueDateMap'].set(this.state.due_date, modifiedData)

    this.setState({items: modifiedData}, () => {
      console.log("modified items: ", this.state.items);
    })
  };
  validatorFormatter = (newValue, row, column) => {
    var exists = false;
    console.log("newValue: ", newValue, ", row: ", row, ", column: ", column, ", this.state.items: ", this.state.items.length)
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

    if (!this.state.validItems.includes(newValue)) {
      return {
        valid: false,
        message: "Invalid item!"
      };
    }
    return true;
  };

  componentDidMount() {
    this.setState({
      items: this.props.orderDetails,
      due_date: this.props.due_date,
      isDateEditable: this.props.isDateEditable,
      validItems: this.props.validItems
    }, () => {
    });
  }

  componentDidUpdate(prevProps) {
    if(prevProps.orderDetails !== this.props.orderDetails){
      this.setState({
        items: this.props.orderDetails
      });
    }
  }

  handleBtnClick = () => {
    let value = this.context;

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

    var existingItemByDueDate = value['itemsByDueDate']
    for (let index = 0; index < existingItemByDueDate.length; index++) {
      if(existingItemByDueDate[index]['key'] == this.state.due_date) {
        existingItemByDueDate[index]['value'] = Object.assign([], modifiedData);
        break
      }
    }

    value['itemsByDueDateMap'].set(this.state.due_date, modifiedData)
  }

  insertItemByDueDate = () => {
    this.context.insertItemByDueDate(this.state.due_date);
    this.setState({
      validItems: this.context.validItems
    }, () => {
    });
  }

  copyItemsByDueDate = () => {
    this.context.copyItemsByDueDate(this.state.due_date);
  }

  setDueDate = (event) => {
    this.context.setDueDate(event, this.state.due_date);
  }

  render() {
    return (
      <Container className="p-3">
        {
          <div>
            <Form>
              <Form.Group as={Row} className="mb-3" controlId="formGroupDueDate">
                <Form.Label style={{display: 'flex', justifyContent:'left'}} column sm="1">
                  Due Date
                </Form.Label>
                <Col sm="2" className='m-6'>
                  <Form.Control onChange={event => this.setDueDate(event)} disabled={!this.state.isDateEditable || this.context.isSubmitButtonLoading} type="date" value={moment(this.state.due_date).utc().format('YYYY-MM-DD')} placeholder="Enter date" />
                </Col>
                {!this.context.isConfirmed && 
                  <>
                    <Col className='d-flex flex-row mb-3'>
                        <Button className='mx-1' disabled={this.context.isSubmitButtonLoading} onClick={this.copyItemsByDueDate}>
                          Duplicate this Due Date
                        </Button>
                    </Col>
                  </>
                }
              </Form.Group>
            </Form>
          </div>
        }
        <BootstrapTable
          keyField="id"
          data={ this.state.items }
          columns={ this.state.columns }
          // cellEdit={ cellEditFactory({ mode: 'dbclick', blurToSave: true }) }
          cellEdit={ cellEditFactory({ mode: 'dbclick' }) }
          noDataIndication="Table is Empty"
          tabIndexCell={true}
        />
        <Col className='d-flex flex-row'>
          <Button className='mx-1' disabled={this.context.isSubmitButtonLoading} onClick={this.insertItemByDueDate}>
            Add Item
          </Button>
        </Col>
      </Container>
    );
  }
};

TableTest.contextType = MyContext;


export default TableTest;