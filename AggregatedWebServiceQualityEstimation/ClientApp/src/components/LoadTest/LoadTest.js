import React, { Component } from 'react';
import {
    Col,
    Row,
    Grid,
    Button,
    ButtonToolbar,
    Badge,
    Panel,
    PanelGroup,
    Tooltip
} from 'react-bootstrap';
import LoadTestMetricsForm from './../LoadTestMetrics/LoadTestMetricsForm';
import LoadTestForm from './LoadTestForm';
import WebServiceForm from '../WebService/WebServiceForm';
import LoadTestCharts from '../LoadTestCharts/LoadTestCharts';
import EstimationContainer from '../Estimation/EstimationContainer';
import connectToStores from 'alt-utils/lib/connectToStores';
import LoadTestStore from '../../stores/LoadTestStore';
import LoadTestChartsStore from '../../stores/LoadTestChartsStore';
import LoadTestActions from '../../actions/LoadTestActions';
import LoadTestChartsActions from '../../actions/LoadTestChartsActions';
import WebServicesStore from '../../stores/WebServicesStore';
import FileUpload from '../common/FileUpload/FileUpload';
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
            firstServiceLoadTestDataInfo: LoadTestStore.getFirstServiceLoadTestDataInfo(),
            secondServiceLoadTestDataInfo: LoadTestStore.getSecondServiceLoadTestDataInfo(),
            firstWebServiceChartsData: LoadTestChartsStore.getFirstWebServiceChartsData(),
            secondWebServiceChartsData: LoadTestChartsStore.getSecondWebServiceChartsData(),
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

    handleFileUploadChange = (event, webServiceId) => {
        event.preventDefault();
        const { files } = event.target;

        if (isNil(files)) {
            displayFailureMessage("No files selected!");
        } else if (files.length > 1) {
            displayFailureMessage("More than 1 file selected!");
        } else {
            LoadTestActions.uploadLoadTestData({ files, webServiceId });
        }
    }

    getLoadTestStateMessage = (testState) => {
        if (!isNil(testState)) {
            if (testState.started && !testState.finished) {
                return "Running...";
            } else if (testState.writingTestData) {
                return "Writing test data ...";
            }
        }
    }

    renderValidateInputsTooltip = (
            <Tooltip
                id="tooltip-run-load-test"
                placement="top"
                className="in"
            >
                <strong>Enter or check the web service URLs!</strong>
            </Tooltip>
        );

    render() {
        const {
            firstServiceLoadTestData,
            secondServiceLoadTestData,
            firstWebServiceChartsData,
            secondWebServiceChartsData,
            areUrlsValid,
            testState,
            timeLeft,
            first,
            second
        } = this.props;

        const isTestRunning = testState.started && !testState.finished;
        const areOperationsDenied = testState.writingTestData || isTestRunning;
        const isRunLoadTestButtonDisabled = !areUrlsValid || areOperationsDenied;
        const isFirstWebServiceChartsPanelOpen = firstWebServiceChartsData.isPanelOpen;
        const isSecondWebServiceChartsPanelOpen = secondWebServiceChartsData.isPanelOpen;

        return (
            <Grid fluid>
                <Row className="show-grid">
                    <Col md={6}>
                        <Panel id="panel-first-web-service-form" bsStyle="primary">
                            <Panel.Heading id="panel-heading-first-web-service-form">
                                <Panel.Title id="panel-title-first-web-service-form">
                                    <b>First Web Service Form</b>
                                </Panel.Title>
                            </Panel.Heading>
                            <Panel.Body id="panel-body-first-web-service-form">
                                <WebServiceForm
                                    webServiceId="first"
                                    {...first}
                                    areOperationsDenied={areOperationsDenied}
                                />
                            </Panel.Body>
                        </Panel>
                    </Col>
                    <Col md={6}>
                        <Panel id="panel-second-web-service-form" bsStyle="primary">
                            <Panel.Heading id="panel-heading-second-web-service-form">
                                <Panel.Title id="panel-title-second-web-service-form">
                                    <b>Second Web Service Form</b>
                                </Panel.Title>
                            </Panel.Heading>
                            <Panel.Body id="panel-body-second-web-service-form">
                                <WebServiceForm
                                    webServiceId="second"
                                    {...second}
                                    areOperationsDenied={areOperationsDenied}
                                />
                            </Panel.Body>
                        </Panel>
                    </Col>
                </Row>
                <Row>
                    {/*<Col sm={12} md={4} mdOffset={4}>*/}
                    <Col md={12}>
                        <Row>
                            <Panel
                                id="panel-configs"
                                bsStyle="primary"
                                style={{ margin: '0 1.5rem' }}
                            >
                                <Panel.Heading id="panel-heading-configs">
                                    <Panel.Title id="panel-title-configs">
                                        <b>Configurations</b>
                                    </Panel.Title>
                                </Panel.Heading >
                                <Panel.Body id="panel-body-configs">
                                    <Col md={6}>
                                        <Panel id="panel-metrics" bsStyle="info">
                                            <Panel.Heading id="panel-heading-metrics">
                                                <Panel.Title id="panel-title-metrics"> 
                                                    <b>Metrics Used</b>
                                                </Panel.Title>
                                            </Panel.Heading >
                                            <Panel.Body id="panel-body-metrics">
                                                <LoadTestMetricsForm />
                                            </Panel.Body>
                                        </Panel>
                                    </Col>
                                    <Col md={6}>
                                        <PanelGroup
                                            id="panel-group"
                                            accordion 
                                            defaultActiveKey="1"
                                        >
                                            <Panel
                                                id="panel-metrics-data-source"
                                                bsStyle="info"
                                                eventKey="1"
                                            >
                                                <Panel.Heading id="panel-heading-metrics-data-source">
                                                    <Panel.Title id="panel-title-metrics-data-source" toggle>
                                                        <b>Metrics From Tests</b>
                                                    </Panel.Title>
                                                </Panel.Heading >
                                                <Panel.Body id="panel-body-metrics-data-source" collapsible>
                                                    <LoadTestForm />
                                                    <ButtonToolbar>
                                                        {/*<OverlayTrigger
                                                            trigger={'hover'}
                                                            placement="bottom"
                                                            overlay={this.renderValidateInputsTooltip}
                                                        >*/}
                                                            <Button
                                                                id="run-load-test-button"
                                                                onClick={this.handleRunLoadTestButtonClick}
                                                                disabled={isRunLoadTestButtonDisabled}
                                                            >
                                                                Run Load Test
                                                            </Button>
                                                        {/*</OverlayTrigger>*/}
                                                        <Button
                                                            id="cancel-load-test-button"
                                                            onClick={this.handleCancelLoadTestButtonClick}
                                                            disabled={!isTestRunning}
                                                        >
                                                            Cancel Test
                                                        </Button>
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
                                                        <br />
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
                                                    </ButtonToolbar>
                                                    {
                                                        (testState.started || testState.writingTestData) &&
                                                        <h4> Test State: {this.getLoadTestStateMessage(testState)} </h4>
                                                    }
                                                    {' '}
                                                    {
                                                        isTestRunning && !isNil(timeLeft) &&
                                                        <div style={{ marginLeft: '1rem' }}>
                                                            Time Left: <Badge>{timeLeft}</Badge>
                                                        </div>
                                                    }
                                                </Panel.Body>
                                            </Panel>
                                            <Panel
                                                id="panel-metrics-data-source"
                                                bsStyle="info"
                                                eventKey="2"
                                            >
                                                <Panel.Heading id="panel-heading-metrics-data-source">
                                                    <Panel.Title id="panel-title-metrics-data-source" toggle> 
                                                        <b>Metrics From CSV File</b>
                                                    </Panel.Title>
                                                </Panel.Heading >
                                                <Panel.Body id="panel-body-metrics-data-source" collapsible>
                                                    <FileUpload
                                                        id={`file-upload-first-web-service`}
                                                        title="Metrics for the first web service:"
                                                        buttonText="Add file"
                                                        fileType=".csv"
                                                        disabled={areOperationsDenied}
                                                        onChange={(event) => this.handleFileUploadChange(event, "first")}
                                                    />
                                                    <FileUpload
                                                        id={`file-upload-second-web-service`}
                                                        title="Metrics for the second web service:"
                                                        buttonText="Add file"
                                                        fileType=".csv"
                                                        disabled={areOperationsDenied}
                                                        onChange={(event) => this.handleFileUploadChange(event, "second")}
                                                    />
                                                </Panel.Body>
                                            </Panel>
                                        </PanelGroup>
                                    </Col>
                                </Panel.Body>
                            </Panel>
                        </Row>
                    </Col>
                </Row>
                <Row className="show-grid" style={{ marginTop: '2rem' }}>
                    <Col md={6}>
                        <PanelGroup id="panel-group-first-web-service">
                            <Panel
                                id="panel-first-web-service-charts"
                                bsStyle="primary"
                                expanded={isFirstWebServiceChartsPanelOpen || firstServiceLoadTestData.length !== 0}
                                onToggle={() => LoadTestChartsActions.togglePanel({
                                    isPanelOpen: !isFirstWebServiceChartsPanelOpen,
                                    webServiceId: "first"
                                })}
                                eventKey="1"
                            >
                                <Panel.Heading id="panel-heading-first-web-service-charts">
                                    <Panel.Title id="panel-title-first-web-service-charts" toggle>
                                        <b> First Web Service Metrics Charts</b>
                                    </Panel.Title> 
                                </Panel.Heading>
                                <Panel.Body id="panel-body-first-web-service-charts" collapsible>
                                    <LoadTestCharts
                                        webServiceId="first"
                                        areOperationsDenied={areOperationsDenied}
                                        chartsData={firstServiceLoadTestData}
                                        brushOnChange={this.handleBrushOnChange}
                                    />
                                </Panel.Body>
                            </Panel>
                            <Panel
                                bsStyle="primary"
                                eventKey="2"
                            >
                                <Panel.Heading>
                                    <Panel.Title toggle>
                                        <b>First Web Service Estimations</b>
                                    </Panel.Title>
                                </Panel.Heading>
                                <Panel.Body collapsible>
                                    <EstimationContainer
                                        webServiceId="first" 
                                        brushOnChange={this.handleBrushOnChange}
                                        areOperationsDenied={areOperationsDenied}
                                    />
                                </Panel.Body>
                            </Panel>
                        </PanelGroup>
                    </Col>
                    <Col md={6}>       
                        <PanelGroup id="panel-group-second-web-service">
                            <Panel
                                id="panel-second-web-service-charts"
                                bsStyle="primary"
                                expanded={isSecondWebServiceChartsPanelOpen || secondServiceLoadTestData.length !== 0}
                                onToggle={() => LoadTestChartsActions.togglePanel({
                                    isPanelOpen: !isSecondWebServiceChartsPanelOpen,
                                    webServiceId: "second"
                                })}
                                eventKey="1"
                            >
                                <Panel.Heading>
                                    <Panel.Title toggle>
                                        <b>Second Web Service Metrics Charts</b>
                                    </Panel.Title>
                                </Panel.Heading>
                                <Panel.Body collapsible>
                                    <LoadTestCharts
                                        webServiceId="second"
                                        areOperationsDenied={areOperationsDenied}
                                        chartsData={secondServiceLoadTestData}
                                        brushOnChange={this.handleBrushOnChange}
                                    />
                                </Panel.Body>
                            </Panel>
                            <Panel
                                bsStyle="primary"
                                eventKey="2"
                            >
                                <Panel.Heading>
                                    <Panel.Title toggle>
                                        <b>Second Web Service Estimations</b>
                                    </Panel.Title>
                                </Panel.Heading>
                                <Panel.Body collapsible>
                                    <EstimationContainer
                                        webServiceId="second"
                                        brushOnChange={this.handleBrushOnChange}
                                        areOperationsDenied={areOperationsDenied}
                                    />
                                </Panel.Body>
                             </Panel>
                        </PanelGroup>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default connectToStores(LoadTest);