import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class Select extends Component {
    static propTypes = {
        disabled: PropTypes.bool,
        id: PropTypes.string.isRequired,
        items: PropTypes.instanceOf(Array).isRequired,
        onChange: PropTypes.func.isRequired,
        style: PropTypes.shape({}),
        title: PropTypes.string.isRequired
    };

    static defaultProps = {
        style: {},
        disabled: false
    };

    render() {
        const {
            id,
            title,
            items,
            onChange,
            style,
            disabled
        } = this.props;

        return (
            <FormGroup
                controlId={`select-${id}`}
                style={style}
            >
                <ControlLabel>{title}</ControlLabel>
                <FormControl
                    componentClass="select"
                    placeholder={items[0]}
                    disabled={disabled}
                    onChange={onChange}
                >
                    {
                        items.map((item) => {
                            return <option value={item} key={item}>{item}</option>;
                        })
                    }
                </FormControl>
            </FormGroup>
        );
    }
}

export default Select;