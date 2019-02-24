import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { mount } from 'enzyme';
import { beforeEach, afterEach } from 'mocha';
import noop from 'lodash/noop';
import merge from 'lodash/merge';

import { LoadTest } from '../../../components/LoadTest/LoadTest';
import { LoadTestMetricsForm } from '../../../components/LoadTestMetrics/LoadTestMetricsForm';
import LoadTestActions from '../../../actions/LoadTestActions';
import LoadTestChartsActions from '../../../actions/LoadTestChartsActions';
import LoadTestMetricsActions from '../../../actions/LoadTestMetricsActions';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import {
    chartsLinesData,
    metricsInfo,
    testsData,
    webServicesData,
    apdexScoreEstimatorResult,
    clusterEstimatorResult,
    statisticalEstimatorResult,
    getFakeUploadedFile,
} from '../../testData';

let wrapper;

let saveMetricsUsabilityInfoSpy;

const props = {
    firstServiceLoadTestData: testsData,
    secondServiceLoadTestData: testsData,
    firstWebServiceChartsData: { syncCharts: false },
    secondWebServiceChartsData: { syncCharts: false },
    firstWebServiceEstimationData: {
        apdexScoreLimit: 0.05,
        apdexScoreData: apdexScoreEstimatorResult,
        clusterData: clusterEstimatorResult,
        statisticalData: statisticalEstimatorResult
    },
    secondWebServiceEstimationData: {
        apdexScoreLimit: 0.05,
        apdexScoreData: apdexScoreEstimatorResult,
        clusterData: clusterEstimatorResult,
        statisticalData: statisticalEstimatorResult
    },
    areUrlsValid: false,
    testState: {
        isStarted: false,
        isFinished: false,
        isWritingTestData: false
    },
    timeLeft: '',
    first: webServicesData['first'],
    second: webServicesData['second'],
};

