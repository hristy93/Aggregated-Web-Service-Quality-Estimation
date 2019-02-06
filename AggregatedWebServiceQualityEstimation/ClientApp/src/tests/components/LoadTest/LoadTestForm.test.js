import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { mount } from 'enzyme';
import { beforeEach, afterEach } from 'mocha';

import LoadTestForm from '../../../components/LoadTest/LoadTestForm';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

let wrapper;

describe('<LoadTestForm />', () => {
    beforeEach(() => {
        wrapper = mount(<LoadTestForm />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders FormGroup', () => {
        expect(wrapper.find(FormGroup)).to.have.lengthOf(1);
        // add more
    });

    it('renders FormControl', () => {
        const formControl = wrapper.find(FormControl);
        expect(formControl).to.have.lengthOf(1);
    });
});

