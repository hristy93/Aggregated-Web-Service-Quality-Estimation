import alt from '../alt';
import LoadTestActions from '../actions/LoadTestActions';
import EstimationActions from '../actions/EstimationActions';
import LoadTestChartsActions from '../actions/LoadTestChartsActions';
import EstimationStore from '../stores/EstimationStore';
import immutable from 'alt-utils/lib/ImmutableUtil';
import Immutable from 'immutable';
import isNil from 'lodash/isNil';
import { displaySuccessMessage, displayFailureMessage } from '../utils/displayInformation';

class LoadTestStore {
    constructor() {
        this.bindActions(LoadTestActions);

        this.state = Immutable.Map({
            first: Immutable.Map({
                loadTestData: [],
                isFromFile: false,
                loadTestDataSize: 0
            }),
            second: Immutable.Map({
                loadTestData: [],
                isFromFile: false,
                loadTestDataSize: 0
            }),
            loadTestDuration: "00:00:30",
            url: "https://jsonplaceholder.typicode.com/todos/1",
            isUrlValid: false,
            requestType: "GET",
            testState: {
                isStarted: false,
                isFinished: false,
                isWritingTestData: false
            },
            requestPostData: null,
            timeLeft: null
        });
    }

    runLoadTest = (testResult) => {
        LoadTestActions.setTestState.defer({
            isStarted: false,
            isFinished: true,
            isWritingTestData: true
        });

        LoadTestActions.writeLoadTestData.defer("first");
        LoadTestActions.writeLoadTestData.defer("second");
    }

    readLoadTestData = ({ loadTestData, webServiceId }) => {
        //console.log("loadTestData", webServiceId, loadTestData);
        if (!isNil(loadTestData)) {
            this.setState(this.state.setIn([webServiceId, "loadTestData"], loadTestData));

            const loadTestDataLength = loadTestData.length;

            // Set charts' panel visibility to true
            LoadTestChartsActions.setChartsPanelVisibility.defer({
                isPanelVisible: true,
                webServiceId
            });

            // Set the size of the test data
            this.setLoadTestDataSize({
                loadTestDataSize: loadTestDataLength,
                webServiceId
            });
        } else {
            const alertMessage = "There is a problem with the load test data!";
            const logMessage = "The load test data is invalid!";
            displayFailureMessage(alertMessage, logMessage);
        }
    }

    writeLoadTestData = ({ isLoadTestDataWritten, webServiceId }) => {
        if (isLoadTestDataWritten) {
            LoadTestActions.readLoadTestData.defer({ fromFile: true, webServiceId });

            // if you want to generate the estimators result after displaying the metrics data
            this.getEstimatorsData(webServiceId);
        }

        LoadTestActions.setTestState.defer({
            isWritingTestData: false
        });
    }

    uploadLoadTestData = ({ isFileUploaded, fileContentLines, webServiceId }) => {
        if (isFileUploaded) {

            this.setLoadTestDataSource({ isFromFile: true, webServiceId });
            this.setLoadTestDataSize({ loadTestDataSize: fileContentLines, webServiceId });

            const otherWebServiceLoadTestDataSize = webServiceId === "first" ?
                this.state.getIn(["second", "loadTestDataSize"]) : this.state.getIn(["first", "loadTestDataSize"]);

            if (otherWebServiceLoadTestDataSize !== 0 && otherWebServiceLoadTestDataSize !== fileContentLines) {
                const alertMessage = "The the test data from the CSV file doesn't have the same number of lines as the previous one. " +
                    "Please check your data and upload the file again!";
                const logMessage = "The load test data lines from the CSV file are inconsistent with the previous one!";
                displayFailureMessage(alertMessage, logMessage);

                return;
            } else {
                const alertMessage = `The CSV file for the ${webServiceId} web service is uploaded successfully!`;
                const logMessage = alertMessage;
                displaySuccessMessage(alertMessage, logMessage);
            }

            LoadTestActions.readLoadTestData.defer({ fromFile: true, webServiceId });

            // if you want to generate the estimators result after displaying the metrics data
            this.getEstimatorsData(webServiceId);
        }
    }

    getEstimatorsData = (webServiceId) => {
        // Get the statistics estimator's result and displaying it in a table
        EstimationActions.getStatisticalEstimatorResult.defer(webServiceId);

        // Get the apdex estimator's result and displaying it in a chart
        this.waitFor(EstimationStore);
        let apdexScoreLimit = EstimationStore.getState().getIn([webServiceId, "apdexScoreLimit"]);
        apdexScoreLimit = !isNil(apdexScoreLimit) ? apdexScoreLimit : "";
        EstimationActions.getApdexScoreEstimatorResult.defer({
            apdexScoreLimit,
            webServiceId
        });

        // Get cluster estimator's result and display it in the panel
        EstimationActions.getClusterEstimatorResult.defer(webServiceId);

        // Set estimations' panel visibility to true
        EstimationActions.setEstimationsPanelVisibility.defer({
            isPanelVisible: true,
            webServiceId
        });
    }

    setLoadTestDuration = (loadTestDuration) => {
        this.setState(this.state.set("loadTestDuration", loadTestDuration));
    }

    setTestState = (newTestState) => {
        if (!isNil(newTestState)) {
            const localTestState = this.state.get("testState");
            if (!isNil(newTestState.isStarted)) {
                localTestState["isStarted"] = newTestState.isStarted;
            }
            if (!isNil(newTestState.isFinished)) {
                localTestState["isFinished"] = newTestState.isFinished;
            }
            if (!isNil(newTestState.isWritingTestData)) {
                localTestState["isWritingTestData"] = newTestState.isWritingTestData;
            }

            this.setState(this.state.set("testState", localTestState));
        }
    }

    clearLoadTestData = () => {
        this.setState(this.state
            .setIn(["first", "loadTestData"], [])
            .setIn(["second", "loadTestData"], []));
    }

    setTimeLeft = (timeLeft) => {
        this.setState(this.state.set("timeLeft", timeLeft));
    }

    setLoadTestDataSize = ({ loadTestDataSize, webServiceId }) => {
        this.setState(this.state.setIn([webServiceId, "loadTestDataSize"], loadTestDataSize));
    }

    setLoadTestDataSource = ({ isFromFile, webServiceId }) => {
        this.setState(this.state.setIn([webServiceId, "isFromFile"], isFromFile));
    }

    static getFirstServiceLoadTestData() {
        return this.state.getIn(["first", "loadTestData"]);
    }

    static getSecondServiceLoadTestData() {
        return this.state.getIn(["second", "loadTestData"]);
    }

    static getLoadTestDuration() {
        return this.state.get("loadTestDuration");
    }

    static getTestState() {
        return this.state.get("testState");
    }

    static getTimeLeft() {
        return this.state.get("timeLeft");
    }

    static getFirstServiceLoadTestDataInfo() {
        return {
            loadTestDataSize: this.state.getIn(["first", "loadTestDataSize"]),
            loadTestDataSource: this.state.getIn(["first", "isFromFile"]) ? "file" : "tests"
        };
    }

    static getSecondServiceLoadTestDataInfo() {
        return {
            loadTestDataSize: this.state.getIn(["second", "loadTestDataSize"]),
            loadTestDataSource: this.state.getIn(["second", "isFromFile"]) ? "file" : "tests"
        };
    }
}

export default alt.createStore(immutable(LoadTestStore));