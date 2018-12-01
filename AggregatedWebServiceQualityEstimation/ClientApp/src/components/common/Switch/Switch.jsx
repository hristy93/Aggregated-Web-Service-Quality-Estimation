import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as ReactSwitch from "react-switch";
import '../../../styles/components/common/Switch/Switch.css';

class Switch extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        isChecked: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired
    }

    render() {
        const { id, text, isChecked, onChange } = this.props;
        return (
            <div className="example">
                <label htmlFor={id}>
                    <span> {text} </span>
                    <ReactSwitch.default
                        onChange={onChange}
                        checked={isChecked}
                        className="react-switch"
                        id={id}
                    />
                </label>
            </div>
        );
    }
}

export default Switch;