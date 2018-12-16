import alt from '../alt';
import LoadTestActions from '../actions/LoadTestActions';
import immutable from 'alt-utils/lib/ImmutableUtil';
import Immutable from 'immutable';
import isNil from 'lodash/isNil';
import { displayFailureMessage } from '../utils/displayInformation';

class LoadTestStore {
    constructor() {
        this.bindActions(LoadTestActions);

        this.state = Immutable.Map({
            loadTestData: [],
            loadTestDuration: "00:00:30",
            url: "https://jsonplaceholder.typicode.com/todos/1",
            isUrlValid: false,
            requestType: "GET",
            testState: {
                isStarted: false,
                isFinished: false,
                writingTestData: false
            },
            requestPostData: null
        });
    }

    runLoadTest = (testResult) => {
        LoadTestActions.setTestState.defer({
            started: false,
            finished: true,
            writingTestData: true
        });

        LoadTestActions.writeLoadTestData.defer();
    }

    readLoadTestData = (loadTestData) => {
        if (!isNil(loadTestData)) {
            this.setState(this.state.set("loadTestData", loadTestData));
        } else {
            const alertMessage = "There is a problem with the load test data!";
            const logMessage = "The load test data is invalid!";
            displayFailureMessage(alertMessage, logMessage);
        }
       
    }

    writeLoadTestData = (result) => {
        if (!isNil(result) && result.isLoadTestDataWritten) {
            LoadTestActions.readLoadTestData.defer();
        }

        LoadTestActions.setTestState.defer({
            writingTestData: false
        });
    }

    uploadLoadTestData = (result) => {
        if (!isNil(result) && result.isFileUploaded) {
            LoadTestActions.readLoadTestData.defer();
        }
    }

    setUrl = (url) => {        if (!isNil(url)) {
            this.setState(this.state.set("url", url));
        } else {
            const alertMessage = "There is a problem with the url!";
            const logMessage = "The url is invalid!";
            displayFailureMessage(alertMessage, logMessage);
        }
    }

    setUrlValidity = (isUrlValid) => {
        this.setState(this.state.set("isUrlValid", isUrlValid));
    }

    setRequestType = (requestType) => {
        this.setState(this.state.set("requestType", requestType));
    }

    setRequestPostData(requestPostData) {
        this.setState(this.state.set("requestPostData", requestPostData));
    }

    setLoadTestDuration(loadTestDuration) {
        this.setState(this.state.set("loadTestDuration", loadTestDuration));
    }

    setTestState(newTestState) {
        if (!isNil(newTestState)) {
            const localTestState = this.state.get("testState");
            if (!isNil(newTestState.started)) {
                localTestState["started"] = newTestState.started;
            }
            if (!isNil(newTestState.finished)) {
                localTestState["finished"] = newTestState.finished;
            }
            if (!isNil(newTestState.writingTestData)) {
                localTestState["writingTestData"] = newTestState.writingTestData;
            }

            this.setState(this.state.set("testState", localTestState));
        }
    }

    static getLoadTestData() {
        return this.state.get("loadTestData");
    }

    static getUrl() {
        return this.state.get("url");
    }

    static getUrlValidity() {
        return this.state.get("isUrlValid");
    }

    static getRequestType() {
        return this.state.get("requestType");
    }

    static getRequestPostData() {
        return this.state.get("requestPostData");
    }

    static getLoadTestDuration() {
        return this.state.get("loadTestDuration");
    }

    static getTestState() {
        return this.state.get("testState");
    }
}

export default alt.createStore(immutable(LoadTestStore));