import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import PropTypes from 'prop-types';
import {responsiveFontSize} from "../../component/responsive/responsive";

import Utils from '../../../common/util';
import MyCardContent from './MyCardContent';
import Toolbar from "../../component/toolbar/Toolbar";

export default class MyCard extends Component{
    constructor(props) {
        super(props);

        this.state = {
            content: {
                title: "My Cards"
            }
        };

        this.createNewCard = this.createNewCard.bind(this);
        this.setHttp = this.setHttp.bind(this);
    }

    shouldComponentUpdate(){
        return false;
    }

    createNewCard(){
        this.refs.content.createNewCard();
    }

    setHttp(isHttp){
        this.refs['toolbar'].setLoadingShow(isHttp);
    }

    render(){
        return(
            <View style={[styles.container]}>
                <Toolbar ref={'toolbar'} title={this.state.content.title} rightElement={'user'} loading={true} rightText={null}/>
                <View style={styles.content}>
                    <MyCardContent ref={'content'} navigation={this.props.navigation} updateView={this.props.updateView} setHttp={this.setHttp}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Utils.size.width,
        height:Utils.size.height*0.925,
        flexDirection: "column"
    },
    content:{
        width: Utils.size.width,
        height: Utils.size.height*0.85,
        flexDirection: 'column'
    }
});

MyCard.propTypes = {
    navigation: PropTypes.object,
};