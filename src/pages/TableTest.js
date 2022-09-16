import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import React from 'react';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
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

  // version 1
  // validatorFormatter = (newValue, row, column) => {
  //   var exists = false;
  //   for (let index = 0; index < this.state.items.length; index++) {
  //     if (this.state.items[index]['item'] === newValue) {
  //       exists = true;
  //       break;
  //     }
  //   }
  //   if (exists) {
  //     return {
  //       valid: false,
  //       message: "Duplicated entry found!"
  //     };
  //   }
  //   return true;
  // };

  // version 2
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

    // console.log("calling from validatorFormatter, this.state.validItems: ", this.state.validItems, ", newValue: ", newValue)
    // for (let index = 0; index < this.state.validItems.length; index++) {
    //   console.log("calling from validatorFormatter, this.state.validItems[index]: ", this.state.validItems[index], ", newValue: ", newValue)
    //   if (this.state.validItems[index] === newValue) {
    //     exists = true;
    //     break;
    //   }
    // }

    if (!this.state.validItems.includes(newValue)) {
      return {
        valid: false,
        message: "Invalid item!"
      };
    }
    return true;
  };

  componentDidMount() {
    //console.log("calling from componentDidMount in TableTest: ", this.props.validItems)
    this.setState({
      items: this.props.orderDetails,
      due_date: this.props.due_date,
      isDateEditable: this.props.isDateEditable,
      validItems: this.props.validItems
    }, () => {
      //console.log("calling from TableTest, this.state.validItems: ", this.state.validItems)
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
    let value = this.context;
    value['cars']['car001']['name'] = 'Biplab1'
    // console.log("calling from handleBtnClick in TableTest, value: ", value)
    // console.log("calling from handleBtnClick in TableTest, this.state.items: ", this.state.items);
    // console.log("calling from handleBtnClick in TableTest, this.state.selected: ", this.state.selected);

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

    // value.getTest(this.state.due_date, selectedItems)
    var existingItemByDueDate = value['itemsByDueDate']
    // var existingItemByDueDateMap = value['itemsByDueDateMap']
    for (let index = 0; index < existingItemByDueDate.length; index++) {
      if(existingItemByDueDate[index]['key'] == this.state.due_date) {
          existingItemByDueDate[index]['value'] = Object.assign([], modifiedData);
          break
      }
    }

    value['itemsByDueDateMap'].set(this.state.due_date, modifiedData)

    //console.log("value['itemsByDueDate']: ", value['itemsByDueDate'], ", value['itemsByDueDateMap']: ", value['itemsByDueDateMap'])
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

    //console.log("calling from removeItemByDueDate, existingItem: ", existingItem, ", selectedItems: ", selectedItems)

    var modifiedData = [];
    existingItem.forEach(element => {
        if (!selectedItems.includes(element.id)) {
          modifiedData.push(element);
        }
    })

    //console.log("modifiedData: ", modifiedData, ", modifiedData.length: ", modifiedData.length)

    for (let index = 0; index < modifiedData.length; index++) {
      modifiedData[index]['id'] = index
    }

    this.setState({items: modifiedData, selected: []})

    // value.getTest(this.state.due_date, selectedItems)
    var existingItemByDueDate = this.context['itemsByDueDate']
    // var existingItemByDueDateMap = value['itemsByDueDateMap']
    for (let index = 0; index < existingItemByDueDate.length; index++) {
      if(existingItemByDueDate[index]['key'] == this.state.due_date) {
          existingItemByDueDate[index]['value'] = Object.assign([], modifiedData);
          break
      }
    }

    this.context['itemsByDueDateMap'].set(this.state.due_date, modifiedData)

    //console.log("value['itemsByDueDate']: ", this.context['itemsByDueDate'], ", value['itemsByDueDateMap']: ", this.context['itemsByDueDateMap'])
  }

  insertItemByDueDate = () => {
    this.context.insertItemByDueDate(this.state.due_date);
    this.setState({
      validItems: this.context.validItems
    }, () => {
      //console.log("calling from TableTest, this.state.validItems: ", this.state.validItems)
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
      onSelectAll: this.handleOnSelectAll
    };
      return (
        <Container className="p-3">
          {/* <button className="btn btn-success" onClick={ this.handleBtnClick }>Select/UnSelect 3rd row</button> */}
          {/* <Form>
            <Form.Group className="mb-3" controlId="formGroupEmail">
              <Form.Control type="date" placeholder="Enter date" />
            </Form.Group>
          </Form> */}
          {
            // style={{'background-color': 'green'}}
            // style={{display: 'flex', justifyContent:'left'}}
            <div>
              <Form>
                <Form.Group as={Row} className="mb-3" controlId="formGroupDueDate">
                  <Form.Label style={{display: 'flex', justifyContent:'left'}} column sm="1">
                    Due Date
                  </Form.Label>
                  <Col sm="3" className='m-6'>
                    {/* <Form.Control style={{ justifyContent:'left'}} type="date" placeholder="Enter date" /> */}
                    {/* <Form.Control onChange={event => context.setDueDate(event, element.key)} disabled={!element.isDateEditable} type="date" value={moment(element.key).utc().format('YYYY-MM-DD')} placeholder="Enter date" /> */}
                    <Form.Control onChange={event => this.setDueDate(event)} disabled={!this.state.isDateEditable} type="date" value={moment(this.state.due_date).utc().format('YYYY-MM-DD')} placeholder="Enter date" />
                  </Col>
                </Form.Group>
              </Form>
            </div>
          }
          
          {
            !this.context.isConfirmed &&
            <div className='d-flex justify-content-between me-3'>
              <form>
                <Button onClick={ this.removeItemByDueDate }>
                  Remove records
                </Button>
              </form>
              <form>
                <Button onClick={this.insertItemByDueDate}>
                  Insert Record
                </Button>
              </form>
              <form>
                <Button onClick={this.copyItemsByDueDate}>
                  Copy Record
                </Button>
              </form>
            </div>
          }
          {
            <div>
              <br />
            </div>
          }
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

TableTest.contextType = MyContext;


export default TableTest;