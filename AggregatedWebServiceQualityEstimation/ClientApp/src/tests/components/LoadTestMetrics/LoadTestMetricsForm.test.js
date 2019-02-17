import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { mount } from 'enzyme';
import { beforeEach, afterEach } from 'mocha';

import { LoadTestMetricsForm } from '../../../components/LoadTestMetrics/LoadTestMetricsForm';
import LoadTestMetricsActions from '../../../actions/LoadTestMetricsActions';
import { FormGroup, ControlLabel, Checkbox } from 'react-bootstrap';
import { metricsInfo } from '../../testData';

const props = {
    metricsInfo
};

let wrapper;

describe('<LoadTestMetricsForm />', () => {
    beforeEach(() => {
        wrapper = mount(<LoadTestMetricsForm {...props} />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('calls saveMetricsUsabilityInfo after mounting', () => {
        wrapper.unmount();
        var saveMetricsUsabilityInfoSpy = sinon.spy(LoadTestMetricsActions, "saveMetricsUsabilityInfo");
        wrapper = mount(<LoadTestMetricsForm {...props} />);
        expect(saveMetricsUsabilityInfoSpy.calledOnce).to.be.equal(true);
        saveMetricsUsabilityInfoSpy.restore();
    });

    it('renders FormGroup', () => {
        expect(wrapper.find(FormGroup)).to.have.lengthOf(1);
    });

    it('renders ControlLabel', () => {
        const controlLabel = wrapper.find(ControlLabel);
        expect(controlLabel).to.have.lengthOf(1);
    });

    it('renders four Checkboxes', () => {
        const checkboxes = wrapper.find(Checkbox);
        expect(checkboxes).to.have.lengthOf(4);
    });

    it('Checkboxes are in their proper default state', () => {
        const checkboxes = wrapper.find(Checkbox);
        const metricsInfoKeys = Object.keys(metricsInfo);
        for (var i = 0; i < checkboxes.length; i++) {
            const checkbox = checkboxes.at(i).getElement();
            const metric = metricsInfoKeys[i];
            expect(checkbox.props.name).to.equal(metric);
            expect(checkbox.props.checked).to.equal(metricsInfo[metric]);
        }
    });

    it('fires handleCheckBoxChange() when the checkboxes are clicked', () => {
        const setMetricsUsabilitySpy = sinon.spy(LoadTestMetricsActions, 'setMetricsUsability');
        const checkboxes = wrapper.find(Checkbox).at(1);
        const event = {
            target: {
                name: 'responseTime'
            }
        }
        checkboxes.getElement().props.onChange(event);

        expect(setMetricsUsabilitySpy.calledOnce).to.equal(true);
        setMetricsUsabilitySpy.restore();
    });
});

