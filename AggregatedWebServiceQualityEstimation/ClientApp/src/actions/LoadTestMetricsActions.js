import alt from '../alt';
import { displayFailureMessage, logActivity } from '../utils/displayInformation';

import LoadTestMetricsServices from '../services/LoadTestMetricsServices';

class LoadTestMetricsActions {
    constructor() {
        this.generateActions("setMetricsUsability");
    }

    saveMetricsUsabilityInfo = (metricsUsabilityInfo) => {
        return (dispatch) => {
            LoadTestMetricsServices.saveMetricsUsabilityInfo(metricsUsabilityInfo)
                .then((response) => {
                    // handle success
                    const logMessage = response.data;
                    logActivity(logMessage);
                    dispatch({ isSaveSuccessful: true });
                })
                .catch((error) => {
                    // handle error
                    const alertMessage = "There is a problem with the load test!";
                    displayFailureMessage(alertMessage, error);
                    dispatch({ isSaveSuccessful: false });
                });
        };
    }
}

export default alt.createActions(LoadTestMetricsActions);