import MyContext from './MyContext';
import React from 'react';

const baseAPIURL = "https://vanna.zh.if.atcsg.net:453/api/v1/"

const baseAPIURLTest = "http://127.0.0.1:5000/api/"

class MyProvider extends React.Component {
    state = {
        error: '',
        isLoaded: true,
        items: [],
        listOfUniqueItems: new Map(),
        listOfUniqueDates: new Map(),
        listOfPromiseDates: [],
        listOfUniqueDueDates: [],
        itemsByDueDateMap: new Map(),
        itemsByDueDate: [],
        refTagsByOrderItem: [],
        formattedItemsByDueDate: new Map(),
        orderNumber: '',
        isConfirmed: null,
        validItems: [],
        validLisecItems: [],
        validQADItems: [],
        submitButtonText: 'Submit Data',
        isSubmitButtonLoading: false,
        channel: '',
        orderStatus: '',

        isNewDueDateAdded: false,
        isOrderQuantityUpdated: false,
        isNewItemAdded: false,
        isItemNumberModified: false,
        isDueDateModified: false,
        isPromiseDateModified: false,
        isDueDateDeleted: false,
        isItemDeleted: false
    };

    componentDidMount() {
        window.addEventListener("beforeunload", (ev) => 
        {  
            console.log("calling from componentDidMount, this.state.orderNumber: ", this.state.orderNumber)
            if (this.state.orderNumber && this.state.itemsByDueDate.length) {
                ev.preventDefault();
                return ev.returnValue = 'Are you sure you want to close?';
            }
        });
    };
    
    componentWillUnmount() {
        window.addEventListener("beforeunload", (ev) => 
        {
            console.log("calling from componentWillUnmount, this.state.orderNumber: ", this.state.orderNumber)
            if (this.state.orderNumber) {
                ev.preventDefault();
                return ev.returnValue = 'Are you sure you want to close?';
            }
        });
    };

    //======================================================================================================================
    async dataFetch() {
        return await fetch(baseAPIURL + "get-qad-sales-order-info-for-cs/"+this.state.orderNumber)
    };

