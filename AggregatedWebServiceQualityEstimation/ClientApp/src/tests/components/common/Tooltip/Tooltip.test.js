import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { mount } from 'enzyme';
import { beforeEach, afterEach } from 'mocha';

import { Button, Tooltip as ReactTooltip, OverlayTrigger } from 'react-bootstrap';
import Tooltip from '../../../../components/common/Tooltip/Tooltip';

const props = {
    id: 'id',
    title: 'title',
    disabled: false
};

let wrapper;

describe('<Tooltip />', () => {
    beforeEach(() => {
        wrapper = mount(
            <Tooltip {...props}>
                <Button>
                    test
                </Button>
            </Tooltip>
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders Button', () => {
        const button = wrapper.find(Button);
        expect(button).to.have.lengthOf(1);
    });

    it('renders OverlayTrigger', () => {
        wrapper.setProps({
            disabled: true
        });
        const overlayTrigger = wrapper.find(OverlayTrigger);
        expect(overlayTrigger).to.have.lengthOf(1);
    });
});

