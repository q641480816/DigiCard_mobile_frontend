import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import PropTypes from 'prop-types';
import { responsiveFontSize,responsiveHeight,responsiveWidth } from '../../component/responsive/responsive';

import {IndicatorViewPager, PagerDotIndicator} from 'rn-viewpager';
import Ripple from 'react-native-material-ripple';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Spinner from 'react-native-spinkit';
import moment from 'moment';

import Utils from '../../../common/util';
import PStorage from '../../../common/persistantStorage';
import Card from '../../component/card/Display/Card';
import QR from '../../component/card/Display/qr/QR';

const cardHeight = Utils.size.width/Utils.ratio;

export default class MyCardContent extends Component{
    constructor(props) {
        super(props);

        this.state = {
            content: {
                fallbackAdd: 'Add your first card now!',
                loading: 'Loading your Cards'
            },
            cards:null
        };

        this.cards = [];
        this.init_card = this.init_card.bind(this);
        this.getCardsOnline = this.getCardsOnline.bind(this);
        this.getCardLocal = this.getCardLocal.bind(this);
        this.createNewCard = this.createNewCard.bind(this);
        this.saveNew = this.saveNew.bind(this);
        this.saveEdit = this.saveEdit.bind(this);
        this.deleteCard = this.deleteCard.bind(this);
        this.refreshCards = this.refreshCards.bind(this);
        this.refreshQR = this.refreshQR.bind(this);
        this.renderIndicator = this.renderIndicator.bind(this);
    }

    componentWillMount(){
        this.init_card();
    }

    init_card(){
        PStorage.load({
            key: `${Utils.action.lastEdit+Utils.account.accountId}`,
            autoSync: false
        }).then(ret => {
            let lastEdit = moment(ret);
            if(lastEdit.isBefore(moment(Utils.account.lastEdit))){
                this.getCardsOnline();
            }else if(lastEdit.isAfter(moment(Utils.account.lastEdit))){
                //push online
                //TODO: ONLINE SYNC
            }else{
                this.getCardLocal();
            }
        }).catch(err => {
            switch (err.name) {
                case 'NotFoundError':
                    this.getCardsOnline();
                    break;
                case 'ExpiredError':
                    // TODO
                    break;
            }
        });
    }