    async getReferenceTagsByOrderItem() {
        return await fetch(baseAPIURL + 'get-ref-tag-by-order-item', {
            method: 'POST',
            body: JSON.stringify({
                items: this.state.validLisecItems,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((res) => res.json())
        .then((response) => {
            var refTagByOrderItem = response['results']

            this.setState({
                refTagsByOrderItem: refTagByOrderItem
            },() => {
            })

            var existingItemsByDueDate = JSON.parse(JSON.stringify(this.state.itemsByDueDate));

            refTagByOrderItem.forEach(refTagElement => {
                var item = refTagElement['order_no'] + '-' + refTagElement['item_no']

                existingItemsByDueDate.forEach(itemElement => {
                    var items = itemElement['value']

                    items.forEach(itemEl => {
                        if (itemEl['item'] == item) {
                            itemEl['reference_tag'] = refTagElement['reference_tag']
                        }
                        else
                        {
                            if (!itemEl['reference_tag']) {
                                itemEl['reference_tag'] = ""
                            }
                        }
                    })
                })
            })

            this.setState({
                itemsByDueDate: existingItemsByDueDate
            }, () => {
                this.getFormatteditemsByDueDate();
            })
        })
        .catch((err) => {
        });
    }

    processDataFetch(response) {
        if(response.result.status == "Error") {
            this.setState({
                isLoaded: true,
                error: response.result.message
            }, () => {
            });
            return
        }

        var resultData = response['result'][this.state.orderNumber]['line_details'];
        var is_confirmed = response['result'][this.state.orderNumber]['is_confirmed'];
        var channel = response['result'][this.state.orderNumber]['channel'];
        var orderStatusText = ''

        this.destructureItems(resultData);

        if (is_confirmed) {
            orderStatusText = 'Order modification is not possible because Order is already confirmed!'
        }

        this.setState({
            isLoaded: true,
            items: response['result'][this.state.orderNumber]['line_details'],
            orderNumber: this.state.orderNumber,
            isConfirmed: is_confirmed,
            channel: channel,
            error: '',
            orderStatus: orderStatusText
        }, () => {
        });
    }
    //======================================================================================================================

    clearAllRecord() {
        this.setState({
            error: '',
            isLoaded: false,
            items: [],
            itemsByDueDateMap: new Map(),
            itemsByDueDate: [],
            orderNumber: '',
            isConfirmed: null,
            validItems: [],
            validLisecItems: [],
            validQADItems: []
        }, () => {

        })
    }

    async fetchAllData() {
        try{
            const responses = await Promise.all([this.dataFetch()]);
        
            if (responses[0].status == 200) {
                const anotherPromise1 = await responses[0].json();
                this.processDataFetch(anotherPromise1);
            }
        }catch(error) {
            this.setState({
                isLoaded: true,
                error: "Data can not be retrieved from QAD. Please contact IT administrator!"
            }, () => {});
            // return [];
        } finally {
        }
    }

    destructureItems(resultData) {
        const map = new Map();
        const itemMap = new Map()
        const itemSetMap = new Map()

        var itemIndex = 0;
        resultData.forEach(element => {
            if (map.has(element['shipping_date'])) {
                let arr = []
                arr = map.get(element['shipping_date'])
                arr.push(element)
                arr[arr.length-1]["id"] = arr.length-1
                map.set(element['shipping_date'], arr);
            }
            else {
                let arr = []
                arr = [element];
                arr[arr.length-1]["id"] = arr.length-1
                map.set(element['shipping_date'], arr);
            }

            if (!itemMap.has(element['item'])) {
                itemMap.set(element['item'], itemIndex)
                itemIndex += 1
            }

            if (!itemSetMap.has(element['item'])) {
                itemSetMap.set(element['item'], 1)
            }
            else {
                var itemCount = itemSetMap.get(element['item'])
                itemSetMap.set(element['item'], itemCount+1)
            }
        })

        itemMap.forEach((itemValue, itemKey) => {
            map.forEach((mapElementValue, mapElementKey) => {
                var newArray = mapElementValue.filter(function (el) {
                    return el.item == itemKey;
                });
                if (newArray.length == 0) {
                    mapElementValue.push({id: mapElementValue.length, item: itemKey, order_qty: 0, shipping_date: mapElementKey})
                }
            })
        })

        const mappedResult = Array.from(map).map(([key, value]) => ({key, value}))

        const validIguItemsSet = new Set()

        mappedResult.forEach(element => {
            element['isDateEditable'] = false
            element['initialDate'] = element['key']
            var items = element['value']

            var promiseDate = ""
            items.forEach(itemElement => {
                if (itemElement['promise_date'] && promiseDate == "") {
                    promiseDate = itemElement['promise_date']
                }
                if (itemElement['item'].includes('-')) {
                    validIguItemsSet.add(itemElement['item'])
                }
            })
            element['promiseDate'] = promiseDate
            element['initialPromiseDate'] = promiseDate
        })

        mappedResult.forEach(element => {
            var items = element['value']
            var promiseDate = element['promiseDate']
            items.forEach(itemElement => {
                itemElement['promise_date'] = promiseDate
                itemElement['is_item_editable'] = false
            })
        })

        var validIGUItems = Array.from(validIguItemsSet)

        this.setState({
            itemsByDueDate: mappedResult,
            validLisecItems: validIGUItems
        }, () => {
            this.getReferenceTagsByOrderItem();
        })

        this.setState(
            { itemsByDueDateMap: map }, 
            () => {
                console.log("calling from destructureItems, this.state.itemsByDueDateMap: ", this.state.itemsByDueDateMap)
            }
        );
    }

    getFormatteditemsByDueDate() {
        const itemSet = new Set()
        const itemMap = new Map()

        var existingItemsByDueDate = JSON.parse(JSON.stringify(this.state.itemsByDueDate));
        var existingRefTagsByOrderItem = JSON.parse(JSON.stringify(this.state.refTagsByOrderItem))

        var index = 0
        existingItemsByDueDate.map(({key, value}) => {
            value.forEach(element => {
                itemSet.add(element['item'])
                if (!itemMap.has(element['item'])) {
                    itemMap.set(element['item'], index)
                    index += 1
                }
            });
        })

        existingItemsByDueDate.map(({key, value}) => {
            itemSet.forEach(item => {
                let isItemFound = false
                value.forEach(element => {
                    if (item == element['item']) {
                        isItemFound = true
                    }
                });
        
                if (!isItemFound) {
                    value.push({
                        "item": item,
                        "order_qty": 0,
                        "id": 1
                    })
                }
            })
        })

        var formattedMappedResult = []
        var uniqueDatesMap = new Map()
        var uniqueDueDates = []
        var uniquePromiseDates = []
        var indexCount = 0
        existingItemsByDueDate.map(({key, value, isDateEditable, initialDate, initialPromiseDate}) => {
            var items = []
            itemMap.forEach((value1, key) => {
                value.forEach(element => {
                    if (key == element['item']) {
                        items.push(element)
                    }
                })
            })
            var item = {
                key: key,
                value: items,
                isDateEditable: isDateEditable,
                initialDate: initialDate
            }
            formattedMappedResult.push(item)

            //get unique dates
            uniqueDatesMap.set(initialDate, indexCount)
            uniquePromiseDates.push(
                {
                    "promiseDate": initialPromiseDate,
                    "promiseDateIndex": indexCount,
                    "dueDate": key
                }
            )
            
            uniqueDueDates.push({
                "id": indexCount,
                "dueDate": initialDate,
                "promiseDate": initialPromiseDate,
            })

            indexCount += 1
        })

        formattedMappedResult.map(({key, value}) => {
            let index = 0
            value.forEach(element => {
                element['id'] = index
                index += 1
            })
        })

        var formattedMappedResultFinal = new Map();
        formattedMappedResult.forEach(element => {
            var items = element['value']
            items.forEach(itemElement => {
                if (!formattedMappedResultFinal.has(itemElement['item'])) {
                    formattedMappedResultFinal.set(itemElement['item'], [{'order_qty': itemElement['order_qty'], 'due_date': element['key'], 'initial_date': element['key'], 
                    'promise_date': itemElement['promise_date'], 'initial_promise_date': itemElement['promise_date']}])
                }
                else
                {
                    var itemList = formattedMappedResultFinal.get(itemElement['item'])
                    itemList.push({'order_qty': itemElement['order_qty'], 'due_date': element['key'], 'initial_date': element['key'], 
                    'promise_date': itemElement['promise_date'], 'initial_promise_date': itemElement['promise_date']})
                    formattedMappedResultFinal.set(itemElement['item'], itemList)
                }
            })
        })

        const uniqueDates = Array.from(uniqueDatesMap).map(([key, value]) => ({key, value}))
        const formattedItemsByDueDate1 = Array.from(formattedMappedResultFinal).map(([key, value]) => ({key, value}))

        var index = 0
        formattedItemsByDueDate1.forEach(item => {
            item['id'] = index
            index += 1
            item['is_item_editable'] = false
        })

        existingRefTagsByOrderItem.forEach(refTagElement => {
            var item = refTagElement['order_no'] + '-' + refTagElement['item_no']

            formattedItemsByDueDate1.forEach(itemElement => {
                var itemCode = itemElement['key']
                if (itemCode == item) {
                    itemElement['reference_tag'] = refTagElement['reference_tag']
                }
                else {
                    if (!itemElement['reference_tag']) {
                        itemElement['reference_tag'] = ""
                    }
                }
            })
        })

        this.setState({
            listOfUniqueItems: itemMap, 
            listOfUniqueDates: uniqueDates,
            listOfUniqueDueDates: uniqueDueDates,
            listOfPromiseDates: uniquePromiseDates
        }, () => {
            this.setState(
                { formattedItemsByDueDate: formattedItemsByDueDate1 },
                () => {
                }
            );
        })
    }

    updateValidLisecItems() {
        let iguItemSet = new Set()
        this.state.itemsByDueDate.forEach(element => {
            var items = element['value']
            for (let index = 0; index < items.length; index++) {
                const itemElement = items[index];
                if (itemElement['item'].includes('-')) {
                    iguItemSet.add(itemElement['item'])
                }
            }
        })

        let updatedValidLisecItems = Array.from(iguItemSet)
        this.setState({
            validLisecItems: updatedValidLisecItems
        }, () => 
        {
        })
    }

    submitOrderDetailsToQADAPI() {
        this.setState({
            isSubmitButtonLoading: true
        }, () => {})

        // baseAPIURLTest, baseAPIURL
        //fetch('http://127.0.0.1:5000/api/send_req_items_for_cs', {
        fetch(baseAPIURL + 'send_req_items_for_cs', {
            method: 'POST',
            body: JSON.stringify({
                orderNumber: this.state.orderNumber,
                itemsByDueDate: this.state.itemsByDueDate,
                isValidLisecItemsAvailable: this.state.validLisecItems.length,
                validLisecItems: this.state.validLisecItems,
                channel: this.state.channel
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })
        .then((res) => res.json())
        .then((response) => {
            // console.log("response: ", response.data);
            var unverified_items = ""
            if (response.data.list_of_unverified_items.length > 0) {
                for (let index = 0; index < response.data.list_of_unverified_items.length; index++) {
                    const item = response.data.list_of_unverified_items[index];
                    // console.log("item: ", item)
                    unverified_items += item;
                    unverified_items += ","
                }
                unverified_items = unverified_items.replace(/.$/, '');
                alert("Item " + unverified_items + " does not exist in QAD, so you'll need to correct this before this can be saved.")
                this.setState({
                    isSubmitButtonLoading: false
                }, () => {})
            }
            else
            {
                if (response.data.is_confirmed) {
                    this.setState({
                        isSubmitButtonLoading: false
                    }, () => {})
                    
                    alert("Sales order is already confirmed! Data can not be submitted to QAD!")
                }
                else if (response.data.status == 'success') {
                    this.setState({
                        isSubmitButtonLoading: false
                    }, () => {})
                    
                    alert("Data was submitted successfully!")

                    this.setState({
                        itemsByDueDate: [],
                        isLoaded: false,
                        error: '',
                        formattedItemsByDueDate: [],
                        listOfPromiseDates:[],
                        listOfUniqueDates:[]
                    }, () => {
                        this.fetchAllData();
                    })
                }
            }
        })
        .catch((err) => {
            console.log("error: ", err);
            this.setState({
                isSubmitButtonLoading: false
            }, () => {})
            alert("Data was not submitted successfully!Please contact administrator!")
        });
    }

    render() {
        return (
            <MyContext.Provider
                value={{
                    setOrderNumber: (event) => {
                        var orderNumber = event.target.value;
                        this.setState({
                            orderNumber: orderNumber
                        }, () => {
                            
                        });
                    },
                    
                    searchOrderDetails: (event) => {
                        event.preventDefault();

                        this.setState({
                            itemsByDueDate: [],
                            isLoaded: false,
                            error: '',
                            orderStatus: '',
                            formattedItemsByDueDate: [],
                            listOfPromiseDates:[],
                            listOfUniqueDates:[],
                            listOfUniqueDueDates: []
                        })
                        
                        if (this.state.orderNumber.length === 7 && (this.state.orderNumber[0] == 'L' || this.state.orderNumber[0] == 'Q')) {
                            this.fetchAllData();
                        }
                        else {
                            this.setState({
                                isLoaded: true
                            })
                            alert("Please enter a valid order number");
                            event.preventDefault();
                        }
                    },

                    addNewDueDate: (modifiedItemsByDueDate) => {
                        this.setState({itemsByDueDate: modifiedItemsByDueDate}, () => {
                            console.log("calling from MyProvider, addNewDueDate, this.state.itemsByDueDate: ", this.state.itemsByDueDate)
                        })
                    },

                    updateOrderQuantity: (modifiedItemsByDueDate) => {
                        this.setState({itemsByDueDate: modifiedItemsByDueDate}, () => {
                            console.log("calling from MyProvider, updateOrderQuantity, this.state.itemsByDueDate: ", this.state.itemsByDueDate)
                        })
                    },

                    addNewItem: (modifiedItemsByDueDate) => {
                        this.setState({itemsByDueDate: modifiedItemsByDueDate}, () => {
                            console.log("calling from MyProvider, addNewItem, this.state.itemsByDueDate: ", this.state.itemsByDueDate)
                        })
                    },

                    onChangeItemInput: (modifiedItemsByDueDate) => {
                        this.setState({itemsByDueDate: modifiedItemsByDueDate}, () => {
                            console.log("calling from MyProvider, onChangeItemInput, this.state.itemsByDueDate: ", this.state.itemsByDueDate)
                        })
                    },

                    onChangeDateInput: (modifiedItemsByDueDate) => {
                        this.setState({itemsByDueDate: modifiedItemsByDueDate}, () => {
                            console.log("calling from MyProvider, onChangeDateInput, this.state.itemsByDueDate: ", this.state.itemsByDueDate)
                        })
                    },

                    onChangePromiseDateInput: (modifiedItemsByDueDate) => {
                        this.setState({itemsByDueDate: modifiedItemsByDueDate}, () => {
                            console.log("calling from MyProvider, onChangePromiseDateInput, this.state.itemsByDueDate: ", this.state.itemsByDueDate)
                        })
                    },

                    handleDeleteByDueDate: (modifiedItemsByDueDate) => {
                        this.setState({itemsByDueDate: modifiedItemsByDueDate}, () => {
                            console.log("calling from MyProvider, handleDeleteByDueDate, this.state.itemsByDueDate: ", this.state.itemsByDueDate)
                        })
                    },

                    handleDeleteByItem: (modifiedItemsByDueDate) => {
                        this.setState({itemsByDueDate: modifiedItemsByDueDate}, () => {
                            console.log("calling from MyProvider, handleDeleteByItem, this.state.itemsByDueDate: ", this.state.itemsByDueDate)
                        })
                    },
                    
                    submitOrderDetailsToQAD: (event) => {
                        event.preventDefault();

                        console.log("calling from submitOrderDetailsToQAD in MyProvider after preventDefault, itemsByDueDate: ", this.state.itemsByDueDate);

                        if (!this.state.itemsByDueDate.length) {
                            alert("Not enough data to submit to QAD!")
                            return
                        }
                        
                        var isItemListBlank = false
                        var isItemDescriptionBlank = false
                        var isItemQuantityBlank = false
                        var isDuplicateItemExist = false
                        var dateOfBlankItemList = ""
                        var dupliateItemDate = ""
                        var duplicateItem = ""
                        this.state.itemsByDueDate.forEach(element => {
                            // console.log("element: ", element)
                            const itemSet = new Set()
                            let items = element['value']
                            if (items.length == 0) {
                                isItemListBlank = true
                                dateOfBlankItemList = element['key'].replace("T00:00:00.000Z", '')
                            }
                            else
                            {
                                for (let index = 0; index < items.length; index++) {
                                    const item = items[index];
                                    if (!item['item']) {
                                        isItemDescriptionBlank = true
                                        // alert("Item description can not be blank!")
                                        break;
                                    }
    
                                    if (!itemSet.has(item['item'])) {
                                        itemSet.add(item['item'])
                                    }
                                    else
                                    {
                                        isDuplicateItemExist = true
                                        dupliateItemDate = element['key'].replace("T00:00:00.000Z", '')
                                        duplicateItem = item['item']
                                        break;
                                    }
                                }
                            }
                        })

                        if (isItemListBlank) {
                            alert("Item List is Blank for date: " + dateOfBlankItemList + ". Can't submit to QAD!")
                            return;
                        }
                        if (isItemDescriptionBlank) {
                            alert("Item description can not be blank!")
                            return;
                        }
                        if (isItemQuantityBlank) {
                            alert("Item quantity can not be zero!")
                            return;
                        }
                        if (isDuplicateItemExist) {
                            // alert("Duplicate item is not allowed! Duplicate Item: " + duplicateItem + " exist in due date: " + dupliateItemDate)
                            alert("Duplicate item is not allowed! Duplicate Item: " + duplicateItem + " exist!")
                            return;
                        }

                        //updating valid lisec items start
                        let iguItemSet = new Set()
                        this.state.itemsByDueDate.forEach(element => {
                            var items = element['value']
                            for (let index = 0; index < items.length; index++) {
                                const itemElement = items[index];
                                if (itemElement['item'].includes('-')) {
                                    iguItemSet.add(itemElement['item'])
                                }
                            }
                        })

                        let updatedValidLisecItems = Array.from(iguItemSet)
                        this.setState({
                            validLisecItems: updatedValidLisecItems
                        }, () => 
                        {
                            this.submitOrderDetailsToQADAPI();
                        })
                    },

                    orderNumber: this.state.orderNumber,
                    items: this.state.items,
                    error: this.state.error,
                    isLoaded: this.state.isLoaded,
                    itemsByDueDate: this.state.itemsByDueDate,
                    itemsByDueDateMap: this.state.itemsByDueDateMap,
                    isConfirmed: this.state.isConfirmed,
                    validItems: this.state.validItems,
                    submitButtonText: this.state.submitButtonText,
                    isSubmitButtonLoading: this.state.isSubmitButtonLoading,
                    channel: this.state.channel,
                    orderStatus: this.state.orderStatus,
                    formattedItemsByDueDate: this.state.formattedItemsByDueDate,
                    listOfUniqueItems: this.state.listOfUniqueItems,
                    listOfUniqueDates: this.state.listOfUniqueDates,
                    listOfPromiseDates: this.state.listOfPromiseDates,
                    listOfUniqueDueDates: this.state.listOfUniqueDueDates
                }}
            >
                {this.props.children}
            </MyContext.Provider>
        );
    }
}

export default MyProvider;