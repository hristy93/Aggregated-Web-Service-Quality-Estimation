import alt from '../alt';
import LoadTestServices from '../services/LoadTestServices';
import Papa from 'papaparse';
import { displayFailureMessage, displaySuccessMessage } from '../utils/displayInformation';

class LoadTestActions {
    constructor() {
        this.generateActions("setUrl", "setUrlValidity", "setRequestType", "setRequestPostData");
    }

    runLoadTest = (data) => {
        return (dispatch) => {
            LoadTestServices.runLoadTest(data)
                .then((response) => {
                    // handle success
                    const alertMessage = response.data;
                    const logMessage = response;
                    displaySuccessMessage(alertMessage, logMessage);
                    this.writeLoadTestData();
                })
                .catch((error) => {
                    // handle error
                    const alertMessage = "There is a problem with the load test!";
                    displayFailureMessage(alertMessage, error);
                });
        };
    }

    readLoadTestData = () => {
        return (dispatch) => {
            LoadTestServices.readLoadTestData()
                .then((response) => {
                    // handle success
                    console.log(response);
                    const result = response.data;
                    let parsedResult = Papa.parse(result, {
                        header: true
                    });
                    let parsedResultData = parsedResult.data;
                    parsedResultData.sort(function (a, b) {
                        return new Date('1970/01/01 ' + a.IntervalStartTime) - new Date('1970/01/01 ' + b.IntervalStartTime);
                    });
                    console.log(parsedResultData);
                    parsedResultData = parsedResultData.filter(item => item.IntervalStartTime !== "");
                    dispatch(parsedResultData);
                })
                .catch((error) => {
                    // handle error
                    const alertMessage = "There is a problem with the load test data!";
                    displayFailureMessage(alertMessage, error);
                });
        };
    }

    writeLoadTestData = () => {
        LoadTestServices.writeLoadTestData()
            .then((response) => {
                // handle success
                const alertMessage = response.data;
                const logMessage = response;
                displaySuccessMessage(alertMessage, logMessage);
            })
            .catch((error) => {
                // handle error
                const alertMessage = "There is a problem with the load test data!";
                displayFailureMessage(alertMessage, error);
            });
    }

    uploadLoadTestData = (files) => {
        return (dispatch) => {
            LoadTestServices.uploadLoadTestData(files)
                .then((response) => {
                    // handle success
                    const alertMessage = response.data;
                    const logMessage = response;
                    displaySuccessMessage(alertMessage, logMessage);
                })
                .catch((error) => {
                    // handle error
                    const alertMessage = "There is a problem with the upload of the load test file!";
                    displayFailureMessage(alertMessage, error);
                });
        };
    }
}

export default alt.createActions(LoadTestActions);