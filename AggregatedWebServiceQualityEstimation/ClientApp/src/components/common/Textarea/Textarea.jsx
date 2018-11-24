import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

class Textarea extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        style: PropTypes.shape({})
    };

    static defaultProps = {
        style: {}
    };

    render() {
        const {
            id,
            title,
            onChange,
            style
        } = this.props;

        return (
            <FormGroup controlId={`textarea-${id}`}>
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