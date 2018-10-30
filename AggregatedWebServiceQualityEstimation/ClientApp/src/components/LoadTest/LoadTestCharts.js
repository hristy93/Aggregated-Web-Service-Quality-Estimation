import React, { Component } from 'react';
import LineChart from './../common/LineChart/LineChart';

class LoadTestCharts extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <LineChart
                    XAxisKey="IntervalStartTime"
                    YAxisKey="ResponseTime"
                    data={this.props.data}
                    lineColor="#00BFFF"
                />
                <LineChart
                    XAxisKey="IntervalStartTime"
                    YAxisKey="RequestsPerSecond"
                    data={this.props.data}
                    lineColor="#32CD32"
                />
            </React.Fragment>
        );
    }
}

export default LoadTestCharts;