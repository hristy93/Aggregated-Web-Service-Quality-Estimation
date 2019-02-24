import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, Collapse} from 'react-bootstrap';
import Select from '../common/Select/Select';
import Textarea from '../common/Textarea/Textarea';
import WebServicesActions from '../../actions/WebServicesActions';
import LoadTestActions from '../../actions/LoadTestActions';
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
        const requestTypeInput = event.target.value;
        const requestType = requestTypeInput.includes("GET") ? "GET" : "POST";
        const { webServiceId } = this.props;

        WebServicesActions.setRequestType({ requestType, webServiceId });
    }

    handleRequestPostDataChange = (event) => {
        const requestPostData = event.target.value;
        const { webServiceId } = this.props;

        WebServicesActions.setRequestPostData({ requestPostData, webServiceId });
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
                    id={`input-group-request-url-${webServiceId}-web-service`}
                    validationState={isUrlValid ? "success" : "error"}
                >
                    <ControlLabel id={`label-request-url-${webServiceId}-web-service`}>
                        Web Service URL
                    </ControlLabel>
                    <FormControl
                        id={`input-request-url-${webServiceId}-web-service`}
                        type="url"
                        value={url}
                        placeholder={url !== "" ? "" : "Enter web service endpoint"}
                        disabled={areOperationsDenied}
                        onChange={this.handleUrlChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>
                <Select
                    id={`request-type-${webServiceId}-web-service`}
                    title="Request Type:"
                    items={["Receive data (GET)", "Send data (POST)"]}
                    disabled={areOperationsDenied}
                    style={{ width: '30%'}}
                    onChange={this.handleRequestTypeChange}
                />
                {
                    requestType === "POST" && 
                    <Collapse in={requestType === "POST"}>
                        <div>
                            <Textarea
                                id={`textarea-request-body-${webServiceId}-web-service`}
                                title="Request Body:"
                                disabled={areOperationsDenied}
                                onChange={this.handleRequestPostDataChange}
                            />
                        </div>
                    </Collapse>
                }
            </form>
        );
    }
}

export default WebServiceForm;
export { WebServiceForm };
