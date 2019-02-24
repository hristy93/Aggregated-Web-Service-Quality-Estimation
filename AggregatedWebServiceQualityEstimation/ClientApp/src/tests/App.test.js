import React from 'react';
import App from '../App';

import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';
import { Layout } from '../components/Layout/Layout';

configure({ adapter: new Adapter() });
import { mount } from 'enzyme';

let wrapper;


describe('<App />', () => {
    it('renders Layout', () => {
        //const div = document.createElement('div');
        //ReactDOM.render(<App />, div);
        wrapper = mount(<App />);
        expect(wrapper.find(Layout)).to.have.lengthOf(1);
    });
});
