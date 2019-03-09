import React, { Component } from 'react';
import { Layout } from './components/Layout/Layout';
import { Home } from './components/Home/Home';

export default class App extends Component {
  render() {
    return (
      <Layout>
         <Home />
      </Layout>
    );
  }
}
