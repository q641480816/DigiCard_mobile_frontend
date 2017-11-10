import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    PermissionsAndroid
} from 'react-native';
import {responsiveFontSize} from "../component/responsive/responsive";
import Orientation from 'react-native-orientation';

import Ripple from 'react-native-material-ripple';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';

import Utils from '../../common/util';
import BottomAction from './component/BottomAction';
import AllCard from './allCard/AllCard';
import MyCard from './myCard/MyCard';
import ElevatedView from "../component/elevatedView/ElevatedView";

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

        this.measureHeight = this.measureHeight.bind(this);
        this.updateView = this.updateView.bind(this);
        this.createNewCard = this.createNewCard.bind(this);
        this.updateCardMini = this.updateCardMini.bind(this);
        this.scanQr = this.scanQr.bind(this);
        this.getAllGroups = this.getAllGroups.bind(this);
    }

    componentDidMount() {
        Orientation.lockToPortrait();
        //console.log(Utils.account.accountId)
    }

    componentWillUnmount() {
        //Orientation.unlockAllOrientations();
    }

    measureHeight(event){
        if(!this.state.isInitialized) {
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

    render(){
        console.log("Home rendered!");
        return(
            <View style={styles.container} onLayout={(event)=>this.measureHeight(event)}>
                <View style={[{display: this.state.page===1?"flex":'none',height:this.state.bodyHeight}]}>
                    <MyCard ref={'myCards'} navigation={this.props.navigation} updateView={this.updateView}/>
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
                <Modal isVisible={this.state.isAction} animationInTiming={350} animationOutTiming={350} style={styles.actionSheet}
                        onBackButtonPress={() => this.setState({isAction: false})}
                        onBackdropPress={() => this.setState({isAction: false})}>
                        <BottomAction createNewCard={this.createNewCard} scanQr={this.scanQr}/>
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