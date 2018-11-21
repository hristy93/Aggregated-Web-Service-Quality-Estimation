import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class Select extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        items: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
        style: PropTypes.object
    };

    static defaultProps = {
        style: {}
    };

    render() {
        const {
            title,
            items,
            onChange,
            style
        } = this.props;

        return (
            <FormGroup controlId="formControlsSelect" style={style}>
                <ControlLabel>{title}</ControlLabel>
                <FormControl
                    componentClass="select"
                    placeholder={items[0]}
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