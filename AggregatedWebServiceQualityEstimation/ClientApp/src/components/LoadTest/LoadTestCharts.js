import React, { Component } from 'react';
import LineChart from './../common/LineChart/LineChart';
import LoadTestChartsActions from '../../actions/LoadTestChartsActions';
import LoadTestChartsStore from '../../stores/LoadTestChartsStore';
import connectToStores from 'alt-utils/lib/connectToStores';

class LoadTestCharts extends Component {
    static getStores() {
        return [LoadTestChartsStore];
    }

    static getPropsFromStores() {
        return ({
            brushStartIndex: LoadTestChartsStore.getBrushStartIndex(),
            brushEndIndex: LoadTestChartsStore.getBrushEndIndex()
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
        const { data, brushStartIndex, brushEndIndex } = this.props;

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
                />               
            </React.Fragment>
        );
    }
}

export default connectToStores(LoadTestCharts);