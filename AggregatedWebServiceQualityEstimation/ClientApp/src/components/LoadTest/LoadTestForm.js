import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, Collapse } from 'react-bootstrap';
import LoadTestActions from '../../actions/LoadTestActions';
import LoadTestStore from '../../stores/LoadTestStore';
import connectToStores from 'alt-utils/lib/connectToStores';

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

        const isTestRunning = testState.isStarted && !testState.isFinished;
        const areOperationsDenied = testState.writingTestData || isTestRunning;

        return (
            <form>
                <FormGroup
                    controlId="load-test-duration-input"                  
                >
                    <ControlLabel>Tests Duration (hh:mm:ss): </ControlLabel>
                    <FormControl
                        type="text"
                        value={loadTestDuration}
                        placeholder={loadTestDuration !== "" ? "" : "Enter test duration"}
                        disabled={areOperationsDenied}
                        style={{ width: '20%' }}
                        onChange={this.handleLoadTestDurationChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>
            </form>
        );
    }
}

export default connectToStores(LoadTestForm);
export { LoadTestForm };
