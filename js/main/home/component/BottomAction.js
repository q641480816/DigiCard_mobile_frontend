import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView
} from 'react-native';
import PropTypes from 'prop-types';
import { responsiveFontSize,responsiveHeight,responsiveWidth } from '../../component/responsive/responsive';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ripple from 'react-native-material-ripple';

import Util from '../../../common/util';
import ElevatedView from "../../component/elevatedView/ElevatedView";

export default class BottomAction extends Component{
    constructor(props) {
        super(props);

        this.state = {
            content:{
                create: 'Create My Card',
                scanQr: 'Scan QR Code',
                nearby: 'Nearby'
            }
        };
    }

    render(){
        return(
            <ElevatedView elevation={3} style={styles.fullLength}>
                <Ripple onPress={() => this.props.createNewCard()}>
                    <View style={[styles.option,{borderBottomColor:'grey',borderBottomWidth:0.25}]}>
                        <Ionicons name="ios-create" size={responsiveWidth(8)} color={Util.colors.secondaryColor}/>
                        <Text style={styles.textCommon}>{this.state.content.create}</Text>
                    </View>
                </Ripple>
                <Ripple onPress={() => this.props.scanQr()}>
                    <View style={[styles.option,{borderBottomColor:'grey',borderBottomWidth:0.25}]}>
                        <MaterialCommunityIcons name="qrcode-scan" size={responsiveWidth(8)} color={Util.colors.secondaryColor}/>
                        <Text style={styles.textCommon}>{this.state.content.scanQr}</Text>
                    </View>
                </Ripple>
                <Ripple onPress={() => this.props.STG()}>
                    <View style={[styles.option,{borderBottomColor:'grey',borderBottomWidth:0.25}]}>
                        <Entypo name="location-pin" size={responsiveWidth(8)} color={Util.colors.secondaryColor}/>
                        <Text style={styles.textCommon}>{this.state.content.nearby}</Text>
                    </View>
                </Ripple>
            </ElevatedView>
        );
    }
}

const styles = StyleSheet.create({
    fullLength:{
        width: Util.size.width
    },
    option:{
        height: Util.size.height*0.08,
        backgroundColor: '#f8f8ff',
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textCommon: {
        fontSize: responsiveFontSize(2.2),
        marginLeft: 10,
        color: Util.colors.secondaryColor
    }
});

BottomAction.propTypes = {
    createNewCard: PropTypes.func,
    scanQr: PropTypes.func,
    STG: PropTypes.func
};