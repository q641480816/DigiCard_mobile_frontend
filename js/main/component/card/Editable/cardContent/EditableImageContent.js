import React, { Component } from 'react';
import {
    View,
    Image,
    PanResponder
} from 'react-native';
import PropTypes from 'prop-types';

import Ripple from 'react-native-material-ripple';

export default class EditableImageContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            index: -1,
            card:{width:0,height:0},
            tempLocation:{
                left:0,
                top:0
            },
            size: {
                width: 0,
                height: 0
            },
            content: null,
            zIndex:2
        };

        this.setPanResponder = this.setPanResponder.bind(this);
        this.startEdit = this.startEdit.bind(this);
        this.updateProperty = this.updateProperty.bind(this);
    }

    componentWillMount() {
        let size = {
            width: this.props.card.width*this.props.content.property.width,
            height: this.props.card.width*this.props.content.property.width/this.props.content.property.whRatio,
        };
        this.setState({
            index: this.props.index,
            size: size,
            card: this.props.card,
            content: this.props.content
        });
        this.setPanResponder(false);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            index: nextProps.index,
            card: nextProps.card,
            content: nextProps.content
        });
    }

    setPanResponder(isAccept) {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => isAccept,
            onMoveShouldSetPanResponder: (evt, gestureState) => isAccept,
            onPanResponderGrant: (evt, gestureState) => {
                this.setState({
                    tempLocation: {
                        top: this.state.content.location.top,
                        left: this.state.content.location.left
                    },
                    zIndex: 100
                });
            },
            onPanResponderMove: (evt, gestureState) => {
                let left = this.state.tempLocation.left + (gestureState.dx / this.state.card.width * 100);
                let top = this.state.tempLocation.top + (gestureState.dy / this.state.card.height * 100);
                if ((0 <= left) && (0 <= top)) {
                    let temp = this.state.content;
                    temp.location = {
                        left: left,
                        top: top
                    };
                    this.setState({
                        content: temp
                    });
                    this.props.movingPositionUpdate(temp);
                }
            },
            onPanResponderRelease: () => {
                this.setState({tempLocation: {top: 0, left: 0},zIndex: 2});
                this.props.setComponentPosition(this.state.content.location.top, this.state.content.location.left, this.state.index, this.state.size, this.state.content);
                this.setPanResponder(false);
            }
        });
        if (isAccept) {
            this.setState({
                tempLocation: {
                    left: 0,
                    top: 0
                }
            });
        }
    }

    startEdit(){
        this.props.editComponent(this.state.index,this.state.content,this.state.size);
    }

    updateProperty(content){
        this.setState({
            content: content
        });
    }

    render() {
        if(this.state.content === null){
            return(<View/>);
        }else {
            return (
                <View style={{
                    position: 'absolute', left: (this.state.content.location.left + "%"),
                    top: (this.state.content.location.top + "%"),
                    zIndex: this.state.zIndex
                }} {...this._panResponder.panHandlers}>
                    <Ripple onPress={()=>{this.startEdit();}} onLongPress={() => {
                        this.setPanResponder(true);
                        this.startEdit();
                    }}>
                        <Image
                            style={{
                                width: this.state.card.width*this.state.content.property.width,
                                height: this.state.card.width*this.state.content.property.width/this.state.content.property.whRatio,
                            }}
                            source={{uri: this.state.content.value}}
                        />
                    </Ripple>
                </View>
            );
        }
    }
}

EditableImageContent.propTypes = {
    data: PropTypes.object,
    index: PropTypes.number,
    card: PropTypes.object,
    content: PropTypes.object,
    setComponentPosition: PropTypes.func,
    editComponent: PropTypes.func,
    movingPositionUpdate: PropTypes.func
};

