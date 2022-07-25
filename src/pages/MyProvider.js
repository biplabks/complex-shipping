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
        orderNumber: ''
    };

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

    dataFetch() {
        console.log("calling from dataFetch in MyProvider, this.state.orderNumber: ", this.state.orderNumber);
        fetch("https://vanna.zh.if.atcsg.net:453/api/v1/get-qad-sales-order-info/"+this.state.orderNumber)
          .then(res => res.json())
          .then(
            (result) => {
              var resultData = result['result'][this.state.orderNumber]['line_details'];
    
              console.log("calling from dataFetch in MyProvider, resultData: ", resultData)
    
              this.destructureItems(resultData);
    
              this.setState({
                isLoaded: true,
                items: result['result'][this.state.orderNumber]['line_details'],
                orderNumber: this.state.orderNumber
              });
            },
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
        )
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
                    //version 1
                    setOrderNumber: (event) => {
                        // console.log("Hello guys, orderNumber: ", event.target.value)
                        console.log("Hello guys, orderNumber: ", event)
                        var orderNumber = event.target.value;
                        this.setState({
                            orderNumber: orderNumber
                        }, () => {
                            console.log("Updated orderNumber: ", this.state.orderNumber) 
                            // if (this.state.orderNumber.length === 7) {
                            //     console.log("I am here dude 2, this.state.orderNumber: ", this.state.orderNumber)
                            //     this.dataFetch();
                            // }
                        });
                    },
                    
                    //version 2
                    // setOrderNumber: event => {
                    //     // console.log("Hello guys, orderNumber: ", event.target.value)
                    //     console.log("Hello guys, orderNumber: ", event)
                    //     var orderNumber = event.target.value;
                    //     this.setState({
                    //         orderNumber: orderNumber
                    //     }, () => {
                    //         console.log("Updated orderNumber: ", this.state.orderNumber) 
                    //         if (this.state.orderNumber.length === 7) {
                    //             console.log("I am here dude 2, this.state.orderNumber: ", this.state.orderNumber)
                    //             this.dataFetch();
                    //         }
                    //     });
                    // },

                    searchOrderDetails: (event) => {
                        console.log("calling from searchOrderDetails in MyProvider, event: ", event)
                        
                        event.preventDefault();
                        
                        console.log("calling from searchOrderDetails in MyProvider after preventDefault, event: ", event)
                        if (this.state.orderNumber.length === 7) {
                            this.dataFetch();
                        }
                        else {
                            alert("Please enter a valid order number");
                            event.preventDefault();
                        }
                    },
                    copyItemsByDueDate: (due_date_key) => {
                        console.log("Copying items, event: ", due_date_key)

                        // var data = this.state.itemsByDueDate.get(due_date)

                        try {
                            //const {error, isLoaded, items, itemsByDueDate, orderNumber} = this.state;
                            var existingData = this.state.itemsByDueDateMap;
                            var list_of_items = existingData.get(due_date_key)
                            let dateArray = []
                            const keys = [...this.state.itemsByDueDateMap.keys()];
                            for (let index = 0; index < keys.length; index++) {
                                const element = new Date(keys[index]);
                                dateArray.push(element);
                            }

                            const maxDate = new Date(Math.max.apply(null, dateArray));
                            var nextAvailableDate = new Date(maxDate);
                            nextAvailableDate.setDate(maxDate.getDate()+1);

                            existingData.set(nextAvailableDate, list_of_items)
                            const arrayFrommappedResult = Array.from(existingData).map(([key, value]) => ({key, value}))

                            this.setState(
                                { itemsByDueDate: arrayFrommappedResult, itemsByDueDateMap:  existingData}, 
                                () => console.log("calling from copyItemsByDueDate in MyProvider, itemsByDueDateMap: ", this.state.itemsByDueDateMap)
                            );

                        } catch (error) {
                            console.log("error: ", error.message);
                        }
                    },
                    submitOrderDetailsToQAD: (event) => {
                        console.log("calling from submitOrderDetailsToQAD in MyProvider, event: ", event)
                        
                        event.preventDefault();
                        
                        console.log("calling from submitOrderDetailsToQAD in MyProvider after preventDefault, event: ", this.state.itemsByDueDate)
                    },
                    orderNumber: this.state.orderNumber,
                    items: this.state.items,
                    error: this.state.error,
                    isLoaded: this.state.isLoaded,
                    itemsByDueDate: this.state.itemsByDueDate
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