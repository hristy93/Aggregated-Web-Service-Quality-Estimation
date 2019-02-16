import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { stub } from 'sinon';
import Q from 'q';

import { afterEach } from 'mocha';

import LoadTestMetricsServices from '../../services/LoadTestMetricsServices';
import { metricsUsabilityInfo } from '../testData';

let serviceStub;

describe('LoadTestMetricsServices', () => {
    afterEach(() => {
        serviceStub.restore();
    });

    context('saveMetricsUsabilityInfo()', () => {
        it('saveMetricsUsabilityInfo() successfully returns resolved promise', () => {
            serviceStub = stub(LoadTestMetricsServices, "saveMetricsUsabilityInfo");
            const successfulResponse = 'The used metrics are saved successfully!';
            serviceStub
                .withArgs(metricsUsabilityInfo)
                .returns(
                    Q.resolve({
                        body: successfulResponse
                    })
                );

            const methodPromise = LoadTestMetricsServices.saveMetricsUsabilityInfo(metricsUsabilityInfo);
            methodPromise.done(
                response => {
                    expect(response.body).to.deep.equal(successfulResponse);
                    done();
                },
                err => {
                    done(err);
                }
            );
        });

        it('saveMetricsUsabilityInfo() throws error', () => {
            serviceStub = stub(LoadTestMetricsServices, "saveMetricsUsabilityInfo");

            serviceStub
                .withArgs(metricsUsabilityInfo)
                .returns(Q.reject(new Error('error')));

            const methodPromise = LoadTestMetricsServices.saveMetricsUsabilityInfo(metricsUsabilityInfo);
            methodPromise.done(
                () => {
                    done();
                },
                err => {
                    expect(err).to.be.an('error');
                    done();
                }
            );
        });
    });
});