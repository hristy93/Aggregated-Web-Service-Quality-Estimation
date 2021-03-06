﻿import React, { Component } from 'react';
import { Panel, PanelGroup } from 'react-bootstrap';
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
import Popover from '../../components/common/Popover/Popover';

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
            firstServiceLoadTestData: LoadTestStore.getFirstServiceLoadTestData(),
            secondServiceLoadTestData: LoadTestStore.getSecondServiceLoadTestData(),
            firstServiceLoadTestDataInfo: LoadTestStore.getFirstServiceLoadTestDataInfo(),
            secondServiceLoadTestDataInfo: LoadTestStore.getSecondServiceLoadTestDataInfo(),
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

    renderApdexScoreInfo = (webServiceId) => {
        const title = "Apdex Score Information";
        const description = (
            <h5> 
                Apdex Score is a numerical measure of user satisfaction with the performance (response time) of a
                web application. Its values are between 0 and 1 (0 = the user is not satisfied,
                1 = the user is satisfied)
            </h5>
        );
        return (
            <Popover 
                id={`apdex-score-info-${webServiceId}-web-service`}
                title={title}
                position="right"
                description={description}
            />
        );
    }

    render() {
        const {
            firstWebServiceEstimationData,
            secondWebServiceEstimationData,
            firstWebServiceChartsData,
            secondWebServiceChartsData,
            firstServiceLoadTestData,
            secondServiceLoadTestData,
            firstServiceLoadTestDataInfo,
            secondServiceLoadTestDataInfo,
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

        const { loadTestDataSize } = webServiceId === "first" ?
            firstServiceLoadTestDataInfo : secondServiceLoadTestDataInfo;

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
            areOperationsDenied: areOperationsDenied || !metricsInfo["ResponseTime"]
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
            metricsInfo,
            loadTestDataSize
        };

        const statisticsEstimatorProps = {
            webServiceId,
            statisticalData,
            loadTestData,
            metricsInfo
        };

        return (
            <PanelGroup id={`panel-group-${webServiceId}-estimations`}>
                <Panel
                    id={`panel-estimation-options-${webServiceId}-web-service`}
                    bsStyle="info"
                    defaultExpanded
                >
                    <Panel.Heading id={`panel-heading-estimation-options-${webServiceId}-web-service`}>
                        <Panel.Title
                            id={`panel-title-estimation-options-${webServiceId}-web-service`}
                            toggle
                        >
                            <b>Estimations Options</b>
                        </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body
                        id={`panel-body-estimation-options-${webServiceId}-web-service`}
                        collapsible
                    >
                        <EstimationForm {...estimationFormProps} />
                    </Panel.Body>
                </Panel>
               
                <Panel
                    id={`panel-apdex-score-estimation-${webServiceId}-web-service`}
                    bsStyle="info"
                    style={{ marginTop: '2.5rem' }}
                    defaultExpanded
                >
                    <Panel.Heading id={`panel-heading-apdex-score-estimation-${webServiceId}-web-service`}>
                        <Panel.Title
                            id={`panel-title-apdex-score-estimation-${webServiceId}-web-service`}
                            toggle
                        >
                            <b>Apdex Score Estimation Data</b>
                            {'   '}
                            {this.renderApdexScoreInfo(webServiceId)}
                        </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body
                        id={`panel-body-apdex-score-estimation-${webServiceId}-web-service`}
                        collapsible
                    >
                        <ApdexScoreEstimation {...apdexScoreEstimatorProps} />
                    </Panel.Body>
                </Panel>

                <Panel
                    id={`panel-cluster-estimation-${webServiceId}-web-service`}
                    bsStyle="info"
                    style={{ marginTop: '2rem' }}
                    defaultExpanded
                >
                    <Panel.Heading id={`panel-heading-cluster-estimation-${webServiceId}-web-service`}>
                        <Panel.Title
                            id={`panel-title-cluster-estimation-${webServiceId}-web-service`}
                            toggle
                        >
                            <b>Metrics Consistency Estimation Data</b>
                        </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body
                        id={`panel-body-cluster-estimation-${webServiceId}-web-service`}
                        collapsible
                    >
                        <ClusterEstimation {...clusterEstimatorProps} />
                    </Panel.Body>
                </Panel>

                <Panel
                    id={`panel-statistical-estimation-${webServiceId}-web-service`}
                    bsStyle="info"
                    style={{ marginTop: '2rem' }}
                    defaultExpanded
                >
                    <Panel.Heading id={`panel-heading-statistical-estimation-${webServiceId}-web-service`}>
                        <Panel.Title
                            id={`panel-title-statistical-estimation-${webServiceId}-web-service`}
                            toggle
                        >
                            <b>Statistical Estimation Data</b>
                        </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body
                        id={`panel-body-statistical-estimation-${webServiceId}-web-service`}
                        collapsible
                    >
                        <StatisticalEstimation {...statisticsEstimatorProps} />
                    </Panel.Body>
                </Panel>
            </PanelGroup>
        );
    }
}
    
export default connectToStores(EstimationContainer);
export { EstimationContainer };