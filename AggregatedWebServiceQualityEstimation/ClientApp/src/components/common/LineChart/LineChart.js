import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LineChart as LineChartRecharts, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, Brush} from 'recharts'

class LineChart extends Component {
    static propTypes = {
        data: PropTypes.array,
        lines: PropTypes.arrayOf(PropTypes.shape({
            axisXKey: PropTypes.string,
            color: PropTypes.string
        })).isRequired,
        axisXKey: PropTypes.string.isRequired,
        width: PropTypes.number,
        height: PropTypes.number,
        axisYUnit: PropTypes.string,
        margin: PropTypes.shape({
            top: PropTypes.number,
            right: PropTypes.number,
            left: PropTypes.number,
            bottom: PropTypes.number
        }),
        axisXPadding: PropTypes.shape({
            right: PropTypes.number,
            left: PropTypes.number,
        })
    };

    static defaultProps = {
        width: 730,
        height: 250,
        margin: {
            top: 5,
            right: 20,
            left: 20,
            bottom: 5
        },
        axisXPadding: {
            left: 30,
            right: 30
        }
    };

    render() {
        const { data, width, height, margin, axisXPadding, axisXKey, lines, axisYUnit} = this.props;

        return (
            <LineChartRecharts
                width={width}
                height={height}
                data={data}
                margin={margin}
                syncId={""}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={axisXKey} padding={axisXPadding} />
                <YAxis unit={axisYUnit} />
                <Tooltip />
                <Legend />
                {
                    lines.map((lineInfo) => {
                        return (
                            <Line
                                key={lineInfo.axisYKey}
                                type="monotone"
                                dataKey={lineInfo.axisYKey}
                                stroke={lineInfo.color}
                            />
                        );
                    })
                }
               <Brush />
            </LineChartRecharts>
        );
    }
}

export default LineChart;
