import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

const URLRegexExpression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

class LoadTestForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            url: ''
        };

        this.handleChange = this.handleChange.bind(this);
    }

    getValidationState() {
        const regex = new RegExp(URLRegexExpression);
        const { url } = this.state;
        let result;    
        if (regex.test(url)) {
            result = "success";
        } else {
            result = "error";
        }

        return result;
    }

    handleChange(event) {
        this.setState({
            url: event.target.value
        });
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
                        value={this.state.value}
                        placeholder="Enter web service endpoint"
                        onChange={this.handleChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>
            </form>
        );
    }
}

export default LoadTestForm;
