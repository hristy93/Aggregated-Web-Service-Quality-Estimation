import alt from '../alt';
import WebServicesActions from '../actions/WebServicesActions';
import immutable from 'alt-utils/lib/ImmutableUtil';
import Immutable from 'immutable';
import isNil from 'lodash/isNil';
import { displayFailureMessage } from '../utils/displayInformation';

class WebServicesStore {
    constructor() {
        this.bindActions(WebServicesActions);

        this.state = Immutable.Map({
            first: Immutable.Map({
                url: "",
                isUrlValid: false,
                requestType: "GET",
                requestPostData: null,
                fileName: ''
            }),
            second: Immutable.Map({
                url: "",
                isUrlValid: false,
                requestType: "GET",
                requestPostData: null,
                fileName: ''
            })
        });
    }

    setUrl = ({ url, webServiceId }) => {
        if (!isNil(url)) {
            this.setState(this.state.setIn([webServiceId, "url"], url));
        } else {
            const alertMessage = "There is a problem with the url!";
            const logMessage = "The url is invalid!";
            displayFailureMessage(alertMessage, logMessage);
        }
    }

    setUrlValidity = ({ isUrlValid, webServiceId }) => {
        this.setState(this.state.setIn([webServiceId ,"isUrlValid"], isUrlValid));
    }                                  
                                       
    setRequestType = ({ requestType, webServiceId }) => {
        this.setState(this.state.setIn([webServiceId, "requestType"], requestType));
    }                                  
                                       
    setRequestPostData = ({ requestPostData, webServiceId }) => {
        this.setState(this.state.setIn([webServiceId, "requestPostData"], requestPostData));
    }

    setFileName = ({ fileName, webServiceId }) => {
        this.setState(this.state.setIn([webServiceId, "fileName"], fileName));
    }

    static getFirstWebServiceData() {
        return this.state.get("first").toJS();
    }

    static getSecondWebServiceData() {
        return this.state.get("second").toJS();
    }

    static getUrlsValidity() {
        return this.state.getIn(["first", "isUrlValid"]) && this.state.getIn(["second", "isUrlValid"]);
    }
}

export default alt.createStore(immutable(WebServicesStore));