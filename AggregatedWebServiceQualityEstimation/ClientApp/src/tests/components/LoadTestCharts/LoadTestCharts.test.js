import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { mount } from 'enzyme';

import { beforeEach, afterEach } from 'mocha';
import noop from 'lodash/noop';

import LoadTestCharts from '../../../components/LoadTestCharts/LoadTestCharts';
import LineChart from '../../../components/common/LineChart/LineChart';
import Switch from '../../../components/common/Switch/Switch';

let wrapper;

const loadTestData = [{
    IntervalStartTime: '10:10:10',
    IntervalEndTime: '10:10:15',
    RespondTime: 0.4
}];

const externalProps = {
    webServiceId: "first",
    areOperationsDenied: false,
    chartsData: loadTestData,
    brushOnChange: noop
};

describe('<LoadTestCharts />', () => {
    beforeEach(() => {
        wrapper = mount(<LoadTestCharts {...externalProps} />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders three LineCharts when there is test data', () => {
        const lineChartComponents = wrapper.find(LineChart);

        expect(lineChartComponents).to.have.lengthOf(3);
    });

    it('renders none LineCharts when there is no test data', () => {
        const newProps = wrapper.props();
        newProps["chartsData"] = [];
        wrapper.setProps(newProps);
        const lineChartComponents = wrapper.find(LineChart);

        expect(lineChartComponents).to.have.lengthOf(0);
    });

    it('renders two Switches when there is test data', () => {
        const switchesComponents = wrapper.find(Switch);

        expect(switchesComponents).to.have.lengthOf(2);
    });

    it('renders none Switches when there is no test data', () => {
        const newProps = wrapper.props();
        newProps["chartsData"] = [];
        wrapper.setProps(newProps);
        const switchesComponents = wrapper.find(Switch);

        expect(switchesComponents).to.have.lengthOf(0);
    });

    //it('displays title', () => {
    //    const headerTitleNode = wrapper.find('#header-title');

    //    expect(headerTitleNode).to.have.lengthOf(1);
    //    expect(headerTitleNode.text()).to.equal(titleText);
    //});
});

