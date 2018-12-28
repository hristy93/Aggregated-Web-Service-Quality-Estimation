import React, { Component } from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import LoadTest from '../LoadTest/LoadTest';

export class Home extends Component {
    render() {
        return (
            <Grid>
                <Row className="show-grid">
                    <Col sm={12} style={{ textAlign: "center" }}>
                        <h1>Aggregated Web Service Quality Estimation</h1>
                    </Col>
                </Row>
                <Row className="show-grid">
                    <Col md={6} mdPush={7}>
                        <LoadTest key="first" />
                    </Col>
                    <Col md={6} mdPull={7}>
                        <LoadTest key="second" />
                    </Col>
                </Row>
            </Grid>
        );
    }
}
