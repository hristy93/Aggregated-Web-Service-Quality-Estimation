import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { mount } from 'enzyme';
import { spy } from 'sinon';
import { beforeEach, afterEach } from 'mocha';

import LoadTestMetricsForm from '../../../components/LoadTestMetrics/LoadTestMetricsForm';
import LoadTestMetricsActions from '../../../actions/LoadTestMetricsActions';
import { FormGroup, ControlLabel, Checkbox } from 'react-bootstrap';


let wrapper;

describe('<LoadTestMetricsForm />', () => {
    beforeEach(() => {
        wrapper = mount(<LoadTestMetricsForm />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it.skip('calls saveMetricsUsabilityInfo after mounting', () => {
        var spy = sinon.spy(LoadTestMetricsActions, "saveMetricsUsabilityInfo");
        wrapper = mount(<LoadTestMetricsForm />);
        expect(spy.calledOnce).to.be.true();
        spy.restore();
    });

    it('renders FormGroup', () => {
        expect(wrapper.find(FormGroup)).to.have.lengthOf(1);
        // add more
    });

    it('renders ControlLabel', () => {
        const controlLabel = wrapper.find(ControlLabel);
        expect(controlLabel).to.have.lengthOf(1);
    });

    it('renders four Checkboxes', () => {
        const checkbox = wrapper.find(Checkbox);
        expect(checkbox).to.have.lengthOf(4);
    });
});

