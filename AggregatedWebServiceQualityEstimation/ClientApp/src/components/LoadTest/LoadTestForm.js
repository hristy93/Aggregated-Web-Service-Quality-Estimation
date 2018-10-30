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
            url: LoadTestStore.getUrl()
        });
    }

    getValidationState() {
        const regex = new RegExp(URLRegexExpression);
        const { url } = this.props;
        let result;    
        if (regex.test(url)) {
            result = "success";
        } else {
            result = "error";
        }

        return result;
    }

    handleChange(event) {
        LoadTestActions.setUrl(event.target.value);
    }

    render() {
        return (
            <form>
                <FormGroup
                    controlId="url-form"
                    validationState={this.getValidationState()}
                >
                    <ControlLabel>Web Service URL</ControlLabel>
                    <FormControl
                        type="url"
                        value={this.props.url}
                        placeholder={this.props.url !== "" ? "" : "Enter web service endpoint"}
                        onChange={this.handleChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>
            </form>
        );
    }
}

export default connectToStores(LoadTestForm);
