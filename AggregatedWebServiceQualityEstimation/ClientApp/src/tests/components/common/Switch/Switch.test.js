import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { mount } from 'enzyme';
import { beforeEach, afterEach } from 'mocha';
import noop from 'lodash/noop';

import * as ReactSwitch from "react-switch";
import Switch from '../../../../components/common/Switch/Switch';

const props = {
    id: 'id',
    text: 'text',
    height: 20,
    width: 50,
    isChecked: false,
    disabled: false,
    onChange: noop
};

let wrapper;

describe('<Switch />', () => {
    beforeEach(() => {
        wrapper = mount(<Switch {...props} />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders the div of the switch', () => {
        const switchDiv = wrapper.find('.switch-item');
        expect(switchDiv).to.have.lengthOf(1);
    });

    it('renders the label of the switch', () => {
        const switchLabel = wrapper.find('.switch-label');
        expect(switchLabel).to.have.lengthOf(1);
    });

    it('renders the title of the switch', () => {
        const switchSpanTitle = wrapper.find(`#switch-title-${props.id}`);
        expect(switchSpanTitle).to.have.lengthOf(1);
        expect(switchSpanTitle.text()).to.equal(props.text);
    });

    it('renders ReactSwitch', () => {
        const reactSwitch = wrapper.find(ReactSwitch.default);
        expect(reactSwitch).to.have.lengthOf(1);
    });

    it('renders the switch with its default props', () => {
        const reactSwitchNode = wrapper.find(ReactSwitch.default).getElement();
        expect(reactSwitchNode.props.checked).to.equal(props.isChecked);
        expect(reactSwitchNode.props.disabled).to.equal(props.disabled);
        expect(reactSwitchNode.props.onChange).to.equal(props.onChange);
        expect(reactSwitchNode.props.height).to.equal(props.height);
        expect(reactSwitchNode.props.width).to.equal(props.width);
        expect(reactSwitchNode.props.id).to.equal(props.id);
    });

    it('the ReactSwitch is checked when the prop is passed', () => {
        wrapper.setProps({
            isChecked: true
        });

        const reactSwitch = wrapper.find(ReactSwitch.default);
        expect(reactSwitch.getElement().props.checked).to.equal(true);
    });


    it('the ReactSwitch is disabled when the prop is passed', () => {
        wrapper.setProps({
            disabled: true
        });

        const reactSwitch = wrapper.find(ReactSwitch.default);
        expect(reactSwitch.getElement().props.disabled).to.equal(true);
    });

    it('fires onChange() when the switch is clicked', () => {
        const onChangeSpy = sinon.spy();
        wrapper.setProps({
            onChange: onChangeSpy
        });

        const switchComponent = wrapper.find(ReactSwitch.default);
        switchComponent.getElement().props.onChange();

        expect(onChangeSpy.calledOnce).to.equal(true);
    });
});

