import React, { Component } from 'react';
import { FormGroup, ControlLabel, Checkbox } from 'react-bootstrap';
import LoadTestChartsStore from '../../stores/LoadTestChartsStore';
import LoadTestMetricsStore from '../../stores/LoadTestMetricsStore';
import LoadTestMetricsActions from '../../actions/LoadTestMetricsActions';
import connectToStores from 'alt-utils/lib/connectToStores';
import startCase from 'lodash/startCase';

const metricsIgnoreList = ["ApdexScore"];

class LoadTestMetricsForm extends Component {
    static getStores() {
        return [LoadTestChartsStore];
    }

    static getPropsFromStores() {
        return {
            metricsInfo: LoadTestMetricsStore.getMetricsInfo()
        };
    }

    componentDidMount() {
        const { metricsInfo } = this.props;

        LoadTestMetricsActions.saveMetricsUsabilityInfo(metricsInfo);
    }

    handleCheckBoxChange = (event) => {
        const metricName = event.target.name;

        LoadTestMetricsActions.setMetricsUsability(metricName);
    }

    render() {
        const { metricsInfo } = this.props;

        return (
            <form id="form-metrics-usability">
                <FormGroup>
                    <ControlLabel id="label-metrics-usability">Metrics:</ControlLabel>
                    {
                        Object.keys(metricsInfo).map((metricName) => {
                            const isUsed = metricsInfo[metricName];
                            if (metricsIgnoreList.indexOf(metricName) < 0) {
                                return (
                                    <div
                                        key={`metrics-usability-item-${metricName}`}
                                        id={`metrics-usability-item-${metricName}`}
                                    >
                                        <Checkbox
                                            inline
                                            id={`checkbox-metrics-usability-${metricName}`}
                                            name={metricName}
                                            checked={isUsed}
                                            onChange={this.handleCheckBoxChange}
                                        >
                                            {startCase(metricName)}
                                        </Checkbox> {' '}
                                    </div>
                                );
                            }
                        })
                    }
                </FormGroup>
            </form>
        );
    }
}

export default connectToStores(LoadTestMetricsForm);
export { LoadTestMetricsForm };