import alt from '../alt';
import LoadTestActions from '../actions/LoadTestActions';
import EstimationActions from '../actions/EstimationActions';
import WebServicesActions from '../actions/WebServicesActions';
import LoadTestChartsActions from '../actions/LoadTestChartsActions';
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

    runLoadTest = ({ isTestSuccessful }) => {
        if (isTestSuccessful) {
            LoadTestActions.setTestState.defer({
                isStarted: false,
                isFinished: true,
                isWritingTestData: true
            });

            LoadTestActions.writeLoadTestData.defer("first");
            LoadTestActions.writeLoadTestData.defer("second");

            WebServicesActions.setFileName.defer({
                fileName: '',
                webServiceId: "first"
            });
            WebServicesActions.setFileName.defer({
                fileName: '',
                webServiceId: "second"
            });

            this.setLoadTestDataSource({
                isFromFile: false,
                webServiceId: "first"
            });
            this.setLoadTestDataSource({
                isFromFile: false,
                webServiceId: "second"
            });
        } else {
            LoadTestActions.setTestState.defer({
                isStarted: false,
                isFinished: false,
                isWritingTestData: false
            });
        }
    }

    readLoadTestData = ({ loadTestData, webServiceId }) => {
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

            EstimationActions.getAllEstimatorsResults.defer(webServiceId);
        }

        LoadTestActions.setTestState.defer({
            isWritingTestData: false
        });
    }

    uploadLoadTestData = ({ isFileUploaded, fileContentLines, webServiceId }) => {
        if (isFileUploaded) {

            this.setLoadTestDataSource({ isFromFile: true, webServiceId });
            this.setLoadTestDataSize({ loadTestDataSize: fileContentLines, webServiceId });

            const isOtherWebServiceLoadTestDataFromFile = webServiceId === "first" ?
                this.state.getIn(["second", "isFromFile"]) : this.state.getIn(["first", "isFromFile"]);

            const otherWebServiceLoadTestDataSize = webServiceId === "first" ?
                this.state.getIn(["second", "loadTestDataSize"]) : this.state.getIn(["first", "loadTestDataSize"]);

            if (otherWebServiceLoadTestDataSize !== 0 && isOtherWebServiceLoadTestDataFromFile &&
                otherWebServiceLoadTestDataSize !== fileContentLines) {
                const alertMessage = "The the test data from the CSV file doesn't have the same number of lines as the previous one. " +
                    "Please check your data and upload the file again!";
                const logMessage = "The load test data lines from the CSV file are inconsistent with the previous one!";
                displayFailureMessage(alertMessage, logMessage);
                return;
            } 

            const alertMessage = `The CSV file for the ${webServiceId} web service is uploaded successfully!`;
            const logMessage = alertMessage;
            displaySuccessMessage(alertMessage, logMessage);

            LoadTestActions.readLoadTestData.defer({ fromFile: true, webServiceId });

            EstimationActions.getAllEstimatorsResults.defer(webServiceId);
        }
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