import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, Collapse} from 'react-bootstrap';
import Select from '../common/Select/Select';
import Textarea from '../common/Textarea/Textarea';
import FileUpload from '../common/FileUpload/FileUpload';
import LoadTestActions from '../../actions/LoadTestActions';
import LoadTestStore from '../../stores/LoadTestStore';
import { displayFailureMessage } from '../../utils/displayInformation';
import connectToStores from 'alt-utils/lib/connectToStores';
import isNil from 'lodash/isNil';

const URLRegexExpression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

class LoadTestForm extends Component {
    static getStores() {
        return [LoadTestStore];
    }

    static getPropsFromStores() {
        return ({
            url: LoadTestStore.getUrl(),
            isUrlValid: LoadTestStore.getUrlValidity(),
            requestType: LoadTestStore.getRequestType(),
            loadTestDuration: LoadTestStore.getLoadTestDuration(),
            testState: LoadTestStore.getTestState()
        });
    }

    checkUrlInputValidity = (inputValue) => {
        const regex = new RegExp(URLRegexExpression);
        if (regex.test(inputValue)) {
            LoadTestActions.setUrlValidity(true);
        } else {
            LoadTestActions.setUrlValidity(false);
        }
    }

    handleUrlChange = (event) => {
        const inputValue = event.target.value;

        LoadTestActions.setUrl(inputValue);
        this.checkUrlInputValidity(inputValue);
    }

    handleRequestTypeChange = (event) => {
        const inputValue = event.target.value;

        LoadTestActions.setRequestType(inputValue);
    }

    handleRequestPostDataChange = (event) => {
        const inputValue = event.target.value;

        LoadTestActions.setRequestPostData(inputValue);
    }

    handleFileUploadChange = (event) => {
        event.preventDefault();
        const { files } = event.target;

        if (isNil(files)) {
            displayFailureMessage("No files selected!");
        } else if (files.length > 1) {
            displayFailureMessage("More than 1 file selected!");
        } else {
            LoadTestActions.uploadLoadTestData(files);
        }
    }

    handleLoadTestDurationChange = (event) => {
        const inputValue = event.target.value;

        LoadTestActions.setLoadTestDuration(inputValue);
    }

    render() {
        const {
            url,
            isUrlValid,
            requestType,
            loadTestDuration,
            testState
        } = this.props;

        const isTestRunning = testState.started && !testState.finished;
        const areOperationsDenied = testState.writingTestData || isTestRunning;

        return (
            <form>
                <FormGroup
                    controlId="url-input"
                    validationState={isUrlValid ? "success" : "error"}
                >
                    <ControlLabel>Web Service URL</ControlLabel>
                    <FormControl
                        type="url"
                        value={url}
                        placeholder={url !== "" ? "" : "Enter web service endpoint"}
                        disabled={areOperationsDenied}
                        onChange={this.handleUrlChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>
                <Select
                    id="request-type"
                    title="Request Type:"
                    items={["GET", "POST"]}
                    disabled={areOperationsDenied}
                    onChange={this.handleRequestTypeChange}
                />
                {
                    requestType === "POST" && 
                    <Collapse in={requestType === "POST"}>
                        <div>
                            <Textarea
                                title="Request Body:"
                                disabled={areOperationsDenied}
                                onChange={this.handleRequestPostDataChange}
                            />
                        </div>
                    </Collapse>
                }
                <FormGroup
                    controlId="load-test-duration-input"                  
                >
                    <ControlLabel>Test Duration: </ControlLabel>
                    <FormControl
                        type="text"
                        value={loadTestDuration}
                        placeholder={loadTestDuration !== "" ? "" : "Enter test duration"}
                        disabled={areOperationsDenied}
                        onChange={this.handleLoadTestDurationChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>
                <FileUpload
                    id="load-test-metrics"
                    title="Upload .CSV file with metrics:"
                    buttonText="Add file"
                    fileType=".csv"
                    disabled={areOperationsDenied}
                    onChange={this.handleFileUploadChange}
                />
            </form>
        );
    }
}

export default connectToStores(LoadTestForm);
