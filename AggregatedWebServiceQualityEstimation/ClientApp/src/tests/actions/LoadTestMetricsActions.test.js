import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { beforeEach, afterEach } from 'mocha';
import alt from '../../alt';
import LoadTestMetricsActions from '../../actions/LoadTestMetricsActions';
import LoadTestChartsActions from '../../actions/LoadTestChartsActions';

let dispatcherSpy;

describe('LoadTestMetricsActions', () => {
    beforeEach(() => {
        dispatcherSpy = sinon.spy(alt.dispatcher, 'dispatch');
    });

    afterEach(() => {
        alt.dispatcher.dispatch.restore();
    });

    it.skip('saveMetricsUsabilityInfo() successfully dispatches saveMetricsUsabilityInfo action', () => {

    });

    it('setMetricsUsability() passes the right arguments', () => {
        const data = 'ResponseTime';
        const action = LoadTestMetricsActions.SET_METRICS_USABILITY;

        LoadTestMetricsActions.setMetricsUsability(data);

        var dispatcherArgs = dispatcherSpy.args[0];
        var firstArg = dispatcherArgs[0];
        expect(firstArg.action).to.equal(action);
        expect(firstArg.data).to.deep.equal(data);
    });

    it('setMetricsUsability() fires LoadTestMetricsActions.saveMetricsUsabilityInfo()', () => {
        const data = 'ResponseTime';
        const saveMetricsUsabilityInfoSpy = sinon.spy(LoadTestMetricsActions.saveMetricsUsabilityInfo, 'defer');
           
        LoadTestMetricsActions.setMetricsUsability(data);

        expect(saveMetricsUsabilityInfoSpy.calledOnce).to.equal(true);
        saveMetricsUsabilityInfoSpy.restore();
    });

    it('setMetricsUsability() fires LoadTestChartsActions.setLineVisibility()', () => {
        const data = 'ResponseTime';
        const setLineVisibilitySpy = sinon.spy(LoadTestChartsActions.setLineVisibility, 'defer');

        LoadTestMetricsActions.setMetricsUsability(data);

        expect(setLineVisibilitySpy.calledOnce).to.equal(true);
        setLineVisibilitySpy.restore();
    });

    it('setMetricsUsability() fires LoadTestChartsActions.setReferenceLinesVisibility()', () => {
        const data = 'ResponseTime';
        const setReferenceLinesVisibilitySpy = sinon.spy(LoadTestChartsActions.setReferenceLinesVisibility, 'defer');

        LoadTestMetricsActions.setMetricsUsability(data);

        expect(setReferenceLinesVisibilitySpy.calledOnce).to.equal(true);
        setReferenceLinesVisibilitySpy.restore();
    });
});

