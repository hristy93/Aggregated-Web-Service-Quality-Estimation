import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    RadarChart as RadarChartRecharts,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Legend
} from 'recharts';

//const data = [
//    { metric: 'Math', first: 120, second: 110, fullMark: 150 },
//    { metric: 'Chinese', first: 98, second: 130, fullMark: 150 },
//    { metric: 'English', first: 86, second: 130, fullMark: 150 },
//    { metric: 'Geography', first: 99, second: 100, fullMark: 150 },
//    { metric: 'Physics', first: 85, second: 90, fullMark: 150 },
//    { metric: 'History', first: 65, second: 85, fullMark: 150 },
//];

class RadarChart extends Component {
    render() {
        const { axisXKey, radarData, data, outerRadius} = this.props
 
        return (
            <RadarChartRecharts cx={300} cy={250} outerRadius={150} width={600} height={500} data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey={axisXKey} />
                <PolarRadiusAxis angle={30} domain={[0, outerRadius]} />
                <Radar {...radarData["first"]} stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Radar {...radarData["second"]} stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Legend />

            </RadarChartRecharts>
        );
    }
}

export default RadarChart;