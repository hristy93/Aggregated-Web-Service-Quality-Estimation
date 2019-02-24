import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class Textarea extends Component {
    static propTypes = {
        disabled: PropTypes.bool,
        id: PropTypes.string.isRequired,
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
            onChange,
            style,
            disabled
        } = this.props;

        return (
            <FormGroup id={`input-group-textarea-${id}`}>
                <ControlLabel id={`input-label-textarea-${id}`}>
                    {title}
                </ControlLabel>
                <FormControl
                    id={`input-textarea-${id}`}
                    componentClass="textarea"
                    placeholder={title}
                    style={style}
                    disabled={disabled}
                    onChange={onChange}
                />
            </FormGroup>
        );
    }
}

export default Textarea;