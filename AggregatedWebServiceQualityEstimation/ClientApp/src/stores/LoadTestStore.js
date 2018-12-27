﻿import alt from '../alt';
import LoadTestActions from '../actions/LoadTestActions';
import EstimationActions from '../actions/EstimationActions';
import EstimationStore from '../stores/EstimationStore';
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
            requestPostData: null,
            timeLeft: null
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
            LoadTestActions.readLoadTestData.defer(true);
        }

        LoadTestActions.setTestState.defer({
            writingTestData: false
        });
    }

    uploadLoadTestData = (result) => {
        if (!isNil(result) && result.isFileUploaded) {
            LoadTestActions.readLoadTestData.defer(true);

            // Get the statistics estimator's result and displaying it in a table
            EstimationActions.getStatisticalEstimatorResult.defer();

            // Get the apdex estimator's result and displaying it in a chart
            this.waitFor(EstimationStore);
            const apdexScoreLimit = EstimationStore.getApdexScoreLimit();
            EstimationActions.getApdexScoreEstimatorResult.defer(apdexScoreLimit);
        }
    }

    setUrl = (url) => {
        if (!isNil(url)) {
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

    setRequestPostData = (requestPostData) => {
        this.setState(this.state.set("requestPostData", requestPostData));
    }

    setLoadTestDuration = (loadTestDuration) => {
        this.setState(this.state.set("loadTestDuration", loadTestDuration));
    }

    setTestState = (newTestState) => {
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

    clearLoadTestData = () => {
        this.setState(this.state.set("loadTestData", []));
    }

    setTimeLeft = (timeLeft) => {
        this.setState(this.state.set("timeLeft", timeLeft));
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

    static getTimeLeft() {
        return this.state.get("timeLeft");
    }
}

export default alt.createStore(immutable(LoadTestStore));