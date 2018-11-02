import React, { Component } from 'react';
import LoadTestForm from './LoadTestForm';
import { Col, Row, Grid, Button, ButtonToolbar } from 'react-bootstrap';
import LoadTestCharts from './LoadTestCharts';
import connectToStores from 'alt-utils/lib/connectToStores';
import LoadTestStore from '../../stores/LoadTestStore';
import LoadTestActions from '../../actions/LoadTestActions';
import { responseTimeTestData } from '../../data/testData';
import isNil from 'lodash/isNil';
import { displayFailureMessage } from '../../utils/displayInformation';

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
            loadTestData: LoadTestStore.getLoadTestData(),
            url: LoadTestStore.getUrl(),
            isUrlValid: LoadTestStore.getUrlValidity()
        });
    }

    handleRunLoadTestButtonClick() {
        const { url } = this.props;
        if (!isNil(url)) {
            LoadTestActions.runLoadTest(this.props.url);
        } else {
            displayFailureMessage("There is a problem with the load test!", "The url is invalid!");
        }
    }

    handleWriteLoadTestDataClick() {
        LoadTestActions.writeLoadTestData();
    }

    handleReadLoadTestDataClick() {
        LoadTestActions.readLoadTestData();
    }

    render() {
        const { loadTestData, isUrlValid } = this.props;
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
                                disabled={!isUrlValid}
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
                        <LoadTestCharts data={loadTestData} />
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default connectToStores(LoadTest);