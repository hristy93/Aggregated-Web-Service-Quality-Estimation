import axios from 'axios';

class LoadTestServices {
    static runLoadTest(url) {
        return axios.post("https://localhost:44342/api/test/run", "\"" + url + "\"", {
            headers: {
                "Content-type": "application/json",
            }
        });
    }

    static writeLoadTestData() {
        return axios.get("https://localhost:44342/api/test/data/write");
    }

    static readLoadTestData() {
        return axios.get("https://localhost:44342/api/test/data/read");
    }
}

export default LoadTestServices;