describe('<LoadTest />', () => {
    beforeEach(() => {
        wrapper = mount(<LoadTest {...props} />);
        saveMetricsUsabilityInfoSpy = sinon.spy(LoadTestMetricsActions.saveMetricsUsabilityInfo, 'defer');
    });

    afterEach(() => {
        wrapper.unmount();
        saveMetricsUsabilityInfoSpy.restore();
    });

    context('handles first web service components', () => {
        it('renders Panel for first web service form and its children', () => {
            const firstWebServiceFormPanel = wrapper.find('#panel-first-web-service-form').at(0);
            expect(firstWebServiceFormPanel).to.have.lengthOf(1);

            const firstWebServiceFormPanelHeading = wrapper.find('#panel-heading-first-web-service-form');
            expect(firstWebServiceFormPanelHeading).to.have.lengthOf(1);

            const firstWebServiceFormPanelTitle = wrapper.find('#panel-title-first-web-service-form').at(0);
            expect(firstWebServiceFormPanelTitle).to.have.lengthOf(1);

            const firstWebServiceFormPanelBody = wrapper.find('#panel-body-first-web-service-form').at(0);
            expect(firstWebServiceFormPanelBody).to.have.lengthOf(1);
        });

        it('renders FileUpload for metrics of the first web service', () => {
            const firstWebServiceFileUpload = wrapper.find('#csv-metrics-file-first-web-service').at(0);
            expect(firstWebServiceFileUpload).to.have.lengthOf(1);
        });

        it('fires handleFileUploadChange() when a file with metrics for the first web service is uploaded', () => {
            const changeSpy = sinon.spy(LoadTestActions, 'uploadLoadTestData');
            const secondWebServiceFileUpload = wrapper.find('#csv-metrics-file-first-web-service').at(0);
            const event = {
                preventDefault: noop,
                target: {
                    files: getFakeUploadedFile(10)
                }
            };
            secondWebServiceFileUpload.getElement().props.onChange(event, 'first');

            expect(changeSpy.calledOnce).to.equal(true);
            changeSpy.restore();
        });

        it('fires alert() when a file with metrics for the first web service is invalid', () => {
            const changeSpy = sinon.spy(LoadTestActions, 'uploadLoadTestData');
            const alertSpy = sinon.spy(window, 'alert');
            const secondWebServiceFileUpload = wrapper.find('#csv-metrics-file-first-web-service').at(0);
            const event = {
                preventDefault: noop,
                target: {
                    files: null
                }
            };
            secondWebServiceFileUpload.getElement().props.onChange(event, 'first');

            expect(changeSpy.calledOnce).to.equal(false);
            changeSpy.restore();

            expect(alertSpy.calledOnce).to.equal(true);
            alertSpy.restore();
        });


        it('fires alert() when more than one file with metrics for the first web service is uploaded', () => {
            const changeSpy = sinon.spy(LoadTestActions, 'uploadLoadTestData');
            const alertSpy = sinon.spy(window, 'alert');
            const secondWebServiceFileUpload = wrapper.find('#csv-metrics-file-first-web-service').at(0);
            const event = {
                preventDefault: noop,
                target: {
                    files: [getFakeUploadedFile(10), getFakeUploadedFile(10)]
                }
            };
            secondWebServiceFileUpload.getElement().props.onChange(event, 'first');

            expect(changeSpy.calledOnce).to.equal(false);
            changeSpy.restore();

            expect(alertSpy.calledOnce).to.equal(true);
            alertSpy.restore();
        });

        it('renders PanelGroup for the first web service', () => {
            const firstWebServicePanelGroup = wrapper.find('#panel-group-first-web-service').at(0);
            expect(firstWebServicePanelGroup).to.have.lengthOf(1);
        });

        it('renders Panel for the charts of the first web service', () => {
            const firstWebServiceChartsPanel = wrapper.find('#panel-first-web-service-charts').at(0);
            expect(firstWebServiceChartsPanel).to.have.lengthOf(1);

            const firstWebServiceChartsPanelHeading = wrapper.find('#panel-heading-first-web-service-charts');
            expect(firstWebServiceChartsPanelHeading).to.have.lengthOf(1);

            const firstWebServiceChartsPanelTitle = wrapper.find('#panel-title-first-web-service-charts').at(0);
            expect(firstWebServiceChartsPanelTitle).to.have.lengthOf(1);

            const firstWebServiceChartsPanelBody = wrapper.find('#panel-body-first-web-service-charts').at(0);
            expect(firstWebServiceChartsPanelBody).to.have.lengthOf(1);
        });

        it('renders LoadTestCharts for the first web service', () => {
            const firstWebServiceLoadTestCharts = wrapper.find('#charts-first-web-service').at(0);
            expect(firstWebServiceLoadTestCharts).to.have.lengthOf(1);
        });

        it('fires handleBrushOnChange() when the brush of some chart for the first web service is changed', () => {
            const firstWebServiceLoadTestCharts = wrapper.find('#charts-first-web-service').at(0);
            const changeSpy = sinon.spy(LoadTestChartsActions, 'setBrushPosition');
            const change = {
                startIndex: 0,
                endIndex: 10,
            };
            firstWebServiceLoadTestCharts.getElement().props.brushOnChange(change);

            expect(changeSpy.calledOnce).to.equal(true);
            changeSpy.restore();
        });

        it('renders EstimationContainer for the first web service', () => {
            const firstWebServiceEstimationContainer = wrapper.find('#estimation-container-first-web-service').at(0);
            expect(firstWebServiceEstimationContainer).to.have.lengthOf(1);
        });
    });

    context('handles second web service components', () => {
        it('renders Panel for second web service form and its children', () => {
            const secondWebServiceFormPanel = wrapper.find('#panel-second-web-service-form').at(0);
            expect(secondWebServiceFormPanel).to.have.lengthOf(1);

            const secondWebServiceFormPanelHeading = wrapper.find('#panel-heading-second-web-service-form');
            expect(secondWebServiceFormPanelHeading).to.have.lengthOf(1);

            const secondWebServiceFormPanelTitle = wrapper.find('#panel-title-second-web-service-form').at(0);
            expect(secondWebServiceFormPanelTitle).to.have.lengthOf(1);

            const secondWebServiceFormPanelBody = wrapper.find('#panel-body-second-web-service-form').at(0);
            expect(secondWebServiceFormPanelBody).to.have.lengthOf(1);
        });

        it('renders FileUpload for metrics of the second web service', () => {
            const secondWebServiceFileUpload = wrapper.find('#csv-metrics-file-second-web-service').at(0);
            expect(secondWebServiceFileUpload).to.have.lengthOf(1);
        });

        it('fires handleFileUploadChange() when a file with metrics for the second web service is uploaded', () => {
            const changeSpy = sinon.spy(LoadTestActions, 'uploadLoadTestData');
            const secondWebServiceFileUpload = wrapper.find('#csv-metrics-file-second-web-service').at(0);
            const event = {
                preventDefault: noop,
                target: {
                    files: getFakeUploadedFile(10)
                }
            };
            secondWebServiceFileUpload.getElement().props.onChange(event, 'second');

            expect(changeSpy.calledOnce).to.equal(true);
            changeSpy.restore();
        });
    
        it('fires alert() when a file with metrics for the second web service is invalid', () => {
            const changeSpy = sinon.spy(LoadTestActions, 'uploadLoadTestData');
            const alertSpy = sinon.spy(window, 'alert');
            const secondWebServiceFileUpload = wrapper.find('#csv-metrics-file-second-web-service').at(0);
            const event = {
                preventDefault: noop,
                target: {
                    files: null
                }
            };
            secondWebServiceFileUpload.getElement().props.onChange(event, 'second');

            expect(changeSpy.calledOnce).to.equal(false);
            changeSpy.restore();

            expect(alertSpy.calledOnce).to.equal(true);
            alertSpy.restore();
        });


        it('fires alert() when more than one file with metrics for the second web service is uploaded', () => {
            const changeSpy = sinon.spy(LoadTestActions, 'uploadLoadTestData');
            const alertSpy = sinon.spy(window, 'alert');
            const secondWebServiceFileUpload = wrapper.find('#csv-metrics-file-second-web-service').at(0);
            const event = {
                preventDefault: noop,
                target: {
                    files: [getFakeUploadedFile(10), getFakeUploadedFile(10)]
                }
            };
            secondWebServiceFileUpload.getElement().props.onChange(event, 'second');

            expect(changeSpy.calledOnce).to.equal(false);
            changeSpy.restore();

            expect(alertSpy.calledOnce).to.equal(true);
            alertSpy.restore();
        });

        it('renders PanelGroup for the second web service', () => {
            const secondWebServicePanelGroup = wrapper.find('#panel-group-second-web-service').at(0);
            expect(secondWebServicePanelGroup).to.have.lengthOf(1);
        });

        it('renders Panel for the charts of the second web service', () => {
            const secondWebServiceChartsPanel = wrapper.find('#panel-second-web-service-charts').at(0);
            expect(secondWebServiceChartsPanel).to.have.lengthOf(1);

            const secondWebServiceChartsPanelHeading = wrapper.find('#panel-heading-second-web-service-charts');
            expect(secondWebServiceChartsPanelHeading).to.have.lengthOf(1);

            const secondWebServiceChartsPanelTitle = wrapper.find('#panel-title-second-web-service-charts').at(0);
            expect(secondWebServiceChartsPanelTitle).to.have.lengthOf(1);

            const secondWebServiceChartsPanelBody = wrapper.find('#panel-body-second-web-service-charts').at(0);
            expect(secondWebServiceChartsPanelBody).to.have.lengthOf(1);
        });

        it('renders LoadTestCharts for the second web service', () => {
            const secondWebServiceLoadTestCharts = wrapper.find('#charts-second-web-service').at(0);
            expect(secondWebServiceLoadTestCharts).to.have.lengthOf(1);
        });

        it('fires handleBrushOnChange() when the brush of some chart for the second web service is changed', () => {
            const firstWebServiceLoadTestCharts = wrapper.find('#charts-second-web-service').at(0);
            const changeSpy = sinon.spy(LoadTestChartsActions, 'setBrushPosition');
            const change = {
                startIndex: 0,
                endIndex: 10,
            };
            firstWebServiceLoadTestCharts.getElement().props.brushOnChange(change);

            expect(changeSpy.calledOnce).to.equal(true);
            changeSpy.restore();
        });

        it('renders EstimationContainer for the second web service', () => {
            const secondWebServiceEstimationContainer = wrapper.find('#estimation-container-second-web-service').at(0);
            expect(secondWebServiceEstimationContainer).to.have.lengthOf(1);
        });
    });

    context('handles perf. and load tests components', () => {
        it('renders Panel for tests configurations and its children', () => {
            const configsPanel = wrapper.find('#panel-configs').at(0);
            expect(configsPanel).to.have.lengthOf(1);

            const configsPanelHeading = wrapper.find('#panel-heading-configs');
            expect(configsPanelHeading).to.have.lengthOf(1);

            const configsPanelTitle = wrapper.find('#panel-title-configs').at(0);
            expect(configsPanelTitle).to.have.lengthOf(1);

            const configsPanelBody = wrapper.find('#panel-body-configs').at(0);
            expect(configsPanelBody).to.have.lengthOf(1);
        });

        it('renders Panel for tests metrics and its children', () => {
            const metricsPanel = wrapper.find('#panel-metrics').at(0);
            expect(metricsPanel).to.have.lengthOf(1);

            const metricsPanelHeading = wrapper.find('#panel-heading-metrics');
            expect(metricsPanelHeading).to.have.lengthOf(1);

            const metricsPanelTitle = wrapper.find('#panel-title-metrics').at(0);
            expect(metricsPanelTitle).to.have.lengthOf(1);

            const metricsPanelBody = wrapper.find('#panel-body-metrics').at(0);
            expect(metricsPanelBody).to.have.lengthOf(1);
        });

        it('renders LoadTestMetricsForm', () => {
            const loadTestMetricsForm = wrapper.find(LoadTestMetricsForm);
            expect(loadTestMetricsForm).to.have.lengthOf(1);
        });

        it('renders PanelGroup for metrics data source', () => {
            const metricsDataSourcePanelGroup = wrapper.find('#panel-group-metrics-data-source').at(0);
            expect(metricsDataSourcePanelGroup).to.have.lengthOf(1);
        });

        it('renders Panel for tests metrics data source from tests and its children', () => {
            const metricsDataSourceTestsPanel = wrapper.find('#panel-metrics-data-source-tests').at(0);
            expect(metricsDataSourceTestsPanel).to.have.lengthOf(1);

            const metricsDataSourceTestsHeading = wrapper.find('#panel-heading-metrics-data-source-tests');
            expect(metricsDataSourceTestsHeading).to.have.lengthOf(1);

            const metricsDataSourceTestsTitle = wrapper.find('#panel-title-metrics-data-source-tests').at(0);
            expect(metricsDataSourceTestsTitle).to.have.lengthOf(1);

            const metricsDataSourceTestsBody = wrapper.find('#panel-body-metrics-data-source-tests').at(0);
            expect(metricsDataSourceTestsBody).to.have.lengthOf(1);
        });

        it('renders LoadTestForm', () => {
            const loadTestForm = wrapper.find('#load-test-form').at(0);
            expect(loadTestForm).to.have.lengthOf(1);
        });

        it('renders ButtonToolbar for the tests controls', () => {
            const buttonToolbar = wrapper.find('#button-toolbar-tests-controls').at(0);
            expect(buttonToolbar).to.have.lengthOf(1);
        });

        it('renders Button for the running the tests', () => {
            const runTestsButton = wrapper.find('#button-run-load-test').at(0);
            expect(runTestsButton).to.have.lengthOf(1);
        });

        it('fires handleRunLoadTestButtonClick() when the run tests button is clicked and the request is GET', () => {
            const runTestsButton = wrapper.find('#button-run-load-test').at(0);
            const clearLoadTestDataSpy = sinon.spy(LoadTestActions, 'clearLoadTestData');
            const runLoadTestSpy = sinon.spy(LoadTestActions.runLoadTest, 'defer');
            const setTestStateSpy = sinon.spy(LoadTestActions, 'setTestState');
            
            runTestsButton.getElement().props.onClick();

            expect(clearLoadTestDataSpy.calledOnce).to.equal(true);
            expect(runLoadTestSpy.calledOnce).to.equal(true);
            expect(setTestStateSpy.calledOnce).to.equal(true);

            clearLoadTestDataSpy.restore();
            runLoadTestSpy.restore();
            setTestStateSpy.restore();
        });

        it('fires handleRunLoadTestButtonClick() when the run tests button is clicked, the request is POST and request body is valid', () => {
            const newFirstProp = merge({}, props.first, {
                requestType: "POST",
                requestPostData: '{"test":"test"}'
            });
            wrapper.setProps({
                first: newFirstProp
            });

            const runTestsButton = wrapper.find('#button-run-load-test').at(0);
            const clearLoadTestDataSpy = sinon.spy(LoadTestActions, 'clearLoadTestData');
            const runLoadTestSpy = sinon.spy(LoadTestActions.runLoadTest, 'defer');
            const setTestStateSpy = sinon.spy(LoadTestActions, 'setTestState');

            runTestsButton.getElement().props.onClick();

            expect(clearLoadTestDataSpy.calledOnce).to.equal(true);
            expect(runLoadTestSpy.calledOnce).to.equal(true);
            expect(setTestStateSpy.calledOnce).to.equal(true);

            clearLoadTestDataSpy.restore();
            runLoadTestSpy.restore();
            setTestStateSpy.restore();
        });

        it('fires an alert() when the run tests button is clicked, the request is POST and request body is invalid', () => {
            const newFirstProp = merge({}, props.first, {
                requestType: "POST",
                requestPostData: {}
            });
            wrapper.setProps({
                first: newFirstProp
            });

            const runTestsButton = wrapper.find('#button-run-load-test').at(0);
            const alertSpy = sinon.spy(window, 'alert');

            runTestsButton.getElement().props.onClick();
            expect(alertSpy.calledOnce).to.equal(true);
            alertSpy.restore();
        });

        it('fires handleCancelLoadTestButtonClick() when the cancel tests button is clicked', () => {
            const cancelTestsButton = wrapper.find('#button-cancel-load-test').at(0);
            const cancelLoadTestDataSpy = sinon.spy(LoadTestActions, 'cancelLoadTest');

            cancelTestsButton.getElement().props.onClick();

            expect(cancelLoadTestDataSpy.calledOnce).to.equal(true);

            cancelLoadTestDataSpy.restore();
        });

        it('renders Button for the canceling the tests', () => {
            const cancelTestsButton = wrapper.find('#button-cancel-load-test').at(0);
            expect(cancelTestsButton).to.have.lengthOf(1);
        });

        it('renders the tests state as Not running when the tests are not running', () => {
            const testsStateDiv = wrapper.find('#tests-state').at(0);
            expect(testsStateDiv).to.have.lengthOf(1);
            expect(testsStateDiv.text()).to.contain('Not running');
        });

        it('renders the tests state Running when the tests are running', () => {
            wrapper.setProps({
                testState: {
                    isStarted: true,
                    isFinished: false,
                    isWritingTestData: false
                },
            });

            const testsStateDiv = wrapper.find('#tests-state').at(0);
            expect(testsStateDiv).to.have.lengthOf(1);
            expect(testsStateDiv.text()).to.contain('Running');
        });

        it('renders the tests state Writing data when the tests are running', () => {
            wrapper.setProps({
                testState: {
                    isStarted: false,
                    isFinished: false,
                    isWritingTestData: true
                },
            });

            const testsStateDiv = wrapper.find('#tests-state').at(0);
            expect(testsStateDiv).to.have.lengthOf(1);
            expect(testsStateDiv.text()).to.contain('Writing');
        });

        it('does not render the tests time left is the test are not running', () => {
            const testsTimeLeftDiv = wrapper.find('#tests-time-left').at(0);
            expect(testsTimeLeftDiv).to.have.lengthOf(0);
        });

        it('renders the tests time left is the test are running', () => {
            wrapper.setProps({
                testState: {
                    isStarted: true,
                    isFinished: false,
                    isWritingTestData: false
                },
            });

            const testsTimeLeftDiv = wrapper.find('#tests-time-left').at(0);
            expect(testsTimeLeftDiv).to.have.lengthOf(1);
            expect(testsTimeLeftDiv.text()).to.contain(props.timeLeft);
        });

        it('renders Panel for tests metrics data source from tests and its children', () => {
            const metricsDataSourceFilePanel = wrapper.find('#panel-metrics-data-source-file').at(0);
            expect(metricsDataSourceFilePanel).to.have.lengthOf(1);

            const metricsDataSourceFileHeading = wrapper.find('#panel-heading-metrics-data-source-file');
            expect(metricsDataSourceFileHeading).to.have.lengthOf(1);

            const metricsDataSourceFileTitle = wrapper.find('#panel-title-metrics-data-source-file').at(0);
            expect(metricsDataSourceFileTitle).to.have.lengthOf(1);

            const metricsDataSourceFileBody = wrapper.find('#panel-body-metrics-data-source-file').at(0);
            expect(metricsDataSourceFileBody).to.have.lengthOf(1);
        });
    });

    //it('fires handleLoadTestDurationChange() when the duration is changed', () => {
    //    const changeSpy = sinon.spy(LoadTestActions, 'setLoadTestDuration');
    //    const formControl = wrapper.find(FormControl);
    //    formControl.simulate('change');

    //    expect(changeSpy.calledOnce).to.equal(true);
    //    changeSpy.restore();
    //});
});

