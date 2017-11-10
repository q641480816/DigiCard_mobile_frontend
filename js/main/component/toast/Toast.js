import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    Easing
} from 'react-native';
import PropTypes from 'prop-types';

import Utils from '../../../common/util';
import ElevatedView from "../elevatedView/ElevatedView";
import {responsiveFontSize} from "../responsive/responsive";

export default class Toast extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isShow : false,
            message: '1',
            duration: '',
            opacity: new Animated.Value(0)
        };

        this.show = this.show.bind(this);
    }

    componentWillMount(){
        this.setState({
            duration: this.props.duration
        });
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            duration: nextProps.duration
        })
    }

    show(message){
        this.setState({message: message,isShow: true});
        Animated.timing(this.state.opacity, {
                toValue: 1,
                easing: Easing.spring,
                duration: 50,
            }
        ).start(() => setTimeout(()=> {
            Animated.timing(this.state.opacity, {
                    toValue: 0,
                    easing: Easing.spring,
                    duration: 50,
                }
            ).start(() => this.setState({isShow: false}));
        },this.state.duration));
    }

    render(){
        if(this.state.isShow) {
            return (
                <Animated.View style={[styles.container,{opacity: this.state.opacity}]}>
                    <ElevatedView elevation={3} style={styles.toast}>
                        <Text style={styles.message}>{this.state.message}</Text>
                    </ElevatedView>
                </Animated.View>
            );
        }else{
            return(<View/>);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: Utils.size.height*0.75,
        width: Utils.size.width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    toast:{
        backgroundColor: 'black',
        borderRadius: 4,
        opacity: 0.9
    },
    message: {
        fontSize: responsiveFontSize(2),
        color: 'white',
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 12.5,
        marginRight: 12.5
    }
});

Toast.propTypes = {
    duration: PropTypes.number.isRequired
};
