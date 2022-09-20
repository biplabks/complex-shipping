import { Container,Form,Button,Row,Col } from 'react-bootstrap';
import React from 'react';
import MyContext from './MyContext';

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

export default SearchForm;