import React, { Component } from 'react';
import LoadTestForm from './LoadTestForm';
import { Col, Row, Grid, Button, ButtonToolbar } from 'react-bootstrap';
import LoadTestCharts from './LoadTestCharts';
import connectToStores from 'alt-utils/lib/connectToStores';
import LoadTestStore from '../../stores/LoadTestStore';
import LoadTestActions from '../../actions/LoadTestActions';
import { responseTimeTestData } from '../../data/testData';

class LoadTest extends Component {
    constructor(props) {
        super(props);

        this.handleRunLoadTestButtonClick = this.handleRunLoadTestButtonClick.bind(this);
        this.handleWriteLoadTestDataClick = this.handleWriteLoadTestDataClick.bind(this);
        this.handleReadLoadTestDataClick = this.handleReadLoadTestDataClick.bind(this);
    }

    static getStores() {
        return [LoadTestStore];
    }

    static getPropsFromStores() {
        return ({
            csvData: LoadTestStore.getCsvData()
        });
    }

    handleRunLoadTestButtonClick() {
        LoadTestActions.runLoadTest();
    }

    handleWriteLoadTestDataClick() {
        LoadTestActions.writeLoadTestData();
    }

    handleReadLoadTestDataClick() {
        LoadTestActions.readLoadTestData();
    }

    render() {
        return (
            <Grid fluid>
                <Row>
                    <Col sm={7}>
                        <LoadTestForm />
                    </Col>
                </Row>
                <Row>
                    <Col sm={10}>
                        <ButtonToolbar>
                            <Button
                                id="run-load-test-button"
                                onClick={this.handleRunLoadTestButtonClick}
                                value="Run Load Test"
                            >
                                Run Load Test
                            </Button>

                            <Button
                                id="write-load-test-data-button"
                                onClick={this.handleWriteLoadTestDataClick}
                            >
                                Write Load Test Data
                            </Button>
                            <Button
                                id="read-load-test-data-button"
                                onClick={this.handleReadLoadTestDataClick}
                            >
                                Read Load Test Data
                            </Button>
                        </ButtonToolbar>
                        <LoadTestCharts csvData={this.props.csvData} />
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default connectToStores(LoadTest);