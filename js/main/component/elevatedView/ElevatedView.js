import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import PropTypes from 'prop-types';

export default class ElevatedView extends Component {

    render() {
        const { elevation, style, ...otherProps } = this.props;

        if (Platform.OS === 'android') {
            return (
                <View elevation={elevation} style={style} {...otherProps}>
                    {this.props.children}
                </View>
            );
        }

        if (elevation === 0) {
            return (
                <View style={style} {...otherProps}>
                    {this.props.children}
                </View>
            )
        }

        //calculate iosShadows here
        const iosShadowElevation = {
            shadowOpacity: 0.0015 * elevation + 0.18,
            shadowRadius: 0.54 * elevation,
            shadowOffset: {
                height: 0.6 * elevation,
            },
        };

        return (
            <View style={[iosShadowElevation, style]} {...otherProps}>
                {this.props.children}
            </View>
        );
    }
}

ElevatedView.propTypes = {
    elevation: PropTypes.number
};