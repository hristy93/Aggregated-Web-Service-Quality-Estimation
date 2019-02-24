import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { mount } from 'enzyme';
import { beforeEach, afterEach } from 'mocha';

import { WebServiceForm } from '../../../components/WebService/WebServiceForm';
import WebServicesActions from '../../../actions/WebServicesActions';
import { FormGroup, ControlLabel, FormControl, Collapse } from 'react-bootstrap';
import Select from '../../../components/common/Select/Select';
import Textarea from '../../../components/common/Textarea/Textarea';

const props = {
    webServiceId: 'first',
    url: '',
    isUrlValid: false,
    requestType: 'GET',
    areOperationsDenied: false
};

let wrapper;

describe('<WebServiceForm />', () => {
    beforeEach(() => {
        wrapper = mount(<WebServiceForm {...props} />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders two FormGroup', () => {
        expect(wrapper.find(FormGroup)).to.have.lengthOf(2);
    });

    it('renders two ControlLabel', () => {
        expect(wrapper.find(ControlLabel)).to.have.lengthOf(2);
    });

    it('renders two FormControl', () => {
        expect(wrapper.find(FormControl)).to.have.lengthOf(2);
    });

    it('renders Select', () => {
        expect(wrapper.find(Select)).to.have.lengthOf(1);
    });

    it('renders Collapse and Textarea when the request type is POST', () => {
        wrapper.setProps({
            requestType: 'POST'
        });
        expect(wrapper.find(Collapse)).to.have.lengthOf(1);
        expect(wrapper.find(Textarea)).to.have.lengthOf(1);
    });

    it('FormGroup for URL is in its proper default state - validation state is error', () => {
        const formGroup = wrapper.find(`#input-group-request-url-${props.webServiceId}-web-service`)
            .at(0).getElement();
        expect(formGroup.props.validationState).to.equal('error');
    });

    it('FormGroup for URL is changing validation state to valid when the URL is valid', () => {
        wrapper.setProps({
            isUrlValid: true
        });
        const formGroup = wrapper.find(`#input-group-request-url-${props.webServiceId}-web-service`)
            .at(0).getElement();

        expect(formGroup.props.validationState).to.equal('success');
    });

    it('FormControl for URL is disabled when the operations are denied ', () => {
        wrapper.setProps({
            areOperationsDenied: true
        });
        const formControl = wrapper.find(`#input-request-url-${props.webServiceId}-web-service`)
            .at(0).getElement();

        expect(formControl.props.disabled).to.equal(true);
    });

    it('Select is disabled when the operations are denied ', () => {
        wrapper.setProps({
            areOperationsDenied: true
        });
        const select = wrapper.find(Select).getElement();

        expect(select.props.disabled).to.equal(true);
    });

    it('Textarea is disabled when the operations are denied ', () => {
        wrapper.setProps({
            requestType: 'POST',
            areOperationsDenied: true
        });
        const textarea = wrapper.find(Textarea).getElement();

        expect(textarea.props.disabled).to.equal(true);
    });

    it('fires handleUrlChange() when the request URL is changed', () => {
        const setUrlSpy = sinon.spy(WebServicesActions, 'setUrl');
        const formControl = wrapper.find(`#input-request-url-${props.webServiceId}-web-service`).at(0);
        formControl.simulate('change');

        expect(setUrlSpy.calledOnce).to.equal(true);
        setUrlSpy.restore();
    });

    it('fires handleRequestTypeChange() when the request type is changed', () => {
        const setRequestTypeSpy = sinon.spy(WebServicesActions, 'setRequestType');
        const select = wrapper.find(Select).getElement();
        select.props.onChange({target: {value: 'GET'}});

        expect(setRequestTypeSpy.calledOnce).to.equal(true);
        setRequestTypeSpy.restore();
    });

    it('fires handleRequestPostDataChange() when the request type is POST and the request body is changed', () => {
        wrapper.setProps({
            requestType: 'POST'
        });
        const setRequestPostDataSpy = sinon.spy(WebServicesActions, 'setRequestPostData');
        const select = wrapper.find(Textarea).getElement();
        select.props.onChange({ target: { value: '' } });

        expect(setRequestPostDataSpy.calledOnce).to.equal(true);
        setRequestPostDataSpy.restore();
    });
});

