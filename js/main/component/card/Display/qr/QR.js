import React, { Component } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
    ViewPagerAndroid,
    Alert,
    NativeModules
} from 'react-native';
import PropTypes from 'prop-types';
import {responsiveFontSize} from "../../../responsive/responsive";

import QRCode from 'react-native-qrcode';
import Ripple from 'react-native-material-ripple';
import Modal from 'react-native-modal';

import Utils from '../../../../../common/util';
import Data from '../../../../../common/Data';
let RNNFCPush = NativeModules.RNNFCPush;

export default class QRPanel extends Component{
    constructor(props) {
        super(props);

        this.state = {
            index: 0,
            cards: [],
            content: {
                cardName: "Card: ",
                beamTitle: 'Beam',
                beam: 'Your Card is read to Beam!',
                toDigi: 'Beam to Android',
                alert:{
                    nfcOff:'Please turn on your NFC',
                    androidPushOff: 'Please turn on your Android Beam Push on Settings',
                    setting: 'Go Settings',
                    error0: 'NFC Not Supported',
                    error1: 'NFC Is off',
                    error2: 'Android Beam Push Is Off',
                    error3: 'Fuck, Idk what went wrong!!!!!!!!'
                }
            },
            isQREnlarged: false
        };

        this.setIndex = this.setIndex.bind(this);
        this.invokeNFC = this.invokeNFC.bind(this);
    }

    componentWillMount(){
        this.setState({
            cards: this.props.cards
        });
    }

    componentWillReceiveProps(nextProps){
        if(this.state.index < nextProps.cards.length) {
            this.setState({
                cards: nextProps.cards
            });
        }else{
            this.setState({
                index: (this.state.index-1),
                cards: nextProps.cards
            });
        }
    }

    setIndex(index){
        this.setState({
            index: index
        });
    }

    invokeNFC(id){
        RNNFCPush.checkNFC().then((message)=>{
            Alert.alert(this.state.content.beamTitle, this.state.content.beam,
                [
                    {text: this.state.content.toDigi, onPress: () => RNNFCPush.invoke("browser",id)},
                ], { cancelable: true });
        },(err)=>{
            switch (err.code){
                case "0":
                    Alert.alert(this.state.content.alert.error0, "", [{text: 'OK', onPress: () => console.log('OK Pressed')},], { cancelable: true });
                    break;
                case "1":
                    Alert.alert(this.state.content.alert.error1, this.state.content.alert.nfcOff,
                        [{text: 'OK', onPress: () => console.log('OK Pressed')},], { cancelable: true });
                    break;
                case "2":
                    Alert.alert(this.state.content.alert.error2, this.state.content.alert.androidPushOff,
                        [
                            {text: this.state.content.alert.setting, onPress: () => RNNFCPush.goAndroidPushSetting()},
                        ], { cancelable: true });
                    break;
                case "3":
                    Alert.alert(this.state.content.alert.error3, "", [{text: 'OK', onPress: () => console.log('OK Pressed')},], { cancelable: true });
                    break;
            }
        });
    }

    render(){
        let body = null;
        if(Utils.OS === 'android'){
            body =
                (
                    <ViewPagerAndroid
                        style={styles.QRSection}
                        initialPage={0}>
                        <View style={styles.QRSection}>
                            <Ripple onPress={() => this.setState({isQREnlarged: true})}>
                                <QRCode
                                    value={''+Utils.base+this.state.cards[this.state.index].cardId}
                                    size={Utils.size.height * 0.25}
                                    bgColor={Utils.colors.primaryColor}
                                    fgColor='white'/>
                            </Ripple>
                        </View>
                        <View style={styles.QRSection}>
                            <Ripple onPress={() => this.invokeNFC(this.state.cards[this.state.index].cardId+"")}>
                                <Image
                                    style={{width: Utils.size.height * 0.25, height: Utils.size.height * 0.25}}
                                    source={{uri: Data.nfcIcon}}
                                />
                            </Ripple>
                        </View>
                    </ViewPagerAndroid>
                )
        }else{
            body =
                (<View style={styles.QRSection}>
                    <Ripple onPress={() => this.setState({isQREnlarged: true})}>
                        <QRCode
                            value={''+Utils.base+this.state.cards[this.state.index].cardId}
                            size={Utils.size.height * 0.25}
                            bgColor={Utils.colors.primaryColor}
                            fgColor='white'/>
                    </Ripple>
                </View>)
        }

        return (
            <View style={styles.container}>
                <View style={styles.cardName}>
                    <Text
                        style={styles.name}>{this.state.content.cardName} {this.state.cards[this.state.index].cardName + " (" + (this.state.index + 1) + "/" + this.state.cards.length + ")"}</Text>
                </View>
                {body}
                <Modal isVisible={this.state.isQREnlarged} animationInTiming={300} animationOutTiming={300}
                       onBackButtonPress={() => this.setState({isQREnlarged: false})}
                       onBackdropPress={() => this.setState({isQREnlarged: false})}>
                    <View style={styles.modal}>
                        <QRCode
                            value={Utils.base + this.state.cards[this.state.index].cardId}
                            size={Utils.size.width * 0.8}
                            bgColor={Utils.colors.primaryColor}
                            fgColor='white'/>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: Utils.size.width,
        height: Utils.size.height*0.425,
        flexDirection: 'column'
    },
    cardTitle: {
        height: Utils.size.height*0.1,
        borderBottomWidth:1,
        borderBottomColor: 'black',
        flexDirection: 'row',
        alignItems: 'center'
    },
    QRSection: {
        width: Utils.size.width,
        height: Utils.size.height*0.325,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    name: {
        color: Utils.colors.primaryColor,
        fontWeight: 'bold',
        fontSize: responsiveFontSize(2.5),
        marginLeft: Utils.size.width*0.02
    },
    modal:{
        justifyContent: 'center',
        alignItems: 'center'
    }
});

QRPanel.propTypes = {
    cards: PropTypes.array
};