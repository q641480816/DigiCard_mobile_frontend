import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Alert,
    ScrollView,
    Linking,
    TouchableWithoutFeedback
} from 'react-native';
import {responsiveFontSize} from "../component/responsive/responsive";

import Ripple from 'react-native-material-ripple';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import { Sae } from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import Spinner from 'react-native-spinkit';

import Utils from '../../common/util';
import PStorage from '../../common/persistantStorage';
import ToolbarMenu from '../component/toolbarMenu/ToolbarMenu';
import ElevatedView from "../component/elevatedView/ElevatedView";
import Card from '../component/card/Display/Card';
import Toolbar from "../component/toolbar/Toolbar";

export default class CardDetail extends Component{
    constructor(props) {
        super(props);

        this.state = {
            index:0,
            gIndex: 0,
            groups: [],
            editProperty: null,
            tempCardName: '',
            card: {
                width: Utils.size.width,
            },
            cardValue: null,
            content: {
                title: 'Card Detail',
                option: 'Options',
                card: 'Card: ',
                options:{
                    delete: 'Delete',
                    loading: 'Loading ...'
                },
                name:'Card name'
            }
        };

        this.init_card = this.init_card.bind(this);
        this.getCardOnline = this.getCardOnline.bind(this);
        this.updateGroup = this.updateGroup.bind(this);
        this.updateCardName = this.updateCardName.bind(this);
        this.dial = this.dial.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
        this.deleteCard = this.deleteCard.bind(this);
        this.showMenu = this.showMenu.bind(this);
    }

    componentWillMount(){
        this.setState({index: this.props.navigation.state.params.index,gIndex: this.props.navigation.state.params.gIndex,groups:this.props.navigation.state.params.groups});
        this.init_card();
    }

    init_card(){
        PStorage.load({
            key: this.props.navigation.state.params.id+Utils.account.accountId,
            autoSync: false,
        }).then(ret => {
            let card = JSON.parse(ret.card);
            if(moment(card.lastEdit).isBefore(moment(this.state.groups[this.state.gIndex].cards[this.state.index].lastEdit))){
                this.getCardOnline();
            }else{
                this.setState({cardValue: card});
            }
        }).catch(err => {
            this.getCardOnline();
        });
    }

