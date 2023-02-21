// import { Container,Form,Button,Row,Col } from 'react-bootstrap';
import { Form,Button } from 'react-bootstrap';
import React from 'react';
import MyContext from './MyContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

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
                        value={context.orderNumber}
                    />
                    <Button disabled={context.isSubmitButtonLoading} type="submit">
                        Search <FontAwesomeIcon icon={faSearch} />
                    </Button>
                </Form>
            </React.Fragment>
        )}
    </MyContext.Consumer>
);

export default SearchForm;