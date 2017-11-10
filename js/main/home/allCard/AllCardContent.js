import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text
} from 'react-native';
import PropTypes from 'prop-types';
import { responsiveFontSize } from '../../component/responsive/responsive';

import Spinner from 'react-native-spinkit';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ripple from "react-native-material-ripple";
import moment from 'moment';

import Utils from '../../../common/util';
import Group from './component/Group';
import PStorage from '../../../common/persistantStorage';

export default class AllCardContent extends Component{
    constructor(props) {
        super(props);

        this.state = {
            groups: null,
            content: {
                loading: 'Loading All Cards',
                manage: 'Manage Group'
            }
        };

        this.groups = [];
        this.getAllCardsOnline = this.getAllCardsOnline.bind(this);
        this.getAllCardsLocal = this.getAllCardsLocal.bind(this);
        this.getAllGroups = this.getAllGroups.bind(this);
        this.showCardModal = this.showCardModal.bind(this);
        this.init_card = this.init_card.bind(this);
        this.updateCardMini = this.updateCardMini.bind(this);
        this.updateCardMiniWithLocal = this.updateCardMiniWithLocal.bind(this);
        this.updateCardById = this.updateCardById.bind(this);
    }

    componentWillMount(){
        this.init_card();
    }

    init_card(){
        PStorage.load({
            key:`${Utils.action.lastUpdate+Utils.account.accountId}`,
            autoSync: false
        }).then(ret=>{
            let lastUpdate = moment(ret);
            if(lastUpdate.isBefore(moment(Utils.account.lastUpdate))){
                this.getAllCardsOnline(true);
            }else if(lastUpdate.isAfter(moment(Utils.account.lastUpdate))){
                //push online
                //TODO: ONLINE SYNC
            }else{
                this.getAllCardsLocal();
            }
        }).catch(err => {
            switch (err.name) {
                case 'NotFoundError':
                    this.getAllCardsOnline(false);
                    break;
                case 'ExpiredError':
                    //TODO: CATCH
                    break;
            }
        });
    }

    getAllCardsOnline(isSync){
        this.props.setHttp(true);
        let url = Utils.baseURL + 'accounts/'+Utils.account.accountId+'/allCards';
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
                let cards = Utils.cFunctions.sortAllCards(response.data.cards);
                this.setState({groups: cards});
                Utils.cFunctions.updateAllCardsLocal(response.data.lastUpdate,cards,Utils.account.accountId,isSync);
            }else{
                //TODO: Catch
            }
        }).catch(err=>{
            this.props.setHttp(false);
            console.log(err);
        });
    }

    getAllCardsLocal(){
        PStorage.load({
            key: `${Utils.action.allCards+Utils.account.accountId}`
        }).then(ret=>{
            this.setState({
                groups: JSON.parse(ret.cards).cards
            });
        }).catch(err=>{
            this.getAllCardsOnline();
        })
    }

    updateCardMini(allCardsMini,lastUpdate,callback,isSync){
        Utils.cFunctions.updateAllCardsLocal(lastUpdate,allCardsMini,Utils.account.accountId,isSync);
        this.setState({groups:Utils.cFunctions.sortAllCards(allCardsMini)});
        callback();
    }

    updateCardById(card){
        PStorage.save({
            key: card.id,
            data: {
                card:JSON.stringify(card)
            }
        });
    }

    updateCardMiniWithLocal(allCardsMini,callback){
        this.updateCardMini(allCardsMini,()=>{
            this.setState({groups:allCardsMini});
            callback();
        });
    }

    showCardModal(id){
        PStorage.load({
            key: id,
            autoSync: false,
        }).then(ret => {
            this.props.showCardModal(JSON.parse(ret.card));
        }).catch(err => {
            console.log(err.toString());
        });
    }

    getAllGroups(){
        return this.state.groups;
    }

    render() {
        if (this.state.groups === null) {
            return (
                <View style={[styles.container, {alignItems: 'center'}]}>
                    <Spinner style={{marginTop: 50}} isVisible={true} size={Utils.size.width * 0.5} type={'Wave'}
                             color={Utils.colors.tertiaryColor}/>
                    <Text style={styles.loading}>{this.state.content.loading}</Text>
                </View>
            );
        } else {
            this.groups = [];
            for (let i = 1; i < this.state.groups.length; i++) {
                this.groups.push(
                    <Group key={i} index={i} groups={this.state.groups} group={this.state.groups[i]} showCardModal={this.showCardModal} updateCardMini={this.updateCardMini} navigation={this.props.navigation}/>
                );
            }

            return (
                <ScrollView style={[styles.container]}>
                    <View style={{width:Utils.size.width,height: 40,backgroundColor:'white',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <View style={{flex:1,marginLeft:15,marginRight:15,marginBottom: 5,marginTop: 5,backgroundColor:'#E0E0E0',borderRadius:2,height:32,alignItems:'center',justifyContent:'center'}}>
                            <EvilIcons name={'search'} size={30}/>
                        </View>
                    </View>
                    <View>
                        <Group index={0} groups={this.state.groups} group={this.state.groups[0]} showCardModal={this.showCardModal} updateCardMini={this.updateCardMini} navigation={this.props.navigation}/>
                    </View>
                    <View style={{width: Utils.size.width, height: 25, backgroundColor: '#FAFAFA'}}/>
                    <View>
                        {this.groups}
                    </View>
                    <Ripple style={styles.bar} onPress={()=>this.props.navigation.navigate('ManageGroup',{
                        groups: this.state.groups,
                        updateCardMini: this.updateCardMini
                    })}>
                        <FontAwesome name={'object-group'} color={'grey'} size={22.5} style={[styles.icon]}/>
                        <Text style={{fontSize:responsiveFontSize(2.1)}}>{this.state.content.manage}</Text>
                    </Ripple>
                </ScrollView>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    loading:{
        fontSize: responsiveFontSize(3),
        color: Utils.colors.primaryColor,
        fontWeight:"bold",
        marginTop: 50
    },
    bar:{
        width: Utils.size.width,
        height: Utils.size.height*0.075,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    icon: {
        marginLeft: 10,
        marginRight: 10
    },
});

AllCardContent.propTypes = {
    showCardModal: PropTypes.func.isRequired,
    navigation: PropTypes.object,
    setHttp: PropTypes.func.isRequired
};