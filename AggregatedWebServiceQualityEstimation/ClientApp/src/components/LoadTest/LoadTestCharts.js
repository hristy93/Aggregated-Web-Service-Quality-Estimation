import React, { Component } from 'react';
import LineChart from './../common/LineChart/LineChart';
import LoadTestChartsActions from '../../actions/LoadTestChartsActions';
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
            showReferenceLines: LoadTestChartsStore.getShowReferenceLines(),
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

    render() {
        const {
            data,
            brushStartIndex,
            brushEndIndex,
            statisticalData,
            showReferenceLines
        } = this.props;

        let referenceLines = [];
        if (showReferenceLines) {
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
                    showReferenceLines={showReferenceLines}
                    referenceLinesData={referenceLines.length !== 0 ? [referenceLines[0]] : []}
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
                    showReferenceLines={showReferenceLines}
                    referenceLinesData={referenceLines.length !== 0 ? [referenceLines[1], referenceLines[2]] : []}
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
                    showReferenceLines={showReferenceLines}
                    referenceLinesData={referenceLines.length !== 0 ? [referenceLines[3], referenceLines[4]] : []}
                />               
            </React.Fragment>
        );
    }
}

export default connectToStores(LoadTestCharts);