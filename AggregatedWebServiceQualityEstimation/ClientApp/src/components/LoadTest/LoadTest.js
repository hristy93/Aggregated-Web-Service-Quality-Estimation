import React, { Component } from 'react';
import { Col, Row, Grid, Button, ButtonToolbar, Badge } from 'react-bootstrap';
import EstimationForm from '../Estimation/EstimationForm';
import LoadTestMetricsForm from './../LoadTestMetrics/LoadTestMetricsForm';
import LoadTestForm from './LoadTestForm';
import WebServiceForm from '../WebService/WebServiceForm';
import LoadTestCharts from '../LoadTestCharts/LoadTestCharts';
import StatisticalEstimation from '../Estimation/StatisticalEstimation';
import ApdexScoreEstimation from '../Estimation/ApdexScoreEstimation';
import ClusterEstimation from '../Estimation/ClusterEstimation';
import EstimationContainer from '../Estimation/EstimationContainer';
import connectToStores from 'alt-utils/lib/connectToStores';
import LoadTestStore from '../../stores/LoadTestStore';
import LoadTestActions from '../../actions/LoadTestActions';
import LoadTestChartsActions from '../../actions/LoadTestChartsActions';
import WebServicesStore from '../../stores/WebServicesStore';
import isNil from 'lodash/isNil';
import moment from 'moment';
import { displayFailureMessage } from '../../utils/displayInformation';

let testTimer;

class LoadTest extends Component {
    static getStores() {
        return [LoadTestStore, WebServicesStore];
    }

    static getPropsFromStores() {
        return ({
            firstServiceLoadTestData: LoadTestStore.getFirstServiceLoadTestData(),
            secondServiceLoadTestData: LoadTestStore.getSecondServiceLoadTestData(),
            loadTestDuration: LoadTestStore.getLoadTestDuration(),
            areUrlsValid: WebServicesStore.getUrlsValidity(),
            testState: LoadTestStore.getTestState(),
            timeLeft: LoadTestStore.getTimeLeft(),
            first: WebServicesStore.getFirstWebServiceData(),
            second: WebServicesStore.getSecondWebServiceData()
        });
    }

    handleBrushOnChange = (change) => {
        const args = {
            brushStartIndex: change.startIndex,
            brushEndIndex: change.endIndex
        };

        LoadTestChartsActions.setBrushPosition(args);
    }

    handleRunLoadTestButtonClick = () => {
        let data = [];
        const {
            first,
            second,
            loadTestDuration
        } = this.props;

        const firstWebServiceRequestData = this.putTestRequestData(first, "first");
        const secondWebServiceRequestData = this.putTestRequestData(second, "second");

        if (isNil(firstWebServiceRequestData) || isNil(secondWebServiceRequestData)) {
            return;
        }

        data.push(firstWebServiceRequestData);
        data.push(secondWebServiceRequestData);

        //if (!isNil(loadTestDuration)) {
        //    data["duration"] = loadTestDuration;
        //}

        if (!isNil(data)) {
            LoadTestActions.runLoadTest({ data, duration: loadTestDuration });

            LoadTestActions.setTestState({
                started: true,
                finished: false
            });

            LoadTestActions.clearLoadTestData.defer();
            //EstimationActions.clearApdexScoreData.defer();

            this.setTestTimer(loadTestDuration);
        } else {
            displayFailureMessage("There is a problem with the load test!", "The data is invalid!");
        }
    }

    putTestRequestData(webServiceData, webServiceId) {
        const {
            url,
            requestPostData,
            requestType
        } = webServiceData;

        let data = {};
        data["webServiceId"] = webServiceId;
        data["url"] = url;

        if (requestType === "POST" && !isNil(requestPostData)) {
            try {
                const parsedRequestPostData = JSON.parse(requestPostData);
                data["body"] = parsedRequestPostData;
            } catch (error) {
                const alertMessage = "There is a problem with the data in the body! Please check it and try again";
                displayFailureMessage(alertMessage, error);
                return null;
            }
        }

        return data;
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
                //new Promise((resolve) => {
                //    resolve(LoadTestActions.readLoadTestData.defer(false, "first"));
                //});
                //promise.then(() => EstimationActions.getApdexScoreEstimatorResult.defer(apdexScoreLimit));

                LoadTestActions.readLoadTestData.defer({ fromFile: false, webServiceId: "first" });
            }
            if (diff % 5 === 0) {
                //new Promise((resolve) => {
                //    resolve(LoadTestActions.readLoadTestData.defer(false, "second"));
                //});

                LoadTestActions.readLoadTestData.defer({ fromFile: false, webServiceId: "second" });
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

    handleWriteLoadTestDataClick = (webServiceId = "first") => {
        LoadTestActions.writeLoadTestData(webServiceId);
    }

    handleReadLoadTestDataClick = (webServiceId = "first") => {
        LoadTestActions.readLoadTestData({ fromFile: true, webServiceId });
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
            firstServiceLoadTestData,
            secondServiceLoadTestData,
            areUrlsValid,
            testState,
            timeLeft,
            first,
            second
        } = this.props;

        const isTestRunning = testState.started && !testState.finished;
        const areOperationsDenied = testState.writingTestData || isTestRunning;

        return (
            <Grid fluid>
                <Row className="show-grid">
                    <Col sm={12} md={3}>
                        <LoadTestMetricsForm />
                        <LoadTestForm />
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <ButtonToolbar style={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                                id="run-load-test-button"
                                onClick={this.handleRunLoadTestButtonClick}
                                disabled={!areUrlsValid || areOperationsDenied}
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
                        </ButtonToolbar>
                    </Col>
                </Row>
                <Row className="show-grid" style={{ marginTop: '2rem' }}>
                    <Col md={5}>
                        <WebServiceForm {...first} webServiceId="first" areOperationsDenied={areOperationsDenied} />
                        <Button
                            id="write-load-test-data-button"
                            onClick={() => this.handleWriteLoadTestDataClick("first")}
                        >
                            Write Load Test Data
                            </Button>
                        <Button
                            id="read-load-test-data-button"
                            onClick={() => this.handleReadLoadTestDataClick("first")}
                        >
                            Read Load Test Data
                            </Button>
                        <LoadTestCharts
                            webServiceId="first"
                            chartsData={firstServiceLoadTestData}
                            brushOnChange={this.handleBrushOnChange}
                        />
                        <EstimationContainer
                            webServiceId="first" 
                            brushOnChange={this.handleBrushOnChange}
                            areOperationsDenied={areOperationsDenied}
                        />
                    </Col>
                    <Col md={2} />
                    <Col md={5}>
                        <WebServiceForm {...second} webServiceId="second" areOperationsDenied={areOperationsDenied} />
                        <Button
                            id="write-load-test-data-button"
                            onClick={() => this.handleWriteLoadTestDataClick("second")}
                        >
                            Write Load Test Data
                            </Button>
                        <Button
                            id="read-load-test-data-button"
                            onClick={() => this.handleReadLoadTestDataClick("second")}
                        >
                            Read Load Test Data
                            </Button>
                        <LoadTestCharts
                            webServiceId="second"
                            chartsData={secondServiceLoadTestData}
                            brushOnChange={this.handleBrushOnChange}
                        />
                        <EstimationContainer
                            webServiceId="second"
                            brushOnChange={this.handleBrushOnChange}
                            areOperationsDenied={areOperationsDenied}
                        />
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default connectToStores(LoadTest);