    getCardOnline(){
        console.log("get card online");
        let url = Utils.baseURL + 'cards/'+this.props.navigation.state.params.id;
        fetch(`${url}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `${Utils.account.secret}`
            }
        }).then((response) => response.text()).then((responseText) => {
            let response = JSON.parse(responseText);
            if(response.status === 1){
                let card = response.data;
                this.setState({cardValue: card,index: this.props.navigation.state.params.index,gIndex: this.props.navigation.state.params.gIndex,groups:this.props.navigation.state.params.groups});
                Utils.cFunctions.updateAccountCard(card,Utils.account.accountId+"");
            }else{
                //TODO
            }
        }).catch(err=>{
            console.log(err);
        });
    }

    updateGroup(ngIndex){
        if(ngIndex !== this.state.gIndex) {
            this.refs.toolbar.setLoadingShow(true);
            let url = Utils.baseURL + 'accountCards/' + this.state.groups[this.state.gIndex].cards[this.state.index].accountCardId;
            fetch(`${url}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `${Utils.account.secret}`
                },
                body: JSON.stringify({
                    group: this.state.groups[ngIndex].group
                })
            }).then((response) => response.text()).then((responseText) => {
                this.refs.toolbar.setLoadingShow(false);
                let response = JSON.parse(responseText);
                console.log(response);
                if (response.status === 1) {
                    let groups = this.state.groups;
                    groups[ngIndex].cards.push(groups[this.state.gIndex].cards[this.state.index]);
                    groups[this.state.gIndex].cards.splice(this.state.index, 1);
                    this.setState({gIndex: ngIndex, index: (groups[ngIndex].cards.length - 1), groups: groups});
                    this.props.navigation.state.params.updateCardsMini(groups, response.data.account.lastUpdate, () => {
                    }, false);
                } else {
                    // TODO:
                }
            }).catch(e => {
                this.refs.toolbar.setLoadingShow(false);
                this.updateGroup(ngIndex);
            });
        }
    }

    updateCardName(){
        this.refs.toolbar.setLoadingShow(true);
        let url = Utils.baseURL + 'accountCards/'+this.state.groups[this.state.gIndex].cards[this.state.index].accountCardId;
        fetch(`${url}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `${Utils.account.secret}`
            },
            body: JSON.stringify({
                name: this.state.tempCardName
            })
        }).then((response) => response.text()).then((responseText) => {
            this.refs.toolbar.setLoadingShow(false);
            let response = JSON.parse(responseText);
            if(response.status === 1){
                let groups = this.state.groups;
                groups[this.state.gIndex].cards[this.state.index].name = response.data.name;
                this.setState({editProperty:null,groups: groups});
                this.props.navigation.state.params.updateCardsMini(groups,response.data.account.lastUpdate,()=>{},false);
            }else{
                //TODO:
            }
        }).catch(err=>{
            this.refs.toolbar.setLoadingShow(false);
            console.log(err);
            this.updateCardName();
        });
    }

    deleteCard(){
        this.refs.toolbar.setLoadingShow(true);
        let url = Utils.baseURL + 'accountCards/'+this.state.groups[this.state.gIndex].cards[this.state.index].accountCardId;
        fetch(`${url}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `${Utils.account.secret}`
            }
        }).then((response) => response.text()).then((responseText) => {
            this.refs.toolbar.setLoadingShow(false);
            let response = JSON.parse(responseText);
            if(response.status === 1){
                let groups = this.state.groups;
                groups[this.state.gIndex].cards.splice(this.state.index,1);
                this.props.navigation.state.params.updateCardsMini(groups,response.data.account.lastUpdate,()=>{
                    Utils.cFunctions.deleteAccountCard(this.state.cardValue.cardId,Utils.account.accountId+"");
                },false);
                this.props.navigation.goBack(null);
            }else{
                //TODO
            }
        }).catch(err=>{
            this.refs.toolbar.setLoadingShow(false);
            console.log(err);
            this.deleteCard();
        });
    }

    dial(number){
        let url = `${'tel:'+Utils.cFunctions.validatePhone(number)}`;
        Linking.canOpenURL(url).then(canOpen => {
            if (!canOpen) {
                return Promise.reject(new Error(`The URL is invalid: ${url}`));
            } else {
                return Linking.openURL(url).catch((err) => console.log(err.toString()));
            }
        });
    }

    sendEmail(email){
        let url = `${'mailto:'+Utils.cFunctions.validateEmail(email)}`;
        Linking.canOpenURL(url).then(canOpen => {
            if (!canOpen) {
                return Promise.reject(new Error(`The URL is invalid: ${url}`));
            } else {
                return Linking.openURL(url).catch((err) => console.log(err.toString()));
            }
        });
    }

    showMenu(){
        this.refs.menu.showMenu();
    }

    render(){
        if(this.state.cardValue !== null){
            return(
                <View style={styles.container}>
                    <Toolbar ref={'toolbar'} title={this.state.content.title} rightElement={null} loading={true} rightElementAction={this.showMenu} rightText={this.state.content.option}/>
                    <ScrollView>
                        <View style={styles.cardTop}>
                            <Card width={Utils.size.width} cardValue={this.state.cardValue} index={0}/>
                        </View>
                        <View style={{width:Utils.size.width,backgroundColor:'white'}}>
                            <View style={[styles.section]}>
                                <View style={[styles.row,{marginTop:0, justifyContent: 'space-between', marginBottom: 0}]}>
                                    <Text style={{fontSize: responsiveFontSize(2.5),fontWeight:'bold',color: Utils.colors.primaryColor,display:this.state.groups[this.state.gIndex].cards[this.state.index].name===null?'none':'flex'}}>
                                        {this.state.content.card + this.state.groups[this.state.gIndex].cards[this.state.index].name}
                                    </Text>
                                    <Text style={{fontSize: responsiveFontSize(2.5),fontWeight:'bold',color: Utils.colors.primaryColor,display:this.state.groups[this.state.gIndex].cards[this.state.index].name!==null?'none':'flex'}}>
                                        {this.state.content.card + 'Add Name'}
                                    </Text>
                                    <TouchableWithoutFeedback onPress={()=>{this.setState({editProperty: 'name',tempCardName:this.state.groups[this.state.gIndex].cards[this.state.index].name})}}>
                                        <MaterialIcons name={'edit'} size={25} color={'grey'}/>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                            <View style={styles.hr}/>
                            <ElevatedView elevation={1} style={[styles.section]}>
                                <Ripple onPress={()=>this.props.navigation.navigate('Grouping',
                                    {groups: this.state.groups,index:this.state.index,gIndex:this.state.gIndex,updateGroup: this.updateGroup}
                                )}>
                                    <View style={[styles.row,{marginTop:0}]}>
                                        <MaterialIcons name={'group'} size={25} color={'grey'}/>
                                        <Text style={styles.textContent}>{this.state.groups[this.state.gIndex].group}</Text>
                                    </View>
                                </Ripple>
                                <View style={[styles.row,{marginBottom: 0}]}>
                                    <MaterialCommunityIcons name={'calendar-plus'} size={25} color={'grey'}/>
                                    <Text style={styles.textContent}>{moment(this.state.cardValue.addTime).format('YYYY-MM-DD')}</Text>
                                </View>
                            </ElevatedView>
                            <View style={styles.hr}/>
                            <ElevatedView elevation={1} style={[styles.section]}>
                                <View style={[styles.row,{marginTop:0}]}>
                                    <MaterialIcons name={'person'} size={25} color={'grey'}/>
                                    <Text style={styles.textContent}>{this.state.cardValue.contentSet[0].value}</Text>
                                </View>
                                <Ripple onPress={()=>this.dial(this.state.cardValue.contentSet[1].value)}>
                                    <View style={styles.row}>
                                        <MaterialCommunityIcons name={'phone-outgoing'} size={25} color={'grey'}/>
                                        <Text style={styles.textContent}>{this.state.cardValue.contentSet[1].value}</Text>
                                    </View>
                                </Ripple>
                                <Ripple onPress={()=>this.sendEmail(this.state.cardValue.contentSet[2].value)}>
                                    <View style={[styles.row,{marginBottom:0}]}>
                                        <MaterialCommunityIcons name={'email'} size={25} color={'grey'}/>
                                        <Text style={styles.textContent}>{this.state.cardValue.contentSet[2].value}</Text>
                                    </View>
                                </Ripple>
                            </ElevatedView>
                            <View style={styles.hr}/>
                        </View>
                    </ScrollView>
                    <ToolbarMenu ref={'menu'} topOffset={Utils.size.height*0.075} withIcon={false}
                                 items={[
                                     {
                                         name: this.state.content.options.delete,
                                         action: this.deleteCard
                                     }]}
                    />
                    <Modal  isVisible={this.state.editProperty === 'name'} animationInTiming={10} animationOutTiming={10}
                            onBackButtonPress={() => this.updateCardName()}
                            onBackdropPress={() => this.updateCardName()}>
                        <Sae
                            label={this.state.content.name}
                            iconClass={FontAwesomeIcon}
                            iconName={'pencil'}
                            iconColor={'white'}
                            labelStyle={[styles.input,{color: 'white'}]}
                            inputStyle={[styles.input,{color: 'white'}]}
                            value={this.state.tempCardName}
                            onChangeText={(value) => this.setState({tempCardName:value})}
                        />
                    </Modal>
                </View>
            );
        }else {
            return (
                <View style={[styles.container, {alignItems: 'center'}]}>
                    <Spinner style={{marginTop: 50}} isVisible={true} size={Utils.size.width * 0.5} type={'Wave'}
                             color={Utils.colors.tertiaryColor}/>
                    <Text style={styles.loading}>{this.state.content.loading}</Text>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        width: Utils.size.width,
        flex:1
    },
    loading:{
        fontSize: responsiveFontSize(3),
        color: Utils.colors.primaryColor,
        fontWeight:"bold",
        marginTop: 50
    },
    cardTop:{
        width: Utils.size.width,
        height: Utils.size.width/Utils.ratio,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    section: {
        width: Utils.size.width,
        padding: 15,
        flexDirection: 'column',
    },
    row:{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop:12,
        marginBottom:12
    },
    textContent: {
        fontSize: responsiveFontSize(2),
        marginLeft: 15
    },
    hr:{
        borderBottomWidth: 10,
        borderBottomColor: '#FAFAFA'
    },
    input: {
        fontSize: responsiveFontSize(2),
        color: Utils.colors.secondaryColor
    },
});