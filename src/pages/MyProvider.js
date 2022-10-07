import MyContext from './MyContext';
import React from 'react';

const baseAPIURL = "https://vanna.zh.if.atcsg.net:453/api/v1/"

const baseAPIURLTest = "http://127.0.0.1:5000/api/"

class MyProvider extends React.Component {
    state = {
        error: '',
        isLoaded: true,
        items: [],
        itemsByDueDateMap: new Map(),
        itemsByDueDate: [],
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

    processDataFetch(response) {
        if(response.result.status == "Error") {
            console.log("processDataFetch error")
            this.setState({
                isLoaded: true,
                error: response.result.message
            }, () => {
                console.log("calling from processDataFetch, error: ", this.state.error)
            });
            return
        }

        console.log("calling from processDataFetch, response: ", response)

        var resultData = response['result'][this.state.orderNumber]['line_details'];
        var is_confirmed = response['result'][this.state.orderNumber]['is_confirmed'];
        var channel = response['result'][this.state.orderNumber]['channel'];
        var orderStatusText = ''

        this.destructureItems(resultData);

        if (is_confirmed) {
            orderStatusText = 'Order modification is not possible because Order is already confirmed!'
        }
        // else
        // {
        //     if (resultData && resultData.length != 0) {
        //         orderStatusText = 'Order modification is possible because Order is not confirmed yet!'
        //     }
        // }

        this.setState({
            isLoaded: true,
            items: response['result'][this.state.orderNumber]['line_details'],
            orderNumber: this.state.orderNumber,
            isConfirmed: is_confirmed,
            channel: channel,
            error: '',
            orderStatus: orderStatusText
        }, () => {
            console.log("orderStatus: ", this.state.orderStatus)
        });
    }

    processValidLisecOrderItems(response) {
        var returnedData = response['result']['data']
        console.log("returnedData: ", returnedData)
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
                console.log("calling from processValidQADOrderItems, this.state.validItems: ", this.state.validItems)
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
            const responses = await Promise.all([this.dataFetch(), this.getValidLisecOrderItems(), this.getValidQADOrderItems()]);
        
            if (responses[0].status == 200) {
                const anotherPromise1 = await responses[0].json();
                console.log("anotherPromise1: ", anotherPromise1)
                this.processDataFetch(anotherPromise1);
            }
            if (responses[1].status == 200) {
                const anotherPromise2 = await responses[1].json();
                console.log("anotherPromise2: ", anotherPromise2)
                this.processValidLisecOrderItems(anotherPromise2)
            }
            if (responses[2].status == 200) {
                const anotherPromise3 = await responses[2].json();
                console.log("anotherPromise3: ", anotherPromise3)
                this.processValidQADOrderItems(anotherPromise3)
            }
            
        }catch(error) {
            console.log("Erroring out, error: ", error);
            
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

    getDemoData(order_number) {
        //L191953
        var data = ""
        
        if (order_number === 'L191953') {
            return {"result":{"L191953":{"crate_language":"","crates":null,"is_confirmed":true,"lid_required":false,"line_details":[],"sales_order_number":"L191953","special_instructions":""},"status":"Success"}}   
        }
        else if (order_number === 'L210636') {
            return {"result":{"L210636":{"crate_language":"","crates":{"CR21000002":{"211219-12-C":{"quantity":1},"actual_gross_weight":5,"crate_type ":"P","location":"CC-TGT"},"CR21000008":{"210636-10":{"quantity":1},"210636-12":{"quantity":1},"actual_gross_weight":0,"crate_type ":"P","location":"R1A1"},"CR21000013":{"210636-16":{"quantity":1},"actual_gross_weight":0,"crate_type":"P","location":"HVMST05"}," CR21000015":{"210636-16":{"quantity":1},"actual_gross_weight":0,"crate_type":"P","location":"CR"},"CR22000024":{"210636-16":{"quan tity":1},"211068-1":{"quantity":1},"actual_gross_weight":0,"crate_type":"S","location":"CARRESEQ"},"CR22000026":{"210636-16":{"qua ntity":1},"actual_gross_weight":0,"crate_type":"P","location":"CARRESEQ"},"CR22000027":{"210636-16":{"quantity":1},"actual_gross_w eight":0,"crate_type":"P","location":"CARRESEQ"},"CR22000029":{"210636-16":{"quantity":1},"actual_gross_weight":0,"crate_type":"S" ,"location":"CARRESEQ"},"CR22000031":{"210636-16":{"quantity":1},"actual_gross_weight":0,"crate_type":"P","location":"CARRESEQ"}," CR22000032":{"210636-16":{"quantity":1},"actual_gross_weight":0,"crate_type":"Q","location":"CARRESEQ"},"CR22000033":{"210636-16": {"quantity":1},"actual_gross_weight":0,"crate_type":"P","location":"CARRESEQ"}},"is_confirmed":true,"item_details":{"210636-10":{" count_of_devices_packed":1},"210636-11":{"count_of_devices_packed":0},"210636-12":{"count_of_devices_packed":1},"210636-13":{"coun t_of_devices_packed":0},"210636-14":{"count_of_devices_packed":0},"210636-15":{"count_of_devices_packed":0},"210636-16":{"count_of _devices_packed":9},"210636-7":{"count_of_devices_packed":0}},"lid_required":false,"line_details":[{"item":"210636-7","order_qty": 13,"shipped_qty":0,"shipping_date":"2021-10-11T00:00:00.000Z"},{"item":"210636-10","order_qty":9,"shipped_qty":0,"shipping_date":" 2021-10-11T00:00:00.000Z"},{"item":"210636-11","order_qty":9,"shipped_qty":0,"shipping_date":"2021-10-11T00:00:00.000Z"},{"item":" 210636-12","order_qty":9,"shipped_qty":0,"shipping_date":"2021-10-11T00:00:00.000Z"},{"item":"210636-13","order_qty":9,"shipped_qt y":0,"shipping_date":"2021-10-11T00:00:00.000Z"},{"item":"210636-14","order_qty":9,"shipped_qty":0,"shipping_date":"2021-10-11T00: 00:00.000Z"},{"item":"210636-15","order_qty":9,"shipped_qty":0,"shipping_date":"2021-10-11T00:00:00.000Z"},{"item":"210636-16","or der_qty":13,"shipped_qty":0,"shipping_date":"2021-10-11T00:00:00.000Z"}],"sales_order_number":"L210636","special_instructions":""} ,"status":"Success"}}
        }
        else if (order_number === 'L200401') {
            return {"result":{"L200401":{"crate_language":"","crates":null,"is_confirmed":false,"item_details":{"200401-1":{"count_of_devices_packed" :0},"200401-10":{"count_of_devices_packed":0},"200401-11":{"count_of_devices_packed":0},"200401-12":{"count_of_devices_packed":0}, "200401-13":{"count_of_devices_packed":0},"200401-14":{"count_of_devices_packed":0},"200401-2":{"count_of_devices_packed":0},"2004 01-3":{"count_of_devices_packed":0},"200401-4":{"count_of_devices_packed":0},"200401-5":{"count_of_devices_packed":0},"200401-6":{ "count_of_devices_packed":0},"200401-7":{"count_of_devices_packed":0},"200401-8":{"count_of_devices_packed":0},"200401-9":{"count_ of_devices_packed":0}},"lid_required":false,"line_details":[{"item":"200401-1","order_qty":1,"shipped_qty":0,"shipping_date":"2020 -06-01T00:00:00.000Z"},{"item":"200401-2","order_qty":1,"shipped_qty":0,"shipping_date":"2020-06-01T00:00:00.000Z"},{"item":"20040 1-3","order_qty":1,"shipped_qty":0,"shipping_date":"2020-06-01T00:00:00.000Z"},{"item":"200401-4","order_qty":1,"shipped_qty":0,"s hipping_date":"2020-06-01T00:00:00.000Z"},{"item":"200401-5","order_qty":1,"shipped_qty":0,"shipping_date":"2020-06-01T00:00:00.00 0Z"},{"item":"200401-6","order_qty":1,"shipped_qty":0,"shipping_date":"2020-06-01T00:00:00.000Z"},{"item":"200401-7","order_qty":1 ,"shipped_qty":0,"shipping_date":"2020-06-01T00:00:00.000Z"},{"item":"200401-8","order_qty":1,"shipped_qty":0,"shipping_date":"202 0-06-01T00:00:00.000Z"},{"item":"200401-9","order_qty":6,"shipped_qty":0,"shipping_date":"2020-06-01T00:00:00.000Z"},{"item":"2004 01-10","order_qty":12,"shipped_qty":0,"shipping_date":"2020-06-01T00:00:00.000Z"},{"item":"200401-11","order_qty":4,"shipped_qty": 0,"shipping_date":"2020-06-01T00:00:00.000Z"},{"item":"200401-12","order_qty":8,"shipped_qty":0,"shipping_date":"2020-06-01T00:00: 00.000Z"},{"item":"200401-13","order_qty":2,"shipped_qty":0,"shipping_date":"2020-06-01T00:00:00.000Z"},{"item":"200401-14","order _qty":4,"shipped_qty":0,"shipping_date":"2020-06-01T00:00:00.000Z"}],"sales_order_number":"L200401","special_instructions":""},"st atus":"Success"}}
        }

        return data;
    }

    destructureItems(resultData) {
        const map = new Map();

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
        })

        const mappedResult = Array.from(map).map(([key, value]) => ({key, value}))

        mappedResult.forEach(element => {
            element['isDateEditable'] = false
        })
    
        this.setState(
            { itemsByDueDate: mappedResult, itemsByDueDateMap:  map}, 
            () => console.log("calling from destructureItems in MyProvider, map: ", this.state.itemsByDueDate)
        );
    }

