import { Container,Form,Button,Row,Col,InputGroup } from 'react-bootstrap';
import React from 'react';
import MyContext from './MyContext';

const SearchForm = () => (
    <MyContext.Consumer>
        {context => (
            <React.Fragment>
                <Container className="p-3">        
                    <Form onSubmit={context.searchOrderDetails}>
                        <Row>
                            <Col className='col-3'>
                                {/* <Form.Control type='input' placeholder="Order Number" onChange={context.setOrderNumber} /> */}
                                <Form.Control maxLength={7} type='input' placeholder="Order Number" onChange={context.setOrderNumber} />
                            </Col>
                            <Col className='d-flex col-3'>
                                <Button disabled={context.isSubmitButtonLoading} type="submit">
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
//                             {/* <Col>
//                                 <Form.Control className='w-50' maxLength={7} type='input' placeholder="Order Number" onChange={context.setOrderNumber} />
//                                 <Button disabled={context.isSubmitButtonLoading} type="submit">
//                                     Search
//                                 </Button>
//                             </Col> */}
//                             {/* <Col className='d-flex'>
//                                 <Button disabled={context.isSubmitButtonLoading} type="submit">
//                                     Search
//                                 </Button>
//                             </Col> */}
//                             <Col>
//                                 <Form.Control className='w-50' maxLength={7} type='input' placeholder="Order Number" onChange={context.setOrderNumber} />
//                             </Col>
//                             <Col>
//                                 <Button disabled={context.isSubmitButtonLoading} type="submit">
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