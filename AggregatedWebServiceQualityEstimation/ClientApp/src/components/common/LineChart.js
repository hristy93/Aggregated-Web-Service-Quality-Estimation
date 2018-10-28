import React, { Component } from 'react';
import { LineChart as LineChartRecharts, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line} from 'recharts'

class LineChart extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <LineChartRecharts
                width={this.props.width || 730}
                height={this.props.height || 250}
                data={this.props.data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={this.props.dataKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey={this.props.dataKey}
                    stroke="#8884d8" />
            </LineChartRecharts>
        );
    }
}

export default LineChart;
