import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as ReactSwitch from "react-switch";
import '../../../styles/components/common/Switch/Switch.css';

class Switch extends Component {
    static propTypes = {
        disabled: PropTypes.bool,
        height: PropTypes.number,
        id: PropTypes.string.isRequired,
        isChecked: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
        width: PropTypes.number
    }

    static defaultProps = {
        height: 20,
        width: 40,
        disabled: false
    }

    render() {
        const {
            id,
            text,
            height, 
            width,
            isChecked,
            disabled,
            onChange
        } = this.props;
        return (
            <div className="switch-item">
                <label
                    className="switch-label"
                    htmlFor={id}
                >
                    <span
                        id={`switch-title-${id}`}
                        className="switch-title"
                    >
                        {text}
                    </span>
                    <ReactSwitch.default
                        onChange={onChange}
                        checked={isChecked}
                        height={height}
                        width={width}
                        disabled={disabled}
                        className="react-switch"
                        id={id}
                    />
                </label>
            </div>
        );
    }
}

export default Switch;