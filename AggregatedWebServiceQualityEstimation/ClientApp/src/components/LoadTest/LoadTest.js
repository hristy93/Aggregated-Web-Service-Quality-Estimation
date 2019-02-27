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
    ListGroupItem,
    Tooltip
} from 'react-bootstrap';
import LoadTestMetricsForm from './../LoadTestMetrics/LoadTestMetricsForm';
import LoadTestForm from './LoadTestForm';
import WebServiceForm from '../WebService/WebServiceForm';
import LoadTestCharts from '../LoadTestCharts/LoadTestCharts';
import EstimationContainer from '../Estimation/EstimationContainer';
import connectToStores from 'alt-utils/lib/connectToStores';
import LoadTestStore from '../../stores/LoadTestStore';
import EstimationStore from '../../stores/EstimationStore';
import LoadTestChartsStore from '../../stores/LoadTestChartsStore';
import LoadTestActions from '../../actions/LoadTestActions';
import EstimationActions from '../../actions/EstimationActions';
import LoadTestChartsActions from '../../actions/LoadTestChartsActions';
import WebServicesStore from '../../stores/WebServicesStore';
import WebServicesActions from '../../actions/WebServicesActions';
import FileUpload from '../common/FileUpload/FileUpload';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { displayFailureMessage } from '../../utils/displayInformation';

let testTimer;

class LoadTest extends Component {
    static getStores() {
        return [LoadTestStore, WebServicesStore, EstimationStore, LoadTestChartsStore];
    }

