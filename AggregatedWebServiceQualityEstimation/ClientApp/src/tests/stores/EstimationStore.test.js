import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import alt from '../../alt';

import EstimationStore from '../../stores/EstimationStore';
import EstimationActions from '../../actions/EstimationActions';

describe('EstimationStore', () => {
    context('Get and set data for the first web service', () => {
        it.skip('getStatisticalEstimatorResult() properly get the statistical estimator results for the first web service', () => {
        });

        it('clearApdexScoreData() properly clears the Apdex Score data for the first web service ', () => {
            const action = EstimationActions.CLEAR_APDEX_SCORE_DATA;
            const data = "first";

            alt.dispatcher.dispatch({ action, data });
            const returnedData = EstimationStore.getFirstWebServiceEstimationData();
            const { apdexScoreData } = returnedData;
            expect(apdexScoreData).to.deep.equal({});
        });

        it('setApdexScoreLimit() properly sets the Apdex Score limit for the first web service', () => {
            const action = EstimationActions.SET_APDEX_SCORE_LIMIT;
            const data = {
                apdexScoreLimit: 0.1,
                webServiceId: "first"
            };

            alt.dispatcher.dispatch({ action, data });
            const returnedData = EstimationStore.getFirstWebServiceEstimationData();
            const { apdexScoreLimit } = returnedData;
            expect(apdexScoreLimit).to.equal(data.apdexScoreLimit);
        });

        it.skip('getApdexScoreEstimatorResult() properly get the Apdex Score estimator results for the first web service', () => {
        });

        it.skip('getClusterEstimatorResult() properly get the cluster estimator results for the first web service', () => {
        });

        it('setEstimationsPanelVisibility() properly sets the estimations\' panel visiblity for the first web service', () => {
            const action = EstimationActions.SET_ESTIMATIONS_PANEL_VISIBILITY;
            const data = {
                isPanelVisible: true,
                webServiceId: "first"
            };

            alt.dispatcher.dispatch({ action, data });
            const returnedData = EstimationStore.getFirstWebServiceEstimationData();
            const { isPanelVisible } = returnedData;
            expect(isPanelVisible).to.equal(data.isPanelVisible);
        });

        it('setEstimationsPanelVisibility() properly sets the estimations\' panel visiblity for the first web service', () => {
            const action = EstimationActions.SET_ESTIMATIONS_PANEL_VISIBILITY;
            const data = {
                isPanelVisible: true,
                webServiceId: "first"
            };

            alt.dispatcher.dispatch({ action, data });
            const returnedData = EstimationStore.getFirstWebServiceEstimationData();
            const { isPanelVisible } = returnedData;
            expect(isPanelVisible).to.equal(data.isPanelVisible);
        });
    });

    context('Get and set data for the second web service', () => {
        it.skip('getStatisticalEstimatorResult() properly get the statistical estimator results for the second web service', () => {
        });

        it('clearApdexScoreData() properly clears the Apdex Score data for the second web service ', () => {
            const action = EstimationActions.CLEAR_APDEX_SCORE_DATA;
            const data = "second";

            alt.dispatcher.dispatch({ action, data });
            const returnedData = EstimationStore.getSecondWebServiceEstimationData();
            const { apdexScoreData } = returnedData;
            expect(apdexScoreData).to.deep.equal({});
        });

        it('setApdexScoreLimit() properly sets the Apdex Score limit for the second web service', () => {
            const action = EstimationActions.SET_APDEX_SCORE_LIMIT;
            const data = {
                apdexScoreLimit: 0.1,
                webServiceId: "second"
            };

            alt.dispatcher.dispatch({ action, data });
            const returnedData = EstimationStore.getSecondWebServiceEstimationData();
            const { apdexScoreLimit } = returnedData;
            expect(apdexScoreLimit).to.equal(data.apdexScoreLimit);
        });

        it.skip('getApdexScoreEstimatorResult() properly get the Apdex Score estimator results for the second web service', () => {
        });

        it.skip('getClusterEstimatorResult() properly get the cluster estimator results for the second web service', () => {
        });

        it('setEstimationsPanelVisibility() properly sets the estimations\' panel visiblity for the second web service', () => {
            const action = EstimationActions.SET_ESTIMATIONS_PANEL_VISIBILITY;
            const data = {
                isPanelVisible: true,
                webServiceId: "second"
            };

            alt.dispatcher.dispatch({ action, data });
            const returnedData = EstimationStore.getSecondWebServiceEstimationData();
            const { isPanelVisible } = returnedData;
            expect(isPanelVisible).to.equal(data.isPanelVisible);
        });

        it('setEstimationsPanelVisibility() properly sets the estimations\' panel visiblity for the second web service', () => {
            const action = EstimationActions.SET_ESTIMATIONS_PANEL_VISIBILITY;
            const data = {
                isPanelVisible: true,
                webServiceId: "second"
            };

            alt.dispatcher.dispatch({ action, data });
            const returnedData = EstimationStore.getSecondWebServiceEstimationData();
            const { isPanelVisible } = returnedData;
            expect(isPanelVisible).to.equal(data.isPanelVisible);
        });
    });
});

