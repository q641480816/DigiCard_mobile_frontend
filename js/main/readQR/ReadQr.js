import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert
} from 'react-native';

import Utils from '../../common/util';
import QRReader from '../component/qrReader/QRReader';

export default class ReadQr extends Component{
    constructor(props) {
        super(props);

        this.state = {
            cardID: null,
            groups: null,
            content:{

            }
        };

        this.onRead = this.onRead.bind(this);
        this.cancelScan = this.cancelScan.bind(this);
    }

    componentWillMount(){
        this.setState({groups: this.props.navigation.state.params.groups})
    }

    onRead(string){
        let id = 0;
        if(string.indexOf('id=')>=0){
            id = Number(string.substring(string.indexOf('id=')+3));
        }
        this.setState({cardID:id});
        let url = Utils.baseURL + 'accountCards';
        fetch(`${url}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `${Utils.account.secret}`
            },
            body:JSON.stringify({
                accountId: Utils.account.accountId,
                cardId: id
            })
        }).then((response) => response.text()).then((responseText) => {
            let response = JSON.parse(responseText);
            if(response.status === 1){
                if(response.data.new){
                    //when this is a new card
                    let newCards = response.data.card;
                    newCards.contentSet = null;
                    newCards.accountCardId = response.data.accountCardId;
                    newCards.name = response.data.name;
                    let groups = this.state.groups;
                    groups[0].cards.push(newCards);
                    this.props.navigation.state.params.updateCardMini(groups,response.data.account.lastUpdate,()=>{},false);
                    this.props.navigation.dispatch({
                        key: 'CardDetail',
                        type: 'ReplaceCurrentScreen',
                        routeName: 'CardDetail',
                        params: {
                            index:groups[0].cards.length-1,
                            gIndex: 0,
                            id: response.data.card.cardId+"",
                            updateCardsMini:this.props.navigation.state.params.updateCardMini,
                            groups: groups
                        },
                    });
                }else{
                    let accountCardId = response.data.accountCardId;
                    for(let i = 0; i < this.state.groups.length; i++){
                        for(let j = 0; j < this.state.groups[i].cards.length; j++){
                            if(this.state.groups[i].cards[j].accountCardId === accountCardId){
                                this.props.navigation.dispatch({
                                    key: 'CardDetail',
                                    type: 'ReplaceCurrentScreen',
                                    routeName: 'CardDetail',
                                    params: {
                                        index:j,
                                        gIndex: i,
                                        id: response.data.card.cardId+"",
                                        updateCardsMini:this.props.navigation.state.params.updateCardMini,
                                        groups: this.state.groups
                                    },
                                });
                                break;
                            }
                        }
                    }
                }
            }else{
                //TODO
            }
        }).catch(err=>{
            console.log(err);
        });
    }

    cancelScan(){
        this.props.navigation.goBack(null);
    }

    render(){
        return (
            <View style={styles.container}>
                <QRReader cancelScan={this.cancelScan} onRead={this.onRead}/>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        width: Utils.size.width,
        height: Utils.size.height,
        backgroundColor: 'transparent'
    }
});