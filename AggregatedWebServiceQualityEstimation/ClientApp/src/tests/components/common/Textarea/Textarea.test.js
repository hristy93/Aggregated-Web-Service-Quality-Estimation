import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { mount } from 'enzyme';
import { beforeEach, afterEach } from 'mocha';
import noop from 'lodash/noop';

import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import Textarea from '../../../../components/common/Textarea/Textarea';

const props = {
    id: 'id',
    title: 'title',
    onChange: noop,
    disabled: false
};

let wrapper;

describe('<Textarea />', () => {
    beforeEach(() => {
        wrapper = mount(<Textarea {...props} />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders FormGroup', () => {
        const fromGroup = wrapper.find(FormGroup);
        expect(fromGroup).to.have.lengthOf(1);
        expect(fromGroup.getElement().props.id).to.equal(`input-group-textarea-${props.id}`);
    });

    it('renders ControlLabel', () => {
        const controlLabel = wrapper.find(ControlLabel);
        expect(controlLabel).to.have.lengthOf(1);
        expect(controlLabel.getElement().props.id).to.equal(`input-label-textarea-${props.id}`);
    });

    it('renders the correct title', () => {
        const controlLabel = wrapper.find(ControlLabel);
        expect(controlLabel.text()).to.equal(props.title);
    });

    it('renders FormControl', () => {
        const formControl = wrapper.find(FormControl);
        expect(formControl).to.have.lengthOf(1);
        expect(formControl.getElement().props.id).to.equal(`input-textarea-${props.id}`);

        const formControlNode = formControl.getElement();
        expect(formControlNode.props.placeholder).to.equal(props.title);
        expect(formControlNode.props.disabled).to.equal(props.disabled);
    });

    it('renders the textarea with its default props', () => {
        const formControlNode = wrapper.find(FormControl).getElement();
        const controlLabel = wrapper.find(ControlLabel);
        expect(formControlNode.props.disabled).to.equal(props.disabled);
        expect(formControlNode.props.onChange).to.equal(props.onChange);
        expect(controlLabel.text()).to.equal(props.title);
        expect(formControlNode.props.id).to.contain(props.id);
    });

    it('the FormControl is disabled when the prop is passed', () => {
        wrapper.setProps({
            disabled: !props.disabled
        });

        const formControl = wrapper.find(FormControl);
        expect(formControl.getElement().props.disabled).to.equal(!props.disabled);
    });

    it('the FormControl\'s placeholder is changed when the prop is passed', () => {
        wrapper.setProps({
            title: 'test'
        });

        const formControl = wrapper.find(FormControl);
        expect(formControl.getElement().props.placeholder).to.equal('test');
    });

    it('fires onChange() when the input of the textarea is changed', () => {
        const onChangeSpy = sinon.spy();
        wrapper.setProps({
            onChange: onChangeSpy
        });

        const formControl = wrapper.find(`#input-textarea-${props.id}`).at(0);
        formControl.simulate('change');

        expect(onChangeSpy.calledOnce).to.equal(true);
    });
});

