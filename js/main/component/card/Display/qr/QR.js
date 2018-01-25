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

import Modal from '../../../../component/modal/ModalFarme';
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
                    locationOff: 'Location Service is Off',
                    locationOffBody: 'Please turn on the Location service',
                    cardPublic: 'Your name card is public',
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
        this.invokeSTG = this.invokeSTG.bind(this);
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

    invokeSTG(){
        navigator.geolocation.getCurrentPosition((initialPosition) => {
                let url = Utils.baseURL + 'stGround/';
                Utils.cFunctions.fetch.post(url, {
                    latitude: initialPosition.coords.latitude + "",
                    longitude: initialPosition.coords.longitude + "",
                    id: this.state.cards[this.state.index].cardId+""
                }).then(response => {
                    Alert.alert(this.state.content.alert.cardPublic, "", [{text: 'OK', onPress: () => console.log('OK Pressed')},], { cancelable: true });
                }).catch(err => {
                    //TODO: CATCH
                    console.log(err);
                });
            }, (error) => {
                Alert.alert(this.state.content.alert.locationOff, this.state.content.alert.locationOffBody,
                [{text: 'OK', onPress: () => console.log('OK Pressed')},], {cancelable: true});
                console.log(error)
            },
            {enableHighAccuracy: false, timeout: 50000, maximumAge: 10000}
        );
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
                            <Ripple onPress={() => {
                                this.setState({isQREnlarged: true});
                            }}>
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
                        <View style={styles.QRSection}>
                            <Ripple onPress={() => this.invokeSTG()}>
                                <Image
                                    style={{width: Utils.size.height * 0.25, height: Utils.size.height * 0.25}}
                                    source={{uri: Data.STGIcon}}
                                />
                            </Ripple>
                        </View>
                    </ViewPagerAndroid>
                )
        }else{
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
                            <Ripple onPress={() => this.invokeSTG()}>
                                <Image
                                    style={{width: Utils.size.height * 0.25, height: Utils.size.height * 0.25}}
                                    source={{uri: Data.STGIcon}}
                                />
                            </Ripple>
                        </View>
                    </ViewPagerAndroid>
                )
        }

        return (
            <View style={styles.container}>
                <View style={styles.cardName}>
                    <Text
                        style={styles.name}>{this.state.content.cardName} {this.state.cards[this.state.index].cardName + " (" + (this.state.index + 1) + "/" + this.state.cards.length + ")"}</Text>
                </View>
                {body}
                <Modal isShow={this.state.isQREnlarged} animationInTiming={5} animationOutTiming={5}
                       bgPress={() => this.setState({isQREnlarged: false})}
                       backPress={() => this.setState({isQREnlarged: false})}
                       duration={50}>
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