import { Container,Form,Button,Row,Col } from 'react-bootstrap';
import React from 'react';
// import TableTest from './TableTest';

// import { useState } from "react";

class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }
    
    handleSubmit(event) {
        // alert('A name was submitted: ' + this.state.value);
        // alert('A name was submitted: ' + event.target.order_number.value);
        // console.log("from handlesubmit, event: ", event.target.value)
        // this.props.childToParent(event.target.value);
        // this.props.childToParent(event);
        // this.props.childToParent(event, this.state.value);
        // this.props.childToParent(event, event.target.order_number.value);
        this.props.childToParent(event);
        event.preventDefault();
        // <TableTest OrderNumber={this.state.value} />
    }

    render() {
    //   const { value } = this.state;
    //   if (value.length>0) {
    //     return <div> <TableTest OrderNumber={this.state.value} /> </div>
    //   }
      return (
        <Container className="p-3">        
          {/* <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">
                We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
            </Form> */}
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col>
                        <Form.Control placeholder="Order Number" name="order_number" value={this.state.value} onChange={this.handleChange} />
                    </Col>
                    <Col className='d-flex'>
                        <Button type="submit">
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
      );
    }
  }

  export default SearchForm;