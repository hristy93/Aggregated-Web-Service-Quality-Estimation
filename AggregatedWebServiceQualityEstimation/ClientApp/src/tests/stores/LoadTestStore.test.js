import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import alt from '../../alt';

import LoadTestStore from '../../stores/LoadTestStore';
import LoadTestActions from '../../actions/LoadTestActions';

describe('LoadTestStore', () => {
    context('Get and set data for the first web service', () => {
        it.skip('readLoadTestData() properly reads tests data for the first web service', () => {
        });

        it.skip('writeLoadTestData() properly writes tests data for the first web service', () => {
        });

        it.skip('uploadLoadTestData() properly uploads tests data for the first web service', () => {
        });

        it('setLoadTestDataSize() properly sets tests data size for the first web service', () => {
            const action = LoadTestActions.SET_LOAD_TEST_DATA_SIZE;
            const data = {
                loadTestDataSize: 120,
                webServiceId: "first"
            };

            alt.dispatcher.dispatch({ action, data });

            const returnedData = LoadTestStore.getFirstServiceLoadTestDataInfo();
            const { loadTestDataSize } = returnedData;
            expect(loadTestDataSize).to.equal(data.loadTestDataSize);
        });

        it('setLoadTestDataSource() properly sets tests data source for the first web service', () => {
            const action = LoadTestActions.SET_LOAD_TEST_DATA_SOURCE;
            const data = {
                isFromFile: true,
                webServiceId: "first"
            };

            alt.dispatcher.dispatch({ action, data });

            const returnedData = LoadTestStore.getFirstServiceLoadTestDataInfo();
            const { loadTestDataSource } = returnedData;
            expect(loadTestDataSource).to.equal(data.isFromFile ? 'file' : 'tests');
        });
    });

    context('Get and set data for the second web service', () => {
        it.skip('readLoadTestData() properly reads tests data for the second web service', () => {
        });

        it.skip('writeLoadTestData() properly writes tests data for the second web service', () => {
        });

        it.skip('uploadLoadTestData() properly uploads tests data for the second web service', () => {
        });

        it('setLoadTestDataSize() properly sets tests data size for the second web service', () => {
            const action = LoadTestActions.SET_LOAD_TEST_DATA_SIZE;
            const data = {
                loadTestDataSize: 120,
                webServiceId: "second"
            };

            alt.dispatcher.dispatch({ action, data });

            const returnedData = LoadTestStore.getSecondServiceLoadTestDataInfo();
            const { loadTestDataSize } = returnedData;
            expect(loadTestDataSize).to.equal(data.loadTestDataSize);
        });

        it('setLoadTestDataSource() properly sets tests data source for the second web service', () => {
            const action = LoadTestActions.SET_LOAD_TEST_DATA_SOURCE;
            const data = {
                isFromFile: true,
                webServiceId: "second"
            };

            alt.dispatcher.dispatch({ action, data });

            const returnedData = LoadTestStore.getSecondServiceLoadTestDataInfo();
            const { loadTestDataSource } = returnedData;
            expect(loadTestDataSource).to.equal(data.isFromFile ? 'file' : 'tests');
        });
    });


    context('Get and set data for the tests', () => {
        it('setLoadTestDuration() properly the tests duration', () => {
            const action = LoadTestActions.SET_LOAD_TEST_DURATION;
            const data = "00:01:00";
        
            alt.dispatcher.dispatch({ action, data });

            const returnedData = LoadTestStore.getLoadTestDuration();
            expect(returnedData).to.equal(data);
        });

        it('setTestState() properly the tests state/progress', () => {
            const action = LoadTestActions.SET_TEST_STATE;
            const data = {
                isStarted: false,
                isFinished: false,
                writingTestData: false
            };

            alt.dispatcher.dispatch({ action, data });

            const returnedData = LoadTestStore.getTestState();
            expect(returnedData).to.deep.equal(data);
        });

        it('setTestState() properly the tests state/progress', () => {
            const action = LoadTestActions.SET_TEST_STATE;
            const data = {
                isStarted: false,
                isFinished: false,
                writingTestData: false
            };

            alt.dispatcher.dispatch({ action, data });

            const returnedData = LoadTestStore.getTestState();
            expect(returnedData).to.deep.equal(data);
        });

        it('clearLoadTestData() properly clears the tests data', () => {
            const action = LoadTestActions.CLEAR_LOAD_TEST_DATA;

            alt.dispatcher.dispatch({ action, data: undefined });

            const firstServiceLoadTestData = LoadTestStore.getFirstServiceLoadTestData();
            const secondServiceLoadTestData = LoadTestStore.getSecondServiceLoadTestData();
            expect(firstServiceLoadTestData).to.deep.equal([]);
            expect(secondServiceLoadTestData).to.deep.equal([]);
        });

        it('setTimeLeft() properly sets the time left of the tests', () => {
            const action = LoadTestActions.SET_TIME_LEFT;
            const data = "00:00:30";

            alt.dispatcher.dispatch({ action, data });

            const returnedData = LoadTestStore.getTimeLeft();
            expect(returnedData).to.deep.equal(data);
        });


        it('setTimeLeft() properly sets the time left of the tests', () => {
            const action = LoadTestActions.SET_TIME_LEFT;
            const data = "00:00:30";

            alt.dispatcher.dispatch({ action, data });

            const returnedData = LoadTestStore.getTimeLeft();
            expect(returnedData).to.deep.equal(data);
        });
    });
});

