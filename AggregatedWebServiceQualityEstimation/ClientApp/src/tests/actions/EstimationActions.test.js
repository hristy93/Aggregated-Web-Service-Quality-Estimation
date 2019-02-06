import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { beforeEach, afterEach } from 'mocha';
import alt from '../../alt';

import EstimationActions from '../../actions/EstimationActions';

let dispatcherSpy;

describe('EstimationActions', () => {
    beforeEach(() => {
        dispatcherSpy = sinon.spy(alt.dispatcher, 'dispatch');
    });

    afterEach(() => {
        alt.dispatcher.dispatch.restore();
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
});

