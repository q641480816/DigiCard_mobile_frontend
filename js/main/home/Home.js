import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    PermissionsAndroid,
    DeviceEventEmitter,
    NativeModules
} from 'react-native';
import {responsiveFontSize} from "../component/responsive/responsive";
import Orientation from 'react-native-orientation';

import Ripple from 'react-native-material-ripple';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Utils from '../../common/util';
import BottomAction from './component/BottomAction';
import AllCard from './allCard/AllCard';
import MyCard from './myCard/MyCard';
import ElevatedView from "../component/elevatedView/ElevatedView";
import Modal from '../component/modal/ModalFarme';

export default class Home extends Component{
    constructor(props) {
        super(props);

        this.state = {
            test:true,
            page: 1,
            isAction: false,
            isInitialized: false,
            bodyHeight: Utils.size.height*0.925,
            content:{
                myCard: 'My Cards',
                allCard: 'All Cards'
            }
        };

        this.registerNFCListener = this.registerNFCListener.bind(this);
        this.NFCListener = this.NFCListener.bind(this);
        this.measureHeight = this.measureHeight.bind(this);
        this.updateView = this.updateView.bind(this);
        this.createNewCard = this.createNewCard.bind(this);
        this.updateCardMini = this.updateCardMini.bind(this);
        this.scanQr = this.scanQr.bind(this);
        this.STG = this.STG.bind(this);
        this.getAllGroups = this.getAllGroups.bind(this);
    }

    componentDidMount() {
        Orientation.lockToPortrait();
        this.registerNFCListener(false);
        //console.log(Utils.account.accountId)
    }

    componentWillUnmount() {
        this.registerNFCListener(true);
        //Orientation.unlockAllOrientations();
    }

    registerNFCListener(isUnmounted){
        if(isUnmounted){
            DeviceEventEmitter.removeListener('nfcDetect',this.NFCListener)
        }else{
            DeviceEventEmitter.addListener('nfcDetect', this.NFCListener)
        }
    }

    NFCListener(e){
        if(e.nfcDetect.length > 1 && e.nfcDetect.indexOf('id=') >= 0){
            let id = Number(e.nfcDetect.substring(e.nfcDetect.indexOf('id=')+3));
            let url = Utils.baseURL + 'accountCards';

            Utils.cFunctions.fetch.post(url,{
                accountId: Utils.account.accountId,
                cardId: id
            }).then(response => {
                let groups = this.getAllGroups();
                if(response.data.new){
                    //when this is a new card
                    let newCards = response.data.card;
                    newCards.contentSet = null;
                    newCards.accountCardId = response.data.accountCardId;
                    newCards.name = response.data.name;
                    groups[0].cards.push(newCards);
                    this.updateCardMini(groups,response.data.account.lastUpdate,()=>{},false);
                    this.props.navigation.dispatch({
                        key: 'CardDetail',
                        type: 'ReplaceCurrentScreen',
                        routeName: 'CardDetail',
                        params: {
                            index:groups[0].cards.length-1,
                            gIndex: 0,
                            id: response.data.card.cardId+"",
                            updateCardsMini:this.updateCardMini,
                            groups: groups
                        }
                    });
                }else{
                    let accountCardId = response.data.accountCardId;
                    for(let i = 0; i < groups.length; i++){
                        for(let j = 0; j < groups[i].cards.length; j++){
                            if(groups[i].cards[j].accountCardId === accountCardId){
                                this.props.navigation.dispatch({
                                    key: 'CardDetail',
                                    type: 'ReplaceCurrentScreen',
                                    routeName: 'CardDetail',
                                    params: {
                                        index:j,
                                        gIndex: i,
                                        id: response.data.card.cardId+"",
                                        updateCardsMini:this.updateCardMini,
                                        groups: groups
                                    },
                                });
                                break;
                            }
                        }
                    }
                }
            }).catch(err=>{
                //TODO
                console.log(err);
            });
        }
    }

    measureHeight(event){
        if(!this.state.isInitialized) {
            Utils.size.realVerticalH = event.nativeEvent.layout.height;
            this.setState({
                isInitialized:true,
                bodyHeight: (event.nativeEvent.layout.height - Utils.size.height * 0.075)
            });
        }
    }

