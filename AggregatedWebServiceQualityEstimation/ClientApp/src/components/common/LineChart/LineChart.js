import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LineChart as LineChartRecharts, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line} from 'recharts'

class LineChart extends Component {
    render() {
        return (
            <LineChartRecharts
                width={this.props.width}
                height={this.props.height}
                data={this.props.data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={this.props.XAxisKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey={this.props.YAxisKey}
                    stroke="#8884d8" />
            </LineChartRecharts>
        );
    }
}

LineChart.propTypes = {
    data: PropTypes.array,
    XAxisKey: PropTypes.string.isRequired,
    YAxisKey: PropTypes.string.isRequired
};

LineChart.defaultProps = {
    width: 730,
    height: 250
};

export default LineChart;
