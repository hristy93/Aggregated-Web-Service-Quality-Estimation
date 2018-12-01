import React, { Component } from 'react';
import LineChart from '../common/LineChart/LineChart';
import Switch from '../common/Switch/Switch';
import LoadTestChartsActions from '../../actions/LoadTestChartsActions';
import EstimationActions from '../../actions/EstimationActions';
import LoadTestChartsStore from '../../stores/LoadTestChartsStore';
import EstimationStore from '../../stores/EstimationStore';
import connectToStores from 'alt-utils/lib/connectToStores';

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
            statisticalData: EstimationStore.getStatisticalData()
        });
    }

    handleBrushOnChange = (change) => {
        const args = {
            brushStartIndex: change.startIndex,
            brushEndIndex: change.endIndex
        };

        LoadTestChartsActions.setBrushPosition(args);
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
                LoadTestChartsActions.setLineVisibility({
                    chartName: "requests",
                    lineName: "SuccessfulRequestsPerSecond"
                });
                LoadTestChartsActions.setReferenceLinesVisibility.defer({
                    chartName: "requests",
                    lineName: "SuccessfulRequestsPerSecond"
                });
                break;
            case "switch-line-visibility-FailedRequestsPerSecond":
                LoadTestChartsActions.setLineVisibility({
                    chartName: "requests",
                    lineName: "FailedRequestsPerSecond"
                });
                LoadTestChartsActions.setReferenceLinesVisibility.defer({
                    chartName: "requests",
                    lineName: "FailedRequestsPerSecond"
                });
                break;
            case "switch-line-visibility-SentKilobytesPerSecond":
                LoadTestChartsActions.setLineVisibility({
                    chartName: "throughput",
                    lineName: "SentKilobytesPerSecond"
                });
                LoadTestChartsActions.setReferenceLinesVisibility.defer({
                    chartName: "throughput",
                    lineName: "SentKilobytesPerSecond"
                });
                break;
            case "switch-line-visibility-ReceivedKilobytesPerSecond":
                LoadTestChartsActions.setLineVisibility({
                    chartName: "throughput",
                    lineName: "ReceivedKilobytesPerSecond"
                });
                LoadTestChartsActions.setReferenceLinesVisibility.defer({
                    chartName: "throughput",
                    lineName: "ReceivedKilobytesPerSecond"
                });
                break;
        }
    }

    render() {
        const {
            data,
            chartsLinesData,
            brushStartIndex,
            brushEndIndex,
            statisticalData,
            areReferenceLinesVisible,
            syncCharts
        } = this.props;

        let referenceLines = [];
        if (areReferenceLinesVisible) {
            referenceLines = statisticalData.map((item) => {
                const standardDeviation = Math.sqrt(item.variance);
                return {
                    mean: item.mean,
                    lowerStandardDeviation: item.mean - standardDeviation,
                    upperStandardDeviation: item.mean + standardDeviation
                };
            });
        }

        return (
            <React.Fragment>
                <h4><b>Metrics Charts</b></h4>
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
                <LineChart
                    axisXKey="IntervalStartTime"
                    data={data}
                    axisYUnit="s"
                    lines={chartsLinesData['responseTime']}
                    brushOnChange={this.handleBrushOnChange}
                    brushStartIndex={brushStartIndex}
                    brushEndIndex={brushEndIndex}
                    showReferenceLines={areReferenceLinesVisible}
                    referenceLinesData={referenceLines.length !== 0 ? [referenceLines[0]] : []}
                    //legendOnClick={this.handleLegendOnClick}
                    toggleLineVisibility={this.handleSwitchOnChange}
                    syncChart={syncCharts}
                />
                <LineChart
                    axisXKey="IntervalStartTime"
                    data={data}
                    lines={chartsLinesData['requests']}
                    brushOnChange={this.handleBrushOnChange}
                    brushStartIndex={brushStartIndex}
                    brushEndIndex={brushEndIndex}
                    showReferenceLines={areReferenceLinesVisible}
                    referenceLinesData={referenceLines.length !== 0 ? [referenceLines[1], referenceLines[2]] : []}
                    //legendOnClick={this.handleLegendOnClick}
                    toggleLineVisibility={this.handleSwitchOnChange}
                    syncChart={syncCharts}
                />
                <LineChart
                    axisXKey="IntervalStartTime"
                    data={data}
                    axisYUnit="KBps"
                    lines={chartsLinesData['throughput']}
                    brushOnChange={this.handleBrushOnChange}
                    brushStartIndex={brushStartIndex}
                    brushEndIndex={brushEndIndex}
                    showReferenceLines={areReferenceLinesVisible}
                    referenceLinesData={referenceLines.length !== 0 ? [referenceLines[3], referenceLines[4]] : []}
                    //legendOnClick={this.handleLegendOnClick}
                    toggleLineVisibility={this.handleSwitchOnChange}
                    syncChart={syncCharts}
                />               
            </React.Fragment>
        );
    }
}

export default connectToStores(LoadTestCharts);