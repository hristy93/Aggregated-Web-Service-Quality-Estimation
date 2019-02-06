import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { mount } from 'enzyme';

import { beforeEach, afterEach } from 'mocha';

import { Home } from '../../../components/Home/Home';
import LoadTest from '../../../components/LoadTest/LoadTest';

let wrapper;
const titleText = "Aggregated Web Service Quality Estimation";

describe('<Home />', () => {
    beforeEach(() => {
        wrapper = mount(<Home />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders LoadTest', () => {
        const loadTestComponent = wrapper.find(LoadTest);

        expect(loadTestComponent).to.have.lengthOf(1);
    });

    it('displays title', () => {
        const headerTitleNode = wrapper.find('#header-title');

        expect(headerTitleNode).to.have.lengthOf(1);
        expect(headerTitleNode.text()).to.equal(titleText);
    });
});

