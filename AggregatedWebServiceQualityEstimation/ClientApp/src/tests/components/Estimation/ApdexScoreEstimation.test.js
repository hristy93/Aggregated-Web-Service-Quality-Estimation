import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { mount } from 'enzyme';
import { beforeEach, afterEach } from 'mocha';
import noop from 'lodash/noop';

import { ApdexScoreEstimation } from '../../../components/Estimation/ApdexScoreEstimation';
import EstimationActions from '../../../actions/EstimationActions';

import {
    apdexScoreEstimatorResult,
    chartsLinesData,
    metricsInfo
} from '../../testData';


const props = {
    webServiceId: 'first',
    apdexScoreLimit: 0.05,
    apdexScoreData: apdexScoreEstimatorResult,
    chartsLinesData,
    metricsInfo,
    brushStartIndex: 0,
    brushEndIndex: 10,
    brushOnChange: noop,
    syncCharts: false
};

let wrapper;

describe('<ApdexScoreEstimation />', () => {
    beforeEach(() => {
        wrapper = mount(<ApdexScoreEstimation {...props} />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders Button that get the Apdex Score data', () => {
        const getApdexDataButton = wrapper.find(`#button-get-apdex-estimation-${props.webServiceId}-web-service`).at(0);
        expect(getApdexDataButton).to.have.lengthOf(1);
    });

    it('renders the Apdex Score data summary', () => {
        const apdexScoreSummaryDiv = wrapper.find(`#apdex-estimation-summary-${props.webServiceId}-web-service`).at(0);
        expect(apdexScoreSummaryDiv).to.have.lengthOf(1);
    });

    it('renders the Apdex Score chart', () => {
        const lineChart = wrapper.find(`#apdex-estimation-chart-${props.webServiceId}-web-service`).at(0);
        const apdexScoreChart = wrapper.find('.recharts-wrapper').at(0);
        
        expect(lineChart).to.have.lengthOf(1);
        expect(apdexScoreChart).to.have.lengthOf(1);
    });

    it('does not render anything when the Apdex Score data is not present', () => {
        wrapper.setProps({
            apdexScoreData: {}
        });
        const getApdexDataButton = wrapper.find(`#button-get-apdex-estimation-${props.webServiceId}-web-service`).at(0);
        expect(getApdexDataButton).to.have.lengthOf(0);

        const apdexScoreSummaryDiv = wrapper.find(`#apdex-estimation-summary-${props.webServiceId}-web-service`).at(0);
        expect(apdexScoreSummaryDiv).to.have.lengthOf(0);

        const lineChart = wrapper.find(`#apdex-estimation-chart-${props.webServiceId}-web-service`).at(0);
        const apdexScoreChart = wrapper.find('.recharts-wrapper').at(0);
        expect(lineChart).to.have.lengthOf(1);
        expect(apdexScoreChart).to.have.lengthOf(0);
    });

    it('the Button that get the Apdex Score data is disabled when Apdex Score limit is not set', () => {
        wrapper.setProps({
            apdexScoreLimit: undefined
        });
        const getApdexDataButton = wrapper.find(`#button-get-apdex-estimation-${props.webServiceId}-web-service`)
            .at(0).getElement();
        expect(getApdexDataButton.props.disabled).to.equal(true);
    });

    it('the Button that get the Apdex Score data is disabled when ResponseTime metric is not used', () => {
        wrapper.setProps({
            metricsInfo: {
                "ResponseTime": false,
            }
        });

        const getApdexDataButton = wrapper.find(`#button-get-apdex-estimation-${props.webServiceId}-web-service`)
            .at(0).getElement();
        expect(getApdexDataButton.props.disabled).to.equal(true);
    });


    it('the Apdex Score chart is not visible when the Apdex Score data is not present', () => {
        wrapper.setProps({
            apdexScoreData: {}
        });

        const apdexScoreChart = wrapper.find('.recharts-wrapper').at(0);
        expect(apdexScoreChart).to.have.length(0);
    });

    it('the Apdex Score chart is not visible when ResponseTime metric is not used', () => {
        wrapper.setProps({
            metricsInfo: {
                "ResponseTime": false,
            }
        });

        const apdexScoreChart = wrapper.find('.recharts-wrapper').at(0);
        expect(apdexScoreChart).to.have.length(0);
    });

    it('fires handleApdexScoreLimitChange() when Apdex Score limit is not set', () => {
        const setApdexScoreLimitSpy = sinon.spy(EstimationActions.setApdexScoreLimit, 'defer');
        wrapper.setProps({
            apdexScoreLimit: null
        });

        expect(setApdexScoreLimitSpy.calledOnce).to.equal(true);
        setApdexScoreLimitSpy.restore();
    });
});

