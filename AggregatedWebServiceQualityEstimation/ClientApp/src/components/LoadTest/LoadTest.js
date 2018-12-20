import React, { Component } from 'react';
import LoadTestForm from './LoadTestForm';
import { Col, Row, Grid, Button, ButtonToolbar, Badge } from 'react-bootstrap';
import LoadTestCharts from './LoadTestCharts';
import StatisticalEstimation from '../Estimation/StatisticalEstimation';
import connectToStores from 'alt-utils/lib/connectToStores';
import LoadTestStore from '../../stores/LoadTestStore';
import LoadTestActions from '../../actions/LoadTestActions';
import EstimationActions from '../../actions/EstimationActions';
import isNil from 'lodash/isNil';
import moment from 'moment';
import { displayFailureMessage } from '../../utils/displayInformation';

let testTimer;

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
            testState: LoadTestStore.getTestState(),
            timeLeft: LoadTestStore.getTimeLeft()
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
            try {
                const parsedRequestPostData = JSON.parse(requestPostData);
                data["body"] = parsedRequestPostData;
            } catch (error) {
                const alertMessage = "There is a problem with the data in the body! Please check it and try again";
                displayFailureMessage(alertMessage, error);
                return;
            }
           
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

            LoadTestActions.clearLoadTestData();

            this.setTestTimer(loadTestDuration);
        } else {
            displayFailureMessage("There is a problem with the load test!", "The data is invalid!");
        }
    }

    setTestTimer = (loadTestDuration) => {
        const duration = moment.duration(loadTestDuration);
        var justStarted = true;
        var dateTimeAfterTest;
        testTimer = setInterval(() => {
            // Get datetime after the test is finished
            if (justStarted) {
                dateTimeAfterTest = moment(new Date()).add(duration).add(500, 'ms');
                justStarted = false;
            }

            // Find the difference between now and the count down time
            let diff = dateTimeAfterTest.diff(moment(new Date()));
            let diffDuration = moment.duration(diff);

            // Set time left until the test is finished
            const diffTime = `${diffDuration.hours()}:${diffDuration.minutes()}:${diffDuration.seconds()}`;
            LoadTestActions.setTimeLeft(diffTime);

            if (diff % 3 === 0) {
                // Load the test data periodically while the test is running
                new Promise((resolve) => {
                    resolve(LoadTestActions.readLoadTestData.defer(false));
                });
            }

            // If the count down is finished, stop the timer
            if (diff < 0) {
                clearInterval(testTimer);
            }
        }, 1000);
    }

    handleCancelLoadTestButtonClick = () => {
        LoadTestActions.cancelLoadTest();
    }

    handleWriteLoadTestDataClick = () => {
        LoadTestActions.writeLoadTestData();
    }

    handleReadLoadTestDataClick = () => {
        LoadTestActions.readLoadTestData(true);
    }

    getRunLoadTestButtonText = (testState) => {
        if (!isNil(testState)) {
            if (!testState.started && !testState.writingTestData) {
                return "Run Load Test";
            } else if (testState.started && !testState.finished) {
                return "Load Test Running";
            } else if (testState.writingTestData) {
                return "Writing test data ...";
            }
        }
    }

    render() {
        const {
            loadTestData,
            isUrlValid,
            testState,
            timeLeft
        } = this.props;

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
                        <ButtonToolbar style={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                                id="run-load-test-button"
                                onClick={this.handleRunLoadTestButtonClick}
                                disabled={!isUrlValid || areOperationsDenied}
                            >
                                {this.getRunLoadTestButtonText(testState)}
                            </Button>
                            <Button
                                id="cancel-load-test-button"
                                onClick={this.handleCancelLoadTestButtonClick}
                                disabled={!isTestRunning}
                            >
                                Cancel Test
                            </Button>
                            {
                                isTestRunning && !isNil(timeLeft) && (
                                    <div style={{marginLeft: '1rem'}}>
                                        Time Left: <Badge>{timeLeft}</Badge>
                                    </div>
                                )
                            }
                            <br />
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