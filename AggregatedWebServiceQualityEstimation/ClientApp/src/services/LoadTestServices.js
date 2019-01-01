import axios from 'axios';

class LoadTestServices {
    static runLoadTest(data, duration) {
        return axios.post("https://localhost:44342/api/test/run?duration=" + duration, JSON.stringify(data), {
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json"
            }
        });
    }

    static cancelLoadTest() {
        return axios.get("https://localhost:44342/api/test/cancel");
    }

    static checkLoadTestStatus() {
        return axios.get("https://localhost:44342/api/test/status");
    }

    static uploadLoadTestData(files, webServiceId = "first") {
        const file = new Blob([files[0]], { type: 'text/csv' });

        const formData = new FormData();
        formData.append('file', file, file.filename);

        return axios.post("https://localhost:44342/api/test/data/upload?webServiceId=" + webServiceId, formData);
    }

    static writeLoadTestData(webServiceId = "first") {
        return axios.get("https://localhost:44342/api/test/data/write?webServiceId=" + webServiceId);
    }

    static readLoadTestData(fromFile, webServiceId = "first") {
        if (fromFile) {
            return axios.get("https://localhost:44342/api/test/data/read?fromFile=true&webServiceId=" + webServiceId);
        } else {
            return axios.get("https://localhost:44342/api/test/data/read?fromFile=false&webServiceId=" + webServiceId);
        }
    }
}

export default LoadTestServices;