import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import alt from '../../alt';

import LoadTestMetricsStore from '../../stores/LoadTestMetricsStore';
import LoadTestMetricsActions from '../../actions/LoadTestMetricsActions';

describe('LoadTestMetricsStore', () => {
    it('setMetricsUsability() properly sets the metrics that are used', () => {
        const action = LoadTestMetricsActions.SET_METRICS_USABILITY;
        const initialReturnedData = LoadTestMetricsStore.getMetricsInfo().ResponseTime;
        const data = 'ResponseTime';
     
        alt.dispatcher.dispatch({ action, data });

        const returnedData = LoadTestMetricsStore.getMetricsInfo();
        expect(returnedData.ResponseTime).to.deep.equal(!initialReturnedData);
    });

    it.skip('saveMetricsUsabilityInfo() properly saves the the metrics that are used', () => {

    });
});

