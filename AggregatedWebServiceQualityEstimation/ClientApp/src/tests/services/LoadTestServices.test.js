import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { stub } from 'sinon';
import Q from 'q';

import { afterEach } from 'mocha';

import LoadTestServices from '../../services/LoadTestServices';
import {
    runTestsGetArgs,
    runTestsPostArgs,
    getFakeUploadedFile,
    testsData
} from '../testData';

let serviceStub;

const webServiceId = "first";

describe('LoadTestServices', () => {
    afterEach(() => {
        serviceStub.restore();
    });

    context('runLoadTest()', () => {
        it('runLoadTest() successfully returns resolved promise for GET request', () => {
            serviceStub = stub(LoadTestServices, "runLoadTest");
            const succcessfulResponseMessage = 'The performance and load tests finished successfully!"';

            serviceStub
                .withArgs(runTestsGetArgs)
                .returns(
                    Q.resolve({
                        body: succcessfulResponseMessage
                    })
                );

            const methodPromise = LoadTestServices.runLoadTest(runTestsGetArgs);
            methodPromise.done(
                response => {
                    expect(response.body.succcessfulResponseMessage).to.deep.equal(succcessfulResponseMessage);
                    done();
                },
                err => {
                    done(err);
                }
            );    
        });

        it('runLoadTest() successfully returns resolved promise for POST request', () => {
            serviceStub = stub(LoadTestServices, "runLoadTest");
            const succcessfulResponseMessage = 'The performance and load tests finished successfully!"';

            serviceStub
                .withArgs(runTestsPostArgs)
                .returns(
                    Q.resolve({
                        body: succcessfulResponseMessage
                    })
                );

            const methodPromise = LoadTestServices.runLoadTest(runTestsPostArgs);
            methodPromise.done(
                response => {
                    expect(response.body.succcessfulResponseMessage).to.equal(succcessfulResponseMessage);
                    done();
                },
                err => {
                    done(err);
                }
            );
        });

        it('runLoadTest() for GET request throws error', () => {
            serviceStub = stub(LoadTestServices, "runLoadTest");

            serviceStub
                .withArgs(runTestsGetArgs)
                .returns(Q.reject(new Error('error')));

            const methodPromise = LoadTestServices.runLoadTest(runTestsGetArgs);
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

        it('runLoadTest() for POST request throws error', () => {
            serviceStub = stub(LoadTestServices, "runLoadTest");

            serviceStub
                .withArgs(runTestsPostArgs)
                .returns(Q.reject(new Error('error')));

            const methodPromise = LoadTestServices.runLoadTest(runTestsPostArgs);
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

    context('cancelLoadTest()', () => {
        it('cancelLoadTest() successfully returns resolved promise', () => {
            serviceStub = stub(LoadTestServices, "cancelLoadTest");
            const succcessfulResponseMessage = 'The performance and load tests were canceled!';

            serviceStub
                .returns(
                    Q.resolve({
                        body: succcessfulResponseMessage
                    })
                );

            const methodPromise = LoadTestServices.cancelLoadTest();
            methodPromise.done(
                response => {
                    expect(response.body.succcessfulResponseMessage).to.equal(succcessfulResponseMessage);
                    done();
                },
                err => {
                    done(err);
                }
            );
        });

        it('cancelLoadTest() throws error', () => {
            serviceStub = stub(LoadTestServices, "cancelLoadTest");

            serviceStub
                .returns(Q.reject(new Error('error')));

            const methodPromise = LoadTestServices.cancelLoadTest();
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

    context('checkLoadTestStatus()', () => {
        it('checkLoadTestStatus() successfully returns resolved promise', () => {
            serviceStub = stub(LoadTestServices, "checkLoadTestStatus");
            const succcessfulResponseMessage = 'running';

            serviceStub
                .returns(
                    Q.resolve({
                        body: succcessfulResponseMessage
                    })
                );

            const methodPromise = LoadTestServices.checkLoadTestStatus();
            methodPromise.done(
                response => {
                    expect(response.body.succcessfulResponseMessage).to.equal(succcessfulResponseMessage);
                    done();
                },
                err => {
                    done(err);
                }
            );
        });

        it('checkLoadTestStatus() throws error', () => {
            serviceStub = stub(LoadTestServices, "checkLoadTestStatus");

            serviceStub
                .returns(Q.reject(new Error('error')));

            const methodPromise = LoadTestServices.checkLoadTestStatus();
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

    context('uploadLoadTestData()', () => {
        it('uploadLoadTestData() successfully returns resolved promise', () => {
            serviceStub = stub(LoadTestServices, "uploadLoadTestData");
            const uploadedFile = getFakeUploadedFile(fileContentSize);
            const data = {
                files: uploadedFile,
                webServiceId
            };
            const fileContentSize = 100;

            serviceStub
                .withArgs(data)
                .returns(
                    Q.resolve({
                        body: fileContentSize
                    })
                );

            const methodPromise = LoadTestServices.uploadLoadTestData(data);
            methodPromise.done(
                response => {
                    expect(response.body.fileContentSize).to.equal(fileContentSize);
                    done();
                },
                err => {
                    done(err);
                }
            );
        });

        it('uploadLoadTestData() throws error', () => {
            serviceStub = stub(LoadTestServices, "uploadLoadTestData");

            serviceStub
                .returns(Q.reject(new Error('error')));

            const methodPromise = LoadTestServices.uploadLoadTestData();
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

    context('writeLoadTestData()', () => {
        it('writeLoadTestData() successfully returns resolved promise', () => {
            serviceStub = stub(LoadTestServices, "writeLoadTestData");
            const succcessfulResponseMessage = `The ${webServiceId} web service's metrics data was written successfully!`;

            serviceStub
                .withArgs(webServiceId)
                .returns(
                    Q.resolve({
                        body: succcessfulResponseMessage
                    })
                );

            const methodPromise = LoadTestServices.writeLoadTestData(webServiceId);
            methodPromise.done(
                response => {
                    expect(response.body.succcessfulResponseMessage).to.equal(succcessfulResponseMessage);
                    done();
                },
                err => {
                    done(err);
                }
            );
        });

        it('writeLoadTestData() throws error', () => {
            serviceStub = stub(LoadTestServices, "writeLoadTestData");

            serviceStub
                .returns(Q.reject(new Error('error')));

            const methodPromise = LoadTestServices.writeLoadTestData(webServiceId);
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


    context('readLoadTestData()', () => {
        it('readLoadTestData() successfully returns resolved promise', () => {
            serviceStub = stub(LoadTestServices, "readLoadTestData");
            const succcessfulResponse = testsData;

            serviceStub
                .withArgs(webServiceId)
                .returns(
                    Q.resolve({
                        body: succcessfulResponse
                    })
                );

            const methodPromise = LoadTestServices.readLoadTestData(webServiceId);
            methodPromise.done(
                response => {
                    expect(response.body.succcessfulResponse).to.equal(succcessfulResponse);
                    done();
                },
                err => {
                    done(err);
                }
            );
        });

        it('readLoadTestData() throws error', () => {
            serviceStub = stub(LoadTestServices, "readLoadTestData");

            serviceStub
                .returns(Q.reject(new Error('error')));

            const methodPromise = LoadTestServices.readLoadTestData(webServiceId);
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

