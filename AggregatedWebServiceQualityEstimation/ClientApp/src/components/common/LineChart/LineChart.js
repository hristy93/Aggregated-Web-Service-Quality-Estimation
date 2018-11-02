import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LineChart as LineChartRecharts, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line} from 'recharts'

class LineChart extends Component {
    static propTypes = {
        data: PropTypes.array,
        XAxisKey: PropTypes.string.isRequired,
        YAxisKey: PropTypes.string.isRequired,
        width: PropTypes.number,
        height: PropTypes.number,
        margin: PropTypes.shape({
            top: PropTypes.number,
            right: PropTypes.number,
            left: PropTypes.number,
            bottom: PropTypes.number
        }),
        lineColor: PropTypes.string
    };

    static defaultProps = {
        width: 730,
        height: 250,
        maring: {
            top: 5,
            right: 20,
            left: 20,
            bottom: 5
        },
        lineColor: "#00BFFF"
    };

    render() {
        const { data, width, height, margin, XAxisKey, YAxisKey, lineColor } = this.props;

        return (
            <LineChartRecharts
                width={width}
                height={height}
                data={data}
                margin={margin}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={XAxisKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey={YAxisKey}
                    stroke={lineColor}
                />
            </LineChartRecharts>
        );
    }
}

export default LineChart;
