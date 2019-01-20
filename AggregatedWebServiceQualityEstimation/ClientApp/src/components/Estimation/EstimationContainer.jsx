import React, { Component } from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import StatisticalEstimation from './StatisticalEstimation';
import ApdexScoreEstimation from './ApdexScoreEstimation';
import EstimationForm from './EstimationForm';
import ClusterEstimation from './ClusterEstimation';
import EstimationActions from '../../actions/EstimationActions';
import EstimationStore from '../../stores/EstimationStore';
import LoadTestChartsStore from '../../stores/LoadTestChartsStore';
import LoadTestStore from '../../stores/LoadTestStore';
import LoadTestMetricsStore from '../../stores/LoadTestMetricsStore';

class EstimationContainer extends Component {
    static getStores() {
        return [LoadTestChartsStore, EstimationStore];
    }

    static getPropsFromStores() {
        return ({
            firstWebServiceEstimationData: EstimationStore.getFirstWebServiceEstimationData(),
            secondWebServiceEstimationData: EstimationStore.getSecondWebServiceEstimationData(),
            firstServiceLoadTestData: LoadTestStore.getFirstServiceLoadTestData(),
            secondServiceLoadTestData: LoadTestStore.getSecondServiceLoadTestData(),
            chartsLinesData: LoadTestChartsStore.getChartsLinesData(),
            brushStartIndex: LoadTestChartsStore.getBrushStartIndex(),
            brushEndIndex: LoadTestChartsStore.getBrushEndIndex(),
            syncCharts: LoadTestChartsStore.getSyncCharts(),
            metricsInfo: LoadTestMetricsStore.getMetricsInfo()
        });
    }

    handleApdexScoreLimitChange = (event) => {
        const inputValue = event.target.value;

        EstimationActions.setApdexScoreLimit(inputValue);
    }

    render() {
        const {
            firstWebServiceEstimationData,
            secondWebServiceEstimationData,
            firstServiceLoadTestData,
            secondServiceLoadTestData,
            webServiceId,
            chartsLinesData,
            metricsInfo,
            brushStartIndex,
            brushEndIndex,
            brushOnChange,
            syncCharts,
            areOperationsDenied
        } = this.props;

        const {
            apdexScoreLimit,
            apdexScoreData,
            clusterData,
            statisticalData
        } = webServiceId === "first" ? firstWebServiceEstimationData : secondWebServiceEstimationData;

        const loadTestData = webServiceId === "first" ? firstServiceLoadTestData : secondServiceLoadTestData;

        const estimationFormProps = {
            webServiceId,
            apdexScoreLimit,
            areOperationsDenied
        };

        const apdexScoreEstimatorProps = {
            webServiceId,
            apdexScoreLimit,
            apdexScoreData,
            chartsLinesData,
            metricsInfo,
            brushStartIndex,
            brushEndIndex,
            brushOnChange,
            syncCharts
        };

        const clusterEstimatorProps = {
            webServiceId,
            clusterData,
            areOperationsDenied
        };

        const statisticsEstimatorProps = {
            webServiceId,
            statisticalData,
            areOperationsDenied,
            loadTestData
        };

        return (
            <div id={`${webServiceId}-estimations`}>
                <EstimationForm {...estimationFormProps}/>
                <ApdexScoreEstimation {...apdexScoreEstimatorProps} />
                <ClusterEstimation {...clusterEstimatorProps} />
                <StatisticalEstimation {...statisticsEstimatorProps} />
            </div>
        );
    }
}
    
export default connectToStores(EstimationContainer);