    render() {
        return (
            <MyContext.Provider
                value={{
                    getTest: (due_date, selectedItems) => {
                        var existingItemByDueDate = Object.assign([], this.state.itemsByDueDate);
                        var existingItemByDueDateMap = this.state.itemsByDueDateMap;
                        
                        var existingItems = []

                        var existingItems = existingItemByDueDate.filter(item => item.key == due_date)[0]['value'];
                        
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
                            if(existingItemByDueDate[index]['key'] == due_date) {
                                existingItemByDueDate[index]['value'] = Object.assign([], modifiedData);
                                break
                            }
                        }
                        
                        existingItemByDueDateMap.set(due_date, modifiedData)
                    },

                    setOrderNumber: (event) => {
                        var orderNumber = event.target.value;
                        this.setState({
                            orderNumber: orderNumber
                        }, () => {
                            
                        });
                    },
                    
                    setDueDate: (event, due_date_key) => {
                        console.log("calling from setDueDate in MyProvider, event: ", event.target.value, ", due_date_key: ", due_date_key)
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
                            console.log("calling from setDueDate, before existingDataMap: ", existingDataMap)
                            existingDataMap.delete(modifiedISODate)
                            console.log("calling from setDueDate, after existingDataMap: ", existingDataMap)

                            var existingItemsByDueDate = this.state.itemsByDueDate
                            for (let index = 0; index < existingItemsByDueDate.length; index++) {
                                if (existingItemsByDueDate[index]['key'] == modifiedISODate) {
                                    existingItemsByDueDate[index]['key'] = modifiedDate;
                                    break;
                                }
                            }

                            this.setState(
                                { itemsByDueDate: existingItemsByDueDate, itemsByDueDateMap: existingDataMap}, 
                                () => console.log("calling from setDueDate in MyProvider, itemsByDueDateMap: ", this.state.itemsByDueDateMap, ", itemsByDueDate: ", this.state.itemsByDueDate)
                            );
                        }
                    },

                    searchOrderDetails: (event) => {
                        event.preventDefault();

                        this.setState({
                            itemsByDueDate: [],
                            isLoaded: false,
                            error: '',
                            orderStatus: ''
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
                        console.log("calling from removeItemByDueDate in MyProvider, due_date_key: ", due_date_key, ", selectedItems: ", selectedItems)

                        var existingItemByDueDate = Object.assign([], this.state.itemsByDueDate);
                        var existingItemByDueDateMap = this.state.itemsByDueDateMap;
                        // console.log("calling from getTest in MyProvider, existingItemByDueDate: ", existingItemByDueDate, ", existingItemByDueDateMap: ", existingItemByDueDateMap)
                        
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
                            () => console.log("calling from getTest, this.state.itemsByDueDate: ", this.state.itemsByDueDate, ", this.state.itemsByDueDateMap: ", this.state.itemsByDueDateMap))
                    },
                    insertItemByDueDate: (due_date_key) => {
                        var existingData = this.state.itemsByDueDateMap;
                        var list_of_items = Object.assign([], existingData.get(due_date_key));

                        list_of_items.push({id: list_of_items.length, item: '', order_qty: 0, shipping_date: due_date_key})
                        existingData.set(due_date_key, list_of_items)

                        var existingItemsByDueDate = this.state.itemsByDueDate
                        
                        for (let index = 0; index < existingItemsByDueDate.length; index++) {
                            if (existingItemsByDueDate[index]['key'] == due_date_key) {
                                existingItemsByDueDate[index]['value'] = Object.assign([], list_of_items);
                            }
                        }

                        this.setState(
                            { itemsByDueDate: existingItemsByDueDate, itemsByDueDateMap:  existingData}, 
                            () => console.log("calling from insertItemByDueDate in MyProvider, itemsByDueDateMap: ", this.state.itemsByDueDateMap)
                        );
                    },
                    copyItemsByDueDate: (due_date_key) => {
                        console.log("Copying items, event: ", due_date_key)

                        try {
                            var existingData = this.state.itemsByDueDateMap;
                            
                            let list_of_items = JSON.parse(JSON.stringify(existingData.get(due_date_key)));
                            console.log("list_of_items: ", list_of_items)

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

                            console.log("nextAvailableDate: ", nextAvailableDate)

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
                                () => console.log("calling from copyItemsByDueDate in MyProvider, itemsByDueDateMap: ", this.state.itemsByDueDateMap, ", itemsByDueDate: ", this.state.itemsByDueDate)
                            );

                        } catch (error) {
                            console.log("error: ", error.message);
                        }
                    },
                    submitOrderDetailsToQAD: (event) => {
                        event.preventDefault();

                        console.log("calling from submitOrderDetailsToQAD in MyProvider after preventDefault, itemsByDueDate: ", this.state.itemsByDueDate);

                        if (!this.state.itemsByDueDate.length) {
                            alert("Not enough data to submit to QAD!")
                            return
                        }
                        
                        var isItemDescriptionBlank = false
                        var isItemQuantityBlank = false
                        this.state.itemsByDueDate.forEach(element => {
                            console.log("element: ", element)
                            let items = element['value']
                            for (let index = 0; index < items.length; index++) {
                                const item = items[index];
                                if (!item['item']) {
                                    isItemDescriptionBlank = true
                                    // alert("Item description can not be blank!")
                                    break;
                                }

                                if (item['order_qty'] == 0) {
                                    isItemQuantityBlank = true
                                    // alert("Order quantity can not be zero!")
                                    break;
                                }
                            }
                        })

                        if (isItemDescriptionBlank) {
                            alert("Item description can not be blank!")
                            return;
                        }
                        if (isItemQuantityBlank) {
                            alert("Item quantity can not be zero!")
                            return;
                        }

                        this.setState({
                            isSubmitButtonLoading: true
                        }, () => {})
                        
                        // fetch('http://127.0.0.1:5000/api/send_req_items_for_cs', {
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
                            },
                        })
                        .then((res) => res.json())
                        .then((post) => {
                            console.log("=======Am I here=========");
                            console.log("post: ", post.data);
                            if (post.data == 'success') {
                                this.setState({
                                    isSubmitButtonLoading: false
                                }, () => {})
                                
                                alert("Data was submitted successfully!")

                                this.setState({
                                    itemsByDueDate: [],
                                    isLoaded: false,
                                    error: ''
                                })
                                this.fetchAllData();
                            }
                        })
                        .catch((err) => {
                            console.log(err);
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
                                () => console.log("calling from copyItemsByDueDate in MyProvider, itemsByDueDateMap: ", this.state.itemsByDueDateMap, ", itemsByDueDate: ", this.state.itemsByDueDate)
                            );

                        } catch (error) {
                            console.log("error: ", error.message);
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
                    orderStatus: this.state.orderStatus
                }}
            >
                {this.props.children}
            </MyContext.Provider>
        );
    }
}

export default MyProvider;