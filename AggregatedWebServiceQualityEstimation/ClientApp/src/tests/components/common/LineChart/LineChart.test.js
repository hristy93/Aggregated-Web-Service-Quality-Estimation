import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { mount } from 'enzyme';
import { beforeEach, afterEach } from 'mocha';
import noop from 'lodash/noop';

import {
    LineChart as LineChartRecharts,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line,
    Brush,
    ReferenceLine,
    Label
} from 'recharts';
import LineChart from '../../../../components/common/LineChart/LineChart';
import {
    chartsLinesData,
    testsData,
    referenceLinesData
} from '../../../testData';

const props = {
    id: 'id',
    data: testsData,
    axisXKey: 'IntervalStartTime',
    axisYKey: chartsLinesData['responseTime'].axisYKey,
    axisXLabel: 'Interval',
    lines: chartsLinesData['responseTime'],
    axisYUnit: 's',
    axisYLabel: 'ResponseTime',
    brushOnChange: noop,
    brushStartIndex: 0,
    brushEndIndex: 10,
    showReferenceLines: false,
    referenceLinesData,
    toggleLineVisibility: noop,
    syncChart: false,
    isVisible: true,
};

let wrapper;

describe('<LineChart />', () => {
    beforeEach(() => {
        wrapper = mount(<LineChart {...props} />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders LineChartRecharts', () => {
        const lineChartRecharts = wrapper.find(LineChartRecharts);
        expect(lineChartRecharts).to.have.lengthOf(1);
    });

    it('renders CartesianGrid', () => {
        const cartesianGrid = wrapper.find(CartesianGrid);
        expect(cartesianGrid).to.have.lengthOf(1);
    });

    it('renders Tooltip', () => {
        const tooltip = wrapper.find(Tooltip);
        expect(tooltip).to.have.lengthOf(1);
    });

    it('renders Legend', () => {
        const legend = wrapper.find(Legend);
        expect(legend).to.have.lengthOf(1);
    });

    it('renders five ReferenceLine when the reference lines are visible', () => {
        wrapper.setProps({
            showReferenceLines: true
        });

        const legend = wrapper.find(ReferenceLine);
        expect(legend).to.have.lengthOf(5);
    });

    it('renders Line', () => {
        const line = wrapper.find(Line);
        expect(line).to.have.lengthOf(1);
    });

    it('does not render Line if the isLineVisible prop is false', () => {
        wrapper.setProps({
            lines: [{
                axisYKey: "ResponseTime",
                color: "#00BFFF",
                isLineVisible: false,
                areReferenceLinesVisible: true
            }]
        });

        const line = wrapper.find(Line);
        expect(line).to.have.lengthOf(0);
    });

    it('renders Brush', () => {
        const brush = wrapper.find(Brush);
        expect(brush).to.have.lengthOf(1);
    });

    it('the chart is not visible when the chart\'s data is not present', () => {
        wrapper.setProps({
            data: []
        });

        const lineChartRecharts = wrapper.find(LineChartRecharts);
        expect(lineChartRecharts).to.have.lengthOf(0);
    });

    it('the chart is not visible when the is visible props is false', () => {
        wrapper.setProps({
            isVisible: false
        });

        const lineChartRecharts = wrapper.find(LineChartRecharts);
        expect(lineChartRecharts).to.have.lengthOf(0);
    });

    it('renders the chart with its default props', () => {
        const lineChartRecharts = wrapper.find(LineChartRecharts).getElement();
        expect(lineChartRecharts.props.data).to.equal(props.data);
        expect(lineChartRecharts.props.syncId).to.equal(props.syncChart ? "sync" : null);
        expect(lineChartRecharts.props.id).to.contain(props.id);
    });
});

