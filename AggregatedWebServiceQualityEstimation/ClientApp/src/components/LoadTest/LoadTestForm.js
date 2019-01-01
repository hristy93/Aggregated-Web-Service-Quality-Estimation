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
            loadTestDuration: LoadTestStore.getLoadTestDuration(),
            testState: LoadTestStore.getTestState()
        });
    }

    handleLoadTestDurationChange = (event) => {
        const inputValue = event.target.value;

        LoadTestActions.setLoadTestDuration(inputValue);
    }

    render() {
        const {
            loadTestDuration,
            testState
        } = this.props;

        const isTestRunning = testState.started && !testState.finished;
        const areOperationsDenied = testState.writingTestData || isTestRunning;

        return (
            <form>
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
            </form>
        );
    }
}

export default connectToStores(LoadTestForm);
