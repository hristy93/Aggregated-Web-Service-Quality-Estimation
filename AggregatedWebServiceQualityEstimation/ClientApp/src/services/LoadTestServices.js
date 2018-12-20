import axios from 'axios';

class LoadTestServices {
    static runLoadTest(data) {
        return axios.post("https://localhost:44342/api/test/run", JSON.stringify(data), {
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

    static uploadLoadTestData(files) {
        const file = new Blob([files[0]], { type: 'text/csv' });

        const formData = new FormData();
        formData.append('file', file, file.filename);

        return axios.post("https://localhost:44342/api/test/data/upload", formData);
    }

    static writeLoadTestData() {
        return axios.get("https://localhost:44342/api/test/data/write");
    }

    static readLoadTestData(fromFile) {
        if (fromFile) {
            return axios.get("https://localhost:44342/api/test/data/read?fromFile=true");
        } else {
            return axios.get("https://localhost:44342/api/test/data/read?fromFile=false");
        }
    }
}

export default LoadTestServices;