import React, { Component } from 'react';
import LoadTestForm from './LoadTestForm';
import { Col, Row, Grid, Button, ButtonToolbar } from 'react-bootstrap';
import LoadTestCharts from './LoadTestCharts';
import connectToStores from 'alt-utils/lib/connectToStores';
import LoadTestStore from '../../stores/LoadTestStore';
import LoadTestActions from '../../actions/LoadTestActions';
import isNil from 'lodash/isNil';
import { displayFailureMessage } from '../../utils/displayInformation';

class LoadTest extends Component {
    static getStores() {
        return [LoadTestStore];
    }

    static getPropsFromStores() {
        return ({
            loadTestData: LoadTestStore.getLoadTestData(),
            url: LoadTestStore.getUrl(),
            isUrlValid: LoadTestStore.getUrlValidity(),
            requestType: LoadTestStore.getRequestType(),
            requestPostData: LoadTestStore.getRequestPostData()
        });
    }

    handleRunLoadTestButtonClick = () => {
        const { url, requestPostData, requestType } = this.props;
        let data = {};
        data["url"] = url;

        if (requestType === "POST" && !isNil(requestPostData)) {
            const parsedRequestPostData = JSON.parse(requestPostData);
            data["body"] = parsedRequestPostData;
        }

        if (!isNil(data)) {
            LoadTestActions.runLoadTest(data);
        } else {
            displayFailureMessage("There is a problem with the load test!", "The data is invalid!");
        }
    }

    handleWriteLoadTestDataClick = () => {
        LoadTestActions.writeLoadTestData();
    }

    handleReadLoadTestDataClick = () => {
        LoadTestActions.readLoadTestData();
    }

    render() {
        const { loadTestData, isUrlValid } = this.props;
        return (
            <Grid fluid>
                <Row>
                    <Col sm={7}>
                        <LoadTestForm />
                    </Col>
                </Row>
                <Row>
                    <Col sm={10}>
                        <ButtonToolbar>
                            <Button
                                id="run-load-test-button"
                                onClick={this.handleRunLoadTestButtonClick}
                                disabled={!isUrlValid}
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
                        <LoadTestCharts data={loadTestData} />
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default connectToStores(LoadTest);