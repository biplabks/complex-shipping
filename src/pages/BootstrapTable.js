import React from 'react';
import { Container, Button, Form, Row, Col, Table } from 'react-bootstrap';
import MyContext from './MyContext';
import moment from 'moment';

class BootstrapTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          due_date: '',
          items: [],
          isDateEditable: false,
          selected: [] 
        };
    }
    
    // handleDelete = (row) => {
    //     var existingItem = this.state.items;
    //     var modifiedData = [];
    //     existingItem.forEach(element => {
    //       if (element.id != row.id) {
    //         modifiedData.push(element);
    //       }
    //     })
    
    //     for (let index = 0; index < modifiedData.length; index++) {
    //       modifiedData[index]['id'] = index
    //     }
    
    //     var existingItemByDueDate = this.context['itemsByDueDate']
    //     for (let index = 0; index < existingItemByDueDate.length; index++) {
    //       if(existingItemByDueDate[index]['key'] == this.state.due_date) {
    //         existingItemByDueDate[index]['value'] = Object.assign([], modifiedData);
    //         break
    //       }
    //     }
    
    //     this.context['itemsByDueDateMap'].set(this.state.due_date, modifiedData)
    
    //     this.setState({items: modifiedData}, () => {
    //       console.log("modified items: ", this.state.items);
    //     })
    // };

    componentDidMount() {
        this.setState({
            items: this.props.orderDetails,
            due_date: this.props.due_date,
            isDateEditable: this.props.isDateEditable
        }, () => {
            console.log("calling from Bootstraptable componentDidMount, items: ", this.state.items)
        });
    }

    componentDidUpdate(prevProps) {
        if(prevProps.orderDetails !== this.props.orderDetails){
            this.setState({
            items: this.props.orderDetails
            });
        }
    }

    insertItemByDueDate = () => {
        this.context.insertItemByDueDate(this.state.due_date);
    }

    copyItemsByDueDate = () => {
        this.context.copyItemsByDueDate(this.state.due_date);
    }

    setDueDate = (event) => {
        this.context.setDueDate(event, this.state.due_date);
    }

    handleDelete = (e, id) => {
        console.log("calling from Bootstraptable onChangeInput, e: ", e.target, ", id: ", id)

        var existingItem = this.state.items;
        var modifiedData = [];
        existingItem.forEach(element => {
            if (element.id != id) {
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
    }

    onChangeInput = (e, id) => {
        console.log("calling from Bootstraptable onChangeInput, e: ", e.target)
        const { name, value } = e.target
        console.log("id: ", id, ", name: ", name, ", value: ", value)

        if (name == 'order_qty') {
            if (value && value < 0) {
                alert("Negative value is not allowed");
                return
            }
            if(!value)
            {
                alert("Order quantity can not be anything other than number!");
                return
            }
        }
        // else if(name == 'item') {
        //     let item = this.state.items.find(e => e.item === value)
        //     if (item) {
        //         alert("Duplicate item is not allowed!")
        //         return
        //     }
        // }

        const editedData = this.state.items.map((item) =>
            item.id === id && name ? { ...item, [name]: value } : item
        )

        console.log("edit data: ", editedData)

        this.setState({
            items: editedData
        }, () => {
            console.log("calling form onChangeInput, this.state.items: ", this.state.items)
        })

        //update data to main data structure
        let contextValue = this.context;

        var existingItemByDueDate = contextValue['itemsByDueDate']
        for (let index = 0; index < existingItemByDueDate.length; index++) {
            if(existingItemByDueDate[index]['key'] == this.state.due_date) {
                existingItemByDueDate[index]['value'] = Object.assign([], editedData);
                break
            }
        }
        contextValue['itemsByDueDateMap'].set(this.state.due_date, editedData)
    }

    // onBlurInput = (e, id) => {
    //     console.log("calling from Bootstraptable onBlurInput, e: ", e.target)

    //     const { name, value } = e.target

    //     if(name == 'item') {
    //         let item = this.state.items.find(e => e.item === value)
    //         if (item) {
    //             alert("Duplicate item is not allowed here===!")
    //             return
    //         }
    //     }
    // }

    // handleDelete = (id) => {
    //     console.log("calling from Bootstraptable onChangeInput, id: ", id)
    // }

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
                        <Form.Control onChange={event => this.setDueDate(event)} disabled={!this.state.isDateEditable || this.context.isSubmitButtonLoading || this.context.isConfirmed} type="date" value={moment(this.state.due_date).utc().format('YYYY-MM-DD')} placeholder="Enter date" />
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
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Order Quantity</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.items.map(({id, item, order_qty}) => (
                        <tr key={id}>
                            <td>
                                <Form.Control 
                                    name="item" 
                                    value={item} 
                                    type="text" 
                                    onChange={(e) => this.onChangeInput(e, id)}
                                    // onBlur={(e) => this.onBlurInput(e, id)}
                                    placeholder="Type Item Name"
                                    className="text-center"
                                    disabled={this.context.isConfirmed || this.context.isSubmitButtonLoading}
                                />
                            </td>
                            <td>
                                <input
                                    name="order_qty"
                                    value={order_qty}
                                    type="number"
                                    min={1}
                                    onChange={(e) => this.onChangeInput(e, id)}
                                    placeholder="Type Order Quantity"
                                    className="text-center"
                                    disabled={this.context.isConfirmed || this.context.isSubmitButtonLoading}
                                />
                            </td>
                            <td>
                                <Button disabled={this.context.isConfirmed || this.context.isSubmitButtonLoading} variant="danger" onClick={(e) => this.handleDelete(e, id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                    </svg>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Col className='d-flex flex-row'>
                {
                    !this.context.isConfirmed && 
                    <Button className='mx-1' disabled={this.context.isSubmitButtonLoading} onClick={this.insertItemByDueDate}>
                        Add Item
                    </Button>
                }
                
            </Col>
          </Container>
        );
    }
};

BootstrapTable.contextType = MyContext;

export default BootstrapTable;