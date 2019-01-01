import React, { Component } from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import EstimationActions from '../../actions/EstimationActions';

class EstimationForm extends Component {
    //static getStores() {
    //    return [EstimationStore];
    //}

    //static getPropsFromStores() {
    //    return ({
    //        apdexScoreLimit: EstimationStore.getApdexScoreLimit()
    //    });
    //}

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
            <div id={`${webServiceId}-web-service-estimations-options`}>
                <div id={`${webServiceId}-web-service-estimations-form-header`}>
                    <h4><b>Estimations Options</b></h4>
                </div>
                <div id={`${webServiceId}-web-service-estimations-form-content`}>
                    <FormGroup>
                        <ControlLabel>Response Time Limit: </ControlLabel>
                        <FormControl
                            id={`${webServiceId}-web-service-estimations-form-input`}
                            type="text"
                            value={apdexScoreLimit}
                            placeholder={apdexScoreLimit}
                            disabled={areOperationsDenied}
                            onChange={(event) => this.handleApdexScoreLimitChange(event, webServiceId)}
                        />
                        <FormControl.Feedback />
                    </FormGroup>
               </div>
            </div>
        );
    }
}

export default EstimationForm;