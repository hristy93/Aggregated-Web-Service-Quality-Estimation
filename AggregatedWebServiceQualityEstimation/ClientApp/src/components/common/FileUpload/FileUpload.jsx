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
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        fileType: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        buttonText: PropTypes.string.isRequired,
        helpText: PropTypes.string,
        style: PropTypes.object
    };

    static defaultProps = {
        helpText: null,
        style: {}
    };

    render() {
        const {
            id,
            title,
            fileType,
            helpText,
            buttonText,
            onChange,
            style
        } = this.props;

        return (
            <FormGroup style={style}>
                <ControlLabel>{title}</ControlLabel><br />
                <ControlLabel htmlFor={`file-upload-${id}`} style={{ cursor: "pointer" }}>
                    <span className="btn btn-default"> {buttonText} </span>
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