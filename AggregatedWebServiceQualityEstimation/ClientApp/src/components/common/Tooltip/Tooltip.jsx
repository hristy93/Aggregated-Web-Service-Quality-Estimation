import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip as ReactTooltip, OverlayTrigger } from 'react-bootstrap';

class Tooltip extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        disabled: PropTypes.bool,
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired
    };

    static defaultProps = {
        disabled: false
    };

    render() {
        const {
            id,
            title,
            disabled,
            children
        } = this.props;

        //const style = !isDisabled ? { display: 'inline-block' } : { display: 'inline-block', cursor: 'not-allowed' };
        const style = { display: 'inline-block', cursor: 'not-allowed' };
        const tooltip = <ReactTooltip id={id}>{title}</ReactTooltip>;
        console.log('disabled', disabled);
        return (
            disabled ? (
                <OverlayTrigger rootClose placement="top" overlay={tooltip}>
                    <span className="tooltipWrapper" style={style}>{children}</span>
                </OverlayTrigger>
            ) : children
        );
    }
}

export default Tooltip;