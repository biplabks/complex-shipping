import MyContext from './MyContext';
import React from 'react';
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';

class MyProvider extends React.Component {
    state = {
        cars: {
            car001: { name: 'Honda', price: 100 },
            car002: { name: 'BMW', price: 150 },
            car003: { name: 'Mercedes', price: 200 }
        },
        error: '',
        isLoaded: false,
        items: [],
        itemsByDueDateMap: new Map(),
        itemsByDueDate: [],
        orderNumber: '',
        isConfirmed: null,
        validItems: []
    };

    //version 1
    // dataFetch() {
    //     var orderNumber = 'L210636'
    //     fetch("https://vanna.zh.if.atcsg.net:453/api/v1/get-qad-sales-order-info/"+orderNumber)
    //         .then(res => res.json())
    //         .then(
    //         (result) => {
    //             var resultData = result['result'][orderNumber]['line_details'];

    //             console.log("calling from dataFetch in MyProvider, resultData: ", resultData)

    //             // this.destructureItems(resultData);

    //             this.setState({
    //                 isLoaded: true,
    //                 items: result['result'][orderNumber]['line_details'],
    //                 orderNumber: orderNumber
    //             });
    //         },
    //         (error) => {
    //             this.setState({
    //                 isLoaded: true,
    //                 error
    //             });
    //         }
    //     )
    // }

    //version 2
    async dataFetch() {
        // console.log("calling from dataFetch in MyProvider, this.state.orderNumber: ", this.state.orderNumber);
        await fetch("https://vanna.zh.if.atcsg.net:453/api/v1/get-qad-sales-order-info/"+this.state.orderNumber)
          .then(res => res.json())
          .then(
            (result) => {
              var resultData = result['result'][this.state.orderNumber]['line_details'];
              var is_confirmed = result['result'][this.state.orderNumber]['is_confirmed'];
    
            //   console.log("calling from dataFetch in MyProvider, resultData: ", resultData)
            //   console.log("calling from dataFetch in MyProvider, isConfirmed: ", is_confirmed)
    
              this.destructureItems(resultData);
    
              this.setState({
                isLoaded: true,
                items: result['result'][this.state.orderNumber]['line_details'],
                orderNumber: this.state.orderNumber,
                isConfirmed: is_confirmed
              });
            },
            (error) => {
              console.log("error: ", error)
              this.setState({
                isLoaded: true,
                error
              });
            }
        )
    }

    //version 3
    // dataFetch() {
    //     var result = this.getDemoData(this.state.orderNumber);
        
    //     var resultData = result['result'][this.state.orderNumber]['line_details'];
    //     var is_confirmed = result['result'][this.state.orderNumber]['is_confirmed'];

    //     this.destructureItems(resultData);

    //     this.setState({
    //         isLoaded: true,
    //         items: result['result'][this.state.orderNumber]['line_details'],
    //         orderNumber: this.state.orderNumber,
    //         isConfirmed: is_confirmed
    //     });
    // }

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

    // componentDidUpdate(prevProps) {
    //     console.log("calling from componentDidUpdate in MyProvider, this.props.orderNumber: ", this.props.orderNumber)
    //     if(prevProps.orderNumber !== this.props.orderNumber){
    //       // console.log("Hello, I am here for update testing: ", this.props.orderDetails)
    //       this.setState({
    //         orderNumber: this.props.orderNumber
    //       });
    
    //       this.dataFetch();
    //     }
    // }

    // componentDidMount() {
    //     console.log("calling from componentDidMount in MyProvider, this.props.orderNumber: ", this.props.orderNumber)
    //     if (this.props.orderNumber.length !== 7) {
    //         return;
    //     }
    //     this.dataFetch();
    // }

