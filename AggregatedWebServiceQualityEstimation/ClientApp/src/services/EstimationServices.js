﻿import axios from 'axios';

class EstimationServices {
    static getClusterEstimatorResult() {
        return axios.get("https://localhost:44342/api/test/estimator/cluster");
    }

    static getStatisticalEstimatorResult() {
        return axios.get("https://localhost:44342/api/test/estimator/statistics");
    }

    static getFuzzyLogicEstimatorResult() {
        return axios.get("https://localhost:44342/api/test/estimator/fuzzy-logic");
    }

    static getApdexScoreEstimatorResult(apdexScoreLimit) {
        return axios.get("https://localhost:44342/api/test/estimator/apdex-score?apdexScoreLimit=" + apdexScoreLimit);
    }
}

export default EstimationServices;