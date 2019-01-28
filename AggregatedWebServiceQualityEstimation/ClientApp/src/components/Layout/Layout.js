import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';

export class Layout extends Component {
  render() {
    return (
      <Grid fluid>
        <Row>
          <Col sm={12}>
            {this.props.children}
          </Col>
        </Row>
      </Grid>
    );
  }
}
