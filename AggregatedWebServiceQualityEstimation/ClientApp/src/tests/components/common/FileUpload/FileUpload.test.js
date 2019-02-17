import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { mount } from 'enzyme';
import { beforeEach, afterEach } from 'mocha';
import noop from 'lodash/noop';

import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import FileUpload from '../../../../components/common/FileUpload/FileUpload';

const props = {
    id: 'id',
    title: 'title',
    fileType: '.csv',
    helpText: 'helpText',
    buttonText: 'buttonText',
    onChange: noop,
    disabled: false
};

let wrapper;

describe('<FileUpload />', () => {
    beforeEach(() => {
        wrapper = mount(<FileUpload {...props} />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders FormGroup', () => {
        const fromGroup = wrapper.find(FormGroup);
        expect(fromGroup).to.have.lengthOf(1);
        expect(fromGroup.getElement().props.id).to.equal(`input-group-file-upload-${props.id}`);
    });

    it('renders two ControlLabel', () => {
        const controlLabel = wrapper.find(ControlLabel);
        expect(controlLabel).to.have.lengthOf(2);
    });

    it('renders the label that wraps the component', () => {
        const controlLabel = wrapper.find(`#input-label-file-upload-${props.id}`).at(0);
        expect(controlLabel).to.have.lengthOf(1);
    });

    it('renders the correct title', () => {
        const controlLabel = wrapper.find(`#label-file-upload-title-${props.id}`).at(0);
        expect(controlLabel.text()).to.equal(props.title);
    });

    it('renders FormControl', () => {
        const formControl = wrapper.find(FormControl);
        expect(formControl).to.have.lengthOf(1);
        const formControlNode = formControl.getElement();
        expect(formControlNode.props.id).to.equal(`input-file-upload-${props.id}`);
    });

    it('renders the file upload with its default props', () => {
        const formControlNode = wrapper.find(FormControl).getElement();
        const controlLabel = wrapper.find(ControlLabel).at(0);
        expect(formControlNode.props.accept).to.equal(props.fileType);
        expect(formControlNode.props.onChange).to.equal(props.onChange);
        expect(controlLabel.text()).to.equal(props.title);
        expect(formControlNode.props.id).to.contain(props.id);
    });

    it('fires onChange() when a file is uploaded', () => {
        const onChangeSpy = sinon.spy();
        wrapper.setProps({
            onChange: onChangeSpy
        });

        const formControl = wrapper.find(`#input-file-upload-${props.id}`).at(0);
        formControl.simulate('change');

        expect(onChangeSpy.calledOnce).to.equal(true);
    });
});

