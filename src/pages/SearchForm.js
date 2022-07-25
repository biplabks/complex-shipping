import { Container,Form,Button,Row,Col } from 'react-bootstrap';
import React from 'react';
import MyContext from './MyContext';

// class SearchForm extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {value: ''};

//         this.handleChange = this.handleChange.bind(this);
//         this.handleSubmit = this.handleSubmit.bind(this);
//     }

//     handleChange(event) {
//         this.setState({value: event.target.value});
//     }
    
//     handleSubmit(event) {
//         this.props.childToParent(event);
//         event.preventDefault();
//     }

//     render() {
//       return (
//         <Container className="p-3">        
//             <Form onSubmit={this.handleSubmit}>
//                 <Row>
//                     <Col>
//                         <Form.Control placeholder="Order Number" name="order_number" value={this.state.value} onChange={this.handleChange} />
//                     </Col>
//                     <Col className='d-flex'>
//                         <Button type="submit">
//                             Submit
//                         </Button>
//                     </Col>
//                 </Row>
//             </Form>
//         </Container>
//       );
//     }
//   }

const SearchForm = () => (
    <MyContext.Consumer>
        {context => (
            <React.Fragment>
                <Container className="p-3">        
                    <Form onSubmit={context.searchOrderDetails}>
                        <Row>
                            <Col>
                                <Form.Control type='input' placeholder="Order Number" onChange={context.setOrderNumber} />
                            </Col>
                            <Col className='d-flex'>
                                <Button type="submit">
                                    Search
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </React.Fragment>
        )}
    </MyContext.Consumer>
);

// const SearchForm = () => (
//     <MyContext.Consumer>
//         {context => (
//             <React.Fragment>
//                 <Container className="p-3">        
//                     <Form onSubmit={context.searchOrderDetails}>
//                         <Row>
//                             <Col>
//                                 <Form.Control type='input' placeholder="Order Number" onChange={context.setOrderNumber} />
//                             </Col>
//                             <Col className='d-flex'>
//                                 <Button type="submit">
//                                     Search
//                                 </Button>
//                             </Col>
//                         </Row>
//                     </Form>
//                 </Container>
//             </React.Fragment>
//         )}
//     </MyContext.Consumer>
// );

export default SearchForm;