import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { stub } from 'sinon';
import Q from 'q';

import { afterEach } from 'mocha';

import EstimationServices from '../../services/EstimationServices';
import { clusterEstimatorResult } from '../testData';

let serviceStub;

const webServiceId = "first";

describe('EstimationServices', () => {
    afterEach(() => {
        serviceStub.restore();
    });

    context('getClusterEstimatorResult()', () => {
        it('getClusterEstimatorResult() successfully returns resolved promise', () => {
            serviceStub = stub(EstimationServices, "getClusterEstimatorResult");

            serviceStub
                .withArgs(webServiceId)
                .returns(
                    Q.resolve({
                        body: {
                            clusterEstimatorResult
                        }
                    })
                );

            const methodPromise = EstimationServices.getClusterEstimatorResult(webServiceId);
            methodPromise.done(
                response => {
                    expect(response.body.clusterEstimatorResult).to.deep.equal(clusterEstimatorResult);
                    done();
                },
                err => {
                    done(err);
                }
            );    
        });

        it('getClusterEstimatorResult() throws error', () => {
            serviceStub = stub(EstimationServices, "getClusterEstimatorResult");

            serviceStub
                .withArgs(webServiceId)
                .returns(Q.reject(new Error('error')));

            const methodPromise = EstimationServices.getClusterEstimatorResult(webServiceId);
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

