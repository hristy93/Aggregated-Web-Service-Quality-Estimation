import alt from '../alt';
import EstimationServices from '../services/EstimationServices';
import { displayFailureMessage } from '../utils/displayInformation';

const tempDate = '1970/01/01 ';

class EstimationActions {
    constructor() {
        this.generateActions("setApdexScoreLimit", "clearApdexScoreData", "setEstimationsPanelVisibility",
        "getAllEstimatorsResults");
    }

    getClusterEstimatorResult = (webServiceId) => {
        return (dispatch) => {
            EstimationServices.getClusterEstimatorResult(webServiceId)
                .then((response) => {
                    // handle success
                    const clusterData = response.data;
                    dispatch({ clusterData, webServiceId });
                })
                .catch((error) => {
                    // handle error
                    const alertMessage = `There is a problem with the cluster estimator's result of the ${webServiceId} web service!`;
                    displayFailureMessage(alertMessage, error);
                });
        };
    }

    getStatisticalEstimatorResult = (webServiceId) => {
        return (dispatch) => {
            EstimationServices.getStatisticalEstimatorResult(webServiceId)
                .then((response) => {
                    // handle success
                    //console.log(response);
                    const statisticalData = response.data;

                    dispatch({ statisticalData, webServiceId });
                })
                .catch((error) => {
                    // handle error
                    const alertMessage = `There is a problem with the statistical estimator's result of the ${webServiceId} web service!`;
                    displayFailureMessage(alertMessage, error);
                });
        };
    }

    getFuzzyLogicEstimatorResult = (webServiceId) => {
        return (dispatch) => {
            EstimationServices.getFuzzyLogicEstimatorResult(webServiceId)
                .then((response) => {
                    // handle success
                    //console.log(response);
                    const fuzzyLogicData = response.data;

                    dispatch({ fuzzyLogicData, webServiceId });
                })
                .catch((error) => {
                    // handle error
                    const alertMessage = `There is a problem with the fuzzy logic estimator's result of the ${webServiceId} web service!`;
                    displayFailureMessage(alertMessage, error);
                });
        };
    }

    getApdexScoreEstimatorResult({ apdexScoreLimit, webServiceId }) {
        return (dispatch) => {
            EstimationServices.getApdexScoreEstimatorResult(apdexScoreLimit, webServiceId)
                .then((response) => {
                    // handle success
                    //console.log(response);
                    const apdexScoreData = response.data;
                    apdexScoreData.apdexScoreEstimations.sort(function (a, b) {
                        return new Date(tempDate + a.IntervalStartTime) - new Date(tempDate + b.IntervalStartTime);
                    });
                    dispatch({ apdexScoreData, webServiceId });
                })
                .catch((error) => {
                    // handle error
                    const alertMessage = `There is a problem with the apdex score estimator's result of the ${webServiceId} web service!`;
                    displayFailureMessage(alertMessage, error);
                });
        };
    }
}

export default alt.createActions(EstimationActions);