import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { mount } from 'enzyme';
import { beforeEach, afterEach } from 'mocha';
import noop from 'lodash/noop';

import { Glyphicon } from 'react-bootstrap';
import { EstimationContainer } from '../../../components/Estimation/EstimationContainer';

import {
    chartsLinesData,
    metricsInfo,
    testsData,
    apdexScoreEstimatorResult,
    clusterEstimatorResult,
    statisticalEstimatorResult
} from '../../testData';


const props = {
    firstWebServiceEstimationData: {
        apdexScoreLimit: 0.05,
        apdexScoreData: apdexScoreEstimatorResult,
        clusterData: clusterEstimatorResult,
        statisticalData: statisticalEstimatorResult
    },
    secondWebServiceEstimationData: {
        apdexScoreLimit: 0.05,
        apdexScoreData: apdexScoreEstimatorResult,
        clusterData: clusterEstimatorResult,
        statisticalData: statisticalEstimatorResult
    },
    firstWebServiceChartsData: { syncCharts: false },
    secondWebServiceChartsData: { syncCharts: false },
    firstServiceLoadTestData: testsData,
    secondServiceLoadTestData: testsData,
    firstServiceLoadTestDataInfo: { loadTestDataSize: testsData.length },
    secondServiceLoadTestDataInfo: { loadTestDataSize: testsData.length },
    webServiceId: 'first',
    chartsLinesData,
    metricsInfo,
    brushStartIndex: 0,
    brushEndIndex: 10,
    brushOnChange: noop,
    areOperationsDenied: false
};

let wrapper;

describe('<EstimationContainer />', () => {
    beforeEach(() => {
        wrapper = mount(<EstimationContainer {...props} />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders PanelGroup for the estimations data and its children', () => {
        const estimationsPanelGroup = wrapper.find(`#panel-group-${props.webServiceId}-estimations`).at(0);
        expect(estimationsPanelGroup).to.have.lengthOf(1);
    });

    it('renders Panel for estimations\' options and its children', () => {
        const estimationsOptionsPanel = wrapper.find(`#panel-estimation-options-${props.webServiceId}-web-service`).at(0);
        expect(estimationsOptionsPanel).to.have.lengthOf(1);

        const estimationsOptionsPanelHeading = wrapper.find(`#panel-heading-estimation-options-${props.webServiceId}-web-service`);
        expect(estimationsOptionsPanelHeading).to.have.lengthOf(1);

        const estimationsOptionsPanelTitle = wrapper.find(`#panel-title-estimation-options-${props.webServiceId}-web-service`).at(0);
        expect(estimationsOptionsPanelTitle).to.have.lengthOf(1);

        const estimationsOptionsPanelBody = wrapper.find(`#panel-body-estimation-options-${props.webServiceId}-web-service`).at(0);
        expect(estimationsOptionsPanelBody).to.have.lengthOf(1);
    });

    it('renders Panel for Apdex Score estimation and its children', () => {
        const apdexScoreEstimationPanel = wrapper.find(`#panel-apdex-score-estimation-${props.webServiceId}-web-service`).at(0);
        expect(apdexScoreEstimationPanel).to.have.lengthOf(1);

        const apdexScoreEstimationPanelHeading = wrapper.find(`#panel-heading-apdex-score-estimation-${props.webServiceId}-web-service`);
        expect(apdexScoreEstimationPanelHeading).to.have.lengthOf(1);

        const apdexScoreEstimationPanelTitle = wrapper.find(`#panel-title-apdex-score-estimation-${props.webServiceId}-web-service`).at(0);
        expect(apdexScoreEstimationPanelTitle).to.have.lengthOf(1);

        const apdexScoreEstimationPanelBody = wrapper.find(`#panel-body-apdex-score-estimation-${props.webServiceId}-web-service`).at(0);
        expect(apdexScoreEstimationPanelBody).to.have.lengthOf(1);
    });

    it('renders Panel for cluster estimation and its children', () => {
        const clusterEstimationPanel = wrapper.find(`#panel-cluster-estimation-${props.webServiceId}-web-service`).at(0);
        expect(clusterEstimationPanel).to.have.lengthOf(1);

        const clusterEstimationPanelHeading = wrapper.find(`#panel-heading-cluster-estimation-${props.webServiceId}-web-service`);
        expect(clusterEstimationPanelHeading).to.have.lengthOf(1);

        const clusterEstimationPanelTitle = wrapper.find(`#panel-title-cluster-estimation-${props.webServiceId}-web-service`).at(0);
        expect(clusterEstimationPanelTitle).to.have.lengthOf(1);

        const clusterEstimationPanelBody = wrapper.find(`#panel-body-cluster-estimation-${props.webServiceId}-web-service`).at(0);
        expect(clusterEstimationPanelBody).to.have.lengthOf(1);
    });

    it('renders Panel for statistical estimation and its children', () => {
        const statisticalEstimationPanel = wrapper.find(`#panel-statistical-estimation-${props.webServiceId}-web-service`).at(0);
        expect(statisticalEstimationPanel).to.have.lengthOf(1);

        const statisticalEstimationPanelHeading = wrapper.find(`#panel-heading-statistical-estimation-${props.webServiceId}-web-service`);
        expect(statisticalEstimationPanelHeading).to.have.lengthOf(1);

        const statisticalEstimationPanelTitle = wrapper.find(`#panel-title-statistical-estimation-${props.webServiceId}-web-service`).at(0);
        expect(statisticalEstimationPanelTitle).to.have.lengthOf(1);

        const statisticalEstimationPanelBody = wrapper.find(`#panel-body-statistical-estimation-${props.webServiceId}-web-service`).at(0);
        expect(statisticalEstimationPanelBody).to.have.lengthOf(1);
    });

    it('renders Glyphicon for the Apdex Score info', () => {
        const glyphiconApdexScoreInfo = wrapper.find(Glyphicon);
        expect(glyphiconApdexScoreInfo).to.have.lengthOf(1);
    });
});

