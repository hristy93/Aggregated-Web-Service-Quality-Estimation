import alt from '../alt';
import LoadTestMetricsActions from '../actions/LoadTestMetricsActions';
import LoadTestChartsActions from '../actions/LoadTestChartsActions';
import EstimationActions from '../actions/EstimationActions';
import LoadTestStore from '../stores/LoadTestStore';
import isNil from 'lodash/isNil';
import immutable from 'alt-utils/lib/ImmutableUtil';
import Immutable from 'immutable';

class MetricsStore {
    constructor() {
        this.bindActions(LoadTestMetricsActions);

        this.state = Immutable.Map({
            metricsInfo: {
                "ResponseTime": true,
                "SuccessfulRequestsPerSecond": true,
                "FailedRequestsPerSecond": true,
                "ReceivedKilobytesPerSecond": true,
                "SentKilobytesPerSecond": true
            }
        });
    }

    setMetricsUsability = (metricName) => {
        let metricsInfo = this.state.get("metricsInfo");
        metricsInfo[metricName] = !metricsInfo[metricName];

        this.setState(this.state.set("metricsInfo", metricsInfo));

        LoadTestMetricsActions.saveMetricsUsabilityInfo.defer(metricsInfo);

        // Set the visibility of the lines in the charts
        LoadTestChartsActions.setLineVisibility.defer(metricName);

        // Set the visibility of the reference line in the charts
        LoadTestChartsActions.setReferenceLinesVisibility.defer(metricName);
    }

    saveMetricsUsabilityInfo = () => {
        this.waitFor(LoadTestStore);
        const loadTestData = LoadTestStore.getLoadTestData();

        if (!isNil(loadTestData) && loadTestData.length !== 0) {
            EstimationActions.getStatisticalEstimatorResult();
        }
    }

    static getMetricsInfo() {
        return this.state.get("metricsInfo");
    }
}

export default alt.createStore(immutable(MetricsStore));