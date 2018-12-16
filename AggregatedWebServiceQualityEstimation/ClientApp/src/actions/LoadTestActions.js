import alt from '../alt';
import LoadTestServices from '../services/LoadTestServices';
import Papa from 'papaparse';
import { displayFailureMessage, displaySuccessMessage } from '../utils/displayInformation';

const tempDate = '1970/01/01 ';

class LoadTestActions {
    constructor() {
        this.generateActions("setUrl", "setUrlValidity", "setRequestType", "setRequestPostData", "setLoadTestDuration",
            "setTestState");
    }

    runLoadTest = (data) => {
        return (dispatch) => {
            LoadTestServices.runLoadTest(data)
                .then((response) => {
                    // handle success
                    const alertMessage = response.data;
                    const logMessage = response;
                    displaySuccessMessage(alertMessage, logMessage);
                    dispatch({ isTestSuccessful: true });
                })
                .catch((error) => {
                    // handle error
                    const alertMessage = "There is a problem with the load test!";
                    displayFailureMessage(alertMessage, error);
                    dispatch({ isTestSuccessful: false });
                });
        };
    }

    readLoadTestData = () => {
        return (dispatch) => {
            LoadTestServices.readLoadTestData()
                .then((response) => {
                    // handle success
                    const result = response.data;
                    let parsedResult = Papa.parse(
                        result, {
                            header: true
                        }
                    );
                    let parsedResultData = parsedResult.data;
                    parsedResultData.sort(function (a, b) {
                        return new Date(tempDate + a.IntervalStartTime) - new Date(tempDate + b.IntervalStartTime);
                    });
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
        return (dispatch) => {
            LoadTestServices.writeLoadTestData()
                .then((response) => {
                    // handle success
                    const alertMessage = response.data;
                    const logMessage = response;
                    displaySuccessMessage(alertMessage, logMessage);
                    dispatch({ isLoadTestDataWritten: true });
                })
                .catch((error) => {
                    // handle error
                    const alertMessage = "There is a problem with the load test data!";
                    displayFailureMessage(alertMessage, error);
                    dispatch({ isLoadTestDataWritten: true });
                });
        };
    }

    uploadLoadTestData = (files) => {
        return (dispatch) => {
            LoadTestServices.uploadLoadTestData(files)
                .then((response) => {
                    // handle success
                    const alertMessage = response.data;
                    const logMessage = response;
                    displaySuccessMessage(alertMessage, logMessage);
                    dispatch({ isFileUploaded: true });
                })
                .catch((error) => {
                    // handle error
                    const alertMessage = "There is a problem with the upload of the load test file!";
                    displayFailureMessage(alertMessage, error);
                    dispatch({ isFileUploaded: false });
                });
        };
    }
}

export default alt.createActions(LoadTestActions);