    // TODO: check if the props argument in getPropsFromStores works
    static getPropsFromStores() {
        const newProps = {
            firstServiceLoadTestData: LoadTestStore.getFirstServiceLoadTestData(),
            secondServiceLoadTestData: LoadTestStore.getSecondServiceLoadTestData(),
            firstServiceLoadTestDataInfo: LoadTestStore.getFirstServiceLoadTestDataInfo(),
            secondServiceLoadTestDataInfo: LoadTestStore.getSecondServiceLoadTestDataInfo(),
            firstWebServiceChartsData: LoadTestChartsStore.getFirstWebServiceChartsData(),
            secondWebServiceChartsData: LoadTestChartsStore.getSecondWebServiceChartsData(),
            firstWebServiceEstimationData: EstimationStore.getFirstWebServiceEstimationData(),
            secondWebServiceEstimationData: EstimationStore.getSecondWebServiceEstimationData(),
            loadTestDuration: LoadTestStore.getLoadTestDuration(),
            areUrlsValid: WebServicesStore.getUrlsValidity(),
            testState: LoadTestStore.getTestState(),
            timeLeft: LoadTestStore.getTimeLeft(),
            first: WebServicesStore.getFirstWebServiceData(),
            second: WebServicesStore.getSecondWebServiceData()
        };

        return newProps;
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
            LoadTestActions.clearLoadTestData();
            LoadTestActions.runLoadTest.defer({ data, duration: loadTestDuration });

            LoadTestActions.setTestState({
                isStarted: true,
                isFinished: false
            });

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
            LoadTestActions.uploadLoadTestData.defer({ files, webServiceId });

            const fileName = files[0].name;
            WebServicesActions.setFileName.defer({
                fileName,
                webServiceId
            });
        }
    }

    getLoadTestStateMessage = (testState) => {
        if (!isNil(testState)) {
            if (testState.isStarted && !testState.isFinished) {
                return "Running ...";
            } else if (testState.isWritingTestData) {
                return "Writing test data ...";
            } else {
                return "Not running";
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

    handleEstimationsPanelVisibility = (isPanelVisible, webServiceId) => {
        EstimationActions.setEstimationsPanelVisibility({
            isPanelVisible,
            webServiceId
        });
    }

    handleChartsPanelVisibility = (isPanelVisible, webServiceId) => {
        LoadTestChartsActions.setChartsPanelVisibility({
            isPanelVisible,
            webServiceId
        });
    }

    setCursorState = (areOperationsDenied) => {
        if (areOperationsDenied) {
            document.body.style.cursor = "wait";
        } else {
            document.body.style.cursor = "";
        }
    }

    render() {
        const {
            firstServiceLoadTestData,
            secondServiceLoadTestData,
            firstWebServiceChartsData,
            secondWebServiceChartsData,
            firstWebServiceEstimationData,
            secondWebServiceEstimationData,
            areUrlsValid,
            testState,
            timeLeft,
            first,
            second,
        } = this.props;

        const isTestRunning = testState.isStarted && !testState.isFinished;
        const areOperationsDenied = testState.isWritingTestData || isTestRunning;
        const isRunLoadTestButtonDisabled = !areUrlsValid || areOperationsDenied;

        const isFirstWebServiceChartsPanelOpen = firstWebServiceChartsData.isPanelVisible && firstServiceLoadTestData.length !== 0;
        const isSecondWebServiceChartsPanelOpen = secondWebServiceChartsData.isPanelVisible && secondServiceLoadTestData.length !== 0;

        const areFirstWebServiceEstimationsAvailable = !isEmpty(firstWebServiceEstimationData.apdexScoreData) ||
            !isEmpty(firstWebServiceEstimationData.clusterData) || !isEmpty(firstWebServiceEstimationData.statisticalData);
        const areSecondWebServiceEstimationsAvailable = !isEmpty(secondWebServiceEstimationData.apdexScoreData) ||
            !isEmpty(secondWebServiceEstimationData.clusterData) || !isEmpty(secondWebServiceEstimationData.statisticalData);


        const isFirstWebServiceEstimationsPanelOpen = firstWebServiceEstimationData.isPanelVisible && areFirstWebServiceEstimationsAvailable;
        const isSecondWebServiceEstimationsPanelOpen = secondWebServiceEstimationData.isPanelVisible && areSecondWebServiceEstimationsAvailable;

        this.setCursorState(areOperationsDenied);

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
                                            id="panel-group-metrics-data-source"
                                            accordion 
                                            defaultActiveKey="1"
                                        >
                                            <Panel
                                                id="panel-metrics-data-source-tests"
                                                bsStyle="info"
                                                eventKey="1"
                                            >
                                                <Panel.Heading id="panel-heading-metrics-data-source-tests">
                                                    <Panel.Title id="panel-title-metrics-data-source-tests" toggle>
                                                        <b>Metrics From Performance & Load Tests</b>
                                                    </Panel.Title>
                                                </Panel.Heading >
                                                <Panel.Body id="panel-body-metrics-data-source-tests" collapsible>
                                                    <ListGroupItem>
                                                        <LoadTestForm id='load-test-form' />
                                                        <ButtonToolbar id='button-toolbar-tests-controls'>
                                                            <h5><b> Tests Controls: </b></h5>
                                                            {/*<OverlayTrigger
                                                                trigger={'hover'}
                                                                placement="bottom"
                                                                overlay={this.renderValidateInputsTooltip}
                                                            >*/}
                                                            <Button
                                                                id="button-run-load-test"
                                                                onClick={this.handleRunLoadTestButtonClick}
                                                                disabled={isRunLoadTestButtonDisabled}
                                                            >
                                                                Run Tests
                                                            </Button>
                                                            {/*</OverlayTrigger>*/}
                                                            <Button
                                                                id="button-cancel-load-test"
                                                                onClick={this.handleCancelLoadTestButtonClick}
                                                                disabled={!isTestRunning}
                                                            >
                                                                Cancel Tests
                                                            </Button>
                                                            <Button
                                                                id="button-write-load-test-data"
                                                                onClick={() => this.handleWriteLoadTestDataClick("first")}
                                                            >
                                                                Write Load Test Data
                                                            </Button>
                                                            <Button
                                                                id="button-read-load-test-data"
                                                                onClick={() => this.handleReadLoadTestDataClick("first")}
                                                            >
                                                                Read Load Test Data
                                                             </Button>
                                                            <br />
                                                            <Button
                                                                id="button-write-load-test-data"
                                                                onClick={() => this.handleWriteLoadTestDataClick("second")}
                                                            >
                                                                Write Load Test Data
                                                            </Button>
                                                            <Button
                                                                id="button-read-load-test-data"
                                                                onClick={() => this.handleReadLoadTestDataClick("second")}
                                                            >
                                                                Read Load Test Data
                                                             </Button>
                                                        </ButtonToolbar>
                                                    </ListGroupItem>
                                                    <ListGroupItem>
                                                        <div
                                                            id='tests-state'
                                                            style={{ display: 'inline-flex' }}
                                                        >
                                                            <h5 style={{ marginRight: '1rem' }}>
                                                                <b> Tests State: </b>
                                                            </h5> 
                                                            <h4 style={{ marginTop: '0.8rem' }}>
                                                                {this.getLoadTestStateMessage(testState)}
                                                            </h4>
                                                        </div>
                                                        {
                                                            isTestRunning && !isNil(timeLeft) &&
                                                            <div id='tests-time-left'>
                                                                <h5><b> Time Left: </b></h5>
                                                                <Badge> {timeLeft} </Badge>
                                                            </div>
                                                        }
                                                    </ListGroupItem>
                                                </Panel.Body>
                                            </Panel>
                                            <Panel
                                                id="panel-metrics-data-source-file"
                                                bsStyle="info"
                                                eventKey="2"
                                            >
                                                <Panel.Heading id="panel-heading-metrics-data-source-file">
                                                    <Panel.Title id="panel-title-metrics-data-source-file" toggle> 
                                                        <b>Metrics From CSV File</b>
                                                    </Panel.Title>
                                                </Panel.Heading >
                                                <Panel.Body id="panel-body-metrics-data-source-file" collapsible>
                                                    <FileUpload
                                                        id={'csv-metrics-file-first-web-service'}
                                                        title="Metrics for the first web service:"
                                                        buttonText="Add file"
                                                        fileType=".csv"
                                                        disabled={areOperationsDenied}
                                                        onChange={(event) => this.handleFileUploadChange(event, "first")}
                                                        helpText={first.fileName}
                                                    />
                                                    <FileUpload
                                                        id={'csv-metrics-file-second-web-service'}
                                                        title="Metrics for the second web service:"
                                                        buttonText="Add file"
                                                        fileType=".csv"
                                                        disabled={areOperationsDenied}
                                                        helpText={second.fileName}
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
                <Row
                    id='row-web-services'
                    className="show-grid"
                    style={{ marginTop: '2rem' }}
                >
                    <Col md={6}>
                        <PanelGroup id="panel-group-first-web-service">
                            <Panel
                                id="panel-first-web-service-charts"
                                bsStyle="primary"
                                expanded={isFirstWebServiceChartsPanelOpen}
                                onToggle={() => this.handleChartsPanelVisibility(
                                    !isFirstWebServiceChartsPanelOpen,
                                    "first"
                                )}
                                eventKey="1"
                            >
                                <Panel.Heading id="panel-heading-first-web-service-charts">
                                    <Panel.Title id="panel-title-first-web-service-charts" toggle>
                                        <b> First Web Service Metrics Charts</b>
                                    </Panel.Title> 
                                </Panel.Heading>
                                <Panel.Body id="panel-body-first-web-service-charts" collapsible>
                                    <LoadTestCharts
                                        id='charts-first-web-service'
                                        webServiceId="first"
                                        areOperationsDenied={areOperationsDenied}
                                        chartsData={firstServiceLoadTestData}
                                        brushOnChange={this.handleBrushOnChange}
                                    />
                                </Panel.Body>
                            </Panel>
                            <Panel
                                id="panel-first-web-service-estimations"
                                bsStyle="primary"
                                expanded={isFirstWebServiceEstimationsPanelOpen}
                                onToggle={() => this.handleEstimationsPanelVisibility(
                                    !isFirstWebServiceEstimationsPanelOpen,
                                    "first"
                                )}
                                eventKey="2"
                            >
                                <Panel.Heading id="panel-heading-first-web-service-estimations">
                                    <Panel.Title id="panel-title-first-web-service-estimations" toggle>
                                        <b>First Web Service Estimations</b>
                                    </Panel.Title>
                                </Panel.Heading>
                                <Panel.Body id="panel-body-first-web-service-estimations" collapsible>
                                    <EstimationContainer
                                        id='estimation-container-first-web-service'
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
                                expanded={isSecondWebServiceChartsPanelOpen}
                                onToggle={() => this.handleChartsPanelVisibility(
                                    !isSecondWebServiceChartsPanelOpen,
                                    "second"
                                )}
                                eventKey="1"
                            >
                                <Panel.Heading id="panel-heading-second-web-service-charts">
                                    <Panel.Title id="panel-title-second-web-service-charts" toggle>
                                        <b>Second Web Service Metrics Charts</b>
                                    </Panel.Title>
                                </Panel.Heading>
                                <Panel.Body id="panel-body-second-web-service-charts" collapsible>
                                    <LoadTestCharts
                                        id='charts-second-web-service'
                                        webServiceId="second"
                                        areOperationsDenied={areOperationsDenied}
                                        chartsData={secondServiceLoadTestData}
                                        brushOnChange={this.handleBrushOnChange}
                                    />
                                </Panel.Body>
                            </Panel>
                            <Panel
                                id="panel-second-web-service-estimations"
                                bsStyle="primary"
                                expanded={isSecondWebServiceEstimationsPanelOpen}
                                onToggle={() => this.handleEstimationsPanelVisibility(
                                    !isSecondWebServiceEstimationsPanelOpen,
                                    "second"
                                )}
                                eventKey="2"
                            >
                                <Panel.Heading id="panel-heading-second-web-service-estimattions">
                                    <Panel.Title id="panel-title-second-web-service-estimattions" toggle>
                                        <b>Second Web Service Estimations</b>
                                    </Panel.Title>
                                </Panel.Heading>
                                <Panel.Body collapsible>
                                    <EstimationContainer
                                        id='estimation-container-second-web-service'
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
export { LoadTest };