import axios from 'axios';

class LoadTestServices {
    static runLoadTest() {
        return axios.get("https://localhost:44342/api/test/run");
    }

    static writeLoadTestData() {
        return axios.get("https://localhost:44342/api/test/data/write");
    }
}

export default LoadTestServices;