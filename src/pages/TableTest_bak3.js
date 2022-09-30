import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
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
          editable: this.editableTester,
          style: {
            width: '1000px',
            textAlign: 'center'
          }
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
            return true;
          },
          editable: this.editableTester,
          // formatter: this.headerStyle
          style: {
            width: '140px',
            textAlign: 'center'
          }
        },
        {
          dataField: "remove",
          text: "Delete",
          formatter: (cellContent, row) => {
            return (
              <button
                className="btn btn-danger btn-xs"
                onClick={() => this.handleDelete(row)}
                // onClick={() => this.handleDelete(row.id, row.name)}
                // onClick={() => this.handleDelete}
              >
                Delete
              </button>
            );
          },
        }
      ],
      selected: [] 
    };
  }
  // handleDelete = (rowId, name) => {
  //   console.log(rowId, name);
  //   //1 YourCellName
  // };
  handleDelete = (row) => {
    var existingItem = this.state.items;
    // existingItem.forEach(element => {
    //   if (!selectedItems.includes(element.id)) {
    //     modifiedData.push(element);
    //   }
    // })
    console.log("row: ", row)
    console.log("clicking on id: ")
    console.log(row.id)

    var modifiedData = [];
    existingItem.forEach(element => {
        if (element.id != row.id) {
          modifiedData.push(element);
        }
    })

    console.log("modifiedData: ", modifiedData)
    for (let index = 0; index < modifiedData.length; index++) {
      modifiedData[index]['id'] = index
    }
    
    //modified items
    // this.setState({items: modifiedData}, () => {
    //   console.log("modified items: ", this.state.items);
    // })

    var existingItemByDueDate = this.context['itemsByDueDate']
    console.log("before existingItemByDueDate: ", existingItemByDueDate)
    for (let index = 0; index < existingItemByDueDate.length; index++) {
      if(existingItemByDueDate[index]['key'] == this.state.due_date) {
        existingItemByDueDate[index]['value'] = Object.assign([], modifiedData);
        break
      }
    }
    console.log("after existingItemByDueDate: ", existingItemByDueDate)

    this.context['itemsByDueDateMap'].set(this.state.due_date, modifiedData)

    console.log("I am here ....done")

    this.setState({items: modifiedData}, () => {
      console.log("modified items: ", this.state.items);
    })
  };
  // handleDelete = (newValue, row, column) => {
  //   console.log(newValue, row, column);
  //   //1 YourCellName
  // };
  editableTester = () => {
    // return !this.context.isSubmitButtonLoading
    return true 
  }

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

    if (!this.state.validItems.includes(newValue)) {
      return {
        valid: false,
        message: "Invalid item!"
      };
    }
    return true;
  };

  componentDidMount() {
    console.log("Am I here dude 1?")
    this.setState({
      items: this.props.orderDetails,
      due_date: this.props.due_date,
      isDateEditable: this.props.isDateEditable,
      validItems: this.props.validItems
    }, () => {
    });
  }

  componentDidUpdate(prevProps) {
    console.log("Am I here dude 2?")
    console.log("prevProps.orderDetails: ", prevProps.orderDetails)
    console.log("this.props.orderDetails: ", this.props.orderDetails)
    if(prevProps.orderDetails !== this.props.orderDetails){
      console.log("Am I here dude 3?")
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

  removeItemByDueDate = () => {
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

    var existingItemByDueDate = this.context['itemsByDueDate']
    for (let index = 0; index < existingItemByDueDate.length; index++) {
      if(existingItemByDueDate[index]['key'] == this.state.due_date) {
          existingItemByDueDate[index]['value'] = Object.assign([], modifiedData);
          break
      }
    }

    this.context['itemsByDueDateMap'].set(this.state.due_date, modifiedData)
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
    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,
      clickToEdit: true,
      selected: this.state.selected,
      onSelect: this.handleOnSelect,
      onSelectAll: this.handleOnSelectAll,
      // style: {
      //   width: '100px'
      // }
    };
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
                    <Form.Control onChange={event => this.setDueDate(event)} disabled={!this.state.isDateEditable} type="date" value={moment(this.state.due_date).utc().format('YYYY-MM-DD')} placeholder="Enter date" />
                  </Col>
                  {!this.context.isConfirmed && 
                    <>
                      {/* <Col className='float-left'>
                        <Button disabled={this.context.isSubmitButtonLoading} onClick={ this.removeItemByDueDate }>
                          Remove records
                        </Button>
                      </Col>
                      <Col  className='float-left'>
                        <Button disabled={this.context.isSubmitButtonLoading} onClick={this.insertItemByDueDate}>
                          Insert Record
                        </Button>
                      </Col>
                      <Col sm="3" className='m-6'>
                        <Button disabled={this.context.isSubmitButtonLoading} onClick={this.copyItemsByDueDate}>
                          Copy This Table
                        </Button>
                      </Col> */}
                      <Col className='d-flex flex-row mb-3'>
                        {/* <ButtonGroup aria-label="Basic example"> */}
                          <Button className='mx-1' disabled={this.context.isSubmitButtonLoading} onClick={ this.removeItemByDueDate }>
                            Remove records
                          </Button>
                          <Button className='mx-1' disabled={this.context.isSubmitButtonLoading} onClick={this.insertItemByDueDate}>
                            Insert Record
                          </Button>
                          <Button className='mx-1' disabled={this.context.isSubmitButtonLoading} onClick={this.copyItemsByDueDate}>
                            Copy This Table
                          </Button>
                        {/* </ButtonGroup> */}
                      </Col>
                      
                    </>
                  }
                </Form.Group>
              </Form>
            </div>
          }
          
          {/* {
            !this.context.isConfirmed &&
            <div className='d-flex justify-content-between me-3'>
              <form>
                <Button disabled={this.context.isSubmitButtonLoading} onClick={ this.removeItemByDueDate }>
                  Remove records
                </Button>
              </form>
              <form>
                <Button disabled={this.context.isSubmitButtonLoading} onClick={this.insertItemByDueDate}>
                  Insert Record
                </Button>
              </form>
              <form>
                <Button disabled={this.context.isSubmitButtonLoading} onClick={this.copyItemsByDueDate}>
                  Copy This Table
                </Button>
              </form>
            </div>
          } */}
          {/* {
            <div>
              <br />
            </div>
          } */}
          {/* <div style={{padding: "50px"}}> */}
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
          {/* </div> */}
          
        </Container>
      );
    }
};

TableTest.contextType = MyContext;


export default TableTest;