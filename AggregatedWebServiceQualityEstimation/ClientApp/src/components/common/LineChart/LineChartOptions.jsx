import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Switch from '../Switch/Switch';
import startCase from 'lodash/startCase';

class LineChartOptions extends Component {
    static propTypes = {
        lines: PropTypes.arrayOf(PropTypes.shape({
            axisXKey: PropTypes.string,
            color: PropTypes.string,
            isLineVisible: PropTypes.bool,
            isReferenceLineVisible: PropTypes.bool
        })).isRequired,
        toggleLineVisibility: PropTypes.func.isRequired
    };

    render() {
        const {
            lines,
            toggleLineVisibility
        } = this.props;

        return (
            <div>
                {
                    lines.map((lineInfo) => {
                        return (
                            <Switch
                                id={`switch-line-visibility-${lineInfo.axisYKey}`}
                                text={`Toggle ${startCase(lineInfo.axisYKey)}:`}
                                isChecked={lineInfo.isLineVisible}
                                onChange={toggleLineVisibility}
                            />
                        );
                    })
                }
            </div>
        );
    }
}

export default LineChartOptions;
