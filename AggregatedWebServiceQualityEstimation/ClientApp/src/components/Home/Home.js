import React, { Component } from 'react';
import LoadTest from '../LoadTest/LoadTest';

export class Home extends Component {
  render() {
    return (
      <div>
        <h1>Aggregated Web Service Quality Estimation</h1>
        <LoadTest />
      </div>
    );
  }
}
