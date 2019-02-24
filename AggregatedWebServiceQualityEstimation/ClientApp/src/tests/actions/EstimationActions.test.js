import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { beforeEach, afterEach } from 'mocha';
import alt from '../../alt';
import Q from 'q';

import EstimationActions from '../../actions/EstimationActions';
import EstimationServices from '../../services/EstimationServices';
import {
    clusterEstimatorResult,
    apdexScoreEstimatorResult,
    statisticalEstimatorResult,
} from '../testData';

let dispatcherSpy;

describe('EstimationActions', () => {
    beforeEach(() => {
        dispatcherSpy = sinon.spy(alt.dispatcher, 'dispatch');
    });

    afterEach(() => {
        alt.dispatcher.dispatch.restore();
    });

    it('getClusterEstimatorResult() successfully dispatches getClusterEstimatorResult action', (done) => {
        const q = Q.defer();
        const serviceStub = sinon
            .stub(EstimationServices, 'getClusterEstimatorResult')
            .returns(q.promise);
        const data = {
            webServiceId: 'first'
        };

        EstimationActions.getClusterEstimatorResult(data);

        q.promise
            .finally(() => {
                const actionCall = dispatcherSpy.getCall(1);

                if (spy.callCount !== 1) {
                    done(
                        new Error('EstimationActions.getClusterEstimatorResult() not called')
                    );
                }
                if (
                    !actionCall ||
                    actionCall.args[0].action !== LoadTestActions.GET_CLUSTER_ESTIMATOR_RESULT
                ) {
                    done(
                        new Error('EstimationActions.getClusterEstimatorResult() not dispatched')
                    );
                }
            })
            .finally(serviceStub.restore)
            .finally(done);

        q.resolve({
            body: {
                data: clusterEstimatorResult
            }
        });
    });

    it('getClusterEstimatorResult() throws an error', () => {
        const serviceStub = sinon
            .stub(EstimationServices, 'getClusterEstimatorResult')
            .returns(Q.reject(new Error('error')));
        const data = {
            webServiceId: 'first'
        };

        EstimationActions.getClusterEstimatorResult(data);

        serviceStub.restore();
    });

    it('getStatisticalEstimatorResult() successfully dispatches getStatisticalEstimatorResult action', (done) => {
        const q = Q.defer();
        const serviceStub = sinon
            .stub(EstimationServices, 'getStatisticalEstimatorResult')
            .returns(q.promise);
        const data = {
            webServiceId: 'first'
        };

        EstimationActions.getStatisticalEstimatorResult(data);

        q.promise
            .finally(() => {
                const actionCall = dispatcherSpy.getCall(1);

                if (spy.callCount !== 1) {
                    done(
                        new Error('EstimationActions.getStatisticalEstimatorResult() not called')
                    );
                }
                if (
                    !actionCall ||
                    actionCall.args[0].action !== LoadTestActions.GET_STATISTICAL_ESTIMATOR_RESULT
                ) {
                    done(
                        new Error('EstimationActions.getStatisticalEstimatorResult() not dispatched')
                    );
                }
            })
            .finally(serviceStub.restore)
            .finally(done);

        q.resolve({
            body: {
                data: statisticalEstimatorResult
            }
        });
    });

    it('getStatisticalEstimatorResult() throws an error', () => {
        const serviceStub = sinon
            .stub(EstimationServices, 'getStatisticalEstimatorResult')
            .returns(Q.reject(new Error('error')));
        const data = {
            webServiceId: 'first'
        };

        EstimationActions.getStatisticalEstimatorResult(data);

        serviceStub.restore();
    });

    it('getFuzzyLogicEstimatorResult() successfully dispatches getFuzzyLogicEstimatorResult action', (done) => {
        const q = Q.defer();
        const serviceStub = sinon
            .stub(EstimationServices, 'getFuzzyLogicEstimatorResult')
            .returns(q.promise);
        const data = {
            webServiceId: 'first'
        };

        EstimationActions.getFuzzyLogicEstimatorResult(data);

        q.promise
            .finally(() => {
                const actionCall = dispatcherSpy.getCall(1);

                if (spy.callCount !== 1) {
                    done(
                        new Error('EstimationActions.getFuzzyLogicEstimatorResult() not called')
                    );
                }
                if (
                    !actionCall ||
                    actionCall.args[0].action !== LoadTestActions.GET_FUZZY_LOGIC_ESTIMATOR_RESULT
                ) {
                    done(
                        new Error('EstimationActions.getFuzzyLogicEstimatorResult() not dispatched')
                    );
                }
            })
            .finally(serviceStub.restore)
            .finally(done);

        q.resolve({
            body: {
                data: []
            }
        });
    });

    it('getFuzzyLogicEstimatorResult() throws an error', () => {
        const serviceStub = sinon
            .stub(EstimationServices, 'getFuzzyLogicEstimatorResult')
            .returns(Q.reject(new Error('error')));
        const data = {
            webServiceId: 'first'
        };

        EstimationActions.getFuzzyLogicEstimatorResult(data);

        serviceStub.restore();
    });

    it('getApdexScoreEstimatorResult() successfully dispatches getApdexScoreEstimatorResult action', (done) => {
        const q = Q.defer();
        const serviceStub = sinon
            .stub(EstimationServices, 'getApdexScoreEstimatorResult')
            .returns(q.promise);
        const data = {
            webServiceId: 'first'
        };

        EstimationActions.getApdexScoreEstimatorResult(data);

        q.promise
            .finally(() => {
                const actionCall = dispatcherSpy.getCall(1);

                if (spy.callCount !== 1) {
                    done(
                        new Error('EstimationActions.getApdexScoreEstimatorResult() not called')
                    );
                }
                if (
                    !actionCall ||
                    actionCall.args[0].action !== LoadTestActions.GET_APDEX_SCORE_ESTIMATOR_RESULT
                ) {
                    done(
                        new Error('EstimationActions.getApdexScoreEstimatorResult() not dispatched')
                    );
                }
            })
            .finally(serviceStub.restore)
            .finally(done);

        q.resolve({
            body: {
                data: apdexScoreEstimatorResult
            }
        });
    });

    it('getApdexScoreEstimatorResult() throws an error', () => {
        const serviceStub = sinon
            .stub(EstimationServices, 'getApdexScoreEstimatorResult')
            .returns(Q.reject(new Error('error')));
        const data = {
            webServiceId: 'first'
        };

        EstimationActions.getApdexScoreEstimatorResult(data);

        serviceStub.restore();
    });

    it('setApdexScoreLimit() passes the right arguments', () => {
        const data = {
            apdexScoreLimit: 0.1,
            webServiceId: "first"
        };
        const action = EstimationActions.SET_APDEX_SCORE_LIMIT;

        EstimationActions.setApdexScoreLimit(data);

        var dispatcherArgs = dispatcherSpy.args[0];
        var firstArg = dispatcherArgs[0];
        expect(firstArg.action).to.equal(action);
        expect(firstArg.data).to.deep.equal(data);
    });

    it('clearApdexScoreData() passes the right arguments', () => {
        const data = "first";
        const action = EstimationActions.CLEAR_APDEX_SCORE_DATA;

        EstimationActions.clearApdexScoreData(data);

        var dispatcherArgs = dispatcherSpy.args[0];
        var firstArg = dispatcherArgs[0];
        expect(firstArg.action).to.equal(action);
        expect(firstArg.data).to.deep.equal(data);
    });

    it('setEstimationsPanelVisibility() passes the right arguments', () => {
        const data = {
            isPanelVisible: true,
            webServiceId: "first"
        };
        const action = EstimationActions.SET_ESTIMATIONS_PANEL_VISIBILITY;

        EstimationActions.setEstimationsPanelVisibility(data);

        var dispatcherArgs = dispatcherSpy.args[0];
        var firstArg = dispatcherArgs[0];
        expect(firstArg.action).to.equal(action);
        expect(firstArg.data).to.deep.equal(data);
    });
});

