import { Container, Button, Spinner, Form, Table } from 'react-bootstrap';
import React from 'react';
import LoadingSpinner from "./LoadingSpinner";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faSearch, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import DatePicker from 'react-datepicker'

import "react-datepicker/dist/react-datepicker.css"
import "../styles.css";

// const baseAPIURL = "https://vanna.zh.if.atcsg.net:453/api/v1/"
const baseAPIURL = "https://vanna.zh.if.atcsg.net/api/v1/"

const baseAPIURLTest = "http://127.0.0.1:5000/api/"

// B3391410
// window.ssouser = 'p5620895'
//window.ssouser = 'B6347379'

class ComplexShipping extends React.Component{
  constructor(props) {
    super(props);
    
    //Initial state of all class properties
    this.state = {
      error: '',
      isLoaded: true,
      items: [],
      responseFromQAD: [],
      listOfUniqueItems: new Map(),
      listOfUniqueDates: new Map(),
      listOfPromiseDates: [],
      listOfUniqueDueDates: [],
      itemsByDueDate: [],
      refTagsByOrderItem: [],
      formattedItemsByItem: new Map(),
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
      isFormDisabled: false,
      sumOfIgusRowWise: [],
      sumOfIgusColumnWise: [],
      orderQuantityTotal: 0
    };
  }

