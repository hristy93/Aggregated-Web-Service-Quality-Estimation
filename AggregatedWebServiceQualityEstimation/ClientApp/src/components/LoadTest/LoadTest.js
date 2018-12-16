import React, { Component } from 'react';
import LoadTestForm from './LoadTestForm';
import { Col, Row, Grid, Button, ButtonToolbar } from 'react-bootstrap';
import LoadTestCharts from './LoadTestCharts';
import StatisticalEstimation from '../Estimation/StatisticalEstimation';
import connectToStores from 'alt-utils/lib/connectToStores';
import LoadTestStore from '../../stores/LoadTestStore';
import LoadTestActions from '../../actions/LoadTestActions';
import EstimationActions from '../../actions/EstimationActions';
import isNil from 'lodash/isNil';
import { displayFailureMessage } from '../../utils/displayInformation';

class LoadTest extends Component {
    static getStores() {
        return [LoadTestStore];
    }

    static getPropsFromStores() {
        return ({
            loadTestData: LoadTestStore.getLoadTestData(),
            loadTestDuration: LoadTestStore.getLoadTestDuration(),
            url: LoadTestStore.getUrl(),
            isUrlValid: LoadTestStore.getUrlValidity(),
            requestType: LoadTestStore.getRequestType(),
            requestPostData: LoadTestStore.getRequestPostData(),
            testState: LoadTestStore.getTestState()
        });
    }

    handleRunLoadTestButtonClick = () => {
        const {
            url,
            requestPostData,
            loadTestDuration,
            requestType
        } = this.props;

        let data = {};
        data["url"] = url;

        if (requestType === "POST" && !isNil(requestPostData)) {
            const parsedRequestPostData = JSON.parse(requestPostData);
            data["body"] = parsedRequestPostData;
        }

        if (!isNil(loadTestDuration)) {
            data["duration"] = loadTestDuration;
        }

        if (!isNil(data)) {
            LoadTestActions.runLoadTest(data);

            LoadTestActions.setTestState({
                started: true,
                finished: false
            });
        } else {
            displayFailureMessage("There is a problem with the load test!", "The data is invalid!");
        }
    }

    handleWriteLoadTestDataClick = () => {
        LoadTestActions.writeLoadTestData();
    }

    handleReadLoadTestDataClick = () => {
        LoadTestActions.readLoadTestData();
    }

    getRunLoadTestButtonText = (testState) => {
        if (!isNil(testState)) {
            if (!testState.started && !testState.writingTestData) {
                return "Run Load Test";
            } else if (testState.started && !testState.finished) {
                return "Load Test Running";
            } else if (testState.writingTestData) {
                return "Writing test data ..."
            }
        }
    }

    render() {
        const { loadTestData, isUrlValid, testState } = this.props;

        const isTestRunning = testState.started && !testState.finished;
        const areOperationsDenied = testState.writingTestData || isTestRunning;

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
                                disabled={!isUrlValid || areOperationsDenied}
                            >
                                {this.getRunLoadTestButtonText(testState)}
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
                        <LoadTestCharts chartsData={loadTestData} />
                    </Col>
                </Row>
                <Button
                    id="get-statistical-estimation-button"
                    disabled={areOperationsDenied}
                    onClick={EstimationActions.getStatisticalEstimatorResult}
                >
                    Get Statistical Data
                 </Button>
                <StatisticalEstimation />
            </Grid>
        );
    }
}

export default connectToStores(LoadTest);