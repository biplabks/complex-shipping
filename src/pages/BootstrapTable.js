// import {React, createRef} from 'react';
import React from 'react';
import createRef from 'react';
import { Container, Button, Form, Row, Col, Table, Card } from 'react-bootstrap';
import MyContext from './MyContext';
import moment from 'moment';


class BootstrapTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          due_date: '',
          due_date_time: '',
          items: [],
          isDateEditable: false,
          selected: [] 
        };
        this.textInput = React.createRef();
    }

    componentDidMount() {
        this.setState({
            items: this.props.orderDetails,
            due_date: this.props.due_date.replace("T00:00:00.000Z", ''),
            due_date_time: this.props.due_date.replace("T00:00:00.000Z", ''),
            isDateEditable: this.props.isDateEditable
        }, () => {
            console.log("calling from Bootstraptable componentDidMount, items: ", this.state.items, ", due_date: ", this.state.due_date)
        });
        this.textInput.current.focus();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.orderDetails !== this.props.orderDetails){
            console.log("calling from componentDidUpdate in BootstrapTable")
            this.setState({
                items: this.props.orderDetails
            });
        }
    }

    insertItemByDueDate = () => {
        var modified_due_date = this.state.due_date + "T00:00:00.000Z"
        this.context.insertItemByDueDate(modified_due_date);
    }

    copyItemsByDueDate = () => {
        var modified_due_date = this.state.due_date + "T00:00:00.000Z"
        this.context.copyItemsByDueDate(modified_due_date);
    }

    setDueDate = (event) => {
        var modified_due_date = this.state.due_date + "T00:00:00.000Z"
        this.context.setDueDate(event, modified_due_date);
        
        console.log("calling from setDueDate, event: ", event.target.value)
        this.setState({
            due_date: event.target.value
        }, () => {
            console.log("this.state.due_date: ", this.state.due_date)
        })

        console.log("Focusing current text input")
        this.textInput.current.focus();
    }

    handleDelete = (e, id) => {
        console.log("calling from Bootstraptable onChangeInput, e: ", e.target, ", id: ", id, ", this.state.due_date: ", this.state.due_date)

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
        console.log("calling from Bristol, existingItemByDueDate: ", existingItemByDueDate)
        var modified_due_date = this.state.due_date + "T00:00:00.000Z"
        for (let index = 0; index < existingItemByDueDate.length; index++) {
            if(existingItemByDueDate[index]['key'] == modified_due_date) {
                existingItemByDueDate[index]['value'] = Object.assign([], modifiedData);
                break
            }
        }

        this.context['itemsByDueDateMap'].set(modified_due_date, modifiedData)

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
        var modified_due_date = this.state.due_date + "T00:00:00.000Z"
        for (let index = 0; index < existingItemByDueDate.length; index++) {
            if(existingItemByDueDate[index]['key'] == modified_due_date) {
                existingItemByDueDate[index]['value'] = Object.assign([], editedData);
                break
            }
        }
        contextValue['itemsByDueDateMap'].set(modified_due_date, editedData)
    }

    setTestDueDate = (event) => {
        console.log("calling from setTestDueDate, event: ", event.target.value)
        this.setState({
            due_date_time: event.target.value
        }, () => {
            console.log("this.state.due_date_time: ", this.state.due_date_time)
        })
    }

    render() {
        return (
        //   <Container className="p-3">
            // <Card style={{ width: '35rem' }}>
            <Card>
                <Card.Header>
                {
                    <div>
                        <Form>
                            <Form.Group as={Row} className="mb-3" controlId="formGroupDueDate">
                                <Form.Label style={{display: 'flex', justifyContent:'left'}} column sm="2">
                                Due Date
                                </Form.Label>
                                <Col sm="4" className='m-6'>
                                    {/* <Form.Control onChange={event => this.setDueDate(event)} disabled={!this.state.isDateEditable || this.context.isSubmitButtonLoading || this.context.isConfirmed} type="date" value={moment(this.state.due_date).utc().format('YYYY-MM-DD')} placeholder="Enter date" /> */}

                                    <Form.Control onChange={event => this.setDueDate(event)} ref={this.textInput} disabled={!this.state.isDateEditable || this.context.isSubmitButtonLoading || this.context.isConfirmed} type="date" value={this.state.due_date} placeholder="Enter date" />

                                    {/* <Form.Control onChange={event => this.setTestDueDate(event)} value={this.state.due_date_time} type="date" placeholder="Enter date" /> */}

                                    {/* // due_date: this.props.due_date.replace("T00:00:00.000Z", ''), */}
                                    {/* <Form.Control onChange={event => this.setDueDate(event)} disabled={!this.state.isDateEditable || this.context.isSubmitButtonLoading || this.context.isConfirmed} type="date" value={this.state.due_date} placeholder="Enter date" /> */}
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
                </Card.Header>
                <Card.Body>
                    <Table responsive striped bordered hover>
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
                                        {/* <input
                                            name="order_qty"
                                            value={order_qty}
                                            type="number"
                                            min={1}
                                            onChange={(e) => this.onChangeInput(e, id)}
                                            placeholder="Type Order Quantity"
                                            className="text-center"
                                            disabled={this.context.isConfirmed || this.context.isSubmitButtonLoading}
                                        /> */}
                                        <Form.Control
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
                </Card.Body>
            </Card>
        //   </Container>
        );
    }
};

BootstrapTable.contextType = MyContext;

export default BootstrapTable;