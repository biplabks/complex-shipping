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
        orderStatus: ''
    };

    //======================================================================================================================
    async dataFetch() {
        // return await fetch("https://vanna.zh.if.atcsg.net:453/api/v1/get-qad-sales-order-info/"+this.state.orderNumber)
        return await fetch(baseAPIURL + "get-qad-sales-order-info/"+this.state.orderNumber)
    }

    async getValidLisecOrderItems() {
        // return await fetch("https://vanna.zh.if.atcsg.net:453/api/v1/get_valid_order_items/"+this.state.orderNumber.substring(1))
        return await fetch(baseAPIURL + "get_valid_order_items/"+this.state.orderNumber.substring(1))
    }

    async getValidQADOrderItems() {
        // return await fetch("https://vanna.zh.if.atcsg.net:453/api/v1/get-items")
        return await fetch(baseAPIURL + "get-items")
    }

    //refTagsByOrderItem
    //version 1
    // async getReferenceTagsByOrderItem() {
    //     //return await fetch(baseAPIURL + "get-ref-tag-by-order-item/"+this.state.orderNumber)
    //     console.log("calling from getReferenceTagsByOrderItem, this.state.validLisecItems: ", this.state.validLisecItems)
    //     return await fetch(baseAPIURL + 'get-ref-tag-by-order-item', {
    //         method: 'POST',
    //         body: JSON.stringify({
    //             items: this.state.validLisecItems,
    //         }),
    //         headers: {
    //             'Content-type': 'application/json; charset=UTF-8',
    //         },
    //     })
    //     .then((res) => res.json())
    //     .then((response) => {
    //         console.log("calling from getReferenceTagsByOrderItem, response: ", response, ", this.state.itemsByDueDate: ", this.state.itemsByDueDate)

    //         var refTagsByOrderItem = response['results']
    //         var existingItemsByDueDate = JSON.parse(JSON.stringify(this.state.itemsByDueDate));

    //         refTagsByOrderItem.forEach(refTagElement => {
    //             var item = refTagElement['order_no'] + '-' + refTagElement['item_no']

    //             existingItemsByDueDate.forEach(itemElement => {
    //                 var items = itemElement['value']

    //                 items.forEach(itemEl => {
    //                     if (itemEl['item'] == item) {
    //                         itemEl['reference_tag'] = refTagElement['reference_tag']   
    //                     }
    //                     else
    //                     {
    //                         itemEl['reference_tag'] = ""
    //                     }
    //                 })
    //             })
    //         })

    //         this.setState({
    //             itemsByDueDate: existingItemsByDueDate
    //         }, () => {
    //             console.log("calling from getReferenceTagsByOrderItem, itemsByDueDate: ", this.state.itemsByDueDate)
    //         })
    //     })
    //     .catch((err) => {
    //         console.log("calling from getReferenceTagsByOrderItem, err: ", err)
    //     });
    // }

    //version 2
    async getReferenceTagsByOrderItem() {
        //return await fetch(baseAPIURL + "get-ref-tag-by-order-item/"+this.state.orderNumber)
        //console.log("calling from getReferenceTagsByOrderItem, this.state.validLisecItems: ", this.state.validLisecItems)
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
            //console.log("calling from getReferenceTagsByOrderItem, response: ", response, ", this.state.itemsByDueDate: ", this.state.itemsByDueDate)

            var refTagByOrderItem = response['results']

            this.setState({
                refTagsByOrderItem: refTagByOrderItem
            },() => {
                console.log("calling from getReferenceTagsByOrderItem, refTagsByOrderItem: ", this.state.refTagsByOrderItem)
            })

            var existingItemsByDueDate = JSON.parse(JSON.stringify(this.state.itemsByDueDate));

            refTagByOrderItem.forEach(refTagElement => {
                var item = refTagElement['order_no'] + '-' + refTagElement['item_no']

                existingItemsByDueDate.forEach(itemElement => {
                    var items = itemElement['value']

                    items.forEach(itemEl => {
                        if (itemEl['item'] == item) {
                            itemEl['reference_tag'] = refTagElement['reference_tag']
                            //console.log("itemEl['item']: ", itemEl['item'], ", itemEl['reference_tag']: ", itemEl['reference_tag'])
                        }
                        else
                        {
                            if (!itemEl['reference_tag']) {
                                itemEl['reference_tag'] = ""
                            }
                        }
                    })
                })
                //console.log("updated existingItemsByDueDate: ", existingItemsByDueDate)
            })

            this.setState({
                itemsByDueDate: existingItemsByDueDate
            }, () => {
                console.log("calling from getReferenceTagsByOrderItem, itemsByDueDate: ", this.state.itemsByDueDate)
                this.getFormatteditemsByDueDate();
            })
        })
        .catch((err) => {
            //console.log("calling from getReferenceTagsByOrderItem, err: ", err)
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

    processValidLisecOrderItems(response) {
        var returnedData = response['result']['data']
        // console.log("returnedData: ", returnedData)
        if (!returnedData) {    //if it is undefined
            returnedData = []
        }

        this.setState({
            validLisecItems: returnedData
        }, () => {
            var items = this.state.validLisecItems.concat(this.state.validQADItems)

            this.setState({
                validItems: items
            }, () => {
            })
        });
    }

    processValidQADOrderItems(response) {
        var list_of_items = response['result']['items']
        var items_arr = []
        list_of_items.forEach(element => {
            items_arr.push(element['pt_part'])
        })
        
        this.setState({
            validQADItems: items_arr
        }, () => {
            var items = this.state.validLisecItems.concat(this.state.validQADItems)
            
            this.setState({
                validItems: items
            }, () => {
                // console.log("calling from processValidQADOrderItems, this.state.validItems: ", this.state.validItems)
            })
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
            // this.setState({
            //     isLoaded: false
            // }, () => {})
            const responses = await Promise.all([this.dataFetch()]);
        
            if (responses[0].status == 200) {
                const anotherPromise1 = await responses[0].json();
                // console.log("anotherPromise1: ", anotherPromise1)
                this.processDataFetch(anotherPromise1);

                // if (this.state.validLisecItems) {
                //     console.log("this.state.validLisecItems 2: ", this.state.validLisecItems)
                //     const responses1 = await Promise.all([this.getReferenceTagsByOrderItem()]);

                //     if (responses1[0].status == 200) {
                //         console.log("calling from fetchAllData getReferenceTagsByOrderItem")
                //     }   
                // }
            }
            
        }catch(error) {
            // console.log("Erroring out, error: ", error);
            
            this.setState({
                isLoaded: true,
                error: "Data can not be retrieved from QAD. Please contact IT administrator!"
            }, () => {});
            // return [];
        } finally {
            // this.setState({
            //     isLoaded: true
            // }, () => {})
        }
    }

    //version 1
    // destructureItems(resultData) {
    //     const map = new Map();
    //     const itemMap = new Map()

    //     console.log("calling from destructureItems, resultData: ", resultData)

    //     var itemIndex = 0;
    //     resultData.forEach(element => {
    //         if (map.has(element['shipping_date'])) {
    //             let arr = []
    //             arr = map.get(element['shipping_date'])
    //             arr.push(element)
    //             arr[arr.length-1]["id"] = arr.length-1
    //             map.set(element['shipping_date'], arr);
    //         }
    //         else {
    //             let arr = []
    //             arr = [element];
    //             arr[arr.length-1]["id"] = arr.length-1
    //             map.set(element['shipping_date'], arr);
    //         }

    //         if (!itemMap.has(element['item'])) {
    //             itemMap.set(element['item'], itemIndex)
    //             itemIndex += 1
    //         }
    //     })

    //     itemMap.forEach((itemValue, itemKey) => {
    //         map.forEach((mapElementValue, mapElementKey) => {
    //             // console.log("mapElement['key']: ", mapElementKey)
    //             // console.log("mapElement['value']: ", mapElementValue)

    //             var newArray = mapElementValue.filter(function (el) {
    //                 return el.item == itemKey;
    //             });
    //             if (newArray.length == 0) {
    //                 // console.log("newArray: ", newArray)
    //                 mapElementValue.push({id: mapElementValue.length, item: itemKey, order_qty: 0, shipping_date: mapElementKey})
    //             }
    //         })
    //     })

    //     const mappedResult = Array.from(map).map(([key, value]) => ({key, value}))

    //     const validIguItemsSet = new Set()

    //     mappedResult.forEach(element => {
    //         element['isDateEditable'] = true
    //         element['initialDate'] = element['key']
    //         var items = element['value']
    //         items.forEach(itemElement => {
    //             // if (itemElement['item_description']) {
    //             //     if (itemElement['item_description'].toLowerCase() == 'igu') {
    //             //         validIguItemsSet.add(itemElement['item'])
    //             //     }
    //             // }
    //             if (itemElement['item'].includes('-')) {
    //                 validIguItemsSet.add(itemElement['item'])
    //             }
    //         })
    //     })

    //     console.log("calling from destructureItems in MyProvider, validIguItemsSet: ", validIguItemsSet)

    //     var validIGUItems = Array.from(validIguItemsSet)

    //     var formattedMappedResult = JSON.parse(JSON.stringify(mappedResult));

    //     this.getFormatteditemsByDueDate(formattedMappedResult)

    //     this.setState(
    //         { itemsByDueDate: mappedResult, itemsByDueDateMap: map, validLisecItems: validIGUItems}, 
    //         () => {
    //             console.log("calling from destructureItems in MyProvider, this.state.itemsByDueDate: ", this.state.itemsByDueDate, ", this.state.itemsByDueDateMap: ", this.state.itemsByDueDateMap, ", this.state.validLisecItems: ", this.state.validLisecItems)
    //             this.getReferenceTagsByOrderItem();
    //         }
    //     );
    // }

    //version 2
    // destructureItems(resultData) {
    //     const map = new Map();
    //     const itemMap = new Map()

    //     console.log("calling from destructureItems, resultData: ", resultData)

    //     var itemIndex = 0;
    //     resultData.forEach(element => {
    //         if (map.has(element['shipping_date'])) {
    //             let arr = []
    //             arr = map.get(element['shipping_date'])
    //             arr.push(element)
    //             arr[arr.length-1]["id"] = arr.length-1
    //             map.set(element['shipping_date'], arr);
    //         }
    //         else {
    //             let arr = []
    //             arr = [element];
    //             arr[arr.length-1]["id"] = arr.length-1
    //             map.set(element['shipping_date'], arr);
    //         }

    //         if (!itemMap.has(element['item'])) {
    //             itemMap.set(element['item'], itemIndex)
    //             itemIndex += 1
    //         }
    //     })

    //     itemMap.forEach((itemValue, itemKey) => {
    //         map.forEach((mapElementValue, mapElementKey) => {
    //             // console.log("mapElement['key']: ", mapElementKey)
    //             // console.log("mapElement['value']: ", mapElementValue)

    //             var newArray = mapElementValue.filter(function (el) {
    //                 return el.item == itemKey;
    //             });
    //             if (newArray.length == 0) {
    //                 // console.log("newArray: ", newArray)
    //                 mapElementValue.push({id: mapElementValue.length, item: itemKey, order_qty: 0, shipping_date: mapElementKey})
    //             }
    //         })
    //     })

    //     console.log("calling from destructureItems, map: ", map)

    //     const mappedResult = Array.from(map).map(([key, value]) => ({key, value}))

    //     const validIguItemsSet = new Set()

    //     mappedResult.forEach(element => {
    //         element['isDateEditable'] = true
    //         element['initialDate'] = element['key']
    //         var items = element['value']

    //         var promiseDate = ""
    //         items.forEach(itemElement => {
    //             if (itemElement['promise_date'] && promiseDate == "") {
    //                 promiseDate = itemElement['promise_date']
    //             }
    //             if (itemElement['item'].includes('-')) {
    //                 validIguItemsSet.add(itemElement['item'])
    //             }
    //         })
    //         element['promiseDate'] = promiseDate
    //         element['initialPromiseDate'] = promiseDate
    //     })

    //     var validIGUItems = Array.from(validIguItemsSet)

    //     this.setState({
    //         itemsByDueDate: mappedResult,
    //         validLisecItems: validIGUItems
    //     }, () => {
    //         console.log("calling from destructureItems in MyProvider, this.state.itemsByDueDate: ", this.state.itemsByDueDate, ", this.state.validLisecItems: ", this.state.validLisecItems)
    //         this.getReferenceTagsByOrderItem();
    //     })

    //     //console.log("calling from destructureItems in MyProvider, validIguItemsSet: ", validIguItemsSet)

    //     this.setState(
    //         { itemsByDueDateMap: map }, 
    //         () => {
    //             console.log("calling from destructureItems in MyProvider, this.state.itemsByDueDateMap: ", this.state.itemsByDueDateMap)
    //         }
    //     );
    // }

    //version 3
    destructureItems(resultData) {
        const map = new Map();
        const itemMap = new Map()
        const itemSetMap = new Map()
        

        console.log("calling from destructureItems, resultData: ", resultData)

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

        //console.log("calling from destructureItems, itemSetMap: ", itemSetMap)
        //console.log("calling from destructureItems, map: ", map)

        itemMap.forEach((itemValue, itemKey) => {
            map.forEach((mapElementValue, mapElementKey) => {
                // console.log("mapElement['key']: ", mapElementKey)
                // console.log("mapElement['value']: ", mapElementValue)

                var newArray = mapElementValue.filter(function (el) {
                    return el.item == itemKey;
                });
                if (newArray.length == 0) {
                    // console.log("newArray: ", newArray)
                    mapElementValue.push({id: mapElementValue.length, item: itemKey, order_qty: 0, shipping_date: mapElementKey})
                }
            })
        })

        //console.log("calling from destructureItems, map: ", map)

        const mappedResult = Array.from(map).map(([key, value]) => ({key, value}))

        //console.log("calling from destructureItems, mappedResult before: ", mappedResult)

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

        //console.log("calling from destructureItems, mappedResult after: ", mappedResult)

        var validIGUItems = Array.from(validIguItemsSet)

        this.setState({
            itemsByDueDate: mappedResult,
            validLisecItems: validIGUItems
        }, () => {
            console.log("calling from destructureItems in MyProvider, this.state.itemsByDueDate: ", this.state.itemsByDueDate, ", this.state.validLisecItems: ", this.state.validLisecItems)
            this.getReferenceTagsByOrderItem();
        })

        //console.log("calling from destructureItems in MyProvider, validIguItemsSet: ", validIguItemsSet)

        this.setState(
            { itemsByDueDateMap: map }, 
            () => {
                //console.log("calling from destructureItems in MyProvider, this.state.itemsByDueDateMap: ", this.state.itemsByDueDateMap)
            }
        );
    }

    //version 1
    // getFormatteditemsByDueDate(mappedResult) {
    //     const itemSet = new Set()
    //     const itemMap = new Map()

    //     var index = 0
    //     mappedResult.map(({key, value}) => {
    //         value.forEach(element => {
    //             itemSet.add(element['item'])
    //             if (!itemMap.has(element['item'])) {
    //                 itemMap.set(element['item'], index)
    //                 index += 1
    //             }
    //         });
    //     })

    //     mappedResult.map(({key, value}) => {
    //         itemSet.forEach(item => {
    //             let isItemFound = false
    //             value.forEach(element => {
    //                 if (item == element['item']) {
    //                     isItemFound = true
    //                 }
    //             });
        
    //             if (!isItemFound) {
    //                 value.push({
    //                     "item": item,
    //                     "order_qty": 0,
    //                     "id": 1
    //                 })
    //             }
    //         })
    //     })

    //     // console.log("calling from getFormatteditemsByDueDate, mappedResult: ", mappedResult)

    //     var formattedMappedResult = []
    //     var uniqueDatesMap = new Map()
    //     var indexCount = 0
    //     mappedResult.map(({key, value, isDateEditable, initialDate}) => {
    //         var items = []
    //         itemMap.forEach((value1, key) => {
    //             value.forEach(element => {
    //                 if (key == element['item']) {
    //                     items.push(element)
    //                 }
    //             })
    //         })
    //         var item = {
    //             key: key,
    //             value: items,
    //             isDateEditable: isDateEditable,
    //             initialDate: initialDate
    //         }
    //         formattedMappedResult.push(item)

    //         //get unique dates
    //         uniqueDatesMap.set(initialDate, indexCount)
    //         indexCount += 1
    //     })

    //     formattedMappedResult.map(({key, value}) => {
    //         let index = 0
    //         value.forEach(element => {
    //             element['id'] = index
    //             index += 1
    //         })
    //     })

    //     var formattedMappedResultFinal = new Map();
    //     formattedMappedResult.forEach(element => {
    //         var items = element['value']
    //         items.forEach(itemElement => {
    //             if (!formattedMappedResultFinal.has(itemElement['item'])) {
    //                 formattedMappedResultFinal.set(itemElement['item'], [{'order_qty': itemElement['order_qty'], 'due_date': element['key'], 'initial_date': element['key']}])
    //             }
    //             else
    //             {
    //                 var itemList = formattedMappedResultFinal.get(itemElement['item'])
    //                 itemList.push({'order_qty': itemElement['order_qty'], 'due_date': element['key'], 'initial_date': element['key']})
    //                 formattedMappedResultFinal.set(itemElement['item'], itemList)
    //             }
    //         })
    //     })

    //     console.log("calling from getFormatteditemsByDueDate in MyProvider, formattedMappedResultFinal: ", formattedMappedResultFinal)
    //     //listOfUniqueDates
    //     const uniqueDates = Array.from(uniqueDatesMap).map(([key, value]) => ({key, value}))
    //     const formattedItemsByDueDate = Array.from(formattedMappedResultFinal).map(([key, value]) => ({key, value}))

    //     var index = 0
    //     formattedItemsByDueDate.forEach(item => {
    //         item['id'] = index
    //         index += 1
    //     })

    //     this.setState(
    //         { formattedItemsByDueDate: formattedItemsByDueDate, listOfUniqueItems: itemMap, listOfUniqueDates: uniqueDates },
    //         () => {
    //             console.log("calling from getFormatteditemsByDueDate in MyProvider, this.state.formattedItemsByDueDate: ", this.state.formattedItemsByDueDate, ", listOfUniqueDates: ", this.state.listOfUniqueDates)
    //         }
    //     );
    // }

    //version 2
    // getFormatteditemsByDueDate() {
    //     const itemSet = new Set()
    //     const itemMap = new Map()

    //     var existingItemsByDueDate = JSON.parse(JSON.stringify(this.state.itemsByDueDate));
    //     var existingRefTagsByOrderItem = JSON.parse(JSON.stringify(this.state.refTagsByOrderItem))

    //     console.log("calling from getFormatteditemsByDueDate, existingItemsByDueDate: ", existingItemsByDueDate)

    //     var index = 0
    //     existingItemsByDueDate.map(({key, value}) => {
    //         value.forEach(element => {
    //             itemSet.add(element['item'])
    //             if (!itemMap.has(element['item'])) {
    //                 itemMap.set(element['item'], index)
    //                 index += 1
    //             }
    //         });
    //     })

    //     existingItemsByDueDate.map(({key, value}) => {
    //         itemSet.forEach(item => {
    //             let isItemFound = false
    //             value.forEach(element => {
    //                 if (item == element['item']) {
    //                     isItemFound = true
    //                 }
    //             });
        
    //             if (!isItemFound) {
    //                 value.push({
    //                     "item": item,
    //                     "order_qty": 0,
    //                     "id": 1
    //                 })
    //             }
    //         })
    //     })

    //     console.log("calling from getFormatteditemsByDueDate 2, existingItemsByDueDate: ", existingItemsByDueDate)

    //     var formattedMappedResult = []
    //     var uniqueDatesMap = new Map()
    //     var uniquePromiseDates = []
    //     var indexCount = 0
    //     existingItemsByDueDate.map(({key, value, isDateEditable, initialDate, initialPromiseDate}) => {
    //         var items = []
    //         itemMap.forEach((value1, key) => {
    //             value.forEach(element => {
    //                 if (key == element['item']) {
    //                     items.push(element)
    //                 }
    //             })
    //         })
    //         var item = {
    //             key: key,
    //             value: items,
    //             isDateEditable: isDateEditable,
    //             initialDate: initialDate
    //         }
    //         formattedMappedResult.push(item)

    //         //get unique dates
    //         uniqueDatesMap.set(initialDate, indexCount)
    //         uniquePromiseDates.push(
    //             {
    //                 "promiseDate": initialPromiseDate,
    //                 "promiseDateIndex": indexCount
    //             }
    //         )
    //         indexCount += 1
    //     })

    //     console.log("calling from getFormatteditemsByDueDate 2, uniquePromiseDates: ", uniquePromiseDates)

    //     formattedMappedResult.map(({key, value}) => {
    //         let index = 0
    //         value.forEach(element => {
    //             element['id'] = index
    //             index += 1
    //         })
    //     })

    //     var formattedMappedResultFinal = new Map();
    //     console.log("calling from getFormatteditemsByDueDate before building main map, formattedMappedResult: ", formattedMappedResult)
    //     formattedMappedResult.forEach(element => {
    //         var items = element['value']
    //         items.forEach(itemElement => {
    //             if (!formattedMappedResultFinal.has(itemElement['item'])) {
    //                 formattedMappedResultFinal.set(itemElement['item'], [{'order_qty': itemElement['order_qty'], 'due_date': element['key'], 'initial_date': element['key'], 
    //                 'promise_date': itemElement['promise_date'], 'initial_promise_date': itemElement['promise_date']}])
    //             }
    //             else
    //             {
    //                 var itemList = formattedMappedResultFinal.get(itemElement['item'])
    //                 itemList.push({'order_qty': itemElement['order_qty'], 'due_date': element['key'], 'initial_date': element['key'], 
    //                 'promise_date': itemElement['promise_date'], 'initial_promise_date': itemElement['promise_date']})
    //                 formattedMappedResultFinal.set(itemElement['item'], itemList)
    //             }
    //         })
    //     })

    //     console.log("calling from getFormatteditemsByDueDate in MyProvider, formattedMappedResultFinal: ", formattedMappedResultFinal)

    //     const uniqueDates = Array.from(uniqueDatesMap).map(([key, value]) => ({key, value}))
    //     const formattedItemsByDueDate1 = Array.from(formattedMappedResultFinal).map(([key, value]) => ({key, value}))

    //     var index = 0
    //     formattedItemsByDueDate1.forEach(item => {
    //         item['id'] = index
    //         index += 1
    //     })

    //     existingRefTagsByOrderItem.forEach(refTagElement => {
    //         var item = refTagElement['order_no'] + '-' + refTagElement['item_no']

    //         formattedItemsByDueDate1.forEach(itemElement => {
    //             var itemCode = itemElement['key']
    //             if (itemCode == item) {
    //                 itemElement['reference_tag'] = refTagElement['reference_tag']
    //             }
    //             else {
    //                 itemElement['reference_tag'] = ""
    //             }
    //         })
    //     })

    //     this.setState({
    //         listOfUniqueItems: itemMap, 
    //         listOfUniqueDates: uniqueDates,
    //         listOfPromiseDates: uniquePromiseDates
    //     }, () => {
    //         console.log("calling from getFormatteditemsByDueDate in MyProvider, listOfUniqueDates: ", this.state.listOfUniqueDates,
    //             ", listOfPromiseDates: ", this.state.listOfPromiseDates)
            
    //         this.setState(
    //             { formattedItemsByDueDate: formattedItemsByDueDate1 },
    //             () => {
    //                 console.log("calling from getFormatteditemsByDueDate in MyProvider, this.state.formattedItemsByDueDate: ", 
    //                 this.state.formattedItemsByDueDate)
    //             }
    //         );
    //     })
    // }

    //version 3
    getFormatteditemsByDueDate() {
        const itemSet = new Set()
        const itemMap = new Map()
        //const itemSetMap = new Map()

        var existingItemsByDueDate = JSON.parse(JSON.stringify(this.state.itemsByDueDate));
        var existingRefTagsByOrderItem = JSON.parse(JSON.stringify(this.state.refTagsByOrderItem))

        //console.log("calling from getFormatteditemsByDueDate, existingItemsByDueDate: ", existingItemsByDueDate)

        var index = 0
        existingItemsByDueDate.map(({key, value}) => {
            value.forEach(element => {
                itemSet.add(element['item'])
                if (!itemMap.has(element['item'])) {
                    itemMap.set(element['item'], index)
                    index += 1
                }

                // if (!itemSetMap.has(element['item'])) {
                //     itemSetMap.set(element['item'], 1)
                // }
                // else
                // {
                //     var itemCount = itemSetMap.get(element['item'])
                //     itemSetMap.set(element['item'], itemCount+1)
                // }
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

        //console.log("calling from getFormatteditemsByDueDate 2, existingItemsByDueDate: ", existingItemsByDueDate)

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

        //console.log("calling from getFormatteditemsByDueDate 2, uniqueDueDates: ", uniqueDueDates)

        formattedMappedResult.map(({key, value}) => {
            let index = 0
            value.forEach(element => {
                element['id'] = index
                index += 1
            })
        })

        var formattedMappedResultFinal = new Map();
        //console.log("calling from getFormatteditemsByDueDate before building main map, formattedMappedResult: ", formattedMappedResult)
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

        //console.log("calling from getFormatteditemsByDueDate in MyProvider, formattedMappedResultFinal: ", formattedMappedResultFinal)

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

        // existingItemsByDueDate.forEach(eItemElement => {
        //     if (!eItemElement['isDateEditable']) {
                
        //     }
        // })

        this.setState({
            listOfUniqueItems: itemMap, 
            listOfUniqueDates: uniqueDates,
            listOfUniqueDueDates: uniqueDueDates,
            listOfPromiseDates: uniquePromiseDates
        }, () => {
            console.log("calling from getFormatteditemsByDueDate in MyProvider, listOfUniqueDates: ", this.state.listOfUniqueDates, ", listOfPromiseDates: ", this.state.listOfPromiseDates, ", listOfUniqueDueDates: ", this.state.listOfUniqueDueDates)
            
            this.setState(
                { formattedItemsByDueDate: formattedItemsByDueDate1 },
                () => {
                    console.log("calling from getFormatteditemsByDueDate in MyProvider, this.state.formattedItemsByDueDate: ", this.state.formattedItemsByDueDate)
                }
            );
        })
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
                    
                    setDueDate: (event, due_date_key) => {
                        // console.log("calling from setDueDate in MyProvider, event: ", event.target.value, ", due_date_key: ", due_date_key)
                        // let modifiedISODate = due_date_key.toISOString();
                        let modifiedISODate = due_date_key;
                        // console.log("modifiedISODate: ", modifiedISODate)
                        
                        // var localTime = moment().format('YYYY-MM-DD'); // store localTime
                        var modifiedDate = event.target.value + "T00:00:00.000Z";

                        if(this.state.itemsByDueDateMap.has(modifiedDate))
                        {
                            alert("Same date exist! Please choose another date!")
                        }
                        else
                        {
                            var existingDataMap = this.state.itemsByDueDateMap
                            var existingData = Object.assign([], existingDataMap.get(modifiedISODate));
                            existingDataMap.set(modifiedDate, existingData)
                            // console.log("calling from setDueDate, before existingDataMap: ", existingDataMap)
                            existingDataMap.delete(modifiedISODate)
                            
                            var existingValueByNewDueDate = existingDataMap.get(modifiedDate)
                            
                            existingValueByNewDueDate.forEach(item => {
                                item['shipping_date'] = modifiedDate
                            });

                            // console.log("calling from setDueDate, existingValueByNewDueDate: ", existingValueByNewDueDate)
                            // console.log("calling from setDueDate, after existingDataMap: ", existingDataMap)

                            var existingItemsByDueDate = this.state.itemsByDueDate
                            for (let index = 0; index < existingItemsByDueDate.length; index++) {
                                if (existingItemsByDueDate[index]['key'] == modifiedISODate) {
                                    existingItemsByDueDate[index]['key'] = modifiedDate;
                                    break;
                                }
                            }

                            this.setState(
                                { itemsByDueDate: existingItemsByDueDate, itemsByDueDateMap: existingDataMap}, 
                                () => {
                                    // console.log("calling from setDueDate in MyProvider, itemsByDueDateMap: ", this.state.itemsByDueDateMap, ", itemsByDueDate: ", this.state.itemsByDueDate)
                                } 
                            );
                        }
                    },

                    searchOrderDetails: (event) => {
                        event.preventDefault();

                        // this.setState({
                        //     itemsByDueDate: [],
                        //     isLoaded: false,
                        //     error: '',
                        //     orderStatus: ''
                        // })

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
                        
                        /*
                        if (this.state.orderNumber.length === 7 && this.state.orderNumber[0] == 'L') {
                            this.fetchAllData();
                        }
                        else if(this.state.orderNumber.length === 6 || this.state.orderNumber.length === 7) {
                            console.log("this.state.orderNumber: ", this.state.orderNumber)
                            this.fetchAllData();
                        }
                        else {
                            this.setState({
                                isLoaded: true
                            })
                            alert("Please enter a valid order number");
                            event.preventDefault();
                        }*/
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

                    removeItemByDueDate: (due_date_key, selectedItems) => {
                        // console.log("calling from removeItemByDueDate in MyProvider, due_date_key: ", due_date_key, ", selectedItems: ", selectedItems)

                        var existingItemByDueDate = Object.assign([], this.state.itemsByDueDate);
                        var existingItemByDueDateMap = this.state.itemsByDueDateMap;
                        // console.log("calling from removeItemByDueDate in MyProvider, existingItemByDueDate: ", existingItemByDueDate, ", existingItemByDueDateMap: ", existingItemByDueDateMap)
                        
                        var existingItems = []

                        var existingItems = existingItemByDueDate.filter(item => item.key == due_date_key)[0]['value'];
                        
                        var modifiedData = [];
                        existingItems.forEach(element => {
                            if (!selectedItems.includes(element.id)) {
                                modifiedData.push(element);
                            }
                        })
                        for (let index = 0; index < modifiedData.length; index++) {
                            modifiedData[index]['id'] = index
                        }

                        for (let index = 0; index < existingItemByDueDate.length; index++) {
                            if(existingItemByDueDate[index]['key'] == due_date_key) {
                                existingItemByDueDate[index]['value'] = Object.assign([], modifiedData);
                                break
                            }
                        }
                        
                        existingItemByDueDateMap.set(due_date_key, modifiedData)
                        this.setState({itemsByDueDate: modifiedData, itemsByDueDateMap: existingItemByDueDateMap}, 
                            () => {
                                // console.log("calling from removeItemByDueDate, this.state.itemsByDueDate: ", this.state.itemsByDueDate, ", this.state.itemsByDueDateMap: ", this.state.itemsByDueDateMap)
                            }
                        )
                    },
                    insertItemByDueDate: (due_date_key) => {
                        var existingData = this.state.itemsByDueDateMap;
                        var list_of_items = Object.assign([], existingData.get(due_date_key));

                        list_of_items.push({id: list_of_items.length, item: '', order_qty: 1, shipping_date: due_date_key})
                        existingData.set(due_date_key, list_of_items)

                        var existingItemsByDueDate = this.state.itemsByDueDate
                        
                        for (let index = 0; index < existingItemsByDueDate.length; index++) {
                            if (existingItemsByDueDate[index]['key'] == due_date_key) {
                                existingItemsByDueDate[index]['value'] = Object.assign([], list_of_items);
                            }
                        }

                        this.setState(
                            { itemsByDueDate: existingItemsByDueDate, itemsByDueDateMap:  existingData}, 
                            () => {
                                // console.log("calling from insertItemByDueDate in MyProvider, itemsByDueDateMap: ", this.state.itemsByDueDateMap)
                            }
                        );
                    },
                    copyItemsByDueDate: (due_date_key) => {
                        // console.log("Copying items, event: ", due_date_key)

                        try {
                            var existingData = this.state.itemsByDueDateMap;
                            
                            let list_of_items = JSON.parse(JSON.stringify(existingData.get(due_date_key)));
                            // console.log("list_of_items: ", list_of_items)

                            for (let index = 0; index < list_of_items.length; index++) {
                                const element = list_of_items[index];
                                delete element.sales_order_line
                            }

                            let dateArray = []
                            const keys = [...this.state.itemsByDueDateMap.keys()];
                            for (let index = 0; index < keys.length; index++) {
                                const element = new Date(keys[index]);
                                dateArray.push(element);
                            }

                            const maxDate = new Date(Math.max.apply(null, dateArray));
                            var nextAvailableDate = new Date(maxDate);
                            nextAvailableDate.setDate(maxDate.getDate()+1);

                            nextAvailableDate = nextAvailableDate.toISOString();

                            // console.log("nextAvailableDate: ", nextAvailableDate)

                            existingData.set(nextAvailableDate, list_of_items)

                            // const arrayFrommappedResult = Array.from(existingData).map(([key, value]) => ({key, value}))
                            // var filteredRecord = arrayFrommappedResult.filter(item => item.key == nextAvailableDate)
                            // if (filteredRecord.length !== 0) {
                            //     filteredRecord[0]['isDateEditable'] = true
                            // }
                            
                            var arrayFrommappedResult = this.state.itemsByDueDate 
                            var newItem = {
                                'key': nextAvailableDate,
                                'value': list_of_items,
                                'isDateEditable': true  
                            }
                            arrayFrommappedResult.push(newItem)

                            this.setState(
                                { itemsByDueDate: arrayFrommappedResult, itemsByDueDateMap:  existingData}, 
                                () => {
                                    // console.log("calling from copyItemsByDueDate in MyProvider, itemsByDueDateMap: ", this.state.itemsByDueDateMap, ", itemsByDueDate: ", this.state.itemsByDueDate)
                                }
                            );

                        } catch (error) {
                            // console.log("error: ", error.message);
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
                    
                    //version 1
                    // submitOrderDetailsToQAD: (event) => {
                    //     event.preventDefault();

                    //     console.log("calling from submitOrderDetailsToQAD in MyProvider after preventDefault, itemsByDueDate: ", this.state.itemsByDueDate);
                    //     // console.log("calling from submitOrderDetailsToQAD in MyProvider after preventDefault, itemsByDueDateMap: ", this.state.itemsByDueDateMap);

                    //     //return;

                    //     if (!this.state.itemsByDueDate.length) {
                    //         alert("Not enough data to submit to QAD!")
                    //         return
                    //     }
                        
                    //     var isItemListBlank = false
                    //     var isItemDescriptionBlank = false
                    //     var isItemQuantityBlank = false
                    //     var isDuplicateItemExist = false
                    //     var dateOfBlankItemList = ""
                    //     var dupliateItemDate = ""
                    //     var duplicateItem = ""
                    //     this.state.itemsByDueDate.forEach(element => {
                    //         // console.log("element: ", element)
                    //         const itemSet = new Set()
                    //         let items = element['value']
                    //         if (items.length == 0) {
                    //             isItemListBlank = true
                    //             dateOfBlankItemList = element['key'].replace("T00:00:00.000Z", '')
                    //         }
                    //         else
                    //         {
                    //             for (let index = 0; index < items.length; index++) {
                    //                 const item = items[index];
                    //                 if (!item['item']) {
                    //                     isItemDescriptionBlank = true
                    //                     // alert("Item description can not be blank!")
                    //                     break;
                    //                 }
    
                    //                 if (item['order_qty'] == 0) {
                    //                     isItemQuantityBlank = true
                    //                     // alert("Order quantity can not be zero!")
                    //                     break;
                    //                 }
    
                    //                 if (!itemSet.has(item['item'])) {
                    //                     itemSet.add(item['item'])
                    //                 }
                    //                 else
                    //                 {
                    //                     isDuplicateItemExist = true
                    //                     dupliateItemDate = element['key'].replace("T00:00:00.000Z", '')
                    //                     duplicateItem = item['item']
                    //                     break;
                    //                 }
                    //             }
                    //         }
                    //     })

                    //     if (isItemListBlank) {
                    //         alert("Item List is Blank for date: " + dateOfBlankItemList + ". Can't submit to QAD!")
                    //         return;
                    //     }
                    //     if (isItemDescriptionBlank) {
                    //         alert("Item description can not be blank!")
                    //         return;
                    //     }
                    //     if (isItemQuantityBlank) {
                    //         alert("Item quantity can not be zero!")
                    //         return;
                    //     }
                    //     if (isDuplicateItemExist) {
                    //         // alert("Duplicate item is not allowed! Duplicate Item: " + duplicateItem + " exist in due date: " + dupliateItemDate)
                    //         alert("Duplicate item is not allowed! Duplicate Item: " + duplicateItem + " exist!")
                    //         return;
                    //     }

                    //     this.setState({
                    //         isSubmitButtonLoading: true
                    //     }, () => {})
                        
                    //     // baseAPIURLTest, baseAPIURL
                    //     // fetch('http://127.0.0.1:5000/api/send_req_items_for_cs', {
                    //     fetch(baseAPIURL + 'send_req_items_for_cs', {
                    //         method: 'POST',
                    //         body: JSON.stringify({
                    //             orderNumber: this.state.orderNumber,
                    //             itemsByDueDate: this.state.itemsByDueDate,
                    //             isValidLisecItemsAvailable: this.state.validLisecItems.length,
                    //             validLisecItems: this.state.validLisecItems,
                    //             channel: this.state.channel
                    //         }),
                    //         headers: {
                    //             'Content-type': 'application/json; charset=UTF-8',
                    //         },
                    //     })
                    //     .then((res) => res.json())
                    //     .then((response) => {
                    //         // console.log("=======Am I here=========");
                    //         // console.log("response: ", response.data);
                    //         var unverified_items = ""
                    //         if (response.data.list_of_unverified_items.length > 0) {
                    //             for (let index = 0; index < response.data.list_of_unverified_items.length; index++) {
                    //                 const item = response.data.list_of_unverified_items[index];
                    //                 // console.log("item: ", item)
                    //                 unverified_items += item;
                    //                 unverified_items += ","
                    //             }
                    //             unverified_items = unverified_items.replace(/.$/, '');
                    //             alert("Item " + unverified_items + " does not exist in QAD, so you'll need to correct this before this can be saved.")
                    //             this.setState({
                    //                 isSubmitButtonLoading: false
                    //             }, () => {})
                    //         }
                    //         else
                    //         {
                    //             if (response.data.is_confirmed) {
                    //                 this.setState({
                    //                     isSubmitButtonLoading: false
                    //                 }, () => {})
                                    
                    //                 alert("Sales order is already confirmed! Data can not be submitted to QAD!")
                    //             }
                    //             else if (response.data.status == 'success') {
                    //                 this.setState({
                    //                     isSubmitButtonLoading: false
                    //                 }, () => {})
                                    
                    //                 alert("Data was submitted successfully!")
    
                    //                 this.setState({
                    //                     itemsByDueDate: [],
                    //                     isLoaded: false,
                    //                     error: ''
                    //                 })
                    //                 this.fetchAllData();
                    //             }
                    //         }
                    //     })
                    //     .catch((err) => {
                    //         // console.log(err);
                    //         this.setState({
                    //             isSubmitButtonLoading: false
                    //         }, () => {})
                    //         alert("Data was not submitted successfully!Please contact administrator!")
                    //     });
                    // },

                    //version 2
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
    
                                    // if (item['order_qty'] == 0) {
                                    //     isItemQuantityBlank = true
                                    //     // alert("Order quantity can not be zero!")
                                    //     break;
                                    // }
    
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

                        //console.log("calling from submitOrderDetailsToQAD in MyProvider after preventDefault, itemsByDueDate: ", this.state.itemsByDueDate);

                        //return;

                        this.setState({
                            isSubmitButtonLoading: true
                        }, () => {})
                        
                        // baseAPIURLTest, baseAPIURL
                        fetch('http://127.0.0.1:5000/api/send_req_items_for_cs', {
                        //fetch(baseAPIURL + 'send_req_items_for_cs', {
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
                            // console.log("=======Am I here=========");
                            console.log("response: ", response.data);
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
                            console.log("err: ", err);
                            this.setState({
                                isSubmitButtonLoading: false
                            }, () => {})
                            alert("Data was not submitted successfully!Please contact administrator!")
                        });
                    },

                    addNewTableByDueDate: () => {
                        try {
                            var existingData = this.state.itemsByDueDateMap;
                            var list_of_items = []
                            let dateArray = []
                            const keys = [...this.state.itemsByDueDateMap.keys()];
                            for (let index = 0; index < keys.length; index++) {
                                const element = new Date(keys[index]);
                                dateArray.push(element);
                            }

                            var maxDate = new Date(Math.max.apply(null, dateArray));
                            if (dateArray.length == 0) {
                                maxDate = new Date()
                            }
                            
                            var nextAvailableDate = new Date(maxDate);
                            nextAvailableDate.setDate(maxDate.getDate()+1);
                            nextAvailableDate = nextAvailableDate.toISOString();

                            existingData.set(nextAvailableDate, list_of_items)
                            
                            var arrayFrommappedResult = this.state.itemsByDueDate 
                            var newItem = {
                                'key': nextAvailableDate,
                                'value': list_of_items,
                                'isDateEditable': true  
                            }
                            arrayFrommappedResult.push(newItem)

                            this.setState(
                                { itemsByDueDate: arrayFrommappedResult, itemsByDueDateMap:  existingData}, 
                                () => {
                                    // console.log("calling from copyItemsByDueDate in MyProvider, itemsByDueDateMap: ", this.state.itemsByDueDateMap, ", itemsByDueDate: ", this.state.itemsByDueDate)
                                } 
                            );

                        } catch (error) {
                            // console.log("error: ", error.message);
                        }
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