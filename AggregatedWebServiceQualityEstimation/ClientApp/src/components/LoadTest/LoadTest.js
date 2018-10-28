import React, { Component } from 'react';
import LoadTestServices from '../../services/LoadTestServices';
import LineChart from './../common/LineChart/LineChart';
import Papa from 'papaparse';
import { responseTimeTestData } from '../../data/testData';

class LoadTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            csvData: []
        };
        this.handleRunLoadTestButtonClick = this.handleRunLoadTestButtonClick.bind(this);
        this.handleWriteLoadTestDataClick = this.handleWriteLoadTestDataClick.bind(this);
        this.handleReadLoadTestDataClick = this.handleReadLoadTestDataClick.bind(this);
    }

    handleRunLoadTestButtonClick() {
        LoadTestServices.runLoadTest()
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
        LoadTestServices.writeLoadTestData()
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

    handleReadLoadTestDataClick() {
        LoadTestServices.readLoadTestData()
            .then((response) => {
                // handle success
                console.log(response);
                const result = response.data;
                let parsedResult = Papa.parse(result, {
                    header: true
                });
                let parsedResultData = parsedResult.data;
                console.log(parsedResultData);
                parsedResultData.pop();
                this.setState({
                    csvData: parsedResultData
                });
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
                <button
                    id="read-load-test-data-button"
                    onClick={this.handleReadLoadTestDataClick}
                >
                    Read Load Test Data
                </button>
                <LineChart XAxisKey="IntervalStartTime" YAxisKey="ResponseTime" data={this.state.csvData} />
            </div>
        );
    }
}

export default LoadTest;