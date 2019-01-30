import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import LoadTest from '../LoadTest/LoadTest';

export class Home extends Component {
    render() {
        return (
            <div style={{ margin: '0 2rem' }}>
                <Row className="show-grid">
                    <Col sm={12} style={{ textAlign: "center" }}>
                        <h1>Aggregated Web Service Quality Estimation</h1>
                    </Col>
                </Row>
                <Row className="show-grid" style={{ marginTop: "2rem" }}>
                    <Col sm={12}>
                        <LoadTest />
                    </Col>
                </Row>
            </div>
        );
    }
}
