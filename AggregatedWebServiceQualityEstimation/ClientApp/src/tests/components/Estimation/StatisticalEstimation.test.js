import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { mount } from 'enzyme';
import { beforeEach, afterEach } from 'mocha';

import { StatisticalEstimation } from '../../../components/Estimation/StatisticalEstimation';
import { Table } from 'react-bootstrap';

import {
    statisticalEstimatorResult,
    testsData
} from '../../testData';


const props = {
    webServiceId: 'first',
    statisticalData: statisticalEstimatorResult,
    areOperationsDenied: false,
    loadTestData: testsData
};

let wrapper;

describe('<StatisticalEstimation />', () => {
    beforeEach(() => {
        wrapper = mount(<StatisticalEstimation {...props} />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders the statistical estimation data', () => {
        const statisticalEstimationData = wrapper.find(`#statistical-estimation-${props.webServiceId}-web-service`).at(0);
        expect(statisticalEstimationData).to.have.lengthOf(1);
    });

    it('renders the percentiles and success/failure rates', () => {
        props.statisticalData.map((statisticalItem) => {
            const percentilesData = wrapper.find(`#${statisticalItem.metricName}-percentile-data-${props.webServiceId}-web-service`);
            expect(percentilesData).to.have.lengthOf(1);
        });
    });

    it('renders Table eith the statistical data and its children', () => {
        expect(wrapper.find(Table)).to.have.lengthOf(1);
        expect(wrapper.find(`#table-header-${props.webServiceId}-web-service-statistical-estimation`)).to.have.lengthOf(1);
        expect(wrapper.find(`#table-body-${props.webServiceId}-web-service-statistical-estimation`)).to.have.lengthOf(1);
    });
});

