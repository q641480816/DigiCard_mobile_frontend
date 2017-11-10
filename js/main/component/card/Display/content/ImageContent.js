import React, { Component } from 'react';
import {
    View,
    Image
} from 'react-native';
import PropTypes from 'prop-types';

export default class ImageContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            card:{
                width:0,
                height:0
            },
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
            card:nextProps.card,
            content: nextProps.content
        });
    }

    render() {
        return (
            <View style={{
                position:'absolute',
                left:(this.state.content.location.left+"%"),
                top:(this.state.content.location.top+"%"),
                zIndex: 2
            }}>
                <Image
                    style={{
                        width: this.state.card.width*this.state.content.property.width,
                        height: this.state.card.width*this.state.content.property.width/this.state.content.property.whRatio,
                    }}
                    source={{uri: this.state.content.value}}
                />
            </View>
        );
    }
}

ImageContent.propTypes = {
    card: PropTypes.object,
    content: PropTypes.object
};

