import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { beforeEach, afterEach } from 'mocha';
import alt from '../../alt';
import Q from 'q';
import LoadTestActions from '../../actions/LoadTestActions';

let dispatcherSpy;

describe('LoadTestActions', () => {
    beforeEach(() => {
        dispatcherSpy = sinon.spy(alt.dispatcher, 'dispatch');
    });

    afterEach(() => {
        alt.dispatcher.dispatch.restore();
    });

    it('runLoadTest() successfully dispatches runLoadTest action', () => {
        const q = Q.defer();
        const actionStub = sinon
            .stub(LoadTestActions, 'runLoadTest')
            .returns(q.promise);
        const data = {
            data: {
                url: 'www.test.com/api'
            },
            duration: '00:10:00'
        };

        LoadTestActions.runLoadTest(data);

        q.promise
            .finally(() => {
                const actionCall = dispatcherSpy.getCall(1);

                if (spy.callCount !== 1) {
                    done(
                        new Error('LoadTestActions.runLoadTest() not called')
                    );
                }

                if (
                    !actionCall ||
                    actionCall.args[0].action !== LoadTestActions.RUN_LOAD_TEST
                ) {
                    done(
                        new Error('LoadTestActions.runLoadTest() not dispatched')
                    );
                }
            })
            .finally(actionStub.restore);
        q.resolve({
            body: {
                data: []
            }
        });
    });

    it.skip('cancelLoadTest() successfully dispatches cancelLoadTest action', () => {
    });

    it.skip('checkLoadTestStatus() successfully dispatches checkLoadTestStatus action', () => {
    });

    it.skip('readLoadTestData() successfully dispatches readLoadTestData action', () => {
    });

    it.skip('writeLoadTestData() successfully dispatches writeLoadTestData action', () => {
    });

    it.skip('uploadLoadTestData() successfully dispatches uploadLoadTestData action', () => {
    });

    it('setLoadTestDuration() passes the right arguments', () => {
        const data = "00:01:00";
        const action = LoadTestActions.SET_LOAD_TEST_DURATION;

        LoadTestActions.setLoadTestDuration(data);

        var dispatcherArgs = dispatcherSpy.args[0];
        var firstArg = dispatcherArgs[0];
        expect(firstArg.action).to.equal(action);
        expect(firstArg.data).to.deep.equal(data);
    });

    it('setTestState() passes the right arguments', () => {
        const data = {
            isStarted: false,
            isFinished: false,
            writingTestData: false
        };

        const action = LoadTestActions.SET_TEST_STATE;

        LoadTestActions.setTestState(data);

        var dispatcherArgs = dispatcherSpy.args[0];
        var firstArg = dispatcherArgs[0];
        expect(firstArg.action).to.equal(action);
        expect(firstArg.data).to.deep.equal(data);
    });

    it('setTimeLeft() passes the right arguments', () => {
        const data = "00:00:30";

        const action = LoadTestActions.SET_TIME_LEFT;

        LoadTestActions.setTimeLeft(data);

        var dispatcherArgs = dispatcherSpy.args[0];
        var firstArg = dispatcherArgs[0];
        expect(firstArg.action).to.equal(action);
        expect(firstArg.data).to.deep.equal(data);
    });

    it('setLoadTestDataSize() passes the right arguments', () => {
        const data = {
            loadTestDataSize: 120,
            webServiceId: "first"
        };

        const action = LoadTestActions.SET_LOAD_TEST_DATA_SIZE;

        LoadTestActions.setLoadTestDataSize(data);

        var dispatcherArgs = dispatcherSpy.args[0];
        var firstArg = dispatcherArgs[0];
        expect(firstArg.action).to.equal(action);
        expect(firstArg.data).to.deep.equal(data);
    });

    it('setLoadTestDataSource() passes the right arguments', () => {
        const data = {
            isFromFile: true,
            webServiceId: "first"
        };

        const action = LoadTestActions.SET_LOAD_TEST_DATA_SOURCE;

        LoadTestActions.setLoadTestDataSource(data);

        var dispatcherArgs = dispatcherSpy.args[0];
        var firstArg = dispatcherArgs[0];
        expect(firstArg.action).to.equal(action);
        expect(firstArg.data).to.deep.equal(data);
    });
});

