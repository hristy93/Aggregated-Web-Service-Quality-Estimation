import React, { Component } from 'react';
import LoadTest from '../LoadTest/LoadTest';
import LineChart from '../common/LineChart/LineChart';
import { responseTimeTestData } from '../../data/testData';

export class Home extends Component {
  displayName = Home.name

  render() {
    return (
      <div>
            <h1>Aggregated Web Service Quality Estimation</h1>
            <LoadTest />
            <LineChart XAxisKey="name" YAxisKey="value" data={responseTimeTestData}/>
      </div>
    );
  }
}
