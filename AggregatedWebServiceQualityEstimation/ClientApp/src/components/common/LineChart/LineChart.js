import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    LineChart as LineChartRecharts,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line,
    Brush,
    ReferenceLine
} from 'recharts'

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
        }),
        brushOnChange: PropTypes.func.isRequired,
        brushStartIndex: PropTypes.number,
        brushEndIndex: PropTypes.number,
        showReferenceLines: PropTypes.bool,
        referenceLinesData: PropTypes.arrayOf(PropTypes.shape({
            mean: PropTypes.number
        })),
        syncChart: PropTypes.bool.isRequired
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
        },
        showReferenceLines: false,
        referenceLinesData: []
    };

    referenceLinesRenderer = (referenceLinesData, lines) => {
        const result = referenceLinesData.map((item, outerIndex) => {
            const data = Object.keys(item).map((key, innerIndex) => {
                return (
                    <ReferenceLine
                        y={item[key]}
                        key={`reference-line-${lines[outerIndex].axisYKey}-${outerIndex}-${innerIndex}`}
                        label={""}
                        stroke={lines[outerIndex].color}
                        strokeDasharray="3 3"
                    />
                )
            });
            return data;
        });

        return result;
    }

    render() {
        const {
            data,
            width,
            height,
            margin,
            axisXPadding,
            axisXKey,
            lines,
            axisYUnit,
            brushOnChange,
            brushStartIndex,
            brushEndIndex,
            showReferenceLines,
            referenceLinesData,
            syncChart
        } = this.props;

        return (
            <LineChartRecharts
                width={width}
                height={height}
                data={data}
                margin={margin}
                syncId={syncChart ? "sync" : null}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={axisXKey} padding={axisXPadding} />
                <YAxis unit={axisYUnit} />
                <Tooltip />
                <Legend />
                {
                    showReferenceLines && this.referenceLinesRenderer(referenceLinesData, lines)
                }
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
                <Brush
                    dataKey={axisXKey}
                    startIndex={brushStartIndex}
                    endIndex={brushEndIndex}
                    onChange={brushOnChange}
                />
            </LineChartRecharts>
        );
    }
}

export default LineChart;
