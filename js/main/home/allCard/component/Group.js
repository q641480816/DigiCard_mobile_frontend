import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
    Linking
} from 'react-native';
import PropTypes from 'prop-types';
import {responsiveFontSize} from "../../../component/responsive/responsive";

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Utils from '../../../../common/util';
import Ripple from "react-native-material-ripple";
import PStorage from '../../../../common/persistantStorage';

export default class Group extends Component{
    constructor(props) {
        super(props);

        this.state = {
            index:0,
            groups:[],
            group: {},
            isOpen: false,
            content: {}
        };

        this.cards = [];
        this.dial = this.dial.bind(this);
        this.updateCardsMini = this.updateCardsMini.bind(this);
        this.deleteCard = this.deleteCard.bind(this);
    }

    componentWillMount(){
        this.setState({
            index: this.props.index,
            group: this.props.group,
            groups: this.props.groups
        });
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            index: nextProps.index,
            group: nextProps.group,
            groups: nextProps.groups
        })
    }

    updateCardsMini(allCardsMini, lastUpdate, callback, isSync){
        this.props.updateCardMini(allCardsMini,lastUpdate,callback,isSync);
    }

    deleteCard(index){
        let groups = this.state.groups;
        let card = groups[this.state.index].cards[index];
        groups[this.state.index].cards.splice(index,1);
        this.props.updateCardMiniWithLocal(groups,()=>{
            PStorage.remove({key: card.id});
        });
    }

    dial(number){
        let url = `${'tel:'+Utils.cFunctions.validatePhone(number)}`;
        Linking.canOpenURL(url).then(canOpen => {
            if (!canOpen) {
                return Promise.reject(new Error(`The URL is invalid: ${url}`));
            } else {
                return Linking.openURL(url).catch((err) => console.log(err.toString()))
            }
        })
    }

    render(){
        this.cards = [];
        for(let i = 0; i < this.state.group.cards.length; i++){
            let card = this.state.group.cards[i];
            this.cards.push(
                <View style={styles.card} key={i}>
                    <Ripple style={{width:Utils.size.width*0.8}} onLongPress={()=>this.props.showCardModal(card.cardId+"")}
                            onPress={()=>this.props.navigation.navigate('CardDetail',{
                                index:i,
                                gIndex: this.state.index,
                                id:card.cardId+"",
                                deleteCard: this.deleteCard,
                                updateCardsMini:this.updateCardsMini,
                                groups: this.state.groups
                            })}>
                        <View>
                            <Text style={[styles.detail,{marginTop:4,fontSize: responsiveFontSize(2),fontWeight:'bold'}]}>{card.name===null?'Add Name':card.name}</Text>
                            <Text style={{paddingLeft:15,fontSize:responsiveFontSize(1.75)}}>{card.cardName}</Text>
                            <Text style={{marginBottom:4,paddingLeft:15,fontSize:responsiveFontSize(1.75)}}>{card.phone}</Text>
                        </View>
                    </Ripple>
                    <TouchableWithoutFeedback onPress={()=>this.dial(card.phone)}>
                        <View style={[styles.rowCenter,{width:Utils.size.width*0.2}]}>
                            <MaterialCommunityIcons name={'phone-outgoing'} color={'grey'} size={27.5}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            );
        }

        return(
            <View style={[styles.container]}>
                <View style={styles.top}>
                    <Ripple style={styles.bar} onPress={()=>this.setState({isOpen: !this.state.isOpen})}>
                        <Ionicons name={'md-arrow-dropup'} color={'grey'} size={22.5} style={[{display:this.state.isOpen?'none':'flex'},styles.icon]}/>
                        <Ionicons name={'md-arrow-dropdown'} color={'grey'} size={22.5} style={[{display:!this.state.isOpen?'none':'flex'},styles.icon]}/>
                        <Text style={{fontSize:responsiveFontSize(2.1)}}>{this.state.group.group + " (" + this.state.group.cards.length + ")"}</Text>
                    </Ripple>
                    <View style={{width:Utils.size.width,height:0.5,backgroundColor:'grey'}}/>
                </View>
                <View style={{display:this.state.isOpen?'flex':'none'}}>
                    {this.cards}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    top:{
        flexDirection: 'column'
    },
    bar:{
        width: Utils.size.width,
        height: Utils.size.height*0.075,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    card:{
        width: Utils.size.width,
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey',
        alignItems:'center'
    },
    icon: {
        marginLeft: 10,
        marginRight: 10
    },
    detail: {
        marginBottom: 3,
        marginLeft: 10
    },
    rowCenter:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

Group.propTypes = {
    index: PropTypes.number.isRequired,
    group: PropTypes.object.isRequired,
    groups: PropTypes.array.isRequired,
    showCardModal: PropTypes.func.isRequired,
    navigation: PropTypes.object,
    updateCardMini: PropTypes.func,
};