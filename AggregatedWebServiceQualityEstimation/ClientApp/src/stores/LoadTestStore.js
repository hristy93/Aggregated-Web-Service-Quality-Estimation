﻿import alt from '../alt';
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
            url: "https://jsonplaceholder.typicode.com/todos/1",
            isUrlValid: false,
            requestType: "GET",
            requestPostData: null
        })
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

    setRequestPostData(requestPostData) {
        this.setState(this.state.set("requestPostData", requestPostData));
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
}

export default alt.createStore(immutable(LoadTestStore));