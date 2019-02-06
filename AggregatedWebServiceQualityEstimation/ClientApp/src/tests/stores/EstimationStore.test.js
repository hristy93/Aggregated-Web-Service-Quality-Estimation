import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { mount } from 'enzyme';
import alt from '../../alt';

import EstimationStore from '../../stores/EstimationStore';
import EstimationActions from '../../actions/EstimationActions';
import { clusterEstimatorResult } from '../testData';

let storeStub;

describe('EstimationStore', () => {
    //it.skip('getClusterEstimatorResult() properly get the cluster estimator results', () => {
    //    //TODO: see the action with services picture
    //    const action = EstimationActions.getClusterEstimatorResult
    //    const data = {
    //        clusterData: clusterEstimatorResult,
    //        webServiceId: "first"
    //    };

    //    alt.dispatcher.dispatch({action, data});
    //    const returnedData = EstimationStore.getFirstWebServiceEstimationData();
    //    console.log(returnedData);
    //    const clusterData = returnedData.get('clusterData');
    //    expect(clusterData).to.equal(data);
    //});

    it('setApdexScoreLimit() properly sets the Apdes Score limit for the first web service', () => {
        const action = EstimationActions.SET_APDEX_SCORE_LIMIT;
        const data = {
            apdexScoreLimit: 0.1,
            webServiceId: "first"
        };

        alt.dispatcher.dispatch({ action, data });
        const returnedData = EstimationStore.getFirstWebServiceEstimationData();
        console.log(returnedData);
        const { apdexScoreLimit } = returnedData;
        expect(apdexScoreLimit).to.equal(data.apdexScoreLimit);
    });

});

