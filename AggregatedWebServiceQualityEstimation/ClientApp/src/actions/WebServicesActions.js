import alt from '../alt';

class WebServicesActions {
    constructor() {
        this.generateActions("setUrl", "setUrlValidity", "setRequestType", "setRequestPostData",
            'setFileName');
    }
}

export default alt.createActions(WebServicesActions);