import alt from '../alt';
import LoadTestServices from '../services/LoadTestServices';
import Papa from 'papaparse';
import { displayFailureMessage, displaySuccessMessage } from '../utils/displayInformation';

const tempDate = '1970/01/01 ';

class LoadTestActions {
    constructor() {
        this.generateActions("setUrl", "setUrlValidity", "setRequestType", "setRequestPostData", "setLoadTestDuration",
            "setTestState", "setTimeLeft", "clearLoadTestData", "setLoadTestDataSize", "setLoadTestDataSource");
    }

    runLoadTest = ({ data, duration }) => {
        return (dispatch) => {
            LoadTestServices.runLoadTest(data, duration)
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

    cancelLoadTest = () => {
        return (dispatch) => {
            LoadTestServices.cancelLoadTest()
                .then((response) => {
                    // handle success
                    const alertMessage = response.data;
                    const logMessage = response;
                    displaySuccessMessage(alertMessage, logMessage);
                })
                .catch((error) => {
                    // handle error
                    const alertMessage = "There is a problem with the canceling of the load test!";
                    displayFailureMessage(alertMessage, error);
                });
        };
    }

    checkLoadTestStatus = () => {
        return (dispatch) => {
            LoadTestServices.cancelLoadTest()
                .then((response) => {
                    // handle success
                    const alertMessage = response.data;
                    const logMessage = response;
                    displaySuccessMessage(alertMessage, logMessage);
                    dispatch({ isCanceled: true });
                })
                .catch((error) => {
                    // handle error
                    const alertMessage = "There is a problem with the load test!";
                    displayFailureMessage(alertMessage, error);
                    dispatch({ isTestCanceled: false });
                });
        };
    }

    readLoadTestData = ({ fromFile, webServiceId }) => {
        return (dispatch) => {
            LoadTestServices.readLoadTestData(fromFile, webServiceId)
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
                    //console.log("parsedResultData", webServiceId, parsedResultData);
                    dispatch({ loadTestData: parsedResultData, webServiceId });
                })
                .catch((error) => {
                    // handle error
                    const alertMessage = "There is a problem with the load test data!";
                    displayFailureMessage(alertMessage, error);
                });
        };
    }

    writeLoadTestData = (webServiceId) => {
        return (dispatch) => {
            LoadTestServices.writeLoadTestData(webServiceId)
                .then((response) => {
                    // handle success
                    const alertMessage = response.data;
                    const logMessage = response;
                    displaySuccessMessage(alertMessage, logMessage);
                    dispatch({ isLoadTestDataWritten: true, webServiceId });
                })
                .catch((error) => {
                    // handle error
                    const alertMessage = "There is a problem with the load test data!";
                    displayFailureMessage(alertMessage, error);
                    dispatch({ isLoadTestDataWritten: true, webServiceId});
                });
        };
    }

    uploadLoadTestData = ({ files, webServiceId }) => {
        return (dispatch) => {
            LoadTestServices.uploadLoadTestData(files, webServiceId)
                .then((response) => {
                    // handle success
                    const fileContentLines = response.data;
                    if (fileContentLines !== 0) {
                        dispatch({ isFileUploaded: true, fileContentLines, webServiceId });
                    } else {
                        // handle error
                        const alertMessage = "There CSV file is empty!";
                        displayFailureMessage(alertMessage);
                        dispatch({ isFileUploaded: false, webServiceId});
                    }
                })
                .catch((error) => {
                    // handle error
                    const alertMessage = "There is a problem with the upload of the load test file!";
                    displayFailureMessage(alertMessage, error);
                    dispatch({ isFileUploaded: false, webServiceId});
                });
        };
    }
}

export default alt.createActions(LoadTestActions);