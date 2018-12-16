import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LineChartOptions from './LineChartOptions';
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
} from 'recharts';

class LineChart extends Component {
    static propTypes = {
        axisXKey: PropTypes.string.isRequired,
        axisXPadding: PropTypes.shape({
            right: PropTypes.number,
            left: PropTypes.number
        }),
        axisYUnit: PropTypes.string,
        brushEndIndex: PropTypes.number,
        brushOnChange: PropTypes.func.isRequired,       
        brushStartIndex: PropTypes.number,
        data: PropTypes.instanceOf(Array),
        height: PropTypes.number,
        lines: PropTypes.arrayOf(PropTypes.shape({
            axisXKey: PropTypes.string,
            color: PropTypes.string,
            isLineVisible: PropTypes.bool,
            isReferenceLineVisible: PropTypes.bool
        })).isRequired,
        margin: PropTypes.shape({
            top: PropTypes.number,
            right: PropTypes.number,
            left: PropTypes.number,
            bottom: PropTypes.number
        }),
        referenceLinesData: PropTypes.arrayOf(PropTypes.shape({
            mean: PropTypes.number
        })),
        showReferenceLines: PropTypes.bool,
        syncChart: PropTypes.bool.isRequired,
        toggleLineVisibility: PropTypes.func,
        width: PropTypes.number
        //legendOnClick: PropTypes.func,
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
                    lines[outerIndex].areReferenceLinesVisible &&
                    <ReferenceLine
                        y={item[key]}
                        key={`reference-line-${lines[outerIndex].axisYKey}-${outerIndex}-${innerIndex}`}
                        label={""}
                        stroke={lines[outerIndex].color}
                        strokeDasharray="3 3"
                    />
                );
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
            //legendOnClick,
            brushStartIndex,
            brushEndIndex,
            showReferenceLines,
            referenceLinesData,
            toggleLineVisibility,
            syncChart
        } = this.props;

        return (
            <React.Fragment>
                {
                    data.length > 0 &&
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
                                    lineInfo.isLineVisible &&
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
                }
                {
                    data.length > 0 && lines.length > 1 &&
                    <LineChartOptions
                        lines={lines}
                        toggleLineVisibility={toggleLineVisibility}
                    />
                }
            </React.Fragment>
        );
    }
}

export default LineChart;
