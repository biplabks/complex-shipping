import MyContext from './MyContext';
import React from 'react';
import { ThemeProvider } from 'react-bootstrap';

const baseAPIURL = "https://vanna.zh.if.atcsg.net:453/api/v1/"

const baseAPIURLTest = "http://127.0.0.1:5000/api/"

// B3391410
// window.ssouser = 'p5620895'
window.ssouser = 'B6347379'

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

        isActiveUserSecurityRoleExist: false,

        isNewDueDateAdded: false,
        isOrderQuantityUpdated: false,
        isNewItemAdded: false,
        isItemNumberModified: false,
        isDueDateModified: false,
        isPromiseDateModified: false,
        isDueDateDeleted: false,
        isItemDeleted: false,

        isFormDisabled: false
    };

    componentDidMount() {
        window.addEventListener("beforeunload", (ev) => 
        {  
            // console.log("calling from componentDidMount, this.state.orderNumber: ", this.state.orderNumber)
            if (this.state.orderNumber && this.getOrderModificationStatus()) {
                ev.preventDefault();
                return ev.returnValue = 'Are you sure you want to close?';
            }
            // this.setState({
            //     orderNumber: ''
            // }, () => {})
        });
    };
    
    componentWillUnmount() {
        window.addEventListener("beforeunload", (ev) => 
        {
            // console.log("calling from componentWillUnmount, this.state.orderNumber: ", this.state.orderNumber)
            if (this.state.orderNumber && this.getOrderModificationStatus()) {
                ev.preventDefault();
                return ev.returnValue = 'Are you sure you want to close?';
            }
            // this.setState({
            //     orderNumber: ''
            // }, () => {})
        });
    };

    //======================================================================================================================
    //version 1
    // async dataFetch() {
    //     return await fetch(baseAPIURL + "get-qad-sales-order-info-for-cs/"+this.state.orderNumber)
    // };

    //version 2
    async dataFetch() {
        return await fetch(baseAPIURL + "get-qad-sales-order-info-for-cs", {
            method: 'POST',
            body: JSON.stringify({
                sales_order_number: this.state.orderNumber,
                sgid: window.ssouser.toUpperCase()
                //sgid: 'B6347379'
                //sgid: 'B3391410'
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
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

    //version 1
    // processDataFetch(response) {
    //     if(response.result.status == "Error") {
    //         this.setState({
    //             isLoaded: true,
    //             error: response.result.message
    //         }, () => {
    //         });
    //         return
    //     }

    //     var resultData = response['result'][this.state.orderNumber]['line_details'];
    //     var is_confirmed = response['result'][this.state.orderNumber]['is_confirmed'];
    //     var channel = response['result'][this.state.orderNumber]['channel'];
    //     var orderStatusText = ''

    //     console.log("calling from processDataFetch, response: ", response)

    //     this.destructureItems(resultData);

    //     if (is_confirmed) {
    //         orderStatusText = 'Order modification is not possible because Order is already confirmed!'
    //     }

    //     this.setState({
    //         isLoaded: true,
    //         items: response['result'][this.state.orderNumber]['line_details'],
    //         orderNumber: this.state.orderNumber,
    //         isConfirmed: is_confirmed,
    //         channel: channel,
    //         error: '',
    //         orderStatus: orderStatusText
    //     }, () => {
    //     });
    // }

    //version 2
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
        var active_user_sgid = '';
        var user_status_sgid = '';
        var orderStatusText = '';
        var is_active_user_security_role_exist = false;
        var is_form_disabled = false;
        
        var windowSSOUser = window.ssouser.toUpperCase();

        if (response['result']['active_user_roles_info']) {
            active_user_sgid = response['result']['active_user_roles_info']['sgid'];
        }

        if (response['result']['user_status']) {
            user_status_sgid = response['result']['user_status']['sgid'];
        }
        
        // window.ssouser = 'B3391410'
        //console.log("active_user_sgid: ", active_user_sgid, ", user_status_sgid: ", user_status_sgid, ", window.ssouser: ", windowSSOUser)
        
        if (window.ssouser && active_user_sgid === windowSSOUser && user_status_sgid == windowSSOUser) {
            is_active_user_security_role_exist = true
        }

        //console.log("calling from processDataFetch, response: ", response, ", window.ssouser: ", window.ssouser, ", is_active_user_security_role_exist: ", is_active_user_security_role_exist)

        this.destructureItems(resultData);
        //console.log("calling from processDataFetch, response5")

        if (is_confirmed) {
            orderStatusText = 'Order modification is not possible because Order is already confirmed!'
        }

        if (!is_confirmed && !is_active_user_security_role_exist) {
            orderStatusText = 'Order modification is not possible because you are not authorized to edit the sales order!'
        }

        if (is_confirmed || !is_active_user_security_role_exist) {
            is_form_disabled = true;
        }

        this.setState({
            isLoaded: true,
            items: response['result'][this.state.orderNumber]['line_details'],
            orderNumber: this.state.orderNumber,
            isConfirmed: is_confirmed,
            channel: channel,
            error: '',
            orderStatus: orderStatusText,
            isActiveUserSecurityRoleExist: is_active_user_security_role_exist,
            isFormDisabled: is_form_disabled
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
                console.log("calling from fetchAllData, responses: ", responses)
                const anotherPromise1 = await responses[0].json();
                console.log("calling from fetchAllData, anotherPromise1: ", anotherPromise1)
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
        // console.log("calling from destructureItems, resultData: ", resultData)
        var itemIndex = 0;

        console.log("calling from destructureItems, result1")
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

        console.log("calling from destructureItems, result2")

        // console.log("calling from destructureItems, map: ", map)
        // console.log("calling from destructureItems, itemMap: ", itemMap)
        // console.log("calling from destructureItems, itemSetMap: ", itemSetMap)

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

        console.log("calling from destructureItems, result3")

        const mappedResult = Array.from(map).map(([key, value]) => ({key, value}))
        // console.log("calling from destructureItems, mappedResult: ", mappedResult)

        const validIguItemsSet = new Set()

        console.log("calling from destructureItems, result4")

        console.log("calling from destructureItems, mappedResult: ", mappedResult)

        mappedResult.forEach(element => {
            element['isDateEditable'] = false
            element['initialDate'] = element['key']
            var items = element['value']

            var promiseDate = ""
            items.forEach(itemElement => {
                if (itemElement['promise_date'] && promiseDate == "") {
                    promiseDate = itemElement['promise_date']
                }

                // if (itemElement['item'].includes('-') && itemElement['description'].toUpperCase() == 'IGU') {
                //     validIguItemsSet.add(itemElement['item'])
                // }

                if (itemElement['item'].includes('-')) {
                    if (itemElement['description'] && itemElement['description'].toUpperCase() == 'IGU') {
                        validIguItemsSet.add(itemElement['item'])
                    }
                }
            })
            element['promiseDate'] = promiseDate
            element['initialPromiseDate'] = promiseDate
        })

        console.log("calling from destructureItems, result5")

        mappedResult.forEach(element => {
            var items = element['value']
            var promiseDate = element['promiseDate']
            items.forEach(itemElement => {
                itemElement['promise_date'] = promiseDate
                itemElement['is_item_editable'] = false
            })
        })

        // console.log("calling from destructureItems, validIguItemsSet: ", validIguItemsSet)

        var validIGUItems = Array.from(validIguItemsSet)

        this.setState({
            itemsByDueDate: mappedResult,
            validLisecItems: validIGUItems
        }, () => {
            // console.log("calling from destructureItems, this.state.itemsByDueDate: ", this.state.itemsByDueDate)
            this.getReferenceTagsByOrderItem();
        })

        this.setState(
            { itemsByDueDateMap: map }, 
            () => {
                // console.log("calling from destructureItems, this.state.itemsByDueDateMap: ", this.state.itemsByDueDateMap)
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
        
        // console.log("calling from getFormatteditemsByDueDate, formattedMappedResult: ", formattedMappedResult)

        formattedMappedResult.forEach(element => {
            var items = element['value']
            items.forEach(itemElement => {
                if (!formattedMappedResultFinal.has(itemElement['item'])) {
                    formattedMappedResultFinal.set(itemElement['item'], [{'description': itemElement['description'],'order_qty': itemElement['order_qty'], 'due_date': element['key'], 'initial_date': element['key'], 
                    'promise_date': itemElement['promise_date'], 'initial_promise_date': itemElement['promise_date']}])
                }
                else
                {
                    var itemList = formattedMappedResultFinal.get(itemElement['item'])
                    itemList.push({'description': itemElement['description'],'order_qty': itemElement['order_qty'], 'due_date': element['key'], 'initial_date': element['key'], 
                    'promise_date': itemElement['promise_date'], 'initial_promise_date': itemElement['promise_date']})
                    formattedMappedResultFinal.set(itemElement['item'], itemList)
                }
            })
        })

        const uniqueDates = Array.from(uniqueDatesMap).map(([key, value]) => ({key, value}))
        const formattedItemsByDueDate1 = Array.from(formattedMappedResultFinal).map(([key, value]) => ({key, value}))

        // console.log("calling from getFormatteditemsByDueDate, formattedItemsByDueDate1: ", formattedItemsByDueDate1)

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
        
        // console.log("calling from getFormatteditemsByDueDate, uniqueDueDates: ", uniqueDueDates, ", uniquePromiseDates: ", uniquePromiseDates)

        this.setState({
            listOfUniqueItems: itemMap, 
            listOfUniqueDates: uniqueDates,
            listOfUniqueDueDates: uniqueDueDates,
            listOfPromiseDates: uniquePromiseDates
        }, () => {
            this.setState(
                { formattedItemsByDueDate: formattedItemsByDueDate1 },
                () => {
                    // console.log("calling from getFormatteditemsByDueDate, formattedItemsByDueDate: ", this.state.formattedItemsByDueDate)
                }
            );
        })
    }

    // updateValidLisecItems() {
    //     let iguItemSet = new Set()
    //     this.state.itemsByDueDate.forEach(element => {
    //         var items = element['value']
    //         for (let index = 0; index < items.length; index++) {
    //             const itemElement = items[index];
    //             if (itemElement['item'].includes('-')) {
    //                 iguItemSet.add(itemElement['item'])
    //             }
    //         }
    //     })

    //     let updatedValidLisecItems = Array.from(iguItemSet)
    //     this.setState({
    //         validLisecItems: updatedValidLisecItems
    //     }, () => 
    //     {
    //     })
    // }

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
            console.log("response: ", response);
            var unverified_items = ""
            if (response.data.list_of_unverified_items && response.data.list_of_unverified_items.length > 0) {
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
                        listOfUniqueDates:[],

                        isNewDueDateAdded: false,
                        isOrderQuantityUpdated: false,
                        isNewItemAdded: false,
                        isItemNumberModified: false,
                        isDueDateModified: false,
                        isPromiseDateModified: false,
                        isDueDateDeleted: false,
                        isItemDeleted: false
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

    getOrderModificationStatus(){
        return (this.state.isNewDueDateAdded || this.state.isOrderQuantityUpdated || this.state.isNewItemAdded || this.state.isItemNumberModified
        || this.state.isDueDateModified || this.state.isPromiseDateModified || this.state.isDueDateDeleted || this.state.isItemDeleted)
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
                        console.log("calling from searchOrderDetails: ", window.ssouser)
                        // if (typeof ssouser !== 'undefined') {
                        //     console.log("I am here, ssouser: ", ssouser)

                        //     if (typeof ssouser) {
                        //         console.log(ssouser)
                        //     }
                        // }

                        if (this.state.orderNumber && this.getOrderModificationStatus()) {
                            // alert("Changes you made may not be saved!");
                            // return;

                            let text = "Changes you made may not be saved! Do you still want to proceed?";
                            if (window.confirm(text) == false) {
                                return;
                            }

                            // if (window.confirm(text) == true) {
                            //     var test = 0;
                            // } else {
                            //     return;
                            // }
                        }

                        this.setState({
                            itemsByDueDate: [],
                            isLoaded: false,
                            error: '',
                            orderStatus: '',
                            formattedItemsByDueDate: [],
                            listOfPromiseDates:[],
                            listOfUniqueDates:[],
                            listOfUniqueDueDates: [],

                            isNewDueDateAdded: false,
                            isOrderQuantityUpdated: false,
                            isNewItemAdded: false,
                            isItemNumberModified: false,
                            isDueDateModified: false,
                            isPromiseDateModified: false,
                            isDueDateDeleted: false,
                            isItemDeleted: false
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
                        this.setState({itemsByDueDate: modifiedItemsByDueDate, isNewDueDateAdded: true}, () => {
                            console.log("calling from MyProvider, addNewDueDate, this.state.itemsByDueDate: ", this.state.itemsByDueDate, ", this.state.isNewDueDateAdded: ", this.state.isNewDueDateAdded)
                        })
                    },

                    updateOrderQuantity: (modifiedItemsByDueDate) => {
                        this.setState({itemsByDueDate: modifiedItemsByDueDate, isOrderQuantityUpdated: true}, () => {
                            console.log("calling from MyProvider, updateOrderQuantity, this.state.itemsByDueDate: ", this.state.itemsByDueDate, ", this.state.isOrderQuantityUpdated: ", this.state.isOrderQuantityUpdated)
                        })
                    },

                    addNewItem: (modifiedItemsByDueDate) => {
                        this.setState({itemsByDueDate: modifiedItemsByDueDate, isNewItemAdded: true}, () => {
                            console.log("calling from MyProvider, addNewItem, this.state.itemsByDueDate: ", this.state.itemsByDueDate, ", this.state.isNewItemAdded: ", this.state.isNewItemAdded)
                        })
                    },

                    onChangeItemInput: (modifiedItemsByDueDate) => {
                        this.setState({itemsByDueDate: modifiedItemsByDueDate, isItemNumberModified: true}, () => {
                            console.log("calling from MyProvider, onChangeItemInput, this.state.itemsByDueDate: ", this.state.itemsByDueDate, ", this.state.isItemNumberModified: ", this.state.isItemNumberModified)
                        })
                    },

                    onChangeDateInput: (modifiedItemsByDueDate) => {
                        this.setState({itemsByDueDate: modifiedItemsByDueDate, isDueDateModified: true}, () => {
                            console.log("calling from MyProvider, onChangeDateInput, this.state.itemsByDueDate: ", this.state.itemsByDueDate, ", this.state.isDueDateModified: ", this.state.isDueDateModified)
                        })
                    },

                    onChangePromiseDateInput: (modifiedItemsByDueDate) => {
                        this.setState({itemsByDueDate: modifiedItemsByDueDate, isPromiseDateModified: true}, () => {
                            console.log("calling from MyProvider, onChangePromiseDateInput, this.state.itemsByDueDate: ", this.state.itemsByDueDate, ", this.state.isPromiseDateModified: ", this.state.isPromiseDateModified)
                        })
                    },

                    handleDeleteByDueDate: (modifiedItemsByDueDate) => {
                        this.setState({itemsByDueDate: modifiedItemsByDueDate, isDueDateDeleted: true}, () => {
                            console.log("calling from MyProvider, handleDeleteByDueDate, this.state.itemsByDueDate: ", this.state.itemsByDueDate, ", this.state.isDueDateDeleted: ", this.state.isDueDateDeleted)
                        })
                    },

                    handleDeleteByItem: (modifiedItemsByDueDate) => {
                        this.setState({itemsByDueDate: modifiedItemsByDueDate, isItemDeleted: true}, () => {
                            console.log("calling from MyProvider, handleDeleteByItem, this.state.itemsByDueDate: ", this.state.itemsByDueDate, ", this.state.isItemDeleted: ", this.state.isItemDeleted)
                        })
                    },
                    
                    submitOrderDetailsToQAD: (event) => {
                        event.preventDefault();

                        // console.log("calling from submitOrderDetailsToQAD in MyProvider after preventDefault, itemsByDueDate: ", this.state.itemsByDueDate);

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
                                // console.log("itemElement: ", itemElement)
                                if (itemElement['item'].includes('-')) {
                                    if (itemElement['description'] && itemElement['description'].toUpperCase() == 'IGU') {
                                        iguItemSet.add(itemElement['item'])
                                    }
                                    else {
                                        const splittedArray = itemElement['item'].split("-");
                                        if (splittedArray.length==2) {
                                            iguItemSet.add(itemElement['item'])
                                        }
                                    }
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
                    listOfUniqueDueDates: this.state.listOfUniqueDueDates,
                    isActiveUserSecurityRoleExist: this.state.isActiveUserSecurityRoleExist,
                    isFormDisabled: this.state.isFormDisabled
                }}
            >
                {this.props.children}
            </MyContext.Provider>
        );
    }
}

export default MyProvider;