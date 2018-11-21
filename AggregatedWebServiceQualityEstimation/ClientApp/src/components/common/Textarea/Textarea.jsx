import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

class Textarea extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        style: PropTypes.object
    };

    static defaultProps = {
        style: {}
    };

    render() {
        const { title, onChange, style } = this.props;

        return (
            <FormGroup controlId="formControlsTextarea">
                <ControlLabel>{title}</ControlLabel>
                <FormControl
                    componentClass="textarea"
                    placeholder={title}
                    style={style}
                    onChange={onChange}
                />
            </FormGroup>
        );
    }
}

export default Textarea;