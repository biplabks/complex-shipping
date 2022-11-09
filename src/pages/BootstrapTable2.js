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
          items: [],
          dueDatesColspan: 1,
          listOfUniqueItems: new Map(),
          listOfUniqueDates: [],
          sumOfIgusRowWise: [],
          sumOfIgusColumnWise: []
        };
    }

    componentDidMount() {
        console.log("calling from Bootstraptable2 componentDidMount, this.props.orderDetails: ", this.props.orderDetails)
        this.setState({
            items: this.props.orderDetails,
            dueDatesColspan: this.props.listOfUniqueDates.length,
            listOfUniqueItems: this.props.listOfUniqueItems,
            listOfUniqueDates: this.props.listOfUniqueDates
        }, () => {
            console.log("calling from Bootstraptable2 componentDidMount, items: ", this.state.items, ", type of this.state.items: ", typeof this.state.items, ", dueDatesColspan: ", this.state.dueDatesColspan, ", listOfUniqueDates: ", this.state.listOfUniqueDates)
            
            // let sumOfIgusByRow = []
            // this.state.items.forEach(item => {
            //     let items = item['value']
            //     let sum = 0;
            //     items.forEach(itemElement => {
            //         sum += itemElement['order_qty']
            //     })
            //     sumOfIgusByRow.push({
            //         "itemKey": item['key'],
            //         "total": sum
            //     })
            // })

            // let sumOfIgusByColumn = []
            // this.state.listOfUniqueDates.forEach(element => {
            //     let sum = 0;
            //     this.state.items.forEach(item => {
            //         let items = item['value']
            //         items.forEach(itemElement => {
            //             if (itemElement['due_date'] == element['key']) {
            //                 sum += itemElement['order_qty']
            //             }
            //         })
            //     })

            //     sumOfIgusByColumn.push({
            //         "dateKey": element['key'],
            //         "total": sum
            //     })
            // })

            this.updateSumOfIguByRow();
            this.updateSumOfIguByColumn();

            // console.log("sumOfIgusByRow: ", sumOfIgusByRow, ", sumOfIgusByColumn: ", sumOfIgusByColumn)

            // this.setState({
            //     sumOfIgusRowWise: sumOfIgusByRow,
            //     sumOfIgusColumnWise: sumOfIgusByColumn
            // }, () => {
            //     console.log("this.state.sumOfIgusRowWise: ", this.state.sumOfIgusRowWise, ", this.state.sumOfIgusColumnWise: ", this.state.sumOfIgusColumnWise)
            // })
        });
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

        console.log("calling from BootstrapTable2 insertItemByDueDate")
    }

    addNewItem = () => {
        console.log("calling from BootstrapTable2 addNewItem")

        var existingItems = JSON.parse(JSON.stringify(this.state.items));
        var existingItemsByDueDate = JSON.parse(JSON.stringify(this.context.itemsByDueDate));

        // var baseItem = existingItems[0];

        var baseItem = JSON.parse(JSON.stringify(existingItems[0]));
        //console.log("baseItem: ", baseItem)

        baseItem['key'] = ''
        baseItem['value'].forEach(item => {
            item['order_qty'] = 1
        })

        existingItems.push(baseItem);

        var index = 0
        existingItems.forEach(item => {
            item['id'] = index
            index += 1
        })

        existingItemsByDueDate.forEach(element => {
            let items = element['value']
            items.push({
                "item": '',
                "order_qty": 1,
                "shipping_date": element['key']
            })
        })

        existingItemsByDueDate.forEach(element => {
            let items = element['value']
            var index = 0
            items.forEach(itemElement => {
                itemElement['id'] = index
                index += 1
            })
        })

        this.setState({items: existingItems}, () => {
            //console.log("calling from insertItem, items: ", this.state.items);
            this.updateSumOfIguByRow();
            this.updateSumOfIguByColumn();
            this.context.addNewItem(existingItemsByDueDate);
        })
    }

    getNextAvailableDate() {
        let dateArray = []
		const existingUniqueDates = this.state.listOfUniqueDates;
		for (let index = 0; index < existingUniqueDates.length; index++) {
            var element = existingUniqueDates[index]
			const dateElement = new Date(element['key']);
			dateArray.push(dateElement);
		}

		const maxDate = new Date(Math.max.apply(null, dateArray));
		var nextAvailableDate = new Date(maxDate);
		nextAvailableDate.setDate(maxDate.getDate()+1);

		nextAvailableDate = nextAvailableDate.toISOString();

        return nextAvailableDate
    }

    //version 1
    // addNewDueDate = () => {
    //     var nextAvailableDate = this.getNextAvailableDate();

        
    //     console.log("calling from addNewDueDate, nextAvailableDate: ", nextAvailableDate)

    //     var existingItemsByDueDate = JSON.parse(JSON.stringify(this.context.itemsByDueDate));
    //     console.log("calling from addNewDueDate, this.context.itemsByDueDate: ", existingItemsByDueDate)

    //     var existingItems = this.state.items;
    //     var existingUniqueDates = this.state.listOfUniqueDates;

    //     console.log("addNewDueDate, existingItems before: ", existingItems)

    //     existingItems.forEach(element => {
    //         var items = element['value']
    //         items.push({
    //             "order_qty": 0,
    //             "due_date": nextAvailableDate,
    //             "initial_date": nextAvailableDate
    //         })
    //     })
    //     console.log("addNewDueDate, existingItems after: ", existingItems)

    //     var listOfRanks = []
    //     for (let date of existingUniqueDates) {
    //         listOfRanks.push(date['value'])
    //     }
    //     var nextRank = Math.max.apply(null, listOfRanks)
    //     existingUniqueDates.push({
    //         "key": nextAvailableDate,
    //         "value": nextRank+1
    //     })

    //     this.setState({items: existingItems, listOfUniqueDates: existingUniqueDates, dueDatesColspan: existingUniqueDates.length}, () => {
    //         console.log("calling from addNewDueDate, items: ", this.state.items, ", listOfUniqueDates: ", this.state.listOfUniqueDates);
    //     })
    // }

    //version 2
    addNewDueDate = () => {
        var nextAvailableDate = this.getNextAvailableDate();

        console.log("calling from addNewDueDate, nextAvailableDate: ", nextAvailableDate)

        var existingItemsByDueDate = JSON.parse(JSON.stringify(this.context.itemsByDueDate));
        console.log("calling from addNewDueDate, this.context.itemsByDueDate: ", existingItemsByDueDate)

        var existingItems = this.state.items;
        var existingUniqueDates = this.state.listOfUniqueDates;

        console.log("addNewDueDate, existingItems before: ", existingItems)

        existingItems.forEach(element => {
            var items = element['value']
            items.push({
                "order_qty": 0,
                "due_date": nextAvailableDate,
                "initial_date": nextAvailableDate
            })
        })
        console.log("addNewDueDate, existingItems after: ", existingItems)

        var listOfItems = []
        // existingItems.forEach(element => {
        //     element['value'].forEach(item => {
        //         listOfItems.push({
        //             "item": element['key'],
        //             "order_qty": 0,
        //             "shipping_date": nextAvailableDate
        //         })
        //     })
        // })

        existingItems.forEach(element => {
            listOfItems.push({
                "item": element['key'],
                "order_qty": 0,
                "shipping_date": nextAvailableDate
            })
        })

        var itemByDueDate = {
            "key": nextAvailableDate,
            "isDateEditable": true,
            "value": listOfItems
        }
        existingItemsByDueDate.push(itemByDueDate)

        var listOfRanks = []
        for (let date of existingUniqueDates) {
            listOfRanks.push(date['value'])
        }
        var nextRank = Math.max.apply(null, listOfRanks)
        existingUniqueDates.push({
            "key": nextAvailableDate,
            "value": nextRank+1
        })
        
        this.context.addNewDueDate(existingItemsByDueDate);
        console.log("calling from addNewDueDate after, this.context.itemsByDueDate: ", this.context.itemsByDueDate)

        this.setState({items: existingItems, listOfUniqueDates: existingUniqueDates, dueDatesColspan: existingUniqueDates.length}, () => {
            console.log("calling from addNewDueDate, items: ", this.state.items, ", listOfUniqueDates: ", this.state.listOfUniqueDates);
        })
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

    handleDeleteByItem = (e, id, key) => {
        console.log("calling from Bootstraptable handleDeleteByItem, e: ", e, ", key: ", key, ", id: ", id)

        var existingItem = JSON.parse(JSON.stringify(this.state.items));
        var existingItemsByDueDate = JSON.parse(JSON.stringify(this.context.itemsByDueDate));

        console.log("calling from Bootstraptable, existingItemsByDueDate before: ", existingItemsByDueDate)
        var modifiedData = [];

        existingItem.forEach(element => {
            if (element.id != id) {
                modifiedData.push(element);
            }
        })
        
        var index = 0
        modifiedData.forEach(item => {
            item['id'] = index
            index += 1
        })

        existingItemsByDueDate.forEach(element => {
            let items = element['value']
            const indexOfItem = items.findIndex(itemElement => {
                return itemElement['item'] === key;
            })

            items.splice(indexOfItem, 1)
        })

        existingItemsByDueDate.forEach(element => {
            let items = element['value']
            let index = 0
            items.forEach(itemElement => {
                itemElement['id']= index
                index += 1
            })
        })

        console.log("calling from Bootstraptable, existingItemsByDueDate after: ", existingItemsByDueDate)

        this.setState({items: modifiedData}, () => {
            //console.log("modified items: ", this.state.items);
            this.updateSumOfIguByRow();
            this.updateSumOfIguByColumn();
            this.context.handleDeleteByItem(existingItemsByDueDate);
        })

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

        console.log("calling from handleDeleteByItem")
    }

    handleDeleteByDueDate = (e, key) => {
        console.log("calling from Bootstraptable handleDeleteByDueDate, e: ", e, ", key: ", key)

        // if (this.state.listOfUniqueDates.length==1) {
        //     alert("Can't delete!Only one due date is left.")
        //     return
        // }

        var existingItem =  JSON.parse(JSON.stringify(this.state.items));
        var existingItemsByDueDate = JSON.parse(JSON.stringify(this.context.itemsByDueDate));
        console.log("calling from handleDeleteByDueDate before, existingItemsByDueDate: ", existingItemsByDueDate)

        existingItem.forEach(element => {
            let items = element['value']
            const indexOfItem = items.findIndex(item => {
                return item.due_date === key;
            })
            items.splice(indexOfItem, 1)
        })

        const indexOfItemByDueDate = existingItemsByDueDate.findIndex(element => {
            return element.key === key;
        })

        existingItemsByDueDate.splice(indexOfItemByDueDate, 1);
        console.log("calling from handleDeleteByDueDate after, existingItemsByDueDate: ", existingItemsByDueDate)

        var existingUniqueDates = JSON.parse(JSON.stringify(this.state.listOfUniqueDates));
        console.log("existingUniqueDates before: ", existingUniqueDates)
        const indexOfDate = existingUniqueDates.findIndex(element => {
            return element.key === key;
        })
        existingUniqueDates.splice(indexOfDate,1);

        let index = 0
        existingUniqueDates.forEach(element => {
            element['value'] = index
            index += 1
        });

        console.log("existingUniqueDates after: ", existingUniqueDates.length)

        this.setState({items: existingItem, listOfUniqueDates: existingUniqueDates, dueDatesColspan: existingUniqueDates.length}, () => {
            console.log("modified items in handleDeleteByDueDate: ", this.state.items);
            this.updateSumOfIguByRow();
            this.updateSumOfIguByColumn();
            this.context.handleDeleteByDueDate(existingItemsByDueDate);
        })
    }

    updateSumOfIguByRow() {
        let sumOfIgusByRow = []
        this.state.items.forEach(item => {
            let items = item['value']
            let sum = 0;
            let id = item['id']
            items.forEach(itemElement => {
                sum += parseInt(itemElement['order_qty'])
            })
            sumOfIgusByRow.push({
                "rowId": id,
                "itemKey": item['key'],
                "total": sum
            })
        })

        this.setState({
            sumOfIgusRowWise: sumOfIgusByRow
        }, () => {
            console.log("calling from updateSumOfIguByRow, this.state.sumOfIgusRowWise: ", this.state.sumOfIgusRowWise)
        })
    }

    updateSumOfIguByColumn() {
        let sumOfIgusByColumn = []
        this.state.listOfUniqueDates.forEach(element => {
            let sum = 0;
            this.state.items.forEach(item => {
                let items = item['value']
                items.forEach(itemElement => {
                    if (itemElement['due_date'] == element['key']) {
                        sum += parseInt(itemElement['order_qty'])
                    }
                })
            })

            sumOfIgusByColumn.push({
                "dateKey": element['key'],
                "total": sum
            })
        })

        this.setState({
            sumOfIgusColumnWise: sumOfIgusByColumn
        }, () => {
            console.log("calling from updateSumOfIguByColumn, this.state.sumOfIgusColumnWise: ", this.state.sumOfIgusColumnWise)
        })
    }

    checkForDuplicateDate(key) {
        console.log("calling from checkForDuplicateDate")

        var existingItem = this.state.items;
        console.log("existingItem: ", existingItem)

        // existingItem.forEach(element => {
        //     element['value'].forEach(item => {
        //         if (item['due_date'] == key) {
        //             console.log("Same date exist in the table!");
        //             return true;
        //         }
        //     })
        // })

        for (let index = 0; index < existingItem.length; index++) {
            const element = existingItem[index];
            const items = element['value']
            for (let index1 = 0; index1 < items.length; index1++) {
                const item = items[index1];
                if (item['due_date'] == key) {
                    return true;
                }
            }
        }
        return false;
    }

    onChangeDateInput = (e, key) => {
        console.log("calling from Bootstraptable onChangeDateInput, e: ", e.target.value, ", key: ", key, ", this.state.listOfUniqueDates: ", this.state.listOfUniqueDates)

        var newDateKey = e.target.value + 'T00:00:00.000Z'
        var isDuplicateDateFound = this.checkForDuplicateDate(newDateKey);

        if (isDuplicateDateFound) {
            alert("Same date exist in the table!")
            return;
        }

        var existingItem = JSON.parse(JSON.stringify(this.state.items));
        var existingItemsByDueDate = JSON.parse(JSON.stringify(this.context.itemsByDueDate));

        console.log("calling from onChangeDateInput, existingItemsByDueDate before: ", existingItemsByDueDate)

        existingItem.forEach(element => {
            element['value'].forEach(item => {
                if (item['due_date'] == key) {
                    item['due_date'] = newDateKey
                }
            })
        })

        existingItemsByDueDate.forEach(element => {
            if (element['key'] == key) {
                element['key'] = newDateKey
                let items = element['value']
                items.forEach(itemElement => {
                    itemElement['shipping_date'] = newDateKey
                })
            }
        })

        console.log("calling from onChangeDateInput, existingItemsByDueDate after: ", existingItemsByDueDate)

        var existingUniqueDates = JSON.parse(JSON.stringify(this.state.listOfUniqueDates));
        existingUniqueDates.forEach(element => {
            if (element['key'] == key) {
                element['key'] = newDateKey
            }
        })

        this.setState({items: existingItem, listOfUniqueDates: existingUniqueDates}, () => {
            console.log("onChangeDateInput, modified items: ", this.state.items);
            this.context.onChangeDateInput(existingItemsByDueDate)
            this.updateSumOfIguByColumn();
        })
    }

    onChangeItemInput = (e, id, key) => {
        console.log("calling from Bootstraptable onChangeItemInput, e: ", e.target.value, ", key: ", key, ", id: ", id)
        
        var existingItems = JSON.parse(JSON.stringify(this.state.items));
        var existingItemsByDueDate = JSON.parse(JSON.stringify(this.context.itemsByDueDate));

        console.log("calling from onChangeItemInput before, existingItems: ", existingItems)
        console.log("calling from onChangeItemInput before, existingItemsByDueDate: ", existingItemsByDueDate)
        existingItems.forEach(element => {
            if (element['id'] == id) {
                element['key'] = e.target.value
            }
        })
        console.log("calling from onChangeItemInput after, existingItems: ", existingItems)

        existingItemsByDueDate.forEach(element => {
            let items = element['value']
            items.forEach(itemElement => {
                if (itemElement['id'] == id) {
                    itemElement['item'] = e.target.value
                }
            })
        })

        console.log("calling from onChangeItemInput after, existingItemsByDueDate: ", existingItemsByDueDate)

        this.setState({
            items: existingItems
        }, () => {
            console.log("calling from Bootstraptable2, onChangeItemInput, this.state.items: ", this.state.items)
            this.updateSumOfIguByRow()
            this.context.onChangeItemInput(existingItemsByDueDate);
        })

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

        console.log("calling from onChangeItemInput")
    }

    //version 1
    // onChangeOrderQuantityInput = (e, key, due_date) => {
    //     console.log("calling from Bootstraptable onChangeOrderQuantityInput, e: ", e.target.value, ", key: ", key, ", due_date: ", due_date)

    //     var existingItem = this.state.items;
    //     console.log("existingItem before: ", existingItem)

    //     existingItem.forEach(element => {
    //         if (element['key'] == key) {
    //             element['value'].forEach(item => {
    //                 if (item['due_date'] == due_date) {
    //                     item['order_qty'] = e.target.value
    //                 }
    //             })
    //         }
    //     })
    //     console.log("existingItem after: ", existingItem)

    //     this.setState({items: existingItem}, () => {
    //         console.log("modified items: ", this.state.items);
    //     })
    // }

    //version 2
    onChangeOrderQuantityInput = (e, id, key, due_date) => {
        console.log("calling from Bootstraptable onChangeOrderQuantityInput, e: ", e.target.value, ", key: ", key, ", due_date: ", due_date)

        var existingItem = this.state.items;
        var existingItemsByDueDate = JSON.parse(JSON.stringify(this.context.itemsByDueDate));
        console.log("existingItem before: ", existingItem)

        existingItem.forEach(element => {
            if (element['key'] == key && element['id'] == id) {
                element['value'].forEach(item => {
                    if (item['due_date'] == due_date) {
                        item['order_qty'] = e.target.value
                    }
                })
            }
        })
        console.log("existingItem after: ", existingItem)

        existingItemsByDueDate.forEach(element => {
            if (element['key'] == due_date) {
                var items = element['value']
                items.forEach(itemElement => {
                    if (itemElement['item'] == key) {
                        itemElement['order_qty'] = e.target.value
                    }
                })
            }
        })

        this.context.updateOrderQuantity(existingItemsByDueDate)

        this.setState({items: existingItem}, () => {
            console.log("modified items: ", this.state.items);
            this.updateSumOfIguByRow();
            this.updateSumOfIguByColumn();
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
                        {/* <Form>
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
                        </Form> */}
                    </div>
                }
                </Card.Header>
                <Card.Body>
                    <Col className='d-flex justify-content-end mb-2'>
                        {
                            !this.context.isConfirmed && 
                            <Button className='mx-1' disabled={this.context.isSubmitButtonLoading} onClick={this.addNewDueDate}>
                                Add Due Date
                            </Button>
                        }
                    </Col>
                    {/* style={{ width: '1000px' }} */}
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                                <th>Item</th>
                                {/* <th>Ref Tags</th> */}
                                {/* <th colSpan={this.state.dueDatesColspan}>Due Dates</th> */}
                                {
                                    this.state.dueDatesColspan>=1 && 
                                    <th colSpan={this.state.dueDatesColspan}>Due Dates</th>
                                }
                                <th>Order Quantity</th>
                                <th>Remove</th>
                            </tr>
                            <tr>
                                <td></td>
                                {
                                    this.state.listOfUniqueDates.map(({key, value}) => (
                                        // console.log("key: ", element['key'])
                                        <td key={key}>
                                            {/* <Form.Control onChange={event => this.setDueDate(event)} disabled={this.context.isSubmitButtonLoading || this.context.isConfirmed} type="date" value={key.replace("T00:00:00.000Z", '')} placeholder="Enter date" /> */}
                                            <Form.Control
                                                value={key.replace("T00:00:00.000Z", '')}
                                                type="date"
                                                onChange={(e) => this.onChangeDateInput(e, key)}
                                                placeholder="Type Item Name"
                                                className="text-center"
                                                disabled={this.context.isConfirmed || this.context.isSubmitButtonLoading}
                                            />
                                        </td>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.items.map(({key, value, id}) => (
                                <tr key={id}>
                                    <td style={{ width: '200px' }}>
                                        <Form.Control 
                                            name="item" 
                                            value={key} 
                                            type="text" 
                                            onChange={(e) => this.onChangeItemInput(e, id, key)}
                                            placeholder="Type Item Name"
                                            className="text-center"
                                            disabled={this.context.isConfirmed || this.context.isSubmitButtonLoading}
                                        />
                                    </td>
                                    {
                                        value.map(({order_qty, due_date}) => (
                                            <td key={due_date} style={{ width: '200px' }}>
                                                <Form.Control
                                                    name="order_qty"
                                                    value={order_qty}
                                                    type="number"
                                                    min={1}
                                                    onChange={(e) => this.onChangeOrderQuantityInput(e, id, key, due_date)}
                                                    placeholder="Type Order Quantity"
                                                    className="text-center"
                                                    disabled={this.context.isConfirmed || this.context.isSubmitButtonLoading}
                                                />
                                            </td>
                                        ))
                                    }
                                    <td>
                                        {
                                            this.state.sumOfIgusRowWise.find(({ itemKey, rowId }) => itemKey === key && rowId === id) &&
                                            this.state.sumOfIgusRowWise.find(({ itemKey, rowId }) => itemKey === key && rowId === id)['total']
                                        }
                                    </td>
                                    <td style={{ width: '200px' }}>
                                        <Button disabled={this.context.isConfirmed || this.context.isSubmitButtonLoading} variant="danger" onClick={(e) => this.handleDeleteByItem(e, id, key)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                            </svg>
                                        </Button>
                                    </td>
                                </tr>
                            ))}

                            {
                                this.state.dueDatesColspan>=1 && 
                                <tr>
                                    <td></td>
                                    {
                                        this.state.listOfUniqueDates.map(({key, value}) => (
                                            <td key={key}>
                                                {
                                                    this.state.sumOfIgusColumnWise.find(({ dateKey }) => dateKey === key) &&
                                                    this.state.sumOfIgusColumnWise.find(({ dateKey }) => dateKey === key)['total']
                                                }
                                            </td>
                                    ))}
                                </tr>
                            }
                            
                            {
                                this.state.dueDatesColspan>=1 && 
                                <tr>
                                    <td></td>
                                    {
                                        this.state.listOfUniqueDates.map(({key, value}) => (
                                            <td key={key}>
                                                <Button disabled={this.context.isConfirmed || this.context.isSubmitButtonLoading} variant="danger" onClick={(e) => this.handleDeleteByDueDate(e, key)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                                    </svg>
                                                </Button>
                                            </td>
                                    ))}
                                </tr>
                            }
                            
                        </tbody>
                    </Table>
                    <Col className='d-flex flex-row'>
                        {
                            !this.context.isConfirmed && 
                            <Button className='mx-1' disabled={this.context.isSubmitButtonLoading} onClick={this.addNewItem}>
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