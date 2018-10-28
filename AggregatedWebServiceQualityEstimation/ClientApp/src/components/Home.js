import React, { Component } from 'react';
import LoadTest from './LoadTest';
import LineChart from './common/LineChart';
import { responseTimeTestData } from '../TestData';

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
