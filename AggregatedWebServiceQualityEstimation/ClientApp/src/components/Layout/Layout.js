import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import { NavigationBar } from '../common/NavigationBar/NavigationBar';

export class Layout extends Component {
  render() {
    return (
      <Grid fluid>
        <Row>
          <Col sm={3}>
            <NavigationBar />
          </Col>
          <Col sm={9}>
            {this.props.children}
          </Col>
        </Row>
      </Grid>
    );
  }
}
