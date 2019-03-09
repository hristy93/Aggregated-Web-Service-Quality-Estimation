import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Popover as ReactPopover,
    Glyphicon,
    OverlayTrigger
} from 'react-bootstrap';
import isNil from 'lodash/isNil';

class Popover extends Component {
    static propTypes = {
        children: PropTypes.node,
        description: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.node,
        ]).isRequired,
        id: PropTypes.string.isRequired,
        position: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired
    };

    static defaultProps = {
        children: null
    };

    render() {
        const {
            children,
            description,
            id,
            position,
            title,
        } = this.props;
        const popover = (
            <ReactPopover id={`popover-${id}`} title={title}>
                {description}
            </ReactPopover>
        );
        return (
            <OverlayTrigger
                trigger={['hover', 'focus']}
                placement={position}
                overlay={popover}
                delayHide={200}
            >
                {!isNil(children) ? children : <Glyphicon id={`glyphicon-${id}`} glyph="info-sign" /> }
            </OverlayTrigger>
        );
    }
}

export default Popover;