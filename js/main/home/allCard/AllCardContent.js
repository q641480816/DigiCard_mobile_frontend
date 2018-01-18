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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ripple from "react-native-material-ripple";
import moment from 'moment';

import Utils from '../../../common/util';
import Group from './component/Group';
import PStorage from '../../../common/persistantStorage';
import Search from "../../component/search/Search";
import AllCardSearch from "./component/AllCardSearch";

export default class AllCardContent extends Component{
    constructor(props) {
        super(props);

        this.state = {
            groups: null,
            isSearch: false,
            searchKey: '',
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
        this.navigateCardDetail = this.navigateCardDetail.bind(this);
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
        Utils.cFunctions.fetch.get(url).then(response => {
            this.props.setHttp(false);
            console.log(response)
            let cards = Utils.cFunctions.sortAllCards(response.data.cards);
            this.setState({groups: cards});
            Utils.cFunctions.updateAllCardsLocal(response.data.lastUpdate,cards,Utils.account.accountId,isSync);
        }).catch(err => {
            // TODO: CATCH
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
            key: id + Utils.account.accountId,
            autoSync: false,
        }).then(ret => {
            this.props.showCardModal(JSON.parse(ret.card));
        }).catch(err => {
            console.log(err.toString());
        });
    }

    navigateCardDetail(id, index, gIndex){
        this.props.navigation.navigate('CardDetail',{
            index:index,
            gIndex: gIndex,
            id:id+"",
            updateCardsMini:this.updateCardMini,
            groups: this.state.groups
        })
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
                    <Search placeholder={"Search"} cancel={'Cancel'}
                            onFocus={()=>{this.setState({isSearch: true})}}
                            onCancel={()=>{this.setState({isSearch: false, searchKey:''})}}
                            onTextChange={(text)=>this.setState({searchKey: text})}
                    />
                    <View style={{display: this.state.isSearch? 'none':'flex'}}>
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
                    </View>
                    <View style={{display: !this.state.isSearch? 'none':'flex'}}>
                        <AllCardSearch ref={'search'} groups={this.state.groups} searchKey={this.state.searchKey} showCardModal={this.showCardModal}
                                       navigateCardDetail={this.navigateCardDetail}
                        />
                    </View>
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