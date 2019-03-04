import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { mount } from 'enzyme';
import { beforeEach, afterEach } from 'mocha';

import {
    Button,
    Popover as ReactPopover,
    OverlayTrigger
} from 'react-bootstrap';
import Popover from '../../../../components/common/Popover/Popover';

const props = {
    id: 'id',
    description: 'description',
    position: 'right',
    title: 'title',
};

let wrapper;

describe('<Popover />', () => {
    beforeEach(() => {
        wrapper = mount(
            <Popover {...props} />
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders the children', () => {
        wrapper = mount(
            <Popover {...props} >
                <Button /> 
            </Popover>
        );
        const button = wrapper.find(Button);
        expect(button).to.have.lengthOf(1);
    });

    it('renders OverlayTrigger', () => {
        const overlayTrigger = wrapper.find(OverlayTrigger);
        expect(overlayTrigger).to.have.lengthOf(1);
    });
});

