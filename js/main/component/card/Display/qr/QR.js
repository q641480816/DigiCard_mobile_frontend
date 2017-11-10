import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import PropTypes from 'prop-types';
import {responsiveFontSize} from "../../../responsive/responsive";

import QRCode from 'react-native-qrcode';
import Ripple from 'react-native-material-ripple';
import Modal from 'react-native-modal';

import Utils from '../../../../../common/util';

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
        return (
            <View style={styles.container}>
                <View style={styles.cardName}>
                    <Text
                        style={styles.name}>{this.state.content.cardName} {this.state.cards[this.state.index].cardName + " (" + (this.state.index + 1) + "/" + this.state.cards.length + ")"}</Text>
                </View>
                <View style={styles.QRSection}>
                    <Ripple onPress={() => this.setState({isQREnlarged: true})}>
                        <QRCode
                            value={''+Utils.base+this.state.cards[this.state.index].cardId}
                            size={Utils.size.height * 0.25}
                            bgColor={Utils.colors.primaryColor}
                            fgColor='white'/>
                    </Ripple>
                </View>
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