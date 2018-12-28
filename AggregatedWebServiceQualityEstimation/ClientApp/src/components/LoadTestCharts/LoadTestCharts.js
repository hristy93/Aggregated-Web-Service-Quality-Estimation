import React, { Component } from 'react';
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
            areReferenceLinesVisible: LoadTestChartsStore.getReferenceLinesVisibility(),
            syncCharts: LoadTestChartsStore.getSyncCharts(),
            statisticalData: EstimationStore.getStatisticalData(),
            metricsInfo: LoadTestMetricsStore.getMetricsInfo()
        });
    }

    handleSwitchOnChange = (isChecked, event, id) => {
        switch (id) {
            case "switch-sync-charts":
                LoadTestChartsActions.setChartsSync(isChecked);
                break;
            case "switch-show-reference-lines":
                // need to check if the data is the same 
                //if (this.props.statisticalData.length === 0) {
                //    EstimationActions.getStatisticalEstimatorResult();
                //}

                if (isChecked) {
                    EstimationActions.getStatisticalEstimatorResult();
                }

                LoadTestChartsActions.setAllReferenceLinesVisibility.defer(isChecked);
                break;
            case "switch-line-visibility-SuccessfulRequestsPerSecond":
                LoadTestChartsActions.setLineVisibility.defer("SuccessfulRequestsPerSecond");
                LoadTestChartsActions.setReferenceLinesVisibility.defer("SuccessfulRequestsPerSecond");
                break;
            case "switch-line-visibility-FailedRequestsPerSecond":
                LoadTestChartsActions.setLineVisibility.defer("FailedRequestsPerSecond");
                LoadTestChartsActions.setReferenceLinesVisibility.defer("FailedRequestsPerSecond");
                break;
            case "switch-line-visibility-SentKilobytesPerSecond":
                LoadTestChartsActions.setLineVisibility.defer("SentKilobytesPerSecond");
                LoadTestChartsActions.setReferenceLinesVisibility.defer("SentKilobytesPerSecond");
                break;
            case "switch-line-visibility-ReceivedKilobytesPerSecond":
                LoadTestChartsActions.setLineVisibility.defer("ReceivedKilobytesPerSecond");
                LoadTestChartsActions.setReferenceLinesVisibility.defer("ReceivedKilobytesPerSecond");
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
            chartsData,
            chartsLinesData,
            brushStartIndex,
            brushEndIndex,
            brushOnChange,
            statisticalData,
            metricsInfo,
            areReferenceLinesVisible,
            syncCharts
        } = this.props;

        let referenceLines = [];
        if (areReferenceLinesVisible) {
            referenceLines = statisticalData.map((item) => {
                const standardDeviation = Math.sqrt(item.variance);
                return {
                    metricName: item.metricName,
                    mean: item.mean,
                    lowerStandardDeviation: item.mean - standardDeviation,
                    upperStandardDeviation: item.mean + standardDeviation
                };
            });
        }

        const isResponseTimeChartVisible = metricsInfo["ResponseTime"];
        const isRequestsChartVisible = metricsInfo["SuccessfulRequestsPerSecond"] ||
            metricsInfo["SuccessfulRequestsPerSecond"];
        const isThroughputChartVisible = metricsInfo["ReceivedKilobytesPerSecond"] ||
            metricsInfo["SentKilobytesPerSecond"];

        return (
            <React.Fragment>
                <h4><b>Metrics Charts</b></h4>
                {
                    chartsData.length > 0 ? (
                        <div id="charts-switches">
                            <Switch
                                id="switch-sync-charts"
                                text="Synchronize charts:"
                                isChecked={syncCharts}
                                onChange={this.handleSwitchOnChange}
                            />
                            <Switch
                                id="switch-show-reference-lines"
                                text="Show reference lines:"
                                isChecked={areReferenceLinesVisible}
                                onChange={this.handleSwitchOnChange}
                            />
                        </div>
                    ) : (
                            <div id="no-charts-data">
                                <h3> No data </h3>
                            </div>
                    )
                }
                <LineChart
                    axisXKey="IntervalStartTime"
                    data={chartsData}
                    axisYUnit="s"
                    lines={chartsLinesData['responseTime']}
                    brushOnChange={brushOnChange}
                    brushStartIndex={brushStartIndex}
                    brushEndIndex={brushEndIndex}
                    showReferenceLines={areReferenceLinesVisible}
                    //referenceLinesData={referenceLines.length !== 0 ? [referenceLines[0]] : []}
                    referenceLinesData={referenceLines}
                    //legendOnClick={this.handleLegendOnClick}
                    toggleLineVisibility={this.handleSwitchOnChange}
                    syncChart={syncCharts}
                    isVisible={isResponseTimeChartVisible}
                />
                <LineChart
                    axisXKey="IntervalStartTime"
                    data={chartsData}
                    lines={chartsLinesData['requests']}
                    brushOnChange={brushOnChange}
                    brushStartIndex={brushStartIndex}
                    brushEndIndex={brushEndIndex}
                    showReferenceLines={areReferenceLinesVisible}
                    //referenceLinesData={referenceLines.length !== 0 ? [referenceLines[1], referenceLines[2]] : []}
                    referenceLinesData={referenceLines}
                    //legendOnClick={this.handleLegendOnClick}
                    toggleLineVisibility={this.handleSwitchOnChange}
                    syncChart={syncCharts}
                    isVisible={isRequestsChartVisible}
                />
                <LineChart
                    axisXKey="IntervalStartTime"
                    data={chartsData}
                    axisYUnit="KBps"
                    lines={chartsLinesData['throughput']}
                    brushOnChange={brushOnChange}
                    brushStartIndex={brushStartIndex}
                    brushEndIndex={brushEndIndex}
                    showReferenceLines={areReferenceLinesVisible}
                    //referenceLinesData={referenceLines.length !== 0 ? [referenceLines[3], referenceLines[4]] : []}
                    referenceLinesData={referenceLines}
                    //legendOnClick={this.handleLegendOnClick}
                    toggleLineVisibility={this.handleSwitchOnChange}
                    syncChart={syncCharts}
                    isVisible={isThroughputChartVisible}
                />               
            </React.Fragment>
        );
    }
}

export default connectToStores(LoadTestCharts);