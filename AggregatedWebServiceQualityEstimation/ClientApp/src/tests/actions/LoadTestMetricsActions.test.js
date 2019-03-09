import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { beforeEach, afterEach } from 'mocha';
import alt from '../../alt';
import Q from 'q';
import LoadTestMetricsActions from '../../actions/LoadTestMetricsActions';
import LoadTestMetricsServices from '../../services/LoadTestMetricsServices';
import LoadTestChartsActions from '../../actions/LoadTestChartsActions';

let dispatcherSpy;

describe('LoadTestMetricsActions', () => {
    beforeEach(() => {
        dispatcherSpy = sinon.spy(alt.dispatcher, 'dispatch');
    });

    afterEach(() => {
        alt.dispatcher.dispatch.restore();
    });

    it('saveMetricsUsabilityInfo() successfully dispatches saveMetricsUsabilityInfo service', (done) => {
        const q = Q.defer();
        const serviceStub = sinon
            .stub(LoadTestMetricsServices, 'saveMetricsUsabilityInfo')
            .returns(q.promise);
        const data = {
            metricsInfo: {
                "ResponseTime": true,
                "SuccessfulRequestsPerSecond": true,
                "FailedRequestsPerSecond": true,
                "ReceivedKilobytesPerSecond": true
            }
        };

        LoadTestMetricsActions.saveMetricsUsabilityInfo(data);

        q.promise
            .finally(() => {
                const actionCall = dispatcherSpy.getCall(1);

                if (spy.callCount !== 1) {
                    done(
                        new Error('LoadTestMetricsActions.saveMetricsUsabilityInfo() not called')
                    );
                }

                if (
                    !actionCall ||
                    actionCall.args[0].action !== LoadTestActions.SAVE_METRICS_USABILITY_INFO
                ) {
                    done(
                        new Error('LoadTestMetricsActions.saveMetricsUsabilityInfo() not dispatched')
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

    
    it('saveMetricsUsabilityInfo() throws an error', () => {
        const serviceStub = sinon
            .stub(LoadTestMetricsServices, 'saveMetricsUsabilityInfo')
            .returns(Q.reject(new Error('error')));
        const data = {
            metricsInfo: {
                "ResponseTime": true,
                "SuccessfulRequestsPerSecond": true,
                "FailedRequestsPerSecond": true,
                "ReceivedKilobytesPerSecond": true
            }
        };

        LoadTestMetricsActions.saveMetricsUsabilityInfo(data);

        serviceStub.restore();
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

