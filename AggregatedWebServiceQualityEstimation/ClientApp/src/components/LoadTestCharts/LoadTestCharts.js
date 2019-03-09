import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import LineChart from '../common/LineChart/LineChart';
import Switch from '../common/Switch/Switch';
import LoadTestChartsActions from '../../actions/LoadTestChartsActions';
import EstimationActions from '../../actions/EstimationActions';
import LoadTestChartsStore from '../../stores/LoadTestChartsStore';
import LoadTestMetricsStore from '../../stores/LoadTestMetricsStore';
import EstimationStore from '../../stores/EstimationStore';
import connectToStores from 'alt-utils/lib/connectToStores';
import { displayFailureMessage } from '../../utils/displayInformation';
import '../../styles/components/LoadTestCharts/LoadTestCharts.css';

class LoadTestCharts extends Component {
    static getStores() {
        return [LoadTestChartsStore, EstimationStore];
    }

    static getPropsFromStores() {
        return ({
            chartsLinesData: LoadTestChartsStore.getChartsLinesData(),
            brushStartIndex: LoadTestChartsStore.getBrushStartIndex(),
            brushEndIndex: LoadTestChartsStore.getBrushEndIndex(),
            metricsInfo: LoadTestMetricsStore.getMetricsInfo(),
            firstWebServiceEstimationData: EstimationStore.getFirstWebServiceEstimationData(),
            secondWebServiceEstimationData: EstimationStore.getSecondWebServiceEstimationData(),
            firstWebServiceChartsData: LoadTestChartsStore.getFirstWebServiceChartsData(),
            secondWebServiceChartsData: LoadTestChartsStore.getSecondWebServiceChartsData(),
        });
    }

    handleSwitchOnChange = (isChecked, event, id) => {
        const { webServiceId } = this.props;

        switch (id) {
            case `${webServiceId}-web-service-switch-sync-charts`:
                LoadTestChartsActions.setChartsSync({ syncCharts: isChecked, webServiceId: webServiceId });
                break;
            case `${webServiceId}-web-service-switch-show-reference-lines`:
                if (isChecked) {
                    EstimationActions.getStatisticalEstimatorResult(webServiceId);
                }

                LoadTestChartsActions.setAllReferenceLinesVisibility.defer({ areReferenceLinesVisible: isChecked, webServiceId });
                break;
            default:
                const alertMessage = "There is a problem with the switch!";
                const errorMessage = `There is no switch with id = ${id}`;
                displayFailureMessage(alertMessage, errorMessage);
                break;
        }
    }

    render() {
        const {
            webServiceId,
            areOperationsDenied,
            chartsData,
            chartsLinesData,
            firstWebServiceEstimationData,
            secondWebServiceEstimationData,
            firstWebServiceChartsData,
            secondWebServiceChartsData,
            brushStartIndex,
            brushEndIndex,
            brushOnChange,
            metricsInfo
        } = this.props;

        const webServiceEstimationData = webServiceId === "first" ?
            firstWebServiceEstimationData : secondWebServiceEstimationData;
        const { statisticalData } = webServiceEstimationData;

        const { syncCharts, areReferenceLinesVisible } = webServiceId === "first" ?
            firstWebServiceChartsData : secondWebServiceChartsData;

        let referenceLinesData = [];
        if (areReferenceLinesVisible) {
            referenceLinesData = statisticalData.map((item) => {
                const standardDeviation = Math.sqrt(item.variance);
                const innerQuartileDistance = item.upperQuartile - item.lowerQuartile;

                return {
                    metricName: item.metricName,
                    median: item.median,
                    lowerInnerFenceBound: item.lowerQuartile - innerQuartileDistance * 1.5,
                    upperInnerFenceBound: item.upperQuartile + innerQuartileDistance * 1.5,
                    lowerOuterFenceBound: item.lowerQuartile - innerQuartileDistance * 3,
                    upperOuterFenceBound: item.upperQuartile + innerQuartileDistance * 3
                };
            });
        }

        const isResponseTimeChartVisible = metricsInfo["ResponseTime"];
        const isRequestsChartVisible = metricsInfo["SuccessfulRequestsPerSecond"] ||
            metricsInfo["FailedRequestsPerSecond"];
        const isThroughputChartVisible = metricsInfo["ReceivedKilobytesPerSecond"];

        const chartsCommonProps = {
            axisXKey: "IntervalStartTime",
            data: chartsData,
            brushOnChange: brushOnChange,
            brushStartIndex: brushStartIndex,
            brushEndIndex: brushEndIndex,
            showReferenceLines: areReferenceLinesVisible,
            referenceLinesData: referenceLinesData,
            toggleLineVisibility: this.handleSwitchOnChange,
            syncChart: syncCharts
        };

        return (
            <div id={`${webServiceId}-web-service-charts`}>
                {
                    chartsData.length > 0 ? (
                        <div id="charts-switches">
                            <Switch
                                id={`${webServiceId}-web-service-switch-sync-charts`}
                                text="Synchronize charts:"
                                isChecked={syncCharts}
                                onChange={this.handleSwitchOnChange}
                            />
                            <Switch
                                id={`${webServiceId}-web-service-switch-show-reference-lines`}
                                text="Show reference lines:"
                                isChecked={areReferenceLinesVisible}
                                disabled={areOperationsDenied}
                                onChange={this.handleSwitchOnChange}
                            />
                        </div>
                    ) : (
                            <div id="no-charts-data">
                                <h3> No data </h3>
                            </div>
                    )
                }
                {
                    chartsData.length !== 0 &&
                    <ListGroup>
                        <ListGroupItem>
                            <LineChart
                                id='responseTime'
                                {...chartsCommonProps }
                                axisYUnit="s"
                                lines={chartsLinesData['responseTime']}
                                isVisible={isResponseTimeChartVisible}
                            />
                        </ListGroupItem>
                        <ListGroupItem style={{ marginTop: '2rem' }}>
                            <LineChart
                                id='requests'
                                {...chartsCommonProps}
                                axisYUnit="rps"
                                lines={chartsLinesData['requests']}
                                isVisible={isRequestsChartVisible}
                            />
                        </ListGroupItem>
                        <ListGroupItem style={{ marginTop: '2rem' }}>
                            <LineChart
                                id='throughput'
                                {...chartsCommonProps}
                                axisYUnit="KBps"
                                lines={chartsLinesData['throughput']}
                                isVisible={isThroughputChartVisible}
                            />
                        </ListGroupItem>
                    </ListGroup>
                }
            </div>
        );
    }
}

export default connectToStores(LoadTestCharts);
export { LoadTestCharts };