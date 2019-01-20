import React, { Component } from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import StatisticalEstimation from './StatisticalEstimation';
import ApdexScoreEstimation from './ApdexScoreEstimation';
import EstimationForm from './EstimationForm';
import ClusterEstimation from './ClusterEstimation';
import EstimationActions from '../../actions/EstimationActions';
import EstimationStore from '../../stores/EstimationStore';
import LoadTestChartsStore from '../../stores/LoadTestChartsStore';
import LoadTestMetricsStore from '../../stores/LoadTestMetricsStore';

class EstimationContainer extends Component {
    static getStores() {
        return [LoadTestChartsStore, EstimationStore];
    }

    static getPropsFromStores() {
        return ({
            firstWebServiceEstimationData: EstimationStore.getFirstWebServiceEstimationData(),
            secondWebServiceEstimationData: EstimationStore.getSecondWebServiceEstimationData(),
            firstWebServiceChartsData: LoadTestChartsStore.getFirstWebServiceChartsData(),
            secondWebServiceChartsData: LoadTestChartsStore.getSecondWebServiceChartsData(),
            chartsLinesData: LoadTestChartsStore.getChartsLinesData(),
            brushStartIndex: LoadTestChartsStore.getBrushStartIndex(),
            brushEndIndex: LoadTestChartsStore.getBrushEndIndex(),
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
            firstWebServiceChartsData,
            secondWebServiceChartsData,
            webServiceId,
            chartsLinesData,
            metricsInfo,
            brushStartIndex,
            brushEndIndex,
            brushOnChange,
            areOperationsDenied
        } = this.props;

        const { syncCharts } = webServiceId === "first" ?
            firstWebServiceChartsData : secondWebServiceChartsData;

        const {
            apdexScoreLimit,
            apdexScoreData,
            clusterData,
            statisticalData
        } = webServiceId === "first" ? firstWebServiceEstimationData : secondWebServiceEstimationData;

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
            areOperationsDenied
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