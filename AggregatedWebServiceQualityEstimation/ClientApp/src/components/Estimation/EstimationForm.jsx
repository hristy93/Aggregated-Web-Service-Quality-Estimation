import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import EstimationActions from '../../actions/EstimationActions';

class EstimationForm extends Component {
    handleApdexScoreLimitChange = (event, webServiceId) => {
        const apdexScoreLimit = event.target.value;

        EstimationActions.setApdexScoreLimit({ apdexScoreLimit, webServiceId});
    }

    render() {
        const {
            webServiceId,
            apdexScoreLimit,
            areOperationsDenied
        } = this.props;

        return (
            <div id={`estimations-options-${webServiceId}-web-service`}>
                 <FormGroup>
                     <ControlLabel>Response Time Limit: </ControlLabel>
                     <FormControl
                         id={`input-apdex-score-estimation-limit-${webServiceId}-web-service`}
                         type="text"
                         value={apdexScoreLimit}
                         placeholder={apdexScoreLimit}
                         disabled={areOperationsDenied}
                         style={{width: '20%'}}
                         onChange={(event) => this.handleApdexScoreLimitChange(event, webServiceId)}
                     />
                     <FormControl.Feedback />
                 </FormGroup>
            </div>
        );
    }
}

export default EstimationForm;