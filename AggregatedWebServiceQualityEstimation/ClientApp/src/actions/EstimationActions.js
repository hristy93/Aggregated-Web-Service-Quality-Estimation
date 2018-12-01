import alt from '../alt';
import EstimationServices from '../services/EstimationServices';
import { displayFailureMessage, displaySuccessMessage } from '../utils/displayInformation';

class EstimationActions {
    getClusterEstimatorResult = () => {
        return (dispatch) => {
            EstimationServices.getClusterEstimatorResult()
                .then((response) => {
                    // handle success
                    console.log(response);
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
                    console.log(response);
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
                    console.log(response);
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
}

export default alt.createActions(EstimationActions);