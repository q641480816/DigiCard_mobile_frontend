import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';
import PropTypes from 'prop-types';

export default class TextContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            card:{width:0,height:0,unitFont:0},
            content: {}
        };
    }

    componentWillMount(){
        this.setState({
            card: this.props.card,
            content: this.props.content
        });
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            card: nextProps.card,
            content: nextProps.content
        });
    }

    render() {
        return (
            <View style={{
                position:'absolute',
                left:(this.state.content.location.left+"%"),
                top:(this.state.content.location.top+"%"),
                zIndex: 3
            }}>
                <Text style={{
                    fontSize: (this.state.card.unitFont * (this.state.content.property.fontSize)),
                    fontWeight: this.state.content.property.fontWeight,
                    fontStyle: this.state.content.property.fontStyle,
                    textDecorationLine: this.state.content.property.textDecorationLine,
                    color: this.state.content.property.color,
                    fontFamily: this.state.content.property.fontFamily
                }}>{this.state.content.value}</Text>
            </View>
        );
    }
}

TextContent.propTypes = {
    card: PropTypes.object,
    content: PropTypes.object
};

