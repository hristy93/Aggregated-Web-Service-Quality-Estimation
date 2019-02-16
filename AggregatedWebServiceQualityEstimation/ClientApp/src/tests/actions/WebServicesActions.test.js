import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { beforeEach, afterEach } from 'mocha';
import alt from '../../alt';

import WebServicesActions from '../../actions/WebServicesActions';

let dispatcherSpy;

describe('WebServicesActions', () => {
    beforeEach(() => {
        dispatcherSpy = sinon.spy(alt.dispatcher, 'dispatch');
    });

    afterEach(() => {
        alt.dispatcher.dispatch.restore();
    });

    it('setUrl() passes the right arguments', () => {
        const data = {
            url: "www.test.com/api",
            webServiceId: "first"
        };
        const action = WebServicesActions.SET_URL;

        WebServicesActions.setUrl(data);

        var dispatcherArgs = dispatcherSpy.args[0];
        var firstArg = dispatcherArgs[0];
        expect(firstArg.action).to.equal(action);
        expect(firstArg.data).to.deep.equal(data);
    });

    it('setUrlValidity() passes the right arguments', () => {
        const data = {
            isUrlValid: true,
            webServiceId: "first"
        };
        const action = WebServicesActions.SET_URL_VALIDITY;

        WebServicesActions.setUrlValidity(data);

        var dispatcherArgs = dispatcherSpy.args[0];
        var firstArg = dispatcherArgs[0];
        expect(firstArg.action).to.equal(action);
        expect(firstArg.data).to.deep.equal(data);
    });

    it('setRequestType() passes the GET argument', () => {
        const data = {
            requestType: "GET",
            webServiceId: "first"
        };
        const action = WebServicesActions.SET_REQUEST_TYPE;

        WebServicesActions.setRequestType(data);

        var dispatcherArgs = dispatcherSpy.args[0];
        var firstArg = dispatcherArgs[0];
        expect(firstArg.action).to.equal(action);
        expect(firstArg.data).to.deep.equal(data);
    });

    it('setRequestType() passes the POST as argument', () => {
        const data = {
            requestType: "POST",
            webServiceId: "first"
        };
        const action = WebServicesActions.SET_REQUEST_TYPE;

        WebServicesActions.setRequestType(data);

        var dispatcherArgs = dispatcherSpy.args[0];
        var firstArg = dispatcherArgs[0];
        expect(firstArg.action).to.equal(action);
        expect(firstArg.data).to.deep.equal(data);
    });

    it('setRequestPostData() passes the right arguments', () => {
        const data = {
            requestPostData: "test",
            webServiceId: "first"
        };
        const action = WebServicesActions.SET_REQUEST_POST_DATA;

        WebServicesActions.setRequestPostData(data);

        var dispatcherArgs = dispatcherSpy.args[0];
        var firstArg = dispatcherArgs[0];
        expect(firstArg.action).to.equal(action);
        expect(firstArg.data).to.deep.equal(data);
    });
});

