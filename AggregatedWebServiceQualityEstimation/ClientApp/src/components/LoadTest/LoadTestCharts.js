import React, { Component } from 'react';
import LineChart from './../common/LineChart/LineChart';

class LoadTestCharts extends Component {
    render() {
        const { data } = this.props;

        return (
            <React.Fragment>
                <LineChart
                    XAxisKey="IntervalStartTime"
                    YAxisKey="ResponseTime"
                    data={data}
                    lineColor="#00BFFF"
                />
                <LineChart
                    XAxisKey="IntervalStartTime"
                    YAxisKey="RequestsPerSecond"
                    data={data}
                    lineColor="#32CD32"
                />
            </React.Fragment>
        );
    }
}

export default LoadTestCharts;