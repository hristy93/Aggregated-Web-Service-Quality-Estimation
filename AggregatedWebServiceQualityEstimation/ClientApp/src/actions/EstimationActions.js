import alt from '../alt';
import EstimationServices from '../services/EstimationServices';
import { displayFailureMessage } from '../utils/displayInformation';

const tempDate = '1970/01/01 ';

class EstimationActions {
    constructor() {
        this.generateActions("setApdexScoreLimit", "clearApdexScoreData");
    }

    getClusterEstimatorResult = () => {
        return (dispatch) => {
            EstimationServices.getClusterEstimatorResult()
                .then((response) => {
                    // handle success
                    const result = response.data;
                    dispatch(result);
                })
                .catch((error) => {
                    // handle error
                    const alertMessage = "There is a problem with the cluster estimator's result!";
                    displayFailureMessage(alertMessage, error);
                });
        };
    }

    getStatisticalEstimatorResult = () => {
        return (dispatch) => {
            EstimationServices.getStatisticalEstimatorResult()
                .then((response) => {
                    // handle success
                    //console.log(response);
                    const result = response.data;

                    dispatch(result);
                })
                .catch((error) => {
                    // handle error
                    const alertMessage = "There is a problem with the statistical estimator's result!";
                    displayFailureMessage(alertMessage, error);
                });
        };
    }

    getFuzzyLogicEstimatorResult = () => {
        return (dispatch) => {
            EstimationServices.getFuzzyLogicEstimatorResult()
                .then((response) => {
                    // handle success
                    //console.log(response);
                    const result = response.data;

                    dispatch(result);
                })
                .catch((error) => {
                    // handle error
                    const alertMessage = "There is a problem with the fuzzy logic estimator's result!";
                    displayFailureMessage(alertMessage, error);
                });
        };
    }

    getApdexScoreEstimatorResult(apdexScoreLimit) {
        return (dispatch) => {
            EstimationServices.getApdexScoreEstimatorResult(apdexScoreLimit)
                .then((response) => {
                    // handle success
                    //console.log(response);
                    const result = response.data;
                    result.sort(function (a, b) {
                        return new Date(tempDate + a.IntervalStartTime) - new Date(tempDate + b.IntervalStartTime);
                    });
                    dispatch(result);
                })
                .catch((error) => {
                    // handle error
                    const alertMessage = "There is a problem with the apdex score estimator's result!";
                    displayFailureMessage(alertMessage, error);
                });
        };
    }
}

export default alt.createActions(EstimationActions);