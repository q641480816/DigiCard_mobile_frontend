import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    Easing,
    Vibration,
    Alert
} from 'react-native';
import PropTypes from 'prop-types';
import {responsiveFontSize} from "../responsive/responsive";

import Utils from '../../../common/util';
import Ripple from "react-native-material-ripple";
import Camera from "react-native-camera";
import ElevatedView from "../elevatedView/ElevatedView";

export default class QRReader extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isScanned: false,
            config:{
                windowWidth: 20,
                topHeight: 0,
                sideWidth: 0,
                cornerBorder: 5,
                cornerHeight: 35,
                scanBarHeight: 2,
                scanBarTop: new Animated.Value(0)
            },
            content:{
                title: 'Scanner QR Code',
                cancel: 'Cancel'
            }
        };

        this.measureWindow = this.measureWindow.bind(this);
        this.measureTop = this.measureTop.bind(this);
        this.moveScanBar = this.moveScanBar.bind(this);
        this.onRead = this.onRead.bind(this);
    }

    componentDidMount(){

    }

    measureWindow(event){
        let temp = this.state.config;
        temp.windowWidth = event.nativeEvent.layout.height;
        temp.sideWidth = (Utils.size.width-event.nativeEvent.layout.height)/2;
        this.setState({
            config: temp
        });
        this.moveScanBar(event.nativeEvent.layout.height-6);
    }

    measureTop(event){
        let temp = this.state.config;
        temp.topHeight = event.nativeEvent.layout.height;
        this.setState({
            config: temp
        });
    }

    moveScanBar(toValue) {
        Animated.timing(this.state.config.scanBarTop, {
            toValue: toValue,
            duration: 2000,
            easing: Easing.spring
        }).start(() => this.moveScanBar((this.state.config.windowWidth-6)-toValue));
    }

    onRead(v){
        if(!this.state.isScanned){
            Vibration.vibrate();
            this.setState({isScanned:true});
            this.props.onRead(v.data);
        }
    }

    render(){
        return (
            <Camera style={[styles.container,{backgroundColor: 'transparent'}]} onBarCodeRead={(v) => this.onRead(v)}>
                <View style={[styles.container,{backgroundColor: 'transparent'}]}>
                    <ElevatedView elevation={3} style={styles.top}>
                        <Text style={styles.title}>{this.state.content.title}</Text>
                        <Ripple onPress={() => this.props.cancelScan()}
                                style={{height: Utils.size.height * 0.075, justifyContent: 'center'}}>
                            <Text style={[styles.title, {
                                color: Utils.colors.tertiaryColor,
                                marginRight: 20
                            }]}>{this.state.content.cancel}</Text>
                        </Ripple>
                    </ElevatedView>
                    <View style={styles.body}>
                        <View style={[styles.mask, styles.fullLength, {flex: 4}]}
                              onLayout={(event) => this.measureTop(event)}/>
                        <View style={[styles.fullLength, {flex: 6, flexDirection: 'row'}]}
                              onLayout={(event) => this.measureWindow(event)}>
                            <View style={[styles.mask, {
                                height: this.state.config.windowWidth,
                                width: this.state.config.sideWidth
                            }]}/>
                            <View style={[{
                                height: this.state.config.windowWidth,
                                width: this.state.config.windowWidth,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]}>
                                <View style={[{
                                    height: this.state.config.windowWidth,
                                    width: this.state.config.windowWidth
                                }, styles.window]}>
                                    <Animated.View
                                        style={{
                                            width: this.state.config.windowWidth-6,
                                            height: this.state.config.scanBarHeight,
                                            backgroundColor: Utils.colors.tertiaryColor,
                                            position: 'absolute',
                                            top: this.state.config.scanBarTop,
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={[styles.mask, {
                                height: this.state.config.windowWidth,
                                width: this.state.config.sideWidth
                            }]}/>
                        </View>
                        <View style={[styles.mask, styles.fullLength, {flex: 5}]}/>
                    </View>
                    <View
                        style={[
                            styles.corner,
                            {
                                top: this.state.config.topHeight - this.state.config.cornerBorder * 1.5,
                                left: this.state.config.sideWidth - this.state.config.cornerBorder * 1.5,
                                borderLeftWidth: this.state.config.cornerBorder,
                                borderLeftColor: Utils.colors.tertiaryColor,
                                borderTopColor: Utils.colors.tertiaryColor,
                                borderTopWidth: this.state.config.cornerBorder
                            }
                        ]}/>
                    <View/>
                    <View
                        style={[
                            styles.corner,
                            {
                                top: this.state.config.topHeight - this.state.config.cornerBorder * 1.5,
                                right: this.state.config.sideWidth - this.state.config.cornerBorder * 1.5,
                                borderRightWidth: this.state.config.cornerBorder,
                                borderRightColor: Utils.colors.tertiaryColor,
                                borderTopColor: Utils.colors.tertiaryColor,
                                borderTopWidth: this.state.config.cornerBorder
                            }
                        ]}/>
                    <View
                        style={[
                            styles.corner,
                            {
                                top: this.state.config.topHeight + this.state.config.windowWidth + this.state.config.cornerBorder * 1.5 - this.state.config.cornerHeight,
                                left: this.state.config.sideWidth - this.state.config.cornerBorder * 1.5,
                                borderLeftWidth: this.state.config.cornerBorder,
                                borderLeftColor: Utils.colors.tertiaryColor,
                                borderBottomColor: Utils.colors.tertiaryColor,
                                borderBottomWidth: this.state.config.cornerBorder
                            }
                        ]}/>
                    <View
                        style={[
                            styles.corner,
                            {
                                top: this.state.config.topHeight + this.state.config.windowWidth + this.state.config.cornerBorder * 1.5 - this.state.config.cornerHeight,
                                right: this.state.config.sideWidth - this.state.config.cornerBorder * 1.5,
                                borderRightWidth: this.state.config.cornerBorder,
                                borderRightColor: Utils.colors.tertiaryColor,
                                borderBottomColor: Utils.colors.tertiaryColor,
                                borderBottomWidth: this.state.config.cornerBorder
                            }
                        ]}/>
                </View>
            </Camera>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        width: Utils.size.width,
        height: Utils.size.height
    },
    top:{
        width:Utils.size.width,
        height:Utils.size.height*0.075,
        backgroundColor: Utils.colors.primaryColor,
        flexDirection: 'row',
        justifyContent:"space-between",
        alignItems:'center',
        position: 'absolute',
        top: 0,
        zIndex: 3
    },
    title:{
        fontSize: responsiveFontSize(2.5),
        color: 'white',
        marginLeft: 20
    },
    body:{
        flex:2,
        width: Utils.size.width,
        flexDirection: 'column',
        backgroundColor: 'transparent'
    },
    fullLength: {
        width: Utils.size.width
    },
    mask:{
        backgroundColor: 'black',
        opacity: 0.5
    },
    window:{
        borderWidth: 3,
        borderColor: Utils.colors.secondaryColor,
        backgroundColor: 'transparent'
    },
    corner:{
        position: 'absolute',
        backgroundColor: 'transparent',
        height: 35,
        width: 35
    }
});

QRReader.propTypes = {
    onRead: PropTypes.func,
    cancelScan: PropTypes.func
};