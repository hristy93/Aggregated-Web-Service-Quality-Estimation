import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { mount } from 'enzyme';

import { beforeEach, afterEach } from 'mocha';
import noop from 'lodash/noop';

import { LoadTestCharts } from '../../../components/LoadTestCharts/LoadTestCharts';
import LoadTestChartsActions from '../../../actions/LoadTestChartsActions';
import EstimationActions from '../../../actions/EstimationActions';
import LineChart from '../../../components/common/LineChart/LineChart';
import Switch from '../../../components/common/Switch/Switch';
import {
    metricsInfo,
    chartsLinesData,
    testsData
} from '../../testData';

let wrapper;

const externalProps = {
    webServiceId: "first",
    areOperationsDenied: false,
    chartsData: testsData,
    brushOnChange: noop
};

const props = {
    ...externalProps,
    chartsLinesData,
    brushStartIndex: 0,
    brushEndIndex: 10,
    metricsInfo,
    firstWebServiceEstimationData: {
        statisticalData: {}
    },
    secondWebServiceEstimationData: {
        statisticalData: {}
    },
    firstWebServiceChartsData: {
        syncCharts: false,
        areReferenceLinesVisible: false
    },
    secondWebServiceChartsData: {
        syncCharts: false,
        areReferenceLinesVisible: false
    }
};

describe('<LoadTestCharts />', () => {
    beforeEach(() => {
        wrapper = mount(<LoadTestCharts {...props} />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders three LineCharts when there is test data', () => {
        const lineChartComponents = wrapper.find(LineChart);

        expect(lineChartComponents).to.have.lengthOf(3);
    });

    it('renders none LineCharts when there is no test data', () => {
        wrapper.setProps({
            chartsData: []
        });
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

    it('fires handleSwitchOnChange() when the charts synchronization switch is clicked', () => {
        const setChartsSyncSpy = sinon.spy(LoadTestChartsActions, 'setChartsSync');
        const switchId = `${props.webServiceId}-web-service-switch-sync-charts`;
        const switchSync = wrapper.find(`#${switchId}`).at(0).getElement();
        switchSync.props.onChange(true, null, switchId);

        expect(setChartsSyncSpy.calledOnce).to.equal(true);
        setChartsSyncSpy.restore();
    });

    it('fires handleSwitchOnChange() when the charts\' reference lines switch is clicked', () => {
        const setAllReferenceLinesVisibilitySpy = sinon.spy(LoadTestChartsActions.setAllReferenceLinesVisibility, 'defer');
        const getStatisticalEstimatorResultSpy = sinon.spy(EstimationActions, 'getStatisticalEstimatorResult');
        const switchId = `${props.webServiceId}-web-service-switch-show-reference-lines`;
        const switchReferenceLines = wrapper.find(`#${switchId}`).at(0).getElement();
        switchReferenceLines.props.onChange(true, null, switchId);

        expect(setAllReferenceLinesVisibilitySpy.calledOnce).to.equal(true);
        setAllReferenceLinesVisibilitySpy.restore();
        getStatisticalEstimatorResultSpy.restore();
    });
});

