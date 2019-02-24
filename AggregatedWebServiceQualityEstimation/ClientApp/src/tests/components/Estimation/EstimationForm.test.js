import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { mount } from 'enzyme';
import { beforeEach, afterEach } from 'mocha';

import { EstimationForm } from '../../../components/Estimation/EstimationForm';
import EstimationActions from '../../../actions/EstimationActions';
import { FormGroup, ControlLabel, FormControl, Collapse } from 'react-bootstrap';


const props = {
    webServiceId: 'first',
    apdexScoreLimit: 0.05,
    areOperationsDenied: false
};

let wrapper;

describe('<EstimationForm />', () => {
    beforeEach(() => {
        wrapper = mount(<EstimationForm {...props} />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders FormGroup', () => {
        expect(wrapper.find(FormGroup)).to.have.lengthOf(1);
    });

    it('renders ControlLabel', () => {
        expect(wrapper.find(ControlLabel)).to.have.lengthOf(1);
    });

    it('renders FormControl', () => {
        expect(wrapper.find(FormControl)).to.have.lengthOf(1);
    });

    it('FormControl is in its default state', () => {
        const formControl = wrapper.find(`#input-apdex-score-estimation-limit-${props.webServiceId}-web-service`)
            .at(0).getElement();

        expect(formControl.props.value).to.equal(props.apdexScoreLimit);
        expect(formControl.props.placeholder).to.equal(props.apdexScoreLimit);
        expect(formControl.props.disabled).to.equal(false);
    });

    it('FormControl for Apdex Score limit is disabled when the operations are denied', () => {
        wrapper.setProps({
            areOperationsDenied: true
        });
        const formControl = wrapper.find(`#input-apdex-score-estimation-limit-${props.webServiceId}-web-service`)
            .at(0).getElement();

        expect(formControl.props.disabled).to.equal(true);
    });

    it('fires handleApdexScoreLimitChange() when the Apdex Score limit is changed', () => {
        const setApdexScoreLimitSpy = sinon.spy(EstimationActions, 'setApdexScoreLimit');
        const formControl = wrapper.find(`#input-apdex-score-estimation-limit-${props.webServiceId}-web-service`).at(0)
        formControl.simulate('change');

        expect(setApdexScoreLimitSpy.calledOnce).to.equal(true);
        setApdexScoreLimitSpy.restore();
    });
});

