import React from 'react';
import { configure } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import { mount } from 'enzyme';
import { beforeEach, afterEach } from 'mocha';

import Layout from '../../../components/Layout/Layout';

let wrapper;

describe.skip('<Layout />', () => {
    it('renders its children', () => {
        const text = "test";
        const TestComponent = (props) => {
            return <div id={text}> {text} </div>;
        };
        wrapper = mount(
            <Layout>
                {TestComponent}
            </Layout>
        );
        const wrappedTestComponent = wrapper.find(TestComponent);

        expect(wrappedTestComponent).to.have.lengthOf(1);
        expect(wrappedTestComponent.find(`#${text}`).text()).to.have.equal(text);
    });
});

