import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { beforeEach, afterEach } from 'mocha';
import alt from '../../alt';
import LoadTestChartsActions from '../../actions/LoadTestChartsActions';

let dispatcherSpy;

describe('LoadTestChartsActions', () => {
    beforeEach(() => {
        dispatcherSpy = sinon.spy(alt.dispatcher, 'dispatch');
    });

    afterEach(() => {
        alt.dispatcher.dispatch.restore();
    });

    it('setBrushPosition() passes the right arguments', () => {
        const data = {
            brushStartIndex: 0,
            brushEndIndex: 10
        };

        const action = LoadTestChartsActions.SET_BRUSH_POSITION;

        LoadTestChartsActions.setBrushPosition(data);

        var dispatcherArgs = dispatcherSpy.args[0];
        var firstArg = dispatcherArgs[0];
        expect(firstArg.action).to.equal(action);
        expect(firstArg.data).to.deep.equal(data);
    });

    it('setAllReferenceLinesVisibility() passes the right arguments', () => {
        const data = {
            areReferenceLinesVisible: true,
            webServiceIdL: "first"
        };

        const action = LoadTestChartsActions.SET_ALL_REFERENCE_LINES_VISIBILITY;

        LoadTestChartsActions.setAllReferenceLinesVisibility(data);

        var dispatcherArgs = dispatcherSpy.args[0];
        var firstArg = dispatcherArgs[0];
        expect(firstArg.action).to.equal(action);
        expect(firstArg.data).to.deep.equal(data);
    });

    it('setReferenceLinesVisibility() passes the right arguments', () => {
        const data = 'ResponseTime';

        const action = LoadTestChartsActions.SET_REFERENCE_LINES_VISIBILITY;

        LoadTestChartsActions.setReferenceLinesVisibility(data);

        var dispatcherArgs = dispatcherSpy.args[0];
        var firstArg = dispatcherArgs[0];
        expect(firstArg.action).to.equal(action);
        expect(firstArg.data).to.deep.equal(data);
    });

    it('setChartsSync() passes the right arguments', () => {
        const data = {
            syncCharts: true,
            webServiceId: "first"
        };

        const action = LoadTestChartsActions.SET_CHARTS_SYNC;

        LoadTestChartsActions.setChartsSync(data);

        var dispatcherArgs = dispatcherSpy.args[0];
        var firstArg = dispatcherArgs[0];
        expect(firstArg.action).to.equal(action);
        expect(firstArg.data).to.deep.equal(data);
    });

    it('setLineVisibility() passes the right arguments', () => {
        const data = 'ResponseTime';

        const action = LoadTestChartsActions.SET_LINE_VISIBILITY;

        LoadTestChartsActions.setLineVisibility(data);

        var dispatcherArgs = dispatcherSpy.args[0];
        var firstArg = dispatcherArgs[0];
        expect(firstArg.action).to.equal(action);
        expect(firstArg.data).to.deep.equal(data);
    });

    it('setChartsPanelVisibility() passes the right arguments', () => {
        const data = {
            isPanelVisible: true,
            webServiceId: "first"
        };

        const action = LoadTestChartsActions.SET_CHARTS_PANEL_VISIBILITY;

        LoadTestChartsActions.setChartsPanelVisibility(data);

        var dispatcherArgs = dispatcherSpy.args[0];
        var firstArg = dispatcherArgs[0];
        expect(firstArg.action).to.equal(action);
        expect(firstArg.data).to.deep.equal(data);
    });
});

