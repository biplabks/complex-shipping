// import {React, createRef} from 'react';
import React from 'react';
// import { Container, Button, Form, Col, Table, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Button, Form, Col, Table } from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
import MyContext from './MyContext';
import debounce from "lodash.debounce";
import { $ }  from 'react-jquery-plugin';
//import $ from 'jquery'
// import DatePicker from "react-bootstrap-date-picker";
import DatePicker from 'react-datepicker'

import "react-datepicker/dist/react-datepicker.css"


const baseAPIURL = "https://vanna.zh.if.atcsg.net:453/api/v1/"

// $(function() {
//     $( "#datepicker-1" ).datepicker();
//     console.log("calling from mounted")
//  });

class BootstrapTable extends React.Component {

    jQuerycode = () => {
        $('.button').click(function(){
            $('p').css('color', 'red')
        });

        // $( "#datepicker-1" ).datepicker();
    }

    // testCode = () => {
    //     $( "#datepicker" ).datepicker();
    // }

    constructor(props) {
        super(props);
        this.state = {
          items: [],
          dueDatesColspan: 1,
          listOfUniqueDates: [],
          listOfPromiseDates: [],
          sumOfIgusRowWise: [],
          sumOfIgusColumnWise: [],
          listOfUniqueDueDates: [],
          orderQuantityTotal: 0
        };
        this.onBlurItemInput = debounce(this.onBlurItemInput.bind(this), 500);
    }

    // mounted() {
    //     $(function() {
    //         $( "#datepicker-1" ).datepicker();
    //         console.log("calling from mounted")
    //      });
    // }

