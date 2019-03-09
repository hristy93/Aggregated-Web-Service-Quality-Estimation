import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { mount } from 'enzyme';
import { beforeEach, afterEach } from 'mocha';
import merge from 'lodash/merge';

import { StatisticalEstimation } from '../../../components/Estimation/StatisticalEstimation';
import { Table } from 'react-bootstrap';

import {
    statisticalEstimatorResult,
    metricsInfo,
    testsData
} from '../../testData';


const props = {
    webServiceId: 'first',
    statisticalData: statisticalEstimatorResult,
    areOperationsDenied: false,
    loadTestData: testsData,
    metricsInfo
};

let wrapper;

describe('<StatisticalEstimation />', () => {
    beforeEach(() => {
        wrapper = mount(<StatisticalEstimation {...props} />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders the statistical estimation result', () => {
        const statisticalEstimationResult = wrapper.find(`#statistical-estimation-${props.webServiceId}-web-service`).at(0);
        expect(statisticalEstimationResult).to.have.lengthOf(1);
    });

    it('renders the statistical estimation data', () => {
        const statisticalEstimationData = wrapper.find(`#statistical-data-${props.webServiceId}-web-service`).at(0);
        expect(statisticalEstimationData).to.have.lengthOf(1);
    });

    it('renders the success/failure rates if the metrics are shown', () => {
        const statisticalEstimationRequestsRates = wrapper.find(`#requests-statistical-data-${props.webServiceId}-web-service`).at(0);
        expect(statisticalEstimationRequestsRates).to.have.lengthOf(1);
    });

    it('renders the success/failure rates if the metrics are shown', () => {
        wrapper.setProps({
            metricsInfo: merge({}, metricsInfo, {
                "SuccessfulRequestsPerSecond": false,
                "FailedRequestsPerSecond": false,
            })
        })
        const statisticalEstimationRequestsRates = wrapper.find(`#requests-statistical-data-${props.webServiceId}-web-service`).at(0);
        expect(statisticalEstimationRequestsRates).to.have.lengthOf(0);
    });

    it('renders Table with the statistical data and its children', () => {
        const fullStatisticalDataDiv = wrapper.find(`#full-statistical-data-${props.webServiceId}-web-service`);
        expect(fullStatisticalDataDiv).to.have.lengthOf(1);
        expect(fullStatisticalDataDiv.find(`#table-${props.webServiceId}-web-service-statistical-estimation`).at(0)).to.have.lengthOf(1);
        expect(fullStatisticalDataDiv.find(`#table-body-${props.webServiceId}-web-service-statistical-estimation`)).to.have.lengthOf(1);
    });
});

