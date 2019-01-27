import axios from 'axios';

class EstimationServices {
    static getClusterEstimatorResult(webServiceId = "first") {
        return axios.get("https://localhost:44342/api/estimator/cluster?webServiceId=" + webServiceId);
    }

    static getStatisticalEstimatorResult(webServiceId = "first") {
        return axios.get("https://localhost:44342/api/estimator/statistics?webServiceId=" + webServiceId);
    }

    static getFuzzyLogicEstimatorResult(webServiceId = "first") {
        return axios.get("https://localhost:44342/api/estimator/fuzzy-logic?webServiceId=" + webServiceId);
    }

    static getApdexScoreEstimatorResult(apdexScoreLimit, webServiceId = "first") {
        return axios.get("https://localhost:44342/api/estimator/apdex-score?apdexScoreLimit=" + apdexScoreLimit + "&webServiceId=" + webServiceId);
    }
}

export default EstimationServices;