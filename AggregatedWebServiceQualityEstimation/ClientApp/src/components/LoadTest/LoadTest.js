import React, { Component } from 'react';
import axios from 'axios';

class LoadTest extends Component {
    constructor(props) {
        super(props);
        this.handleRunLoadTestButtonClick = this.handleRunLoadTestButtonClick.bind(this);
        this.handleWriteLoadTestDataClick = this.handleWriteLoadTestDataClick.bind(this);
    }

    handleRunLoadTestButtonClick() {
        axios.get("https://localhost:44342/api/test/run")
            .then((response) => {
                // handle success
                console.log(response);
                alert(response.data)
            })
            .catch((error) => {
                // handle error
                console.log(error);
                alert(error)
            });
    }

    handleWriteLoadTestDataClick() {
        axios.get("https://localhost:44342/api/test/data/write")
            .then((response) => {
                // handle success
                console.log(response);
                alert(response.data)
            })
            .catch((error) => {
                // handle error
                console.log(error);
                alert(error)
            });
    }

    render() {
        return (
            <div>
                <button
                    id="run-load-test-button"
                    onClick={this.handleRunLoadTestButtonClick}
                    value="Run Load Test"
                >
                    Run Load Test
                </button>

                <button
                    id="write-load-test-data-button"
                    onClick={this.handleWriteLoadTestDataClick}
                >
                    Write Load Test Data
                </button>

            </div>
        );
    }
}

export default LoadTest;