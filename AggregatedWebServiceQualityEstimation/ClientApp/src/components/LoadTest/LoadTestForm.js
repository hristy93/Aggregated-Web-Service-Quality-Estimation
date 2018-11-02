import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import LoadTestActions from '../../actions/LoadTestActions';
import LoadTestStore from '../../stores/LoadTestStore';
import connectToStores from 'alt-utils/lib/connectToStores';

const URLRegexExpression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

class LoadTestForm extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    static getStores() {
        return [LoadTestStore];
    }

    static getPropsFromStores() {
        return ({
            url: LoadTestStore.getUrl(),
            isUrlValid: LoadTestStore.getUrlValidity()
        });
    }

    checkUrlInputValidity(inputValue) {
        const regex = new RegExp(URLRegexExpression);
        if (regex.test(inputValue)) {
            LoadTestActions.setUrlValidity(true);
        } else {
            LoadTestActions.setUrlValidity(false);
        }
    }

    handleChange(event) {
        const inputValue = event.target.value;

        LoadTestActions.setUrl(inputValue);
        this.checkUrlInputValidity(inputValue);
    }

    render() {
        const { url, isUrlValid } = this.props;
        return (
            <form>
                <FormGroup
                    controlId="url-form"
                    validationState={isUrlValid ? "success" : "error"}
                >
                    <ControlLabel>Web Service URL</ControlLabel>
                    <FormControl
                        type="url"
                        value={url}
                        placeholder={url !== "" ? "" : "Enter web service endpoint"}
                        onChange={this.handleChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>
            </form>
        );
    }
}

export default connectToStores(LoadTestForm);