    updateView(index){
        this.setState({
            page: index
        });
    }

    createNewCard(){
        this.setState({isAction:false});
        this.refs.myCards.createNewCard();
    }

    getAllGroups(){
        return this.refs.allCards.getAllGroups();
    }

    updateCardMini(allCardsMini,lastUpdate,callback,isSync){
        this.refs.allCards.updateCardMini(allCardsMini,lastUpdate,callback,isSync);
    }

    scanQr(){
        this.setState({isAction:false});
        if(Utils.OS === 'android'){
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA).then((result)=>{
                if(result){
                    this.props.navigation.navigate('ReadQr',{groups: this.getAllGroups(),updateCardMini: this.updateCardMini});
                }else{
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA).then((result)=> {
                        if(result === 'granted'){
                            this.props.navigation.navigate('ReadQr',{groups: this.getAllGroups(),updateCardMini: this.updateCardMini});
                        }
                    })
                }
            });
        }
    }

    STG(){
        this.setState({isAction:false});
        if(Utils.OS === 'android'){
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result)=>{
                if(result){
                    this.props.navigation.navigate('NearbyCards');
                }else{
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result)=> {
                        if(result === 'granted'){
                            this.props.navigation.navigate('NearbyCards');
                        }
                    })
                }
            });
        }
    }

    render(){
        console.log("Home rendered!");
        return(
            <View style={styles.container} onLayout={(event)=>this.measureHeight(event)}>
                <View style={[{display: this.state.page===1?"flex":'none',height:this.state.bodyHeight}]}>
                    <MyCard ref={'myCards'} navigation={this.props.navigation} updateView={this.updateView} createNewCard={this.createNewCard}/>
                </View>
                <View style={{display: this.state.page===2?"flex":'none',height:this.state.bodyHeight}}>
                    <AllCard ref={'allCards'} navigation={this.props.navigation}/>
                </View>
                <ElevatedView elevation={5} style={styles.bottomRouter}>
                    <Ripple style={{flex:1}} onPress={() => {if(this.state.page!==1){this.setState({page: 1})}}}>
                        <View style={this.state.page === 1? styles.bottomButtonSelected:styles.bottomButton}>
                            <MaterialCommunityIcons name="account-card-details" size={25}/>
                            <Text style={[styles.buttonText,{color: this.state.page === 1? "#00E3E3":"#272727"}]}>{this.state.content.myCard}</Text>
                        </View>
                    </Ripple>
                    <Ripple style={{flex:1}} onPress={()=>this.setState({isAction:true})}>
                        <View style={styles.bottomButton}>
                            <MaterialCommunityIcons name="credit-card-plus" color={Utils.colors.tertiaryColor} size={40}/>
                        </View>
                    </Ripple>
                    <Ripple style={{flex:1}} onPress={() => {if(this.state.page!==2){this.setState({page: 2})}}}>
                        <View style={this.state.page === 2? styles.bottomButtonSelected:styles.bottomButton}>
                            <MaterialCommunityIcons name="cards" size={25}/>
                            <Text style={[styles.buttonText,{color: this.state.page === 2? "#00E3E3":"#272727"}]}>{this.state.content.allCard}</Text>
                        </View>
                    </Ripple>
                </ElevatedView>
                <Modal isShow={this.state.isAction} position={'flex-end'}
                        backPress={() => this.setState({isAction: false})}
                        bgPress={() => this.setState({isAction: false})}>
                        <BottomAction createNewCard={this.createNewCard} scanQr={this.scanQr} STG={this.STG}/>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Utils.size.width,
        flexDirection: "column"
    },
    bottomRouter:{
        width: Utils.size.width,
        height: Utils.size.height*0.075,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        left:0,
        flexDirection: 'row'
    },
    bottomButton:{
        height: Utils.size.height*0.075,
        flex: 1,
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomButtonSelected:{
        height: Utils.size.height*0.075,
        flex: 1,
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#d0d0d0'
    },
    buttonText:{
        fontSize: responsiveFontSize(1.4),
        fontWeight: 'bold'
    },
    actionSheet: {
        justifyContent: 'flex-end',
        margin: 0,
    }
});