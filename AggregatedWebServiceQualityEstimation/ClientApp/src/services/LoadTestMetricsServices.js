import axios from 'axios';

class LoadTestMetricsServices {
    static saveMetricsUsabilityInfo(metricsUsabilityInfo) {
        return axios.post("https://localhost:44342/api/test/metrics", JSON.stringify(metricsUsabilityInfo), {
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json"
            }
        });
    }
}

export default LoadTestMetricsServices;