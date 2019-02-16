import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { mount } from 'enzyme';
import { beforeEach, afterEach } from 'mocha';

import { LoadTestForm } from '../../../components/LoadTest/LoadTestForm';
import LoadTestActions from '../../../actions/LoadTestActions';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

let wrapper;

const props = {
    loadTestDuration: '00:00:30',
    testState: {
        isStarted: false,
        isFinished: false,
        writingTestData: false
    }
};

describe('<LoadTestForm />', () => {
    beforeEach(() => {
        wrapper = mount(<LoadTestForm {...props} />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders FormGroup', () => {
        expect(wrapper.find(FormGroup)).to.have.lengthOf(1);
    });

    it('renders FormControl', () => {
        expect(wrapper.find(FormControl)).to.have.lengthOf(1);
    });

    it('renders ControlLabel', () => {
        expect(wrapper.find(ControlLabel)).to.have.lengthOf(1);
    });

    it('FormControl is in its proper default state', () => {
        const formControl = wrapper.find(FormControl).getElement();
        expect(formControl.props.disabled).to.equal(false);
        expect(formControl.props.value).to.equal(props.loadTestDuration);
        expect(formControl.props.placeholder).to.equal(props.loadTestDuration !== "" ? "" : "Enter test duration");
    });

    it('FormControl is disabled when the tests are started and are not finished', () => {
        wrapper.setProps({
            testState: {
                isStarted: true,
                isFinished: false,
                writingTestData: false 
            }
        });
        const formControl = wrapper.find(FormControl).getElement();

        expect(formControl.props.disabled).to.equal(true);
    });

    it('FormControl is disabled when the tests are writing the data', () => {
        wrapper.setProps({
            testState: {
                isStarted: false,
                isFinished: false,
                writingTestData: true
            }
        });
        const formControl = wrapper.find(FormControl).getElement();

        expect(formControl.props.disabled).to.equal(true);
    });

    it('fires handleLoadTestDurationChange() when the duration is changed', () => {
        const changeSpy = sinon.spy(LoadTestActions, 'setLoadTestDuration');
        const formControl = wrapper.find(FormControl);
        formControl.simulate('change');

        expect(changeSpy.calledOnce).to.equal(true);
        changeSpy.restore();
    });
});

