import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { beforeEach, afterEach } from 'mocha';
import alt from '../../alt';
import Q from 'q';
import LoadTestActions from '../../actions/LoadTestActions';
import LoadTestServices from '../../services/LoadTestServices';
import { getFakeUploadedFile } from '../testData';

let dispatcherSpy;

describe('LoadTestActions', () => {
    beforeEach(() => {
        dispatcherSpy = sinon.spy(alt.dispatcher, 'dispatch');
    });

    afterEach(() => {
        alt.dispatcher.dispatch.restore();
    });

    it('runLoadTest() successfully dispatches runLoadTest service', (done) => {
        const q = Q.defer();
        const serviceStub = sinon
            .stub(LoadTestServices, 'runLoadTest')
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
            .finally(serviceStub.restore)
            .finally(done);

        q.resolve({
            body: {
                data: []
            }
        });
    });

    it('runLoadTest() throws an error', () => {
        const serviceStub = sinon
            .stub(LoadTestServices, 'runLoadTest')
            .returns(Q.reject(new Error('error')));
        const data = {
            data: {
                url: 'www.test.com/api'
            },
            duration: '00:10:00'
        };

        LoadTestActions.runLoadTest(data);

        serviceStub.restore();
    });

    it('cancelLoadTest() successfully dispatches cancelLoadTest service', (done) => {
        const q = Q.defer();
        const serviceStub = sinon
            .stub(LoadTestServices, 'cancelLoadTest')
            .returns(q.promise);

        LoadTestActions.cancelLoadTest();

        q.promise
            .finally(() => {
                const actionCall = dispatcherSpy.getCall(1);

                if (spy.callCount !== 1) {
                    done(
                        new Error('LoadTestActions.cancelLoadTest() not called')
                    );
                }
                if (
                    !actionCall ||
                    actionCall.args[0].action !== LoadTestActions.CANCEL_LOAD_TEST
                ) {
                    done(
                        new Error('LoadTestActions.canceloadTest() not dispatched')
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

    it('cancelLoadTest() throws an error', () => {
        const serviceStub = sinon
            .stub(LoadTestServices, 'cancelLoadTest')
            .returns(Q.reject(new Error('error')));

        LoadTestActions.cancelLoadTest();

        serviceStub.restore();
    });

    it('checkLoadTestStatus() successfully dispatches checkLoadTestStatus service', (done) => {
        const q = Q.defer();
        const serviceStub = sinon
            .stub(LoadTestServices, 'checkLoadTestStatus')
            .returns(q.promise);

        LoadTestActions.checkLoadTestStatus();

        q.promise
            .finally(() => {
                const actionCall = dispatcherSpy.getCall(1);

                if (spy.callCount !== 1) {
                    done(
                        new Error('LoadTestActions.checkLoadTestStatus() not called')
                    );
                }
                if (
                    !actionCall ||
                    actionCall.args[0].action !== LoadTestActions.CHECK_LOAD_TEST_STATUS
                ) {
                    done(
                        new Error('LoadTestActions.checkLoadTestStatus() not dispatched')
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

    it('checkLoadTestStatus() throws an error', () => {
        const serviceStub = sinon
            .stub(LoadTestServices, 'checkLoadTestStatus')
            .returns(Q.reject(new Error('error')));

        LoadTestActions.checkLoadTestStatus();

        serviceStub.restore();
    });

    it('readLoadTestData() successfully dispatches readLoadTestData service', (done) => {
        const q = Q.defer();
        const serviceStub = sinon
            .stub(LoadTestServices, 'readLoadTestData')
            .returns(q.promise);
        const data = {
            fromFile: true,
            webServiceId: 'first'
        };

        LoadTestActions.readLoadTestData(data);

        q.promise
            .finally(() => {
                const actionCall = dispatcherSpy.getCall(1);

                if (spy.callCount !== 1) {
                    done(
                        new Error('LoadTestActions.readLoadTestData() not called')
                    );
                }
                if (
                    !actionCall ||
                    actionCall.args[0].action !== LoadTestActions.READ_LOAD_TEST_DATA
                ) {
                    done(
                        new Error('LoadTestActions.readLoadTestData() not dispatched')
                    );
                }
            })
            .finally(serviceStub.restore)
            .finally(done);

        q.resolve({
            body: {
                data: 'a,b,c\r\n1,2,3'
            }
        });
    });

    it('readLoadTestData() throws an error', () => {
        const serviceStub = sinon
            .stub(LoadTestServices, 'readLoadTestData')
            .returns(Q.reject(new Error('error')));
        const data = {
            fromFile: true,
            webServiceId: 'first'
        };

        LoadTestActions.readLoadTestData(data);

        serviceStub.restore();
    });

    it('writeLoadTestData() successfully dispatches writeLoadTestData service', (done) => {
        const q = Q.defer();
        const serviceStub = sinon
            .stub(LoadTestServices, 'writeLoadTestData')
            .returns(q.promise);
        const data = {
            webServiceId: 'first'
        };

        LoadTestActions.writeLoadTestData(data);

        q.promise
            .finally(() => {
                const actionCall = dispatcherSpy.getCall(1);

                if (spy.callCount !== 1) {
                    done(
                        new Error('LoadTestActions.writeLoadTestData() not called')
                    );
                }
                if (
                    !actionCall ||
                    actionCall.args[0].action !== LoadTestActions.WRITE_LOAD_TEST_DATA
                ) {
                    done(
                        new Error('LoadTestActions.writeLoadTestData() not dispatched')
                    );
                }
            })
            .finally(serviceStub.restore)
            .finally(done);

        q.resolve({
            body: {
                data: 'a,b,c\r\n1,2,3'
            }
        });
    });

    it('writeLoadTestData() throws an error', () => {
        const serviceStub = sinon
            .stub(LoadTestServices, 'writeLoadTestData')
            .returns(Q.reject(new Error('error')));
        const data = {
            webServiceId: 'first'
        };

        LoadTestActions.writeLoadTestData(data);

        serviceStub.restore();
    });

    it('uploadLoadTestData() successfully dispatches uploadLoadTestData service with valid file', (done) => {
        const q = Q.defer();
        const serviceStub = sinon
            .stub(LoadTestServices, 'uploadLoadTestData')
            .returns(q.promise);
        const data = {
            files: getFakeUploadedFile(10),
            webServiceId: 'first'
        };

        LoadTestActions.uploadLoadTestData(data);

        q.promise
            .finally(() => {
                const actionCall = dispatcherSpy.getCall(1);

                if (spy.callCount !== 1) {
                    done(
                        new Error('LoadTestActions.uploadLoadTestData() not called')
                    );
                }
                if (
                    !actionCall ||
                    actionCall.args[0].action !== LoadTestActions.UPLOAD_LOAD_TEST_DATA
                ) {
                    done(
                        new Error('LoadTestActions.uploadLoadTestData() not dispatched')
                    );
                }
            })
            .finally(serviceStub.restore)
            .finally(done);

        q.resolve({
            body: {
                data: 10
            }
        });
    });

    it('uploadLoadTestData() successfully dispatches uploadLoadTestData service with invalid file', (done) => {
        const q = Q.defer();
        const serviceStub = sinon
            .stub(LoadTestServices, 'uploadLoadTestData')
            .returns(q.promise);
        const data = {
            files: null,
            webServiceId: 'first'
        };

        LoadTestActions.runLoadTest(data);

        q.promise
            .finally(() => {
                const actionCall = dispatcherSpy.getCall(1);

                if (spy.callCount !== 1) {
                    done(
                        new Error('LoadTestActions.uploadLoadTestData() not called')
                    );
                }
                if (
                    !actionCall ||
                    actionCall.args[0].action !== LoadTestActions.UPLOAD_LOAD_TEST_DATA
                ) {
                    done(
                        new Error('LoadTestActions.uploadLoadTestData() not dispatched')
                    );
                }
            })
            .finally(serviceStub.restore)
            .finally(done);

        q.resolve({
            body: {
                data: 0
            }
        });
    });

    it('uploadLoadTestData() throws an error', () => {
        const serviceStub = sinon
            .stub(LoadTestServices, 'uploadLoadTestData')
            .returns(Q.reject(new Error('error')));
        const data = {
            files: getFakeUploadedFile(10),
            webServiceId: 'first'
        };

        LoadTestActions.uploadLoadTestData(data);

        serviceStub.restore();
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

