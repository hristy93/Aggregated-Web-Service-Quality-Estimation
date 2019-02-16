import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { stub } from 'sinon';
import Q from 'q';

import { afterEach } from 'mocha';

import EstimationServices from '../../services/EstimationServices';
import {
    clusterEstimatorResult,
    statisticalEstimatorResult,
    apdexScoreEstimatorResult
} from '../testData';

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

    context('getStatisticalEstimatorResult()', () => {
        it('getStatisticalEstimatorResult() successfully returns resolved promise', () => {
            serviceStub = stub(EstimationServices, "getStatisticalEstimatorResult");

            serviceStub
                .withArgs(webServiceId)
                .returns(
                    Q.resolve({
                        body: {
                            statisticalEstimatorResult
                        }
                    })
                );

            const methodPromise = EstimationServices.getStatisticalEstimatorResult(webServiceId);
            methodPromise.done(
                response => {
                    expect(response.body.statisticalEstimatorResult).to.deep.equal(statisticalEstimatorResult);
                    done();
                },
                err => {
                    done(err);
                }
            );
        });

        it('getStatisticalEstimatorResult() throws error', () => {
            serviceStub = stub(EstimationServices, "getStatisticalEstimatorResult");

            serviceStub
                .withArgs(webServiceId)
                .returns(Q.reject(new Error('error')));

            const methodPromise = EstimationServices.getStatisticalEstimatorResult(webServiceId);
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

    context('getApdexScoreEstimatorResult()', () => {
        it('getApdexScoreEstimatorResult() successfully returns resolved promise', () => {
            serviceStub = stub(EstimationServices, "getApdexScoreEstimatorResult");

            serviceStub
                .withArgs(webServiceId)
                .returns(
                    Q.resolve({
                        body: {
                            apdexScoreEstimatorResult
                        }
                    })
                );

            const methodPromise = EstimationServices.getApdexScoreEstimatorResult(webServiceId);
            methodPromise.done(
                response => {
                    expect(response.body.apdexScoreEstimatorResult).to.deep.equal(apdexScoreEstimatorResult);
                    done();
                },
                err => {
                    done(err);
                }
            );
        });

        it('getApdexScoreEstimatorResult() throws error', () => {
            serviceStub = stub(EstimationServices, "getApdexScoreEstimatorResult");

            serviceStub
                .withArgs(webServiceId)
                .returns(Q.reject(new Error('error')));

            const methodPromise = EstimationServices.getApdexScoreEstimatorResult(webServiceId);
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

