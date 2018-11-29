import React, { Component } from 'react';
import LineChart from './../common/LineChart/LineChart';
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
            brushStartIndex: LoadTestChartsStore.getBrushStartIndex(),
            brushEndIndex: LoadTestChartsStore.getBrushEndIndex(),
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
        }

        LoadTestChartsActions.setBrushPosition(args);
    }

    handleSwitchOnChange = (isChecked, event, id) => {
        if (id === "switch-sync-charts") {
            LoadTestChartsActions.setChartsSync(isChecked);
        }

        if (id === "switch-show-reference-lines") {
            // need to check if the data is the same 
            //if (this.props.statisticalData.length === 0) {
            //    EstimationActions.getStatisticalEstimatorResult();
            //}

            if (isChecked) {
                EstimationActions.getStatisticalEstimatorResult();
            }

            LoadTestChartsActions.setReferenceLinesVisibility.defer(isChecked);
        }
    }

    render() {
        const {
            data,
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
                    upperStandardDeviation: item.mean + standardDeviation,
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
                    lines={[{
                        axisYKey: "ResponseTime",
                        color: "#00BFFF"
                    }]}
                    brushOnChange={this.handleBrushOnChange}
                    brushStartIndex={brushStartIndex}
                    brushEndIndex={brushEndIndex}
                    showReferenceLines={areReferenceLinesVisible}
                    referenceLinesData={referenceLines.length !== 0 ? [referenceLines[0]] : []}
                    syncChart={syncCharts}
                />
                <LineChart
                    axisXKey="IntervalStartTime"
                    data={data}
                    lines={[{
                        axisYKey: "SuccessfulRequestsPerSecond",
                        color: "#32CD32"
                    },
                    {
                        axisYKey: "FailedRequestsPerSecond",
                        color: "#F31111"
                    }]}
                    brushOnChange={this.handleBrushOnChange}
                    brushStartIndex={brushStartIndex}
                    brushEndIndex={brushEndIndex}
                    showReferenceLines={areReferenceLinesVisible}
                    referenceLinesData={referenceLines.length !== 0 ? [referenceLines[1], referenceLines[2]] : []}
                    syncChart={syncCharts}
            />
                <LineChart
                    axisXKey="IntervalStartTime"
                    data={data}
                    axisYUnit="KBps"
                    lines={[{
                        axisYKey: "ReceivedKilobytesPerSecond",
                        color: "#8884d8"
                    },
                    {
                        axisYKey: "SentKilobytesPerSecond",
                        color: "#E85D18"
                    }]}
                    brushOnChange={this.handleBrushOnChange}
                    brushStartIndex={brushStartIndex}
                    brushEndIndex={brushEndIndex}
                    showReferenceLines={areReferenceLinesVisible}
                    referenceLinesData={referenceLines.length !== 0 ? [referenceLines[3], referenceLines[4]] : []}
                    syncChart={syncCharts}
                />               
            </React.Fragment>
        );
    }
}

export default connectToStores(LoadTestCharts);