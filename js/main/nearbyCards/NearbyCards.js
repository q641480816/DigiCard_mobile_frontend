import React, { Component } from 'react';
import {
    Alert,
    Image,
    ListView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import PropTypes from 'prop-types';
import { responsiveFontSize,responsiveHeight,responsiveWidth } from '../component/responsive/responsive';

import Spinner from 'react-native-spinkit';

import Utils from "../../common/util";
import Toolbar from "../component/toolbar/Toolbar";
import Card from "../component/card/Display/Card";
import Ripple from 'react-native-material-ripple';
import Data from "../../common/Data";
import RefreshableList from "../component/refreshableList/RefreshableList";

export default class NearbyCards extends Component{
    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            coors: null,
            cards: null,
            dataSource: this.ds.cloneWithRows([]),
            content: {
                title: 'Nearby',
                loading: 'Finding Nearby',
                footer: 'Powered by Little Target',
                alert:{
                    locationOff: 'Location Service is Off',
                    locationOffBody: 'Please turn on the Location service',
                }
            }
        };

        this.init_data = this.init_data.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
    }

    componentWillMount(){
        navigator.geolocation.getCurrentPosition((initialPosition) =>
            {
                this.setState({coors:{
                    latitude: initialPosition.coords.latitude,
                    longitude: initialPosition.coords.longitude,
                }});
                this.init_data();
            }, (error) =>
            {
                Alert.alert(this.state.content.alert.locationOff, this.state.content.alert.locationOffBody,
                    [{text: 'OK', onPress: () => console.log('OK Pressed')},], { cancelable: true });
                console.log(error)
            }
        );
    }

    init_data(){
        let url = Utils.baseURL + 'stGround/' + this.state.coors.latitude + "," + this.state.coors.longitude;
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
                this.setState({
                    cards: response.data,
                    dataSource: this.ds.cloneWithRows(response.data),
                });
            }else{
                console.log("something is wrong");
                //TODO: ADD SOME CATCH
            }
        }).catch(err=>{
            this.init_data();
        });
    }

    renderFooter(){
        return(
            <View style={{height: 30, width: Utils.size.width, alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize: responsiveFontSize(1.75),color: 'grey'}}>{this.state.content.footer}</Text>
            </View>
        );
    }

    renderRow(card){
        if (card.cardId !== Utils.account.accountId) {
            return (
                <View style={{flexDirection:'row'}}>
                    <View style={[styles.sideFrame,{alignItems: 'center'}]}>
                        <Image
                            style={{width: Utils.size.width * 0.175, height: Utils.size.width * 0.175,borderRadius:90,borderWidth:1,borderColor: 'grey',marginTop:5}}
                            source={{uri: Data.tempAvatar}}
                        />
                    </View>
                    <View style={styles.frame}>
                        <Card cardValue={card} width={Utils.size.width*0.75}/>
                    </View>
                </View>
            );
        }else{
            return (
                <View/>
            )
        }
    }

    render(){
        if (this.state.cards === null) {
            return(
                <View style={[styles.container,{alignItems: 'center'}]}>
                    <Spinner style={{marginTop: 50}} isVisible={true} size={Utils.size.width*0.5} type={'Wave'} color={Utils.colors.tertiaryColor}/>
                    <Text style={styles.loading}>{this.state.content.loading}</Text>
                </View>
            );
        } else {
            return(
                <View style={[styles.container]}>
                    <Toolbar ref={'toolbar'} title={this.state.content.title} loading={true}/>
                    <RefreshableList
                        cards={this.state.cards}
                        renderRow={this.renderRow}
                        renderFooter={this.renderFooter}
                        refresh={this.init_data}
                    />
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: 'white'
    },
    loading:{
        fontSize: responsiveFontSize(3),
        color: Utils.colors.primaryColor,
        fontWeight:"bold",
        marginTop: 50
    },
    sideFrame:{
        width: Utils.size.width*0.25,
        height: Utils.size.width*0.75/Utils.ratio
    },
    frame:{
        width: Utils.size.width*0.75,
        height: Utils.size.width*0.75/Utils.ratio
    }
})