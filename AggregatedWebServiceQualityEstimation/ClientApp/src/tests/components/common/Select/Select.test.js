import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { mount } from 'enzyme';
import { beforeEach, afterEach } from 'mocha';
import noop from 'lodash/noop';

import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import Select from '../../../../components/common/Select/Select';

const props = {
    id: 'id',
    title: 'title',
    items: ['1', '2'],
    onChange: noop,
    disabled: false
};

let wrapper;

describe('<Select />', () => {
    beforeEach(() => {
        wrapper = mount(<Select {...props} />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders FormGroup', () => {
        const fromGroup = wrapper.find(FormGroup);
        expect(fromGroup).to.have.lengthOf(1);
        expect(fromGroup.getElement().props.id).to.equal(`input-group-select-${props.id}`);
    });

    it('renders ControlLabel', () => {
        const controlLabel = wrapper.find(ControlLabel);
        expect(controlLabel).to.have.lengthOf(1);
    });

    it('renders the correct title', () => {
        const controlLabel = wrapper.find(ControlLabel);
        expect(controlLabel.text()).to.equal(props.title);
    });

    it('renders FormControl', () => {
        const formControl = wrapper.find(FormControl);
        expect(formControl).to.have.lengthOf(1);
        const formControlNode = formControl.getElement();
        expect(formControlNode.props.placeholder).to.equal(props.items[0]);
    });

    it('renders the select with its default props', () => {
        const formControlNode = wrapper.find(FormControl).getElement();
        const controlLabel = wrapper.find(ControlLabel);
        expect(formControlNode.props.disabled).to.equal(props.disabled);
        expect(formControlNode.props.onChange).to.equal(props.onChange);
        expect(controlLabel.text()).to.equal(props.title);
        expect(formControlNode.props.id).to.contain(props.id);
    });

    it('renders all elements of the items as options', () => {
        props.items.map((item) => {
            const optionNode = wrapper.find(`#select-option-${item}`);
            expect(optionNode).to.have.length(1);
            expect(optionNode.text()).to.equal(item);
        });
    });

    it('fires onChange() when the selected option is changed', () => {
        const onChangeSpy = sinon.spy();
        wrapper.setProps({
            onChange: onChangeSpy
        });

        const formControl = wrapper.find(`#input-select-${props.id}`).at(0);
        formControl.simulate('change');

        expect(onChangeSpy.calledOnce).to.equal(true);
    });
});

