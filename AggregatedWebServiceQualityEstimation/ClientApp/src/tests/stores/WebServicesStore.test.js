import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import alt from '../../alt';

import WebServicesStore from '../../stores/WebServicesStore';
import WebServicesActions from '../../actions/WebServicesActions';

describe('WebServicesStore', () => {
    context('Get and set data for the first web service', () => {
        it('setUrl() properly set the URL for the first web service', () => {
            const action = WebServicesActions.SET_URL;
            const data = {
                url: "www.test.com/api",
                webServiceId: "first"
            };

            alt.dispatcher.dispatch({ action, data });
            const returnedData = WebServicesStore.getFirstWebServiceData();
            const { url } = returnedData;
            expect(url).to.deep.equal(data.url);
        });

        it('setUrlValidity() properly sets the validity of the URL for the first web service', () => {
            const action = WebServicesActions.SET_URL_VALIDITY;
            const data = {
                isUrlValid: true,
                webServiceId: "first"
            };

            alt.dispatcher.dispatch({ action, data });
            const returnedData = WebServicesStore.getFirstWebServiceData();
            const { isUrlValid } = returnedData;
            expect(isUrlValid).to.equal(data.isUrlValid);
        });

        it('setRequestType() properly sets the request type of the request to GET for the first web service', () => {
            const action = WebServicesActions.SET_REQUEST_TYPE;
            const data = {
                requestType: "GET",
                webServiceId: "first"
            };
          
            alt.dispatcher.dispatch({ action, data });
            const returnedData = WebServicesStore.getFirstWebServiceData();
            const { requestType } = returnedData;
            expect(requestType).to.equal(data.requestType);
        });

        it('setRequestType() properly sets the request type of the request to POST for the first web service', () => {
            const action = WebServicesActions.SET_REQUEST_TYPE;
            const data = {
                requestType: "POST",
                webServiceId: "first"
            };

            alt.dispatcher.dispatch({ action, data });
            const returnedData = WebServicesStore.getFirstWebServiceData();
            const { requestType } = returnedData;
            expect(requestType).to.equal(data.requestType);
        });

        it('setRequestPostData() properly sets the request POST data for the first web service', () => {
            const action = WebServicesActions.SET_REQUEST_POST_DATA;
            const data = {
                requestPostData: "test",
                webServiceId: "first"
            };
         
            alt.dispatcher.dispatch({ action, data });
            const returnedData = WebServicesStore.getFirstWebServiceData();
            const { requestPostData } = returnedData;
            expect(requestPostData).to.equal(data.requestPostData);
        });


        it('setFileName() properly sets the name of the uploaded CSV file for the first web service', () => {
            const action = WebServicesActions.SET_FILE_NAME;
            const data = {
                fileName: "test",
                webServiceId: "first"
            };

            alt.dispatcher.dispatch({ action, data });
            const returnedData = WebServicesStore.getFirstWebServiceData();
            const { fileName } = returnedData;
            expect(fileName).to.equal(data.fileName);
        });
    });

    context('Get and set data for the second web service', () => {
        it('setUrl() properly set the URL for the first web service ', () => {
            const action = WebServicesActions.SET_URL;
            const data = {
                url: "www.test.com/api",
                webServiceId: "second"
            };

            alt.dispatcher.dispatch({ action, data });
            const returnedData = WebServicesStore.getSecondWebServiceData();
            const { url } = returnedData;
            expect(url).to.deep.equal(data.url);
        });

        it('setUrlValidity() properly sets the validity of the URL for the second web service', () => {
            const action = WebServicesActions.SET_URL_VALIDITY;
            const data = {
                isUrlValid: true,
                webServiceId: "second"
            };

            alt.dispatcher.dispatch({ action, data });
            const returnedData = WebServicesStore.getSecondWebServiceData();
            const { isUrlValid } = returnedData;
            expect(isUrlValid).to.equal(data.isUrlValid);
        });

        it('setRequestType() properly sets the request type of the request to GET for the second web service', () => {
            const action = WebServicesActions.SET_REQUEST_TYPE;
            const data = {
                requestType: "GET",
                webServiceId: "second"
            };

            alt.dispatcher.dispatch({ action, data });
            const returnedData = WebServicesStore.getSecondWebServiceData();
            const { requestType } = returnedData;
            expect(requestType).to.equal(data.requestType);
        });

        it('setRequestType() properly sets the request type of the request to POST for the second web service', () => {
            const action = WebServicesActions.SET_REQUEST_TYPE;
            const data = {
                requestType: "POST",
                webServiceId: "second"
            };

            alt.dispatcher.dispatch({ action, data });
            const returnedData = WebServicesStore.getSecondWebServiceData();
            const { requestType } = returnedData;
            expect(requestType).to.equal(data.requestType);
        });

        it('setRequestPostData() properly sets the request POST data for the second web service', () => {
            const action = WebServicesActions.SET_REQUEST_POST_DATA;
            const data = {
                requestPostData: "test",
                webServiceId: "second"
            };

            alt.dispatcher.dispatch({ action, data });
            const returnedData = WebServicesStore.getSecondWebServiceData();
            const { requestPostData } = returnedData;
            expect(requestPostData).to.equal(data.requestPostData);
        });

        it('setFileName() properly sets the name of the uploaded CSV file for the second web service', () => {
            const action = WebServicesActions.SET_FILE_NAME;
            const data = {
                fileName: "test",
                webServiceId: "second"
            };

            alt.dispatcher.dispatch({ action, data });
            const returnedData = WebServicesStore.getSecondWebServiceData();
            const { fileName } = returnedData;
            expect(fileName).to.equal(data.fileName);
        });
    });

    context('Get and set data for both web services', () => {
        it('setUrlValidity() properly sets the validity of the URL for both web services to true and true', () => {
            const action = WebServicesActions.SET_URL_VALIDITY;
            const firstWebServiceData = {
                isUrlValid: true,
                webServiceId: "first"
            };

            alt.dispatcher.dispatch({ action, data: firstWebServiceData });

            const secondWebServiceData = {
                isUrlValid: true,
                webServiceId: "second"
            };

            alt.dispatcher.dispatch({ action, data: secondWebServiceData });

            const bothWebServicesUrlsValidity = WebServicesStore.getUrlsValidity();
            expect(bothWebServicesUrlsValidity).to.equal(true);
        });

        it('setUrlValidity() properly sets the validity of the URL for both web services to true and false', () => {
            const action = WebServicesActions.SET_URL_VALIDITY;
            const firstWebServiceData = {
                isUrlValid: true,
                webServiceId: "first"
            };

            alt.dispatcher.dispatch({ action, data: firstWebServiceData });

            const secondWebServiceData = {
                isUrlValid: false,
                webServiceId: "second"
            }; 

            alt.dispatcher.dispatch({ action, data: secondWebServiceData });

            const bothWebServicesUrlsValidity = WebServicesStore.getUrlsValidity();
            expect(bothWebServicesUrlsValidity).to.equal(false);
        });
    });
});

