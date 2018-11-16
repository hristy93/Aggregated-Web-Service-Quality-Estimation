import React, { Component } from 'react';
import LineChart from './../common/LineChart/LineChart';

class LoadTestCharts extends Component {
    render() {
        const { data } = this.props;

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
                />               
            </React.Fragment>
        );
    }
}

export default LoadTestCharts;