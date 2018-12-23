import React, { Component } from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import EstimationActions from '../../actions/EstimationActions';
import EstimationStore from '../../stores/EstimationStore';

class EstimationForm extends Component {
    static getStores() {
        return [EstimationStore];
    }

    static getPropsFromStores() {
        return ({
            apdexScoreLimit: EstimationStore.getApdexScoreLimit()
        });
    }

    handleApdexScoreLimitChange = (event) => {
        const inputValue = event.target.value;

        EstimationActions.setApdexScoreLimit(inputValue);
    }

    render() {
        const { apdexScoreLimit } = this.props;
        return (
            <FormGroup
                controlId="apdex-limit-input"
            >
                <ControlLabel>Response Time Limit: </ControlLabel>
                <FormControl
                    type="text"
                    value={apdexScoreLimit}
                    placeholder={apdexScoreLimit}
                    //disabled={areOperationsDenied}
                    onChange={this.handleApdexScoreLimitChange}
                />
                <FormControl.Feedback />
            </FormGroup>
        );
    }
}

export default connectToStores(EstimationForm);