import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import alt from '../../alt';

import LoadTestChartsStore from '../../stores/LoadTestChartsStore';
import LoadTestChartsActions from '../../actions/LoadTestChartsActions';

describe('LoadTestChartsStore', () => {
    context('Get and set data for the first web service', () => {
        it('setAllReferenceLinesVisibility() properly sets visibility of all reference lines for the first web service\'s charts', () => {
            const action = LoadTestChartsActions.SET_ALL_REFERENCE_LINES_VISIBILITY;
            const initialReturnedData = LoadTestChartsStore.getFirstWebServiceChartsData().areReferenceLinesVisible;
            const data = {
                areReferenceLinesVisible: !initialReturnedData,
                webServiceId: "first"
            };

            alt.dispatcher.dispatch({ action, data });

            const returnedData = LoadTestChartsStore.getFirstWebServiceChartsData();
            const { areReferenceLinesVisible } = returnedData;
            expect(areReferenceLinesVisible).to.equal(data.areReferenceLinesVisible);
        });

        it('setChartsSync() properly sets synchronization of the first web service\'s charts', () => {
            const action = LoadTestChartsActions.SET_CHARTS_SYNC;
            const initialReturnedData = LoadTestChartsStore.getFirstWebServiceChartsData().syncCharts;
            const data = {
                syncCharts: !initialReturnedData,
                webServiceId: "first"
            };

             alt.dispatcher.dispatch({ action, data });

            const returnedData = LoadTestChartsStore.getFirstWebServiceChartsData();
            const { syncCharts } = returnedData;
            expect(syncCharts).to.equal(data.syncCharts);
        });

        it('setChartsPanelVisibility() properly sets visibility of the panel for the first web service\'s charts', () => {
            const action = LoadTestChartsActions.SET_CHARTS_PANEL_VISIBILITY;
            const initialReturnedData = LoadTestChartsStore.getFirstWebServiceChartsData().syncCharts;
            const data = {
                isPanelVisible: !initialReturnedData,
                webServiceId: "first"
            };

            alt.dispatcher.dispatch({ action, data });

            const returnedData = LoadTestChartsStore.getFirstWebServiceChartsData();
            const { isPanelVisible } = returnedData;
            expect(isPanelVisible).to.equal(data.isPanelVisible);
        });
    });

    context('Get and set data for the second web service', () => {
        it('setAllReferenceLinesVisibility() properly sets visibility of all reference lines for the second web service\'s charts', () => {
            const action = LoadTestChartsActions.SET_ALL_REFERENCE_LINES_VISIBILITY;
            const initialReturnedData = LoadTestChartsStore.getSecondWebServiceChartsData().areReferenceLinesVisible;
            const data = {
                areReferenceLinesVisible: !initialReturnedData,
                webServiceId: "second"
            };

            alt.dispatcher.dispatch({ action, data });

            const returnedData = LoadTestChartsStore.getSecondWebServiceChartsData();
            const { areReferenceLinesVisible } = returnedData;
            expect(areReferenceLinesVisible).to.equal(data.areReferenceLinesVisible);
        });

        it('setChartsSync() properly sets synchronization of the second web service\'s charts', () => {
            const action = LoadTestChartsActions.SET_CHARTS_SYNC;
            const initialReturnedData = LoadTestChartsStore.getSecondWebServiceChartsData().syncCharts;
            const data = {
                syncCharts: !initialReturnedData,
                webServiceId: "second"
            };

            alt.dispatcher.dispatch({ action, data });

            const returnedData = LoadTestChartsStore.getSecondWebServiceChartsData();
            const { syncCharts } = returnedData;
            expect(syncCharts).to.equal(data.syncCharts);
        });

        it('setChartsPanelVisibility() properly sets visibility of the panel for the second web service\'s charts', () => {
            const action = LoadTestChartsActions.SET_CHARTS_PANEL_VISIBILITY;
            const initialReturnedData = LoadTestChartsStore.getSecondWebServiceChartsData().syncCharts;
            const data = {
                isPanelVisible: !initialReturnedData,
                webServiceId: "second"
            };

            alt.dispatcher.dispatch({ action, data });

            const returnedData = LoadTestChartsStore.getSecondWebServiceChartsData();
            const { isPanelVisible } = returnedData;
            expect(isPanelVisible).to.equal(data.isPanelVisible);
        });
    });

    context('Get and set data for both web services', () => {
        it('setBrushPosition() properly sets the position of the brush on charts', () => {
            const action = LoadTestChartsActions.SET_BRUSH_POSITION;
            const data = {
                brushStartIndex: 0,
                brushEndIndex: 10
            };

            alt.dispatcher.dispatch({ action, data });

            const brushStartIndex = LoadTestChartsStore.getBrushStartIndex();
            const brushEndIndex = LoadTestChartsStore.getBrushEndIndex();
            expect(brushStartIndex).to.equal(data.brushStartIndex);
            expect(brushEndIndex).to.equal(data.brushEndIndex);
        });

        it('setLineVisibility() properly sets the line visibility for some chart', () => {
            const action = LoadTestChartsActions.SET_LINE_VISIBILITY;
            const data = 'ResponseTime';
            const initialReturnData = LoadTestChartsStore.getChartsLinesData().responseTime[0].isLineVisible;

            alt.dispatcher.dispatch({ action, data });

            const returnedData = LoadTestChartsStore.getChartsLinesData();
            const { responseTime } = returnedData;
            expect(responseTime[0].isLineVisible).to.equal(!initialReturnData);
        });

        it('setReferenceLinesVisibility() properly sets visibility of a reference line for some chart', () => {
            const action = LoadTestChartsActions.SET_REFERENCE_LINES_VISIBILITY;
            const data = 'ResponseTime';
            const initialReturnData = LoadTestChartsStore.getChartsLinesData().responseTime[0].areReferenceLinesVisible;

            alt.dispatcher.dispatch({ action, data });

            const returnedData = LoadTestChartsStore.getChartsLinesData();
            const { responseTime } = returnedData;
            expect(responseTime[0].areReferenceLinesVisible).to.equal(!initialReturnData);
        });
    });
});