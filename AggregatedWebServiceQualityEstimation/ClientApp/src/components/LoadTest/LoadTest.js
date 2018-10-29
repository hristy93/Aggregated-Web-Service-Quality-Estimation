import React, { Component } from 'react';
import LoadTestServices from '../../services/LoadTestServices';
import LoadTestForm from './LoadTestForm';
import Papa from 'papaparse';
import { Col, Row, Grid, Button, ButtonToolbar } from 'react-bootstrap';
import LoadTestCharts from './LoadTestCharts';
import { responseTimeTestData } from '../../data/testData';

class LoadTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            csvData: [],
            url: ""
        };

        this.handleRunLoadTestButtonClick = this.handleRunLoadTestButtonClick.bind(this);
        this.handleWriteLoadTestDataClick = this.handleWriteLoadTestDataClick.bind(this);
        this.handleReadLoadTestDataClick = this.handleReadLoadTestDataClick.bind(this);
        this.handleUrlChange = this.handleUrlChange.bind(this);
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
                parsedResultData.sort(function (a, b) {
                    return new Date('1970/01/01 ' + a.IntervalStartTime) - new Date('1970/01/01 ' + b.IntervalStartTime);
                });
                console.log(parsedResultData);
                parsedResultData = parsedResultData.filter(item => item.IntervalStartTime !== "");
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

    handleUrlChange(event) {
        const newValue = event.target.value
        this.setState({
            url: newValue
        });

        console.log(newValue);
    }

    render() {
        return (
            <Grid fluid>
                <Row>
                    <Col sm={5}>
                        <LoadTestForm />
                    </Col>
                </Row>
                <Row>
                    <Col sm={10}>
                        <ButtonToolbar>
                            <Button
                                id="run-load-test-button"
                                onClick={this.handleRunLoadTestButtonClick}
                                value="Run Load Test"
                            >
                                Run Load Test
                            </Button>

                            <Button
                                id="write-load-test-data-button"
                                onClick={this.handleWriteLoadTestDataClick}
                            >
                                Write Load Test Data
                            </Button>
                            <Button
                                id="read-load-test-data-button"
                                onClick={this.handleReadLoadTestDataClick}
                            >
                                Read Load Test Data
                            </Button>
                        </ButtonToolbar>
                        <LoadTestCharts csvData={this.state.csvData} />
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default LoadTest;