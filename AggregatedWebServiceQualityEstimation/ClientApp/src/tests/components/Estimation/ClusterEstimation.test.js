import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { mount } from 'enzyme';
import { beforeEach, afterEach } from 'mocha';

import { ClusterEstimation } from '../../../components/Estimation/ClusterEstimation';

import { metricsInfo, clusterEstimatorResult } from '../../testData';

const props = {
    webServiceId: 'first',
    clusterData: clusterEstimatorResult,
    metricsInfo,
    loadTestDataSize: 10,
    areOperationsDenied: false
};

let wrapper;

describe('<ClusterEstimation />', () => {
    beforeEach(() => {
        wrapper = mount(<ClusterEstimation {...props} />);
    });

    afterEach(() => {
        wrapper.unmount();
    });


    it('renders the cluster estimation result', () => {
        const clusterEstimationResult = wrapper.find(`#cluster-estimation-data-${props.webServiceId}-web-service`);
        expect(clusterEstimationResult).to.have.lengthOf(1);
    });

    it('renders the cluster estimation result data', () => {
        const clusterEstimationResultData = wrapper.find(`.${props.webServiceId}-web-service-cluster-data`).at(0);
        expect(clusterEstimationResultData).to.have.lengthOf(clusterEstimatorResult.length);
    });

    it('renders the cluster estimation result data info', () => {
        const clusterEstimationResultDataInfo = wrapper.find(`.${props.webServiceId}-web-service-cluster-info`);
        expect(clusterEstimationResultDataInfo).to.have.lengthOf(Object.keys(clusterEstimatorResult[0]).length);
    });

    it('does not render the cluster estimation result', () => {
        wrapper.setProps({
            clusterData: {}
        });

        const clusterEstimationResult = wrapper.find(`#cluster-estimation-data-${props.webServiceId}-web-service`);
        expect(clusterEstimationResult).to.have.lengthOf(0);

        const clusterEstimationResultData = wrapper.find(`.${props.webServiceId}-web-service-cluster-data`);
        expect(clusterEstimationResultData).to.have.lengthOf(0);

        const clusterEstimationResultDataInfo = wrapper.find(`.${props.webServiceId}-web-service-cluster-info`);
        expect(clusterEstimationResultDataInfo).to.have.lengthOf(0);
    });
});