    render() {
        return (
            <MyContext.Provider
                value={{
                    cars: this.state.cars,
                    incrementPrice: selectedID => {
                        const cars = Object.assign({}, this.state.cars);
                        cars[selectedID].price = cars[selectedID].price + 1;
                        this.setState({
                            cars: cars
                        });
                    },
                    decrementPrice: selectedID => {
                        const cars = Object.assign({}, this.state.cars);
                        cars[selectedID].price = cars[selectedID].price - 1;
                        this.setState({
                            cars
                        });
                    },
                    getTest: (due_date, selectedItems) => {
                        // console.log("calling from getTest in MyProvider, due_date: ", due_date, ", selectedItems: ", selectedItems)
                        var existingItemByDueDate = Object.assign([], this.state.itemsByDueDate);
                        var existingItemByDueDateMap = this.state.itemsByDueDateMap;
                        // console.log("calling from getTest in MyProvider, existingItemByDueDate: ", existingItemByDueDate, ", existingItemByDueDateMap: ", existingItemByDueDateMap)
                        
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

                        // console.log("modifiedData: ", modifiedData)

                        for (let index = 0; index < existingItemByDueDate.length; index++) {
                            if(existingItemByDueDate[index]['key'] == due_date) {
                                existingItemByDueDate[index]['value'] = Object.assign([], modifiedData);
                                break
                            }
                        }
                        // console.log("this.state.itemsByDueDate: ", this.state.itemsByDueDate)
                        // console.log("existingItemByDueDate: ", existingItemByDueDate)
                        
                        existingItemByDueDateMap.set(due_date, modifiedData)
                        // this.setState({itemsByDueDate: modifiedData, itemsByDueDateMap: existingItemByDueDateMap}, 
                        //     () => console.log("calling from getTest, this.state.itemsByDueDate: ", this.state.itemsByDueDate, ", this.state.itemsByDueDateMap: ", this.state.itemsByDueDateMap))
                    },
                    //version 1
                    setOrderNumber: (event) => {
                        // console.log("Hello guys, orderNumber: ", event.target.value)
                        // console.log("Hello guys, orderNumber: ", event)
                        var orderNumber = event.target.value;
                        this.setState({
                            orderNumber: orderNumber
                        }, () => {
                            // console.log("Updated orderNumber: ", this.state.orderNumber) 
                            // if (this.state.orderNumber.length === 7) {
                            //     console.log("I am here dude 2, this.state.orderNumber: ", this.state.orderNumber)
                            //     this.dataFetch();
                            // }
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
                            // var existingData = this.state.itemsByDueDateMap.get(due_date_key)
                            var existingData = Object.assign([], existingDataMap.get(modifiedISODate));
                            existingDataMap.set(modifiedDate, existingData)
                            console.log("calling from setDueDate, before existingDataMap: ", existingDataMap)
                            existingDataMap.delete(modifiedISODate)
                            console.log("calling from setDueDate, after existingDataMap: ", existingDataMap)

                            // const arrayFrommappedResult = Array.from(existingDataMap).map(([key, value]) => ({key, value}))

                            var existingItemsByDueDate = this.state.itemsByDueDate
                            for (let index = 0; index < existingItemsByDueDate.length; index++) {
                                // const element = existingItemsByDueDate[index];
                                if (existingItemsByDueDate[index]['key'] == modifiedISODate) {
                                    existingItemsByDueDate[index]['key'] = modifiedDate;
                                    // console.log("existingItemsByDueDate[index]['key']: ", existingItemsByDueDate[index]['key'])
                                    break;
                                }
                            }

                            // console.log("calling from setDueDate in MyProvider, existingItemsByDueDate: ", existingItemsByDueDate, ", itemsByDueDate: ", this.state.itemsByDueDate)

                            this.setState(
                                { itemsByDueDate: existingItemsByDueDate, itemsByDueDateMap: existingDataMap}, 
                                () => console.log("calling from setDueDate in MyProvider, itemsByDueDateMap: ", this.state.itemsByDueDateMap, ", itemsByDueDate: ", this.state.itemsByDueDate)
                            );
                        }
                    },

                    searchOrderDetails: (event) => {
                        // console.log("calling from searchOrderDetails in MyProvider, event: ", event)
                        
                        event.preventDefault();
                        
                        // console.log("calling from searchOrderDetails in MyProvider after preventDefault, event: ", event)
                        if (this.state.orderNumber.length === 7) {
                            this.dataFetch();
                        }
                        else {
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

                        // console.log("modifiedData: ", modifiedData)

                        for (let index = 0; index < existingItemByDueDate.length; index++) {
                            if(existingItemByDueDate[index]['key'] == due_date_key) {
                                existingItemByDueDate[index]['value'] = Object.assign([], modifiedData);
                                break
                            }
                        }
                        // console.log("this.state.itemsByDueDate: ", this.state.itemsByDueDate)
                        // console.log("existingItemByDueDate: ", existingItemByDueDate)
                        
                        existingItemByDueDateMap.set(due_date_key, modifiedData)
                        this.setState({itemsByDueDate: modifiedData, itemsByDueDateMap: existingItemByDueDateMap}, 
                            () => console.log("calling from getTest, this.state.itemsByDueDate: ", this.state.itemsByDueDate, ", this.state.itemsByDueDateMap: ", this.state.itemsByDueDateMap))
                    },
                    insertItemByDueDate: (due_date_key) => {
                        // console.log("calling from insertItemByDueDate in MyProvider, due_date_key: ", due_date_key)
                        var existingData = this.state.itemsByDueDateMap;
                        //var list_of_items = existingData.get(due_date_key)
                        var list_of_items = Object.assign([], existingData.get(due_date_key));

                        // console.log("calling from insertItemByDueDate in MyProvider, list_of_items.length: ", list_of_items.length)

                        list_of_items.push({id: list_of_items.length, item: '', order_qty: 0})
                        existingData.set(due_date_key, list_of_items)

                        // const arrayFrommappedResult = Array.from(existingData).map(([key, value]) => ({key, value}))
                        var existingItemsByDueDate = this.state.itemsByDueDate
                        // var arrayFrommappedResult = existingItemsByDueDate.filter(item => item.key == due_date_key)
                        
                        // if (arrayFrommappedResult.length !== 0) {
                        //     arrayFrommappedResult[0]['value'] = list_of_items
                        // }

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

                        // var data = this.state.itemsByDueDate.get(due_date)

                        // console.log("calling from before copyItemsByDueDate in MyProvider, itemsByDueDateMap: ", this.state.itemsByDueDateMap, ", itemsByDueDate: ", this.state.itemsByDueDate)

                        try {
                            //const {error, isLoaded, items, itemsByDueDate, orderNumber} = this.state;
                            var existingData = this.state.itemsByDueDateMap;

                            // var list_of_items = existingData.get(due_date_key)
                            // var list_of_items = Object.assign([],existingData.get(due_date_key))
                            
                            let list_of_items = JSON.parse(JSON.stringify(existingData.get(due_date_key)));

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
                        // console.log("calling from submitOrderDetailsToQAD in MyProvider, event: ", event)
                        
                        event.preventDefault();
                        
                        console.log("calling from submitOrderDetailsToQAD in MyProvider after preventDefault, itemsByDueDate: ", this.state.itemsByDueDate, ", itemsByDueDateMap: ", this.state.itemsByDueDateMap);

                        fetch('http://127.0.0.1:5000/api/send_req_items_for_cs', {
                            method: 'POST',
                            body: JSON.stringify({
                                // title: title,
                                // body: body,
                                // userId: Math.random().toString(36).slice(2),
                                itemsByDueDate: this.state.itemsByDueDate,
                                orderNumber: this.state.orderNumber
                            }),
                            headers: {
                                'Content-type': 'application/json; charset=UTF-8',
                            },
                        })
                        .then((res) => res.json())
                        .then((post) => {
                            // setPosts((posts) => [post, ...posts]);
                            // setTitle('');
                            // setBody('');
                        })
                        .catch((err) => {
                            console.log(err.message);
                        });
                    },
                    addNewTableByDueDate: () => {
                        // console.log("calling from addNewTableByDueDate in MyProvider")

                        try {
                            //const {error, isLoaded, items, itemsByDueDate, orderNumber} = this.state;
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
                    isConfirmed: this.state.isConfirmed
                    // insertDataByDueDate: (due_date, list_of_items) => {
                    //     const cars = Object.assign({}, this.state.cars);
                    //     cars[selectedID].price = cars[selectedID].price + 1;
                    //     this.setState({
                    //         cars: cars
                    //     });
                    // }
                }}
            >
                {this.props.children}
            </MyContext.Provider>
        );
    }
}

export default MyProvider;