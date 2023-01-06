// import { Container,Form,Button,Row,Col } from 'react-bootstrap';
import { Form,Button } from 'react-bootstrap';
import React from 'react';
import MyContext from './MyContext';

// const SearchForm = () => (
//     <MyContext.Consumer>
//         {context => (
//             <React.Fragment>
//                 <Container fluid>
//                     <Form onSubmit={context.searchOrderDetails}>
//                         <Row>
//                             <Col className='col-2'>
//                                 <Form.Control
//                                     maxLength={7}
//                                     type='input'
//                                     placeholder="Order Number"
//                                     onChange={context.setOrderNumber}
//                                 />
//                             </Col>
//                             <Col className='d-flex col-3'>
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

// const SearchForm = () => (
//     <MyContext.Consumer>
//         {context => (
//             <React.Fragment>
//                 <Container fluid>
//                     <form class="form-inline" onSubmit={context.searchOrderDetails}>
//                         <div class="form-group">
//                             <input type="text" maxLength={7} class="form-control" placeholder="Order Number" onChange={context.setOrderNumber}/>
//                         </div>
//                         <button type="submit" class="btn btn-primary" disabled={context.isSubmitButtonLoading}>Search</button>
//                     </form>
//                 </Container>
//             </React.Fragment>
//         )}
//     </MyContext.Consumer>
// );

const SearchForm = () => (
    <MyContext.Consumer>
        {context => (
            <React.Fragment>
                <Form className='form-inline' onSubmit={context.searchOrderDetails}>
                    <Form.Control
                        maxLength={7}
                        type='input'
                        placeholder="Order Number"
                        onChange={context.setOrderNumber}
                    />
                    <Button disabled={context.isSubmitButtonLoading} type="submit">
                        Search
                    </Button>
                </Form>
            </React.Fragment>
        )}
    </MyContext.Consumer>
);

export default SearchForm;