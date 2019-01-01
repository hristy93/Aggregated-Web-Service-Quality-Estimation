import React, { Component } from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import LoadTest from '../LoadTest/LoadTest';
import EstimationForm from '../Estimation/EstimationForm';
import LoadTestMetricsForm from './../LoadTestMetrics/LoadTestMetricsForm';
import LoadTestForm from '../LoadTest/LoadTestForm';
import WebServiceForm from '../WebService/WebServiceForm';

export class Home extends Component {
    render() {
        return (
            <div style={{ margin: '0 4rem' }}>
                <Row className="show-grid">
                    <Col sm={12} style={{ textAlign: "center" }}>
                        <h1>Aggregated Web Service Quality Estimation</h1>
                    </Col>
                </Row>
                <Row className="show-grid">
                    <Col sm={12}>
                        <LoadTest />
                    </Col>
                </Row>
            </div>
        );
    }
}
