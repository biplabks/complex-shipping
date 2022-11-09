// import {React, createRef} from 'react';
import React from 'react';
import createRef from 'react';
import { Container, Button, Form, Row, Col, Table, Card } from 'react-bootstrap';
import MyContext from './MyContext';
import moment from 'moment';


class BootstrapTable2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        //   due_date: '',
        //   due_date_time: '',
          items: [],
          dueDatesColspan: 1,
          listOfUniqueItems: new Map(),
          listOfUniqueDates: []
        //   isDateEditable: false,
        //   formattedItems: [] 
        };
        // this.textInput = React.createRef();
    }

    //version 1
    // componentDidMount() {
    //     this.setState({
    //         items: this.props.orderDetails,
    //         due_date: this.props.due_date.replace("T00:00:00.000Z", ''),
    //         due_date_time: this.props.due_date.replace("T00:00:00.000Z", ''),
    //         isDateEditable: this.props.isDateEditable
    //     }, () => {
    //         console.log("calling from Bootstraptable2 componentDidMount, items: ", this.state.items, ", due_date: ", this.state.due_date)
    //     });
    // }

    //version 2
    componentDidMount() {
        console.log("calling from Bootstraptable2 componentDidMount, this.props.listOfUniqueDates.size: ", this.props.listOfUniqueDates.length)
        this.setState({
            items: this.props.orderDetails,
            dueDatesColspan: this.props.listOfUniqueDates.length,
            listOfUniqueItems: this.props.listOfUniqueItems,
            listOfUniqueDates: this.props.listOfUniqueDates
        }, () => {
            console.log("calling from Bootstraptable2 componentDidMount, items: ", this.state.items, ", type of this.state.items: ", typeof this.state.items, ", dueDatesColspan: ", this.state.dueDatesColspan, ", listOfUniqueDates: ", this.state.listOfUniqueDates)
        });

        // this.props.listOfUniqueItems.forEach((value1, key) => {
        //     console.log("key: ", key, ", value: ", value1)
        // })

        // this.props.orderDetails.map(({key, value}) => {
        //     console.log("key: ", key, ", value: ", value)
        // })
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
        // var modified_due_date = this.state.due_date + "T00:00:00.000Z"
        // this.context.insertItemByDueDate(modified_due_date);

        console.log("calling from insertItemByDueDate")
    }

    copyItemsByDueDate = () => {
        // var modified_due_date = this.state.due_date + "T00:00:00.000Z"
        // this.context.copyItemsByDueDate(modified_due_date);

        console.log("calling from copyItemsByDueDate")
    }

    setDueDate = (event) => {
        // var modified_due_date = this.state.due_date + "T00:00:00.000Z"
        // this.context.setDueDate(event, modified_due_date);
        
        // console.log("calling from setDueDate, event: ", event.target.value)
        // this.setState({
        //     due_date: event.target.value
        // }, () => {
        //     console.log("this.state.due_date: ", this.state.due_date)
        // })

        console.log("calling from setDueDate")
    }

    handleDelete = (e, key) => {
        console.log("calling from Bootstraptable onChangeInput, e: ", e, ", key: ", key)

        // var existingItem = this.state.items;
        // var modifiedData = [];
        // existingItem.forEach(element => {
        //     if (element.id != id) {
        //         modifiedData.push(element);
        //     }
        // })

        // for (let index = 0; index < modifiedData.length; index++) {
        //     modifiedData[index]['id'] = index
        // }

        // var existingItemByDueDate = this.context['itemsByDueDate']
        // console.log("calling from Bristol, existingItemByDueDate: ", existingItemByDueDate)
        // var modified_due_date = this.state.due_date + "T00:00:00.000Z"
        // for (let index = 0; index < existingItemByDueDate.length; index++) {
        //     if(existingItemByDueDate[index]['key'] == modified_due_date) {
        //         existingItemByDueDate[index]['value'] = Object.assign([], modifiedData);
        //         break
        //     }
        // }

        // this.context['itemsByDueDateMap'].set(modified_due_date, modifiedData)

        // this.setState({items: modifiedData}, () => {
        //     console.log("modified items: ", this.state.items);
        // })

        console.log("calling from handleDelete")
    }

    onChangeDateInput = (e, key) => {
        console.log("calling from Bootstraptable onChangeItemInput, e: ", e.target.value, ", key: ", key)
    }

    onChangeItemInput = (e, key) => {
        console.log("calling from Bootstraptable onChangeItemInput, e: ", e.target, ", key: ", key)

        // const { name, value } = e.target
        // console.log("id: ", id, ", name: ", name, ", value: ", value)

        // if (name == 'order_qty') {
        //     if (value && value < 0) {
        //         alert("Negative value is not allowed");
        //         return
        //     }
        //     if(!value)
        //     {
        //         alert("Order quantity can not be anything other than number!");
        //         return
        //     }
        // }

        // const editedData = this.state.items.map((item) =>
        //     item.id === id && name ? { ...item, [name]: value } : item
        // )

        // console.log("edit data: ", editedData)

        // this.setState({
        //     items: editedData
        // }, () => {
        //     console.log("calling form onChangeInput, this.state.items: ", this.state.items)
        // })

        // //update data to main data structure
        // let contextValue = this.context;

        // var existingItemByDueDate = contextValue['itemsByDueDate']
        // var modified_due_date = this.state.due_date + "T00:00:00.000Z"
        // for (let index = 0; index < existingItemByDueDate.length; index++) {
        //     if(existingItemByDueDate[index]['key'] == modified_due_date) {
        //         existingItemByDueDate[index]['value'] = Object.assign([], editedData);
        //         break
        //     }
        // }
        // contextValue['itemsByDueDateMap'].set(modified_due_date, editedData)

        console.log("calling from onChangeInput")
    }

    onChangeOrderQuantityInput = (e, key, due_date) => {
        console.log("calling from Bootstraptable onChangeInput, e: ", e.target.value, ", key: ", key, ", due_date: ", due_date)
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
                                    <Form.Control onChange={event => this.setDueDate(event)} disabled={!this.state.isDateEditable || this.context.isSubmitButtonLoading || this.context.isConfirmed} type="date" value={this.state.due_date} placeholder="Enter date" />
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
                                {/* <th>Ref Tags</th> */}
                                {/* <th colSpan={this.state.dueDatesColspan}>Due Dates</th> */}
                                <th colSpan={this.state.dueDatesColspan}>Due Dates</th>
                                <th>Remove</th>
                            </tr>
                            <tr>
                                <td></td>
                                {/* {this.state.items.forEach(({value, key}) => (
                                    // <th>{key}</th>
                                    <React.Fragment>
                                    {
                                        // value.forEach(element => {
                                        //     console.log("element: ", element)
                                        // })
                                        console.log("key: ", key)
                                    }
                                    <>
                                    <th key={key}>
                                        <Form.Control onChange={event => this.setDueDate(event)} disabled={!this.state.isDateEditable || this.context.isSubmitButtonLoading || this.context.isConfirmed} type="date" value={key} placeholder="Enter date" />
                                    </th>
                                    </>
                                    </React.Fragment>
                                ))} */}

                                {/* {this.state.items.map(({value, key}) => (
                                    console.log("key: ", key)
                                ))} */}

                                
                                {/* {
                                    this.state.listOfUniqueDates.forEach((value, key) => {
                                        // console.log("key: ", key, ", value: ", value)
                                        <th>
                                            {key}
                                        </th>
                                        // value.forEach(element => {
                                        //     console.log("element['order_qty']: ", element['order_qty'])
                                        // })
                                    })
                                } */}
                                
                                {
                                    this.state.listOfUniqueDates.map(({key, value}) => (
                                        // console.log("key: ", element['key'])
                                        <td>
                                            {/* <Form.Control onChange={event => this.setDueDate(event)} disabled={this.context.isSubmitButtonLoading || this.context.isConfirmed} type="date" value={key.replace("T00:00:00.000Z", '')} placeholder="Enter date" /> */}
                                            <Form.Control 
                                                value={key.replace("T00:00:00.000Z", '')} 
                                                type="date" 
                                                onChange={(e) => this.onChangeDateInput(e, key)}
                                                placeholder="Type Item Name"
                                                className="text-center"
                                            />
                                        </td>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.items.map(({key, value}) => (
                                <tr key={key}>
                                    <td>
                                        <Form.Control 
                                            name="item" 
                                            value={key} 
                                            type="text" 
                                            onChange={(e) => this.onChangeItemInput(e, key)}
                                            placeholder="Type Item Name"
                                            className="text-center"
                                            disabled={this.context.isConfirmed || this.context.isSubmitButtonLoading}
                                        />
                                    </td>
                                    {
                                        value.map(({order_qty, due_date}) => (
                                            <td>
                                                <Form.Control
                                                    name="order_qty"
                                                    value={order_qty}
                                                    type="number"
                                                    min={1}
                                                    onChange={(e) => this.onChangeOrderQuantityInput(e, key, due_date)}
                                                    placeholder="Type Order Quantity"
                                                    className="text-center"
                                                    disabled={this.context.isConfirmed || this.context.isSubmitButtonLoading}
                                                />
                                            </td>
                                        ))
                                    }
                                    <td>
                                        <Button disabled={this.context.isConfirmed || this.context.isSubmitButtonLoading} variant="danger" onClick={(e) => this.handleDelete(e, key)}>
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

BootstrapTable2.contextType = MyContext;

export default BootstrapTable2;