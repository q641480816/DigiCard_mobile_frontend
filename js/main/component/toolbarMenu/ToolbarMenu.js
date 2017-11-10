import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    TouchableWithoutFeedback,
    Easing
} from 'react-native';
import PropTypes from 'prop-types';
import {responsiveFontSize} from "../responsive/responsive";

import Ripple from "react-native-material-ripple";

import Utils from '../../../common/util';
import ElevatedView from "../elevatedView/ElevatedView";

export default class ToolbarMenu extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isShow : false,
            withIcon: false,
            items: [],
            topOffset: 0,
            opacity: new Animated.Value(0)
        };

        this.options = [];
        this.showMenu = this.showMenu.bind(this);
        this.hideMenu = this.hideMenu.bind(this);
    }

    componentWillMount(){
        this.setState({
            withIcon: this.props.withIcon,
            items: this.props.items,
            topOffset: this.props.topOffset
        });
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            withIcon: nextProps.withIcon,
            items: nextProps.items,
            topOffset: nextProps.topOffset
        })
    }

    showMenu(){
        this.setState({isShow: true});
        Animated.parallel([
            Animated.timing(this.state.opacity, {
                toValue: 1,
                duration: 300,
                easing: Easing.spring
            })
        ]).start();
    }

    hideMenu(object){
        Animated.parallel([
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 300,
                easing: Easing.spring
            })
        ]).start(() => {
            this.setState({isShow: false});
            if(typeof(object) !== 'undefined'){
                object.action();
            }
        });
    }

    render(){
        if(this.state.isShow) {
            this.options = [];
            for (let i = 0; i < this.state.items.length; i++) {
                if(this.state.withIcon){
                    this.options.push(<View/>);
                }else {
                    this.options.push(
                        <Ripple key={i} onPress={() =>this.hideMenu(this.state.items[i])}>
                            <View style={styles.item}>
                                <Text style={styles.itemName}>{this.state.items[i].name}</Text>
                            </View>
                        </Ripple>
                    );
                }
            }

            return (
                <Animated.View style={[styles.container,{opacity: this.state.opacity}]}>
                    <View style={[styles.container,{backgroundColor: 'black', opacity: 0.25}]}/>
                    <TouchableWithoutFeedback onPress={() => this.hideMenu()}>
                        <View style={[styles.container]} >
                            <ElevatedView elevation={2} style={[styles.option, {top: this.state.topOffset}]}>
                                {this.options}
                            </ElevatedView>
                        </View>
                    </TouchableWithoutFeedback>
                </Animated.View>
            );
        }else{
            return(<View/>);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        height: Utils.size.height,
        width: Utils.size.width,
        position: 'absolute',
        backgroundColor: 'transparent',
        zIndex: 5
    },
    option: {
        borderRadius: 3,
        position: 'absolute',
        width: Utils.size.width*1/3,
        right: 3,
        backgroundColor: 'white',
    },
    item:{
        width: Utils.size.width*1/3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        borderBottomColor:'grey',
        borderBottomWidth:0.25
    },
    itemName: {
        fontSize: responsiveFontSize(2.5),
        color: Utils.colors.primaryColor,
        marginTop: 7.5,
        marginBottom: 7.5
    }
});

ToolbarMenu.propTypes = {
    withIcon: PropTypes.bool.isRequired,
    topOffset: PropTypes.number.isRequired,
    items: PropTypes.array.isRequired
};