  //Get QAD sales order information including line items 
  async getQadSalesOrderInfo() {
    return await fetch(baseAPIURL + "get-qad-sales-order-info-for-soe", {
        method: 'POST',
        body: JSON.stringify({
            sales_order_number: this.state.orderNumber,
            sgid: window.ssouser.toUpperCase()
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
  };

  //Fetch all required data from API endpoints
  async fetchAllData() {
    try{
      const responses = await Promise.all([this.getQadSalesOrderInfo()]);
  
      if (responses[0].status == 200) {
          const responseData = await responses[0].json();
          this.processQadSalesOrderInfo(responseData);
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

  //Modify the initial class properties based on retrieved data from API
  processQadSalesOrderInfo(response) {
    console.log("calling from processQadSalesOrderInfo, response: ", response)
    if(response.result.status == "Error") {
        this.setState({
            isLoaded: true,
            error: response.result.message
        }, () => {
        });
        return
    }

    var resultData = response['result'][this.state.orderNumber]['line_details'];
    var isConfirmed = response['result'][this.state.orderNumber]['is_confirmed'];
    var channel = response['result'][this.state.orderNumber]['channel'];
    var activeUserSgid = '';
    var userStatusSgid = '';
    var orderStatusText = '';
    var isActiveUserSecurityRoleExist = false;
    var isFormDisabled = false;
    
    var windowSSOUser = window.ssouser.toUpperCase();

    if (response['result']['active_user_roles_info']) {
        activeUserSgid = response['result']['active_user_roles_info']['sgid'];
    }

    if (response['result']['user_status']) {
        userStatusSgid = response['result']['user_status']['sgid'];
    }
    
    if (window.ssouser && activeUserSgid === windowSSOUser && userStatusSgid == windowSSOUser) {
        isActiveUserSecurityRoleExist = true
    }

    this.destructureItems(resultData);

    if (isConfirmed) {
        orderStatusText = 'Order modification is not possible because Order is already confirmed!'
    }

    if (!isConfirmed && !isActiveUserSecurityRoleExist) {
        orderStatusText = 'Order modification is not possible because you are not authorized to edit the sales order!'
    }

    if (isConfirmed || !isActiveUserSecurityRoleExist) {
        isFormDisabled = true;
    }

    this.setState({
        isLoaded: true,
        items: response['result'][this.state.orderNumber]['line_details'],
        responseFromQAD: response,
        orderNumber: this.state.orderNumber,
        isConfirmed: isConfirmed,
        channel: channel,
        error: '',
        orderStatus: orderStatusText,
        isActiveUserSecurityRoleExist: isActiveUserSecurityRoleExist,
        isFormDisabled: isFormDisabled
    }, () => {
    });
  }

  //Process the items by due date and filter out Lisec items
  destructureItems(resultData) {
    const map = new Map();
    const itemMap = new Map();
    const itemSetMap = new Map();
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
                if (itemElement['description'] && itemElement['description'].toUpperCase() == 'IGU') {
                    validIguItemsSet.add(itemElement['item'])
                }
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
  }

  //Get the reference tags by list of lisec items
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

  //Structure the data mapping by item to fed into table
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
    const formattedItems = Array.from(formattedMappedResultFinal).map(([key, value]) => ({key, value}))

    var index = 0
    formattedItems.forEach(item => {
        item['id'] = index
        index += 1
        item['is_item_editable'] = false
    })

    existingRefTagsByOrderItem.forEach(refTagElement => {
        var item = refTagElement['order_no'] + '-' + refTagElement['item_no']

        formattedItems.forEach(itemElement => {
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
            { formattedItemsByItem: formattedItems },
            () => {
                console.log("calling from getFormatteditemsByDueDate, this.state.itemsByDueDate: ", this.state.itemsByDueDate)
                console.log("calling from getFormatteditemsByDueDate, this.state.formattedItemsByItem: ", this.state.formattedItemsByItem)
                this.updateSumOfIguByRow();
                this.updateSumOfIguByColumn();
            }
        );
    })
  }

  //Keep track of any change to notify user when tries to close or refresh the browser window
  getOrderModificationStatus(){
    return (this.state.isNewDueDateAdded || this.state.isOrderQuantityUpdated || this.state.isNewItemAdded || this.state.isItemNumberModified
    || this.state.isDueDateModified || this.state.isPromiseDateModified || this.state.isDueDateDeleted || this.state.isItemDeleted)
  }

  //Search for sales order in QAD
  searchOrderDetails = (event) => {
    event.preventDefault();

    if (this.state.orderNumber && this.getOrderModificationStatus()) {
        let text = "Changes you made may not be saved! Do you still want to proceed?";
        if (window.confirm(text) == false) {
            return;
        }
    }

    this.setState({
        itemsByDueDate: [],
        isLoaded: false,
        error: '',
        orderStatus: '',
        formattedItemsByItem: [],
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
    }, () => {

    })

    if (this.state.orderNumber.length === 7 && (this.state.orderNumber[0] == 'L' || this.state.orderNumber[0] == 'Q')) {
        this.fetchAllData();
    }
    else {
        this.setState({
            isLoaded: true
        }, () => {

        })
        alert("Please enter a valid order number");
        event.preventDefault();
    }
  }

  //Set the order number from the input
  setOrderNumber = (event) => {
    var orderNumber = event.target.value;
    this.setState({
        orderNumber: orderNumber
    }, () => {
    });
  }

  //Get next available date to set in the table
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

  //Get next available promise date to set in the table
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

  //Add new due date and relevant data in the table when user clicks to add due date
  addNewDueDate = () => {
    var nextAvailableDate = this.getNextAvailableDate();
    var nextAvailablePromiseDate = this.getNextAvailablePromiseDate();

    var existingItemsByDueDate = JSON.parse(JSON.stringify(this.state.itemsByDueDate));

    var existingItems = JSON.parse(JSON.stringify(this.state.formattedItemsByItem));
    var existingUniqueDates = JSON.parse(JSON.stringify(this.state.listOfUniqueDates));
    var existingUniqueDueDates = JSON.parse(JSON.stringify(this.state.listOfUniqueDueDates));
    var existingPromiseDates = JSON.parse(JSON.stringify(this.state.listOfPromiseDates));

    // console.log("calling from addNewDueDate, existingItems: ", existingItems)

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
        "id": nextRank+1,
        "dueDate": nextAvailableDate,
        "promiseDate": nextAvailablePromiseDate
    })

    existingPromiseDates.push({
        "promiseDate": nextAvailablePromiseDate,
        "promiseDateIndex": existingPromiseDates.length,
        "dueDate": nextAvailableDate
    })
    
    //this.context.addNewDueDate(existingItemsByDueDate);

    this.setState({itemsByDueDate: existingItemsByDueDate, isNewDueDateAdded: true, formattedItemsByItem: existingItems, listOfUniqueDates: existingUniqueDates, 
        dueDatesColspan: existingUniqueDates.length, listOfPromiseDates: existingPromiseDates,
        listOfUniqueDueDates: existingUniqueDueDates
    }, () => {
        this.updateSumOfIguByRow();
        this.updateSumOfIguByColumn();
    })
  }

  //Add new item and relevant data in the table when user clicks to add item
  addNewItem = () => {
    var existingItems = JSON.parse(JSON.stringify(this.state.formattedItemsByItem));
    var existingItemsByDueDate = JSON.parse(JSON.stringify(this.state.itemsByDueDate));

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

    this.setState({formattedItemsByItem: existingItems, itemsByDueDate: existingItemsByDueDate, isNewItemAdded: true}, () => {
        this.updateSumOfIguByRow();
        this.updateSumOfIguByColumn();
        // this.context.addNewItem(existingItemsByDueDate);
    })
  }

  //Update the total quantity by item when any order quantity changes
  updateSumOfIguByRow() {
    let sumOfIgusByRow = []
    let sumOfOrderQuantity = 0
    this.state.formattedItemsByItem.forEach(item => {
        let items = item['value']
        let sum = 0;
        let id = item['id']

        if(item['key'].includes("-"))
        {
            items.forEach(itemElement => {
                if (itemElement['description'] && itemElement['description'].toUpperCase() == 'IGU') {
                    sum += parseInt(itemElement['order_qty'])
                }
                else {
                    const splittedArray = item['key'].split("-");
                    if (splittedArray.length==2) {
                        sum += parseInt(itemElement['order_qty'])
                    }
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

  //Update the quantity by due date when any order quantity changes
  updateSumOfIguByColumn() {
      let sumOfIgusByColumn = []
      this.state.listOfUniqueDates.forEach(element => {
          let sum = 0;
          this.state.formattedItemsByItem.forEach(item => {
              let items = item['value']
              items.forEach(itemElement => {
                  if (itemElement['due_date'] === element['key']) {
                      if(item['key'].includes("-"))
                      {
                          if (itemElement['description'] && itemElement['description'].toUpperCase() == 'IGU') {
                              sum += parseInt(itemElement['order_qty'])
                          }
                          else {
                              const splittedArray = item['key'].split("-");
                              if (splittedArray.length==2) {
                                  sum += parseInt(itemElement['order_qty'])
                              }
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

  //Add or modify item in the table and its relevant data structure
  onChangeItemInput = (e, id, key) => {
    var existingItems = JSON.parse(JSON.stringify(this.state.formattedItemsByItem));
    var existingItemsByDueDate = JSON.parse(JSON.stringify(this.state.itemsByDueDate));

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
        formattedItemsByItem: existingItems, itemsByDueDate: existingItemsByDueDate, isItemNumberModified: true
    }, () => {
        this.updateSumOfIguByRow()
        this.updateSumOfIguByColumn()
        //this.context.onChangeItemInput(existingItemsByDueDate);
    })
  }

  //Once an item is entered and if the item is valid lisec item, it will retrieve reference tag on blur
  onBlurItemInput = (e, id, key) => {
    var existingItems = JSON.parse(JSON.stringify(this.state.formattedItemsByItem));

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
        this.getReferenceTagsBySingleOrderItem(key)
    }
  }

  //Get the reference tag by single order item
  getReferenceTagsBySingleOrderItem(orderItem) {
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
        var existingItems = JSON.parse(JSON.stringify(this.state.formattedItemsByItem));
        var existingItemsByDueDate = JSON.parse(JSON.stringify(this.state.itemsByDueDate));

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
          formattedItemsByItem: existingItems,
          itemsByDueDate: existingItemsByDueDate, 
          isItemNumberModified: true
        }, () => {
            this.updateSumOfIguByRow()
            this.updateSumOfIguByColumn()
        })
    })
    .catch((err) => {
    });
  }

  //Modify data structure when any order quantity changes
  onChangeOrderQuantityInput = (e, id, key, due_date) => {
    var existingItem = JSON.parse(JSON.stringify(this.state.formattedItemsByItem));
    var existingItemsByDueDate = JSON.parse(JSON.stringify(this.state.itemsByDueDate));

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

    this.setState({formattedItemsByItem: existingItem, itemsByDueDate: existingItemsByDueDate, isOrderQuantityUpdated: true}, () => {
        this.updateSumOfIguByRow();
        this.updateSumOfIguByColumn();
    })
  }

  //Modify data structure when any item is deleted
  handleDeleteByItem = (e, id, key) => {
    var existingItem = JSON.parse(JSON.stringify(this.state.formattedItemsByItem));
    var existingItemsByDueDate = JSON.parse(JSON.stringify(this.state.itemsByDueDate));

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

    this.setState({formattedItemsByItem: modifiedData, itemsByDueDate: existingItemsByDueDate, isItemDeleted: true }, () => {
        this.updateSumOfIguByRow();
        this.updateSumOfIguByColumn();
    })
  }

  //Modify data structure when any due date is deleted
  handleDeleteByDueDate = (e, dueDateKey, promiseDateKey) => {
    var existingItem =  JSON.parse(JSON.stringify(this.state.formattedItemsByItem));
    var existingItemsByDueDate = JSON.parse(JSON.stringify(this.state.itemsByDueDate));

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

    this.setState({formattedItemsByItem: existingItem, listOfUniqueDates: existingUniqueDates,
    listOfUniqueDueDates: existingUniqueDueDates, listOfPromiseDates: existingPromiseDates, itemsByDueDate: existingItemsByDueDate, isDueDateDeleted: true}, () => {
        this.updateSumOfIguByRow();
        this.updateSumOfIguByColumn();
    })
  }

  //Verify data before sending to QAD and call intermediary method to process data to QAD
  submitOrderDetailsToQAD = (event) => {
    event.preventDefault();

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
  }

  //API end point call to process updated data to QAD
  //version 1
  submitOrderDetailsToQADAPI() {
    this.setState({
        isSubmitButtonLoading: true
    }, () => {})

    console.log("calling from submitOrderDetailsToQADAPI, this.state.itemsByDueDate: ", this.state.itemsByDueDate)

    // baseAPIURLTest, baseAPIURL
    //fetch('http://127.0.0.1:5000/api/send_req_items_for_cs', {
    fetch(baseAPIURL + 'send_req_items_for_soe', {
        method: 'POST',
        body: JSON.stringify({
            orderNumber: this.state.orderNumber,
            salesOrderInfoFromQad: this.state.responseFromQAD,
            itemsByDueDate: this.state.itemsByDueDate,
            //isValidLisecItemsAvailable: this.state.validLisecItems.length,
            validLisecItems: this.state.validLisecItems,
            channel: this.state.channel,
            sgid: window.ssouser.toUpperCase()
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    })
    .then((res) => res.json())
    .then((response) => {
        console.log("response: ", response);

        if (!response.data.is_valid_qad_user) {
            this.setState({
                isSubmitButtonLoading: false
            }, () => {})

            alert("User: " + window.ssouser + " is not permitted to submit the order")
            return;
        }

        var unVerifiedItems = ""
        if (response.data.list_of_unverified_items && response.data.list_of_unverified_items.length > 0) {
            for (let index = 0; index < response.data.list_of_unverified_items.length; index++) {
                const item = response.data.list_of_unverified_items[index];
                // console.log("item: ", item)
                unVerifiedItems += item;
                unVerifiedItems += ","
            }
            unVerifiedItems = unVerifiedItems.replace(/.$/, '');
            alert("Item " + unVerifiedItems + " does not exist in QAD, so you'll need to correct this before this can be saved.")
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

                var alertMessage = "Data was submitted successfully!"

                if (response.data.qad_error_message) {
                    alertMessage += "But following QAD error returns: " + response.data.qad_error_message
                }
                
                //alert("Data was submitted successfully!")
                alert(alertMessage)

                this.setState({
                    itemsByDueDate: [],
                    isLoaded: false,
                    error: '',
                    formattedItemsByItem: [],
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

  //Test version
//   submitOrderDetailsToQADAPI() {
//     this.setState({
//         isSubmitButtonLoading: true
//     }, () => {})

//     //fetch(baseAPIURL + 'save_soe_log', {
//     fetch('http://127.0.0.1:5000/api/v1/save_soe_log', {
//         method: 'POST',
//         body: JSON.stringify({
//             orderNumber: this.state.orderNumber,
//             responseFromQAD: this.state.responseFromQAD,
//             itemsByDueDate: this.state.itemsByDueDate,
//             //isValidLisecItemsAvailable: this.state.validLisecItems.length,
//             validLisecItems: this.state.validLisecItems,
//             channel: this.state.channel
//         }),
//         headers: {
//             'Content-type': 'application/json; charset=UTF-8',
//         }
//     })
//     .then((res) => res.json())
//     .then((response) => {
//     })
//     .catch((err) => {
//         console.log("error: ", err);
//         this.setState({
//             isSubmitButtonLoading: false
//         }, () => {})
//         alert("Data was not submitted successfully!Please contact administrator!")
//     });

//     // baseAPIURLTest, baseAPIURL
//     //fetch('http://127.0.0.1:5000/api/send_req_items_for_cs', {
//     // fetch(baseAPIURL + 'send_req_items_for_cs', {
//     //     method: 'POST',
//     //     body: JSON.stringify({
//     //         orderNumber: this.state.orderNumber,
//     //         itemsByDueDate: this.state.itemsByDueDate,
//     //         //isValidLisecItemsAvailable: this.state.validLisecItems.length,
//     //         validLisecItems: this.state.validLisecItems,
//     //         channel: this.state.channel
//     //     }),
//     //     headers: {
//     //         'Content-type': 'application/json; charset=UTF-8',
//     //     }
//     // })
//     // .then((res) => res.json())
//     // .then((response) => {
//     //     console.log("response: ", response);
//     //     var unVerifiedItems = ""
//     //     if (response.data.list_of_unverified_items && response.data.list_of_unverified_items.length > 0) {
//     //         for (let index = 0; index < response.data.list_of_unverified_items.length; index++) {
//     //             const item = response.data.list_of_unverified_items[index];
//     //             // console.log("item: ", item)
//     //             unVerifiedItems += item;
//     //             unVerifiedItems += ","
//     //         }
//     //         unVerifiedItems = unVerifiedItems.replace(/.$/, '');
//     //         alert("Item " + unVerifiedItems + " does not exist in QAD, so you'll need to correct this before this can be saved.")
//     //         this.setState({
//     //             isSubmitButtonLoading: false
//     //         }, () => {})
//     //     }
//     //     else
//     //     {
//     //         if (response.data.is_confirmed) {
//     //             this.setState({
//     //                 isSubmitButtonLoading: false
//     //             }, () => {})
                
//     //             alert("Sales order is already confirmed! Data can not be submitted to QAD!")
//     //         }
//     //         else if (response.data.status == 'success') {
//     //             this.setState({
//     //                 isSubmitButtonLoading: false
//     //             }, () => {})

//     //             var alertMessage = "Data was submitted successfully!"

//     //             if (response.data.qad_error_message) {
//     //                 alertMessage += "But following QAD error returns: " + response.data.qad_error_message
//     //             }
                
//     //             //alert("Data was submitted successfully!")
//     //             alert(alertMessage)

//     //             this.setState({
//     //                 itemsByDueDate: [],
//     //                 isLoaded: false,
//     //                 error: '',
//     //                 formattedItemsByDueDate: [],
//     //                 listOfPromiseDates:[],
//     //                 listOfUniqueDates:[],

//     //                 isNewDueDateAdded: false,
//     //                 isOrderQuantityUpdated: false,
//     //                 isNewItemAdded: false,
//     //                 isItemNumberModified: false,
//     //                 isDueDateModified: false,
//     //                 isPromiseDateModified: false,
//     //                 isDueDateDeleted: false,
//     //                 isItemDeleted: false
//     //             }, () => {
//     //                 this.fetchAllData();
//     //             })
//     //         }
//     //     }
//     // })
//     // .catch((err) => {
//     //     console.log("error: ", err);
//     //     this.setState({
//     //         isSubmitButtonLoading: false
//     //     }, () => {})
//     //     alert("Data was not submitted successfully!Please contact administrator!")
//     // });
//   }

  //Check for duplicate due date when adding a new due date
  checkForDuplicateDate(key) {
    var existingItem = this.state.formattedItemsByItem;

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

  //Modify the data structure when a new due date is added.
  onChangeDateInput = (e, dueDateKey, promiseDateKey) => {
    var newDateKey = e.getFullYear() + "-" + (e.getMonth()+1).toString().padStart(2,'0') + "-" + e.getDate().toString().padStart(2,'0') + "T00:00:00.000Z"
    var isDuplicateDateFound = this.checkForDuplicateDate(newDateKey);

    if (isDuplicateDateFound) {
        alert("Same date exist in the table!")
        return;
    }

    var existingItem = JSON.parse(JSON.stringify(this.state.formattedItemsByItem));
    var existingItemsByDueDate = JSON.parse(JSON.stringify(this.state.itemsByDueDate));

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

    this.setState({formattedItemsByItem: existingItem, listOfUniqueDates: existingUniqueDates, listOfUniqueDueDates: existingUniqueDueDates,
        listOfPromiseDates: existingPromiseDates, itemsByDueDate: existingItemsByDueDate, isDueDateModified: true}, () => {
        // this.context.onChangeDateInput(existingItemsByDueDate);
        this.updateSumOfIguByColumn();
    })
  }

  //Modify the data structure when a promise date is modified.
  onChangePromiseDateInput = (e, keyIndex, dueDateKey) => {
    var newPromiseDateKey = e.getFullYear() + "-" + (e.getMonth()+1).toString().padStart(2,'0') + "-" + e.getDate().toString().padStart(2,'0') + "T00:00:00.000Z"

    var existingItem = JSON.parse(JSON.stringify(this.state.formattedItemsByItem));
    var existingItemsByDueDate = JSON.parse(JSON.stringify(this.state.itemsByDueDate));

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

    this.setState({formattedItemsByItem: existingItem, listOfPromiseDates: existingPromiseDates, itemsByDueDate: existingItemsByDueDate, isPromiseDateModified: true}, () => {
    })
  }

  render() {
    return (
      <Container fluid>
        <h1 className="text-center">Welcome To Sales Order Editor</h1>
        <Form className='form-inline' onSubmit={this.searchOrderDetails}>
            <Form.Control
                maxLength={7}
                type='input'
                placeholder="Order Number"
                onChange={this.setOrderNumber}
                value={this.state.orderNumber}
            />
            <Button disabled={this.state.isSubmitButtonLoading} type="submit">
                Search <FontAwesomeIcon icon={faSearch} />
            </Button>
        </Form>
        {
          this.state.orderStatus.length !== 0 &&
          <>
            <h2>Order Status</h2>
            <h4>{this.state.orderStatus}</h4>
          </>
        }
        <br />
        {
          this.state.isLoaded && this.state.formattedItemsByItem.length > 0 &&
          <h2>Order by Due Date</h2>
        }

        <>
            {
              !this.state.isLoaded &&
              <LoadingSpinner />
            }
            {
              this.state.isLoaded && this.state.error.length !== 0 &&
              <p>{this.state.error}</p>
            }
            {
              this.state.isLoaded && this.state.error.length === 0 &&
              this.state.formattedItemsByItem.length > 0 &&
              <Table className='text-center' striped bordered hover size="sm" style={{ position: 'relative', borderColor: '#BDC3C7', width: '10%', borderCollapse: 'separate', padding: '0px'}}>
                  {/* change top to 0 when deploying locally and 50px when deploying to vanna */}
                  <thead style={{ position: 'sticky', top: '50px', backgroundColor: '#f5f7f7', zIndex: 1, padding: '0px' }}>
                      <tr>
                          <th style={{position: 'sticky', left: '0px', padding: '0px', backgroundColor: '#f5f7f7', textAlign: 'center'}}>
                              {
                                  !this.state.isFormDisabled && 
                                  <Button style={{height: '26px', padding: '4px'}} className='mx-1' disabled={this.state.isSubmitButtonLoading} onClick={this.addNewDueDate}>
                                      <FontAwesomeIcon icon={faPlus} /> Due Date 
                                  </Button>
                              }
                          </th>
                          <th style={{position: 'sticky', left: '152px', textAlign: 'right', width: '100px', padding: '0px', backgroundColor: '#f5f7f7' }}>
                              Due Dates
                          </th>
                          {
                              this.state.listOfUniqueDueDates.map(({dueDate, promiseDate}) => (
                                  <th key={dueDate} style={{ padding: '0px' }}>
                                      <div style={{ width: '80px', margin: 'auto'}}>
                                          <DatePicker
                                              selected={new Date(dueDate.replace("T00:00:00.000Z", 'T18:00:00.000Z'))}
                                              type="date"
                                              onChange={(e) => this.onChangeDateInput(e, dueDate, promiseDate)}
                                              className="text-center"
                                              disabled={this.state.isFormDisabled || this.state.isSubmitButtonLoading}
                                              data-toggle='tooltip'
                                              data-placement='top'
                                              title='Due Date'
                                              dateFormat={"MM/dd/yyyy"}
                                              customInput={
                                                  <input
                                                      type="text"
                                                      style={{width: '80px', margin: 'auto'}}
                                                  />
                                              }
                                              style={{position: 'static'}}
                                          />
                                      </div>
                                  </th>
                              ))
                          }
                          <th style={{ backgroundColor: '#f5f7f7' }}></th>
                          <th style={{ backgroundColor: '#f5f7f7' }}></th>
                      </tr>
                      <tr style={{ backgroundColor: '#f5f7f7', padding: '0px' }}>
                          <th style={{position: 'sticky', left: '0px', textAlign: 'center', padding: '0px', backgroundColor: '#f5f7f7'}}></th>
                          <th style={{position: 'sticky', left: '152px', textAlign: 'right', padding: '0px', backgroundColor: '#f5f7f7' }}>Promise Dates</th>
                          {
                              this.state.listOfPromiseDates.map(({promiseDate, promiseDateIndex, dueDate}) => (
                                  <th key={promiseDateIndex} style={{ padding: '0px' }}>
                                      <DatePicker
                                          selected={new Date(promiseDate.replace("T00:00:00.000Z", 'T18:00:00.000Z'))}
                                          type="date"
                                          onChange={(e) => this.onChangePromiseDateInput(e, promiseDateIndex, dueDate)}
                                          className="text-center"
                                          disabled={this.state.isFormDisabled || this.state.isSubmitButtonLoading}
                                          size='sm'
                                          data-toggle='tooltip'
                                          data-placement='top'
                                          title='Promise Date'
                                          dateFormat={"MM/dd/yyyy"}
                                          customInput={
                                              <input
                                                type="text"
                                                style={{width: '80px'}}
                                              />
                                          }
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
                                  <th key={promiseDateIndex} style={{padding: '0px'}}><p style={{ marginTop: '0em', marginBottom: '0em', textAlign: 'center' }}>Quantity</p></th>
                              ))
                          }
                          <th style={{padding: '0px'}}><p style={{ width: '114px', marginTop: '0em', marginBottom: '0em', textAlign: 'center' }}>Total Quantity</p></th>
                          <th style={{ textAlign: 'center', padding: '0px' }}>Remove</th>
                      </tr>
                  </thead>
                  <tbody>
                      {this.state.formattedItemsByItem.map(({key, value, id, reference_tag, is_item_editable}) => (
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
                                      disabled={this.state.isFormDisabled || this.state.isSubmitButtonLoading || !is_item_editable}
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
                                              disabled={this.state.isFormDisabled || this.state.isSubmitButtonLoading}
                                              // max="100"
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
                                      disabled={this.state.isFormDisabled || this.state.isSubmitButtonLoading} 
                                      variant="danger" 
                                      onClick={(e) => this.handleDeleteByItem(e, id, key)}
                                      data-toggle='tooltip'
                                      data-placement='top'
                                      title='Remove'>
                                      {/* x */}
                                      <FontAwesomeIcon icon={faTrashAlt} />
                                  </Button>
                              </td>
                          </tr>
                      ))}
                      {
                          this.state.listOfUniqueDates.length>=1 && 
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
                          this.state.listOfUniqueDates.length>=1 && 
                          <tr>
                              <td style={{ position: 'sticky', backgroundColor: 'white', left: '0px', padding:'0px' }}>
                                  {
                                      !this.state.isFormDisabled && 
                                      <Button style={{height: '20px', width:'60px', padding: '0px'}} className='mx-1' disabled={this.state.isSubmitButtonLoading} onClick={this.addNewItem}>
                                          <FontAwesomeIcon icon={faPlus} /> Item
                                      </Button>
                                  }
                              </td>
                              <td style={{ position: 'sticky', backgroundColor: 'white', left: '152px' }}></td>
                              {
                                  this.state.listOfUniqueDueDates.map(({dueDate, promiseDate}) => (
                                      <td key={dueDate} style={{padding: '0px'}}>
                                          <Button 
                                              style={{ width: '25px', height: '20px', fontSize: '10px', padding: '2px 2px' }}
                                              disabled={this.state.isFormDisabled || this.state.isSubmitButtonLoading} 
                                              variant="danger" 
                                              onClick={(e) => this.handleDeleteByDueDate(e, dueDate, promiseDate)}
                                              data-toggle='tooltip'
                                              data-placement='top'
                                              title='Remove'>
                                              {/* x */}
                                              <FontAwesomeIcon icon={faTrashAlt} />
                                          </Button>
                                      </td>
                              ))}
                              <td></td>
                              <td></td>
                          </tr>
                      }
                  </tbody>
              </Table>
            }
        </>
        <>
          <div className='text-center mx-2'>
            {
              !this.state.isFormDisabled && !this.state.isSubmitButtonLoading && this.state.isLoaded && this.state.formattedItemsByItem.length > 0 &&
              <Button disabled={this.state.isFormDisabled} onClick={this.submitOrderDetailsToQAD} variant="primary" size="sm">
                Save to QAD <FontAwesomeIcon icon={faFloppyDisk} />
              </Button>
            }
            {
              this.state.isSubmitButtonLoading &&
              <Button variant="primary" disabled>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Submitting...
              </Button>
            }
          </div>
        </>
      </Container>
    )
  }
}

export default ComplexShipping;