    componentDidMount() {
        this.setState({
            items: this.props.orderDetails,
            dueDatesColspan: this.props.listOfUniqueDates.length,
            listOfPromiseDates: this.props.listOfPromiseDates,
            listOfUniqueDates: this.props.listOfUniqueDates,
            listOfUniqueDueDates: this.props.listOfUniqueDueDates
        }, () => {
            // console.log("calling from Bootstraptable componentDidMount, this.state.items: ", this.state.items, ", \
            // this.state.dueDatesColspan: ", this.state.dueDatesColspan, ", this.state.listOfPromiseDates: ", 
            // this.state.listOfPromiseDates, ", this.state.listOfUniqueDates: ", this.state.listOfUniqueDates,
            // ", this.state.listOfUniqueDueDates: ", this.state.listOfUniqueDueDates)
            this.updateSumOfIguByRow();
            this.updateSumOfIguByColumn();
        });

        // $(window).scroll(() => {
        //     // put your code here
        //     console.log("Hello world 2")
        // });

        this.jQuerycode();
        // this.testCode();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.orderDetails !== this.props.orderDetails){
            this.setState({
                items: this.props.orderDetails
            });
        }
    }

    // handleDatePicker = () => {
    //     //datepickerinput
    //     const el = findDOMNode(this.refs.datepickerinput)
    //     $(el).datepicker();
    // }

    addNewItem = () => {
        var existingItems = JSON.parse(JSON.stringify(this.state.items));
        var existingItemsByDueDate = JSON.parse(JSON.stringify(this.context.itemsByDueDate));

        var baseItem = JSON.parse(JSON.stringify(existingItems[0]));

        baseItem['key'] = ''
        baseItem['reference_tag'] = ''
        baseItem['value'].forEach(item => {
            item['order_qty'] = 0
        })
        baseItem['is_item_editable'] = true

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
                "order_qty": 0,
                "shipping_date": element['key'],
                "promise_date": element['promiseDate'],
                'is_item_editable': true
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
            this.updateSumOfIguByRow();
            this.updateSumOfIguByColumn();
            this.context.addNewItem(existingItemsByDueDate);
        })
    }

    getNextAvailableDate() {
        let dateArray = []
		const existingUniqueDates = JSON.parse(JSON.stringify(this.state.listOfUniqueDates));
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

    getNextAvailablePromiseDate() {
        let dateArray = []
		const existingPromiseDates = JSON.parse(JSON.stringify(this.state.listOfPromiseDates));
		for (let index = 0; index < existingPromiseDates.length; index++) {
            var element = existingPromiseDates[index]
            if (element['promiseDate']) {
                const dateElement = new Date(element['promiseDate']);
                dateArray.push(dateElement)
            }
		}
        var nextAvailableDate = new Date()
        if (dateArray.length>=1) {
            const maxDate = new Date(Math.max.apply(null, dateArray));
            nextAvailableDate = new Date(maxDate);
            nextAvailableDate.setDate(maxDate.getDate()+1);

            nextAvailableDate = nextAvailableDate.toISOString();
        }
        else
        {
            dateArray.push(new Date())
            nextAvailableDate = new Date(Math.max.apply(null, dateArray));
        }
        return nextAvailableDate
    }

    addNewDueDate = () => {
        var nextAvailableDate = this.getNextAvailableDate();
        var nextAvailablePromiseDate = this.getNextAvailablePromiseDate();

        var existingItemsByDueDate = JSON.parse(JSON.stringify(this.context.itemsByDueDate));

        var existingItems = JSON.parse(JSON.stringify(this.state.items));
        var existingUniqueDates = JSON.parse(JSON.stringify(this.state.listOfUniqueDates));
        var existingUniqueDueDates = JSON.parse(JSON.stringify(this.state.listOfUniqueDueDates));
        var existingPromiseDates = JSON.parse(JSON.stringify(this.state.listOfPromiseDates));

        existingItems.forEach(element => {
            var items = element['value']
            items.push({
                "order_qty": 0,
                "due_date": nextAvailableDate,
                "initial_date": nextAvailableDate
            })
        })

        var listOfItems = []

        existingItems.forEach(element => {
            listOfItems.push({
                "id": element['id'],
                "item": element['key'],
                "order_qty": 0,
                "shipping_date": nextAvailableDate,
                "promise_date": nextAvailablePromiseDate
            })
        })

        var itemByDueDate = {
            "key": nextAvailableDate,
            "isDateEditable": true,
            "promiseDate": nextAvailablePromiseDate,
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

        //existing due dates modification
        listOfRanks = []
        for (let element of existingUniqueDueDates) {
            listOfRanks.push(element['id'])
        }
        
        nextRank = Math.max.apply(null, listOfRanks)
        existingUniqueDueDates.push({
            "dueDate": nextAvailableDate,
            "id": nextRank+1,
            "promiseDate": nextAvailablePromiseDate
        })

        existingPromiseDates.push({
            "promiseDate": nextAvailablePromiseDate,
            "promiseDateIndex": existingPromiseDates.length,
            "dueDate": nextAvailableDate
        })
        
        this.context.addNewDueDate(existingItemsByDueDate);

        this.setState({items: existingItems, listOfUniqueDates: existingUniqueDates, 
            dueDatesColspan: existingUniqueDates.length, listOfPromiseDates: existingPromiseDates,
            listOfUniqueDueDates: existingUniqueDueDates
        }, () => {
            this.updateSumOfIguByRow();
            this.updateSumOfIguByColumn();
        })
    }

    handleDeleteByItem = (e, id, key) => {
        var existingItem = JSON.parse(JSON.stringify(this.state.items));
        var existingItemsByDueDate = JSON.parse(JSON.stringify(this.context.itemsByDueDate));

        if (existingItem.length <= 1) {
            alert("Only one item is left. Can't delete the last item!")
            return;
        }

        var modifiedData = [];

        existingItem.forEach(element => {
            if (element.id !== id) {
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

        this.setState({items: modifiedData}, () => {
            this.updateSumOfIguByRow();
            this.updateSumOfIguByColumn();
            this.context.handleDeleteByItem(existingItemsByDueDate);
        })
    }

    handleDeleteByDueDate = (e, dueDateKey, promiseDateKey) => {
        var existingItem =  JSON.parse(JSON.stringify(this.state.items));
        var existingItemsByDueDate = JSON.parse(JSON.stringify(this.context.itemsByDueDate));

        if (existingItemsByDueDate.length <= 1) {
            alert("Only one due date is left. Can't delete the due date!");
            return;
        }
        
        existingItem.forEach(element => {
            let items = element['value']
            const indexOfItem = items.findIndex(item => {
                return item.due_date === dueDateKey;
            })
            items.splice(indexOfItem, 1)
        })

        const indexOfItemByDueDate = existingItemsByDueDate.findIndex(element => {
            return element.key === dueDateKey;
        })

        existingItemsByDueDate.splice(indexOfItemByDueDate, 1);

        var existingUniqueDates = JSON.parse(JSON.stringify(this.state.listOfUniqueDates));
        const indexOfDate = existingUniqueDates.findIndex(element => {
            return element.key === dueDateKey;
        })
        existingUniqueDates.splice(indexOfDate,1);

        var index = 0
        existingUniqueDates.forEach(element => {
            element['value'] = index
            index += 1
        });

        var existingUniqueDueDates = JSON.parse(JSON.stringify(this.state.listOfUniqueDueDates));
        const indexOfDueDate = existingUniqueDueDates.findIndex(element => {
            return element['dueDate'] === dueDateKey;
        })
        existingUniqueDueDates.splice(indexOfDueDate,1);

        index = 0
        existingUniqueDueDates.forEach(element => {
            element['id'] = index
            index += 1
        });

        var existingPromiseDates = JSON.parse(JSON.stringify(this.state.listOfPromiseDates));
        const indexOfPromiseDate = existingPromiseDates.findIndex(element => {
            return element['dueDate'] === dueDateKey && element['promiseDate'] === promiseDateKey;
        })
        existingPromiseDates.splice(indexOfPromiseDate,1);

        index = 0
        existingPromiseDates.forEach(element => {
            element['promiseDateIndex'] = index
            index += 1
        });

        this.setState({items: existingItem, listOfUniqueDates: existingUniqueDates, dueDatesColspan: existingUniqueDates.length,
        listOfUniqueDueDates: existingUniqueDueDates, listOfPromiseDates: existingPromiseDates}, () => {
            this.updateSumOfIguByRow();
            this.updateSumOfIguByColumn();
            this.context.handleDeleteByDueDate(existingItemsByDueDate);
        })
    }

    updateSumOfIguByRow() {
        let sumOfIgusByRow = []
        let sumOfOrderQuantity = 0
        this.state.items.forEach(item => {
            let items = item['value']
            let sum = 0;
            let id = item['id']

            if(item['key'].includes("-"))
            {
                items.forEach(itemElement => {
                    // console.log("calling from updateSumOfIguByRow, itemElement: ", itemElement)
                    if (itemElement['description'] == 'IGU') {
                        sum += parseInt(itemElement['order_qty'])
                    }
                })
            }
            sumOfOrderQuantity += sum
            sumOfIgusByRow.push({
                "rowId": id,
                "itemKey": item['key'],
                "total": sum
            })
        })

        this.setState({
            sumOfIgusRowWise: sumOfIgusByRow,
            orderQuantityTotal: sumOfOrderQuantity
        }, () => {
        })
    }

    updateSumOfIguByColumn() {
        let sumOfIgusByColumn = []
        this.state.listOfUniqueDates.forEach(element => {
            let sum = 0;
            this.state.items.forEach(item => {
                let items = item['value']
                items.forEach(itemElement => {
                    if (itemElement['due_date'] === element['key']) {
                        if(item['key'].includes("-"))
                        {
                            if (itemElement['description'] == 'IGU') {
                                sum += parseInt(itemElement['order_qty'])
                            }
                        }
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
        })
    }

    checkForDuplicateDate(key) {
        var existingItem = this.state.items;

        for (let index = 0; index < existingItem.length; index++) {
            const element = existingItem[index];
            const items = element['value']
            for (let index1 = 0; index1 < items.length; index1++) {
                const item = items[index1];
                if (item['due_date'] === key) {
                    return true;
                }
            }
        }
        return false;
    }

    // onChangeInput = () => {
    //     console.log("I am here onChangeInput")
    //     $(function() {
    //         $( "#datepicker" ).datepicker()
    //     });
    // }

    onChangeDateInput = (e, dueDateKey, promiseDateKey) => {
        var newDateKey = e.target.value + 'T00:00:00.000Z'
        var isDuplicateDateFound = this.checkForDuplicateDate(newDateKey);

        if (isDuplicateDateFound) {
            alert("Same date exist in the table!")
            return;
        }

        var existingItem = JSON.parse(JSON.stringify(this.state.items));
        var existingItemsByDueDate = JSON.parse(JSON.stringify(this.context.itemsByDueDate));

        existingItem.forEach(element => {
            element['value'].forEach(item => {
                if (item['due_date'] === dueDateKey) {
                    item['due_date'] = newDateKey
                }
            })
        })

        existingItemsByDueDate.forEach(element => {
            if (element['key'] === dueDateKey) {
                element['key'] = newDateKey
                let items = element['value']
                items.forEach(itemElement => {
                    itemElement['shipping_date'] = newDateKey
                })
            }
        })

        var existingUniqueDates = JSON.parse(JSON.stringify(this.state.listOfUniqueDates));
        existingUniqueDates.forEach(element => {
            if (element['key'] === dueDateKey) {
                element['key'] = newDateKey
            }
        })

        var existingUniqueDueDates = JSON.parse(JSON.stringify(this.state.listOfUniqueDueDates));
        existingUniqueDueDates.forEach(element => {
            if (element['dueDate'] === dueDateKey) {
                element['dueDate'] = newDateKey
            }
        })

        var existingPromiseDates = JSON.parse(JSON.stringify(this.state.listOfPromiseDates));
        existingPromiseDates.forEach(element => {
            if (element['dueDate'] === dueDateKey && element['promiseDate'] === promiseDateKey) {
                element['dueDate'] = newDateKey
            }
        })

        this.setState({items: existingItem, listOfUniqueDates: existingUniqueDates, listOfUniqueDueDates: existingUniqueDueDates,
            listOfPromiseDates: existingPromiseDates}, () => {
            this.context.onChangeDateInput(existingItemsByDueDate)
            this.updateSumOfIguByColumn();
        })
    }

    onChangePromiseDateInput = (e, keyIndex, dueDateKey) => {
        var newPromiseDateKey = e.target.value + 'T00:00:00.000Z'

        var existingItem = JSON.parse(JSON.stringify(this.state.items));
        var existingItemsByDueDate = JSON.parse(JSON.stringify(this.context.itemsByDueDate));

        existingItem.forEach(element => {
            var index = 0
            element['value'].forEach(item => {
                if (index === keyIndex) {
                    item['promise_date'] = newPromiseDateKey
                }
                index += 1
            })
        })

        var index = 0
        existingItemsByDueDate.forEach(element => {
            if (index === keyIndex) {
                element['promiseDate'] = newPromiseDateKey

                let items = element['value']
                items.forEach(itemElement => {
                    itemElement['promise_date'] = newPromiseDateKey
                })
            }
            index += 1
        })

        var existingPromiseDates = JSON.parse(JSON.stringify(this.state.listOfPromiseDates));

        var existingUniqueDueDates = JSON.parse(JSON.stringify(this.state.listOfUniqueDueDates));

        existingPromiseDates.forEach(element => {
            if (element['promiseDateIndex'] === keyIndex) {
                element['promiseDate'] = newPromiseDateKey
            }
        })

        existingUniqueDueDates.forEach(element => {
            if (element['dueDate'] === dueDateKey) {
                element['promiseDate'] = newPromiseDateKey
            }
        })

        this.setState({items: existingItem, listOfPromiseDates: existingPromiseDates}, () => {
            this.context.onChangePromiseDateInput(existingItemsByDueDate)
        })
    }

    onChangeItemInput = (e, id, key) => {
        var existingItems = JSON.parse(JSON.stringify(this.state.items));
        var existingItemsByDueDate = JSON.parse(JSON.stringify(this.context.itemsByDueDate));

        existingItems.forEach(element => {
            if (element['id'] === id) {
                element['key'] = e.target.value
            }
        })

        existingItemsByDueDate.forEach(element => {
            let items = element['value']
            items.forEach(itemElement => {
                if (itemElement['id'] === id) {
                    itemElement['item'] = e.target.value
                }
            })
        })

        this.setState({
            items: existingItems
        }, () => {
            this.updateSumOfIguByRow()
            this.updateSumOfIguByColumn()
            this.context.onChangeItemInput(existingItemsByDueDate);
        })
    }

    onChangeOrderQuantityInput = (e, id, key, due_date) => {
        var existingItem = JSON.parse(JSON.stringify(this.state.items));
        var existingItemsByDueDate = JSON.parse(JSON.stringify(this.context.itemsByDueDate));

        existingItem.forEach(element => {
            if (element['key'] === key && element['id'] === id) {
                element['value'].forEach(item => {
                    if (item['due_date'] === due_date) {
                        item['order_qty'] = e.target.value
                    }
                })
            }
        })

        existingItemsByDueDate.forEach(element => {
            if (element['key'] === due_date) {
                var items = element['value']
                items.forEach(itemElement => {
                    if (itemElement['item'] === key) {
                        itemElement['order_qty'] = e.target.value
                    }
                })
            }
        })

        this.context.updateOrderQuantity(existingItemsByDueDate)

        this.setState({items: existingItem}, () => {
            this.updateSumOfIguByRow();
            this.updateSumOfIguByColumn();
        })
    }

    onBlurItemInput = (e, id, key) => {
        var existingItems = JSON.parse(JSON.stringify(this.state.items));

        const itemSet = new Set()
        var isDuplicateItemExist = false
        var duplicateItem = ""

        existingItems.forEach(element => {
            if (!itemSet.has(element['key'])) {
                itemSet.add(element['key'])
            }
            else
            {
                isDuplicateItemExist = true
                duplicateItem = element['key']
            }
        })

        if (isDuplicateItemExist) {
            alert("Duplicate item is not allowed! Duplicate Item: " + duplicateItem + " exist!")
            return
        }

        if (key.includes('-')) {
            this.getReferenceTagsByOrderItem(key)
        }
    }

    getReferenceTagsByOrderItem(orderItem) {
        return fetch(baseAPIURL + 'get-ref-tag-by-order-item', {
            method: 'POST',
            body: JSON.stringify({
                items: [orderItem],
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((res) => res.json())
        .then((response) => {
            var existingItems = JSON.parse(JSON.stringify(this.state.items));
            var existingItemsByDueDate = JSON.parse(JSON.stringify(this.context.itemsByDueDate));

            var refTagByOrderItem = response['results']
            var referenceTag = ''
            if (refTagByOrderItem.length>0) {
                referenceTag = refTagByOrderItem[0]['reference_tag']
            }

            existingItems.forEach(element => {
                if (element['key'] === orderItem) {
                    element['reference_tag'] = referenceTag
                }
            })

            existingItemsByDueDate.forEach(element => {
                var items = element['value']
                items.forEach(itemElement => {
                    if (itemElement['item'] === orderItem) {
                        itemElement['reference_tag'] = referenceTag
                    }
                })
            })

            this.setState({
                items: existingItems
            }, () => {
                this.updateSumOfIguByRow()
                this.updateSumOfIguByColumn()
                this.context.onChangeItemInput(existingItemsByDueDate);
            })
        })
        .catch((err) => {
        });
    }

    render() {
        return (
            // <Container fluid>
            <>
                {/* <p>Enter Date: <input type = "text" id = "datepicker" /></p> */}
                {/* <p>
                    <DatePicker 
                        customInput = {
                            <input 
                                type="text"
                            />
                        }
                    />
                </p>
                
                <p>lorem hello</p>
                <button className='button'>click here</button> */}
                <Table className='text-center' striped bordered hover size="sm" style={{ position: 'relative', borderColor: '#BDC3C7', width: '10%', borderCollapse: 'separate', padding: '0px'}}>
                    {/* change top to 0 when deploying locally and 50px when deploying to vanna */}
                    <thead style={{ position: 'sticky', top: '50px', backgroundColor: '#f5f7f7', zIndex: 1, padding: '0px' }}>
                        <tr>
                            <th style={{position: 'sticky', left: '0px', padding: '0px', backgroundColor: '#f5f7f7'}}>
                                {
                                    !this.context.isFormDisabled && 
                                    <Button className='mx-1' disabled={this.context.isSubmitButtonLoading} onClick={this.addNewDueDate}>
                                        Add Due Date
                                    </Button>
                                }
                            </th>
                            <th style={{position: 'sticky', left: '152px', textAlign: 'right', width: '100px', padding: '0px', backgroundColor: '#f5f7f7' }}>
                                Due Dates
                            </th>
                            {
                                this.state.listOfUniqueDueDates.map(({dueDate, promiseDate}) => (
                                    <th key={dueDate} style={{ padding: '0px' }}>
                                        <Form.Control
                                            value={dueDate.replace("T00:00:00.000Z", '')}
                                            type="date"
                                            onChange={(e) => this.onChangeDateInput(e, dueDate, promiseDate)}
                                            className="text-center"
                                            disabled={this.context.isFormDisabled || this.context.isSubmitButtonLoading}
                                            size='sm'
                                            style={{ width: '120px', margin: 'auto'}}
                                            data-toggle='tooltip'
                                            data-placement='top'
                                            title='Due Date'
                                        />
                                    </th>
                                ))
                            }
                            <th style={{ backgroundColor: '#f5f7f7' }}></th>
                            <th style={{ backgroundColor: '#f5f7f7' }}></th>
                        </tr>
                        <tr style={{ backgroundColor: '#f5f7f7', padding: '0px' }}>
                            <th style={{position: 'sticky', left: '0px', textAlign: 'center', padding: '0px', backgroundColor: '#f5f7f7'}}></th>
                            <th style={{position: 'sticky', left: '152px', width: '100px', textAlign: 'right', padding: '0px', backgroundColor: '#f5f7f7' }}>Promise Dates</th>
                            {
                                this.state.listOfPromiseDates.map(({promiseDate, promiseDateIndex, dueDate}) => (
                                    <th key={promiseDateIndex} style={{ padding: '0px' }}>
                                        <Form.Control
                                            value={promiseDate.replace("T00:00:00.000Z", '')}
                                            type="date"
                                            onChange={(e) => this.onChangePromiseDateInput(e, promiseDateIndex, dueDate)}
                                            className="text-center"
                                            disabled={this.context.isFormDisabled || this.context.isSubmitButtonLoading}
                                            size='sm'
                                            style={{ width: '120px', margin: 'auto'}}
                                            data-toggle='tooltip'
                                            data-placement='top'
                                            title='Promise Date'
                                        />
                                    </th>
                                ))
                            }
                            <th style={{padding: '0px'}}></th>
                            <th style={{ textAlign: 'center', padding: '0px' }}></th>
                        </tr>
                        <tr style={{ backgroundColor: '#f5f7f7', padding: '0px' }}>
                            <th style={{position: 'sticky', left: '0px', textAlign: 'center', padding: '0px', backgroundColor: '#f5f7f7'}}>Item</th>
                            <th style={{position: 'sticky', left: '152px', width: '100px', textAlign: 'center', padding: '0px', backgroundColor: '#f5f7f7' }}>Reference Tag</th>
                            {
                                this.state.listOfPromiseDates.map(({promiseDate, promiseDateIndex, dueDate}) => (
                                    <th key={promiseDateIndex} style={{padding: '0px'}}><p style={{ width: '114px', marginTop: '0em', marginBottom: '0em', textAlign: 'center' }}>Quantity</p></th>
                                ))
                            }
                            <th style={{padding: '0px'}}><p style={{ width: '114px', marginTop: '0em', marginBottom: '0em', textAlign: 'center' }}>Total Quantity</p></th>
                            <th style={{ textAlign: 'center', padding: '0px' }}>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.items.map(({key, value, id, reference_tag, is_item_editable}) => (
                            <tr key={id} style={{ height: '20px' }}>
                                <td style={{ position: 'sticky', left: '0px', width: '150px', padding: '0px' }}>
                                    <Form.Control
                                        name="item"
                                        value={key}
                                        type="text"
                                        onChange={(e) => this.onChangeItemInput(e, id, key)}
                                        onBlur={(e) => this.onBlurItemInput(e, id, key)}
                                        placeholder="Type Item Name"
                                        className="text-center"
                                        disabled={this.context.isFormDisabled || this.context.isSubmitButtonLoading || !is_item_editable}
                                        style={{ width: '150px', height: '20px', margin: 'auto'}}
                                    />
                                </td>
                                <td style={{ position: 'sticky', backgroundColor: 'white', left: '152px', width: '100px', padding: '0px' }}>
                                    <Form.Control 
                                        name="reference_tag" 
                                        value={reference_tag}
                                        type="text"
                                        className="text-center"
                                        disabled={true}
                                        style={{ width: '120px', height: '20px', margin: 'auto'}}
                                    />
                                </td>
                                {
                                    value.map(({order_qty, due_date}) => (
                                        <td key={due_date} style={{ width: '100px', padding: '0px' }}>
                                            <Form.Control
                                                name="order_qty"
                                                value={order_qty}
                                                type="number"
                                                min={0}
                                                onChange={(e) => this.onChangeOrderQuantityInput(e, id, key, due_date)}
                                                onInput = {(e) =>{
                                                    e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0,4)
                                                }}
                                                placeholder="Type Order Quantity"
                                                className="text-center"
                                                disabled={this.context.isFormDisabled || this.context.isSubmitButtonLoading}
                                                max="100"
                                                style={{ width: '80px', height: '20px', margin: 'auto', textAlign:'center' }}
                                            />
                                        </td>
                                    ))
                                }
                                <td style={{ width: '100px', padding: '0px' }}>
                                    <Form.Text style={{ width: '100px', fontWeight: 'bold', fontSize: '14px' }}>
                                        {
                                            this.state.sumOfIgusRowWise.find(({ itemKey, rowId }) => itemKey === key && rowId === id) &&
                                            this.state.sumOfIgusRowWise.find(({ itemKey, rowId }) => itemKey === key && rowId === id)['total']
                                        }
                                    </Form.Text>
                                </td>
                                <td style={{ width: '200px', padding: '0px' }}>
                                    <Button 
                                        style={{ width: '25px', height: '20px', fontSize: '10px', padding: '2px 2px' }}
                                        disabled={this.context.isFormDisabled || this.context.isSubmitButtonLoading} 
                                        variant="danger" 
                                        onClick={(e) => this.handleDeleteByItem(e, id, key)}
                                        data-toggle='tooltip'
                                        data-placement='top'
                                        title='Remove'>
                                        x
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {
                            this.state.dueDatesColspan>=1 && 
                            <tr>
                                <td style={{ position: 'sticky', backgroundColor: 'white', left: '0px' }}></td>
                                <td style={{ position: 'sticky', backgroundColor: 'white', left: '152px' }}></td>
                                {
                                    this.state.listOfUniqueDueDates.map(({dueDate}) => (
                                        <td key={dueDate} style={{padding: '0px'}}>
                                            <Form.Text style={{ width: '100px', fontWeight: 'bold', fontSize: '14px' }}>
                                                {
                                                    this.state.sumOfIgusColumnWise.find(({ dateKey }) => dateKey === dueDate) &&
                                                    this.state.sumOfIgusColumnWise.find(({ dateKey }) => dateKey === dueDate)['total']
                                                }
                                            </Form.Text>
                                        </td>
                                ))}
                                <td style={{padding: '0px'}}>
                                    <Form.Text style={{ width: '100px', fontWeight: 'bold', fontSize: '14px' }}>
                                        {
                                            this.state.orderQuantityTotal
                                        }
                                    </Form.Text>
                                </td>
                                <td></td>
                            </tr>
                        }
                        
                        {
                            this.state.dueDatesColspan>=1 && 
                            <tr>
                                <td style={{ position: 'sticky', backgroundColor: 'white', left: '0px' }}></td>
                                <td style={{ position: 'sticky', backgroundColor: 'white', left: '152px' }}></td>
                                {
                                    this.state.listOfUniqueDueDates.map(({dueDate, promiseDate}) => (
                                        <td key={dueDate} style={{padding: '0px'}}>
                                            <Button 
                                                style={{ width: '25px', height: '20px', fontSize: '10px', padding: '2px 2px' }}
                                                disabled={this.context.isFormDisabled || this.context.isSubmitButtonLoading} 
                                                variant="danger" 
                                                onClick={(e) => this.handleDeleteByDueDate(e, dueDate, promiseDate)}
                                                data-toggle='tooltip'
                                                data-placement='top'
                                                title='Remove'>
                                                x
                                            </Button>
                                        </td>
                                ))}
                                <td></td>
                                <td></td>
                            </tr>
                        }
                        
                    </tbody>
                </Table>
                <Col className='d-flex flex-row'>
                    {
                        !this.context.isFormDisabled && 
                        <Button className='mx-1' disabled={this.context.isSubmitButtonLoading} onClick={this.addNewItem}>
                            Add Item
                        </Button>
                    }
                </Col>
            </>
        );
    }
};

BootstrapTable.contextType = MyContext;
<style scoped>
</style>

export default BootstrapTable;