    getCardsOnline(){
        this.props.setHttp(true);
        let url = Utils.baseURL + 'accounts/'+Utils.account.accountId+'/myCards';
        fetch(`${url}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `${Utils.account.secret}`
            }
        }).then((response) => response.text()).then((responseText) => {
            this.props.setHttp(false);
            let response = JSON.parse(responseText);
            if(response.status === 1){
                this.setState({
                    cards: response.data.cards
                });
                Utils.cFunctions.updateMyCardsLocal(response.data.lastEdit,response.data.cards,Utils.account.accountId);
            }else{
                console.log("something is wrong");
                //TODO: ADD SOME CATCH
            }
        }).catch(err=>{
            this.props.setHttp(false);
            this.getCardsOnline();
        });
    }

    getCardLocal(){
        PStorage.load({
            key: `${Utils.action.myCards+Utils.account.accountId}`
        }).then(ret=>{
            this.setState({
                cards: JSON.parse(ret.cards).cards
            });
        }).catch(err=>{
            this.getCardsOnline();
        })
    }

    createNewCard(){
        this.props.navigation.navigate("EditCard",{action:'new',updateView: this.props.updateView,saveNew: this.saveNew});
        this.props.updateView(2);
    }

    saveNew(card){
        this.props.setHttp(true);
        let tempCards = this.state.cards;
        tempCards.push(card);
        this.setState({cards:tempCards});
        this.props.updateView(1);
        let url = Utils.baseURL + 'cards';
        fetch(`${url}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `${Utils.account.secret}`
            },
            body: JSON.stringify(card)
        }).then((response) => response.text()).then((responseText) => {
            this.props.setHttp(false);
            let response = JSON.parse(responseText);
            if(response.status === 1){
                tempCards[tempCards.length-1] = response.data;
                Utils.cFunctions.updateMyCardsLocal(response.data.lastEdit,tempCards,Utils.account.accountId);
            }else{
                console.log('something is wrong');
            }
        }).catch(err=>{
            this.props.setHttp(false);
            console.log(err);
            this.saveNew(card);
        });
    }

    saveEdit(index, card){
        this.props.setHttp(true);
        let tempCards = this.state.cards;
        tempCards[index] = card;
        this.setState({cards: tempCards});
        let url = Utils.baseURL + 'cards/' + card.cardId;
        fetch(`${url}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `${Utils.account.secret}`
            },
            body: JSON.stringify(card)
        }).then((response) => response.text()).then((responseText) => {
            this.props.setHttp(false);
            let response = JSON.parse(responseText);
            if(response.status === 1){
                tempCards[index] = response.data;
                Utils.cFunctions.updateMyCardsLocal(response.data.lastEdit,tempCards,Utils.account.accountId);
            }else{
                console.log('something is wrong');
            }
        }).catch(err=>{
            this.props.setHttp(false);
            console.log(err);
            this.saveEdit(index,card)
        });
    }

    deleteCard(index,id){
        this.props.setHttp(true);
        let tempCards = this.state.cards;
        tempCards.splice(index,1);
        this.setState({cards: tempCards});
        let url = Utils.baseURL + 'cards/' + id;
        fetch(`${url}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `${Utils.account.secret}`
            }
        }).then((response) => response.text()).then((responseText) => {
            this.props.setHttp(false);
            let response = JSON.parse(responseText);
            if(response.status === 1){
                Utils.cFunctions.updateMyCardsLocal(response.data.lastEdit,tempCards,Utils.account.accountId);
            }else{
                console.log('something is wrong');
            }
        }).catch(err=>{
            this.props.setHttp(false);
            console.log(err.toString());
            this.deleteCard(index,id);
        });
    }

    refreshCards(){

    }

    refreshQR(index){
        this.refs.qr.setIndex(index);
    }

    renderIndicator () {
        return (
            <PagerDotIndicator
                pageCount={this.state.cards.length}
                style={{bottom: -responsiveHeight(3)}}
                hideSingle={true}
                dotStyle={{backgroundColor: '#E0E0E0'}}
                selectedDotStyle={{backgroundColor: Utils.colors.primaryColor}}
            />
        )
    }

    render() {
        if (this.state.cards === null) {
            return(
                <View style={[styles.container,{alignItems: 'center'}]}>
                    <Spinner style={{marginTop: 50}} isVisible={true} size={Utils.size.width*0.5} type={'Wave'} color={Utils.colors.tertiaryColor}/>
                    <Text style={styles.loading}>{this.state.content.loading}</Text>
                </View>
            );
        } else {
            this.cards = [];
            for (let i = 0; i < this.state.cards.length; i++) {
                this.cards.push(
                    <View key={i}>
                        <Ripple onPress={() => {
                            this.props.navigation.navigate("EditCard",{action:'edit', index: i, refreshCards: this.refreshCards,saveEdit: this.saveEdit,deleteCard: this.deleteCard});
                        }} onLongPress={() => console.log("test")}>
                            <View style={styles.card}>
                                <Card index={i} cardValue={this.state.cards[i]} width={Utils.size.width}/>
                            </View>
                        </Ripple>
                    </View>
                );
            }

            if (this.state.cards.length !== 0) {
                return (
                    <View style={[styles.container]}>
                        <IndicatorViewPager
                            indicator={this.renderIndicator()}
                            style={[{height: cardHeight, marginBottom: Utils.size.height * 0.425 - cardHeight}]}
                            onPageSelected={(p) => this.refreshQR(p.position)}
                        >
                            {this.cards}
                        </IndicatorViewPager>
                        <View style={styles.QR}>
                            <QR ref={"qr"} cards={this.state.cards}/>
                        </View>
                    </View>
                );
            } else {
                return (
                    <View style={[styles.container]}>
                        <View style={[{
                            height: Utils.size.height * 0.425,
                            width: Utils.size.width,
                            alignItems: 'center'
                        }]}>
                            <Ripple onPress={() => this.props.createNewCard()}>
                                <View style={[{
                                    height: cardHeight,
                                    width: Utils.size.width,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }]}>
                                    <View style={styles.cardTop}>
                                        <Ionicons name={'ios-add-circle-outline'} size={Utils.size.width * 0.35}/>
                                    </View>
                                </View>
                            </Ripple>
                        </View>
                        <View style={{width: Utils.size.width}}>
                            <Text style={styles.fallbackAdd}>{this.state.content.fallbackAdd}</Text>
                        </View>
                    </View>
                );
            }
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection: "column",
        backgroundColor: 'white'
    },
    card:{
        width: responsiveWidth(100),
        alignItems: 'center',
        backgroundColor: 'white',
    },
    QR:{
        width: responsiveWidth(100),
        height: responsiveHeight(42.5)
    },
    cardTop:{
        height: cardHeight*0.98,
        width: Utils.size.width*0.98,
        borderRadius: 2,
        borderWidth: 1.5,
        borderColor: '#787878',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center'
    },
    fallbackAdd: {
        color: Utils.colors.primaryColor,
        fontWeight: 'bold',
        fontSize: responsiveFontSize(2.5),
        marginLeft: Utils.size.width*0.02
    },
    loading:{
        fontSize: responsiveFontSize(3),
        color: Utils.colors.primaryColor,
        fontWeight:"bold",
        marginTop: 50
    }
});

MyCardContent.propTypes = {
    navigation: PropTypes.object.isRequired,
    updateView: PropTypes.func.isRequired,
    setHttp: PropTypes.func.isRequired,
    createNewCard: PropTypes.func.isRequired
};