import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, Collapse} from 'react-bootstrap';
import Select from '../common/Select/Select';
import Textarea from '../common/Textarea/Textarea';
import FileUpload from '../common/FileUpload/FileUpload';
import WebServicesActions from '../../actions/WebServicesActions';
import LoadTestActions from '../../actions/LoadTestActions';
import WebServicesStore from '../../stores/WebServicesStore';
import { displayFailureMessage } from '../../utils/displayInformation';
import isNil from 'lodash/isNil';

const URLRegexExpression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

class WebServiceForm extends Component {
    checkUrlInputValidity = (url) => {
        const regex = new RegExp(URLRegexExpression);
        const { webServiceId } = this.props;

        if (regex.test(url)) {
            WebServicesActions.setUrlValidity({ isUrlValid: true, webServiceId });
        } else {
            WebServicesActions.setUrlValidity({ isUrlValid: false, webServiceId });
        }
    }

    handleUrlChange = (event) => {
        const url = event.target.value;
        const { webServiceId } = this.props;

        WebServicesActions.setUrl({ url, webServiceId });
        this.checkUrlInputValidity(url);
    }

    handleRequestTypeChange = (event) => {
        const requestType = event.target.value;
        const { webServiceId } = this.props;

        WebServicesActions.setRequestType({ requestType, webServiceId });
    }

    handleRequestPostDataChange = (event) => {
        const requestPostData = event.target.value;
        const { webServiceId } = this.props;

        WebServicesActions.setRequestPostData({ requestPostData, webServiceId });
    }

    handleFileUploadChange = (event, webServiceId) => {
        event.preventDefault();
        const { files } = event.target;

        if (isNil(files)) {
            displayFailureMessage("No files selected!");
        } else if (files.length > 1) {
            displayFailureMessage("More than 1 file selected!");
        } else {
            LoadTestActions.uploadLoadTestData({ files, webServiceId });
        }
    }

    render() {
        const {
            webServiceId,
            url,
            isUrlValid,
            requestType,
            areOperationsDenied
        } = this.props;

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
                    style={{ width: '25%'}}
                    onChange={this.handleRequestTypeChange}
                />
                {
                    requestType === "POST" && 
                    <Collapse in={requestType === "POST"}>
                        <div>
                            <Textarea
                                id="textarea-request-body"
                                title="Request Body:"
                                disabled={areOperationsDenied}
                                onChange={this.handleRequestPostDataChange}
                            />
                        </div>
                    </Collapse>
                }
                {/*<FileUpload
                    id={`file-upload-${webServiceId}-web-service`}
                    title="Upload .CSV file with metrics:"
                    buttonText="Add file"
                    fileType=".csv"
                    disabled={areOperationsDenied}
                    onChange={(event) => this.handleFileUploadChange(event, webServiceId)}
                />*/}
            </form>
        );
    }
}

export default WebServiceForm;
