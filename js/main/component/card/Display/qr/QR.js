import React, { Component } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
    ViewPagerAndroid
} from 'react-native';
import PropTypes from 'prop-types';
import {responsiveFontSize} from "../../../responsive/responsive";

import QRCode from 'react-native-qrcode';
import Ripple from 'react-native-material-ripple';
import Modal from 'react-native-modal';

import Utils from '../../../../../common/util';
let {NativeModules}=require('react-native');
let RNNFCPush = NativeModules.RNNFCPush;

export default class QRPanel extends Component{
    constructor(props) {
        super(props);

        this.state = {
            index: 0,
            cards: [],
            content: {
                cardName: "Card: "
            },
            isQREnlarged: false
        };

        this.setIndex = this.setIndex.bind(this);
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
                            <Ripple onPress={() => {RNNFCPush.invoke(this.state.cards[this.state.index].cardId+"")}}>
                                <Image
                                    style={{width: Utils.size.height * 0.25, height: Utils.size.height * 0.25}}
                                    source={{uri:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADDpiTIAAAC/VBMVEX///8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzNAgbxSAAAA/nRSTlMAYOD4Af3+BwPxCgL5/OjyP/oJBA0R9ljlGIZ/gzD07vfmKAYF+8DfpHAIsdw4rumeIrgXvWXvqw7J7ETD4X3Lz7PzxeoPgesW0j6EQB+7wSe8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'}}
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