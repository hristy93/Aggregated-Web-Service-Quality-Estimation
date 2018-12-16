import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    FormGroup,
    ControlLabel,
    FormControl,
    HelpBlock
} from 'react-bootstrap';

class FileUpload extends Component {
    static propTypes = {
        buttonText: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        fileType: PropTypes.string.isRequired,
        helpText: PropTypes.string,
        id: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        style: PropTypes.shape({}),
        title: PropTypes.string.isRequired
    };

    static defaultProps = {
        helpText: null,
        style: {},
        disabled: false
    };

    render() {
        const {
            id,
            title,
            fileType,
            helpText,
            buttonText,
            onChange,
            style,
            disabled
        } = this.props;

        const spanClassName = !disabled ? "btn btn-default" : "btn btn-default disabled";

        return (
            <FormGroup style={style}>
                <ControlLabel>{title}</ControlLabel><br />
                <ControlLabel htmlFor={`file-upload-${id}`} style={{ cursor: "pointer" }}>
                    <span className={spanClassName}> {buttonText} </span>
                    <FormControl
                        id={`file-upload-${id}`}
                        type="file"
                        label={title}
                        style={{ display: "none" }}
                        onChange={onChange}
                        accept={fileType}
                    />
                </ControlLabel>
                {helpText && <HelpBlock>{helpText}</HelpBlock>}
            </FormGroup>
        );
    }
}

export default FileUpload;