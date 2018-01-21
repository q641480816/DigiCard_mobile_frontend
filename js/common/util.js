import React  from 'react';
import {
    Dimensions,
} from 'react-native';
import { COLOR, ThemeProvider } from 'react-native-material-ui';
import {responsiveWidth} from "../main/component/responsive/responsive";

import PStorage from './persistantStorage';
const ReactN = require('react-native');
const {Platform} = ReactN;

const Utils = {
    //theme
    MaterialUITheme: {
        palette: {
            primaryColor: COLOR.blue50,
        },
        toolbar: {
            container: {
                height: 50,
            },
        },
        checkbox: {
            label: {
                paddingLeft: 0,
                marginLeft: -responsiveWidth(2.5)
            },
            icon:{
                paddingLeft: 0,
                marginLeft: 0,
            },
            container:{
                paddingLeft: 0,
                marginLeft: -responsiveWidth(5),
                paddingRight:0,
                marginRight:0,
                width: Dimensions.get('window').width/3
            }
        }
    },
    colors:{
        primaryColor: '#222B2F',
        secondaryColor: '#4A5357',
        tertiaryColor: '#B0C4DE'
    },

    //account
    account:null,

    //WEB
    base: 'card-digi.com/download?id=',
    //API
    baseURL: 'http://www.card-digi.com:8080/Digi/service/',
    //nav
    navigation: null,
    //global system config
    Platform: ReactN,
    OS: Platform.OS,
    size: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        realVerticalH: 0
    },
    ratio: 85.60/53.98,
    action: {
        myCards: 'myCards',
        lastEdit: 'lastEdit',
        lastUpdate: 'lastUpdate',
        allCards: 'allCards',
        defaultGroup: 'Ungrouped'
    },
    cFunctions: {
        fetch:{
            get: (URL)=>{
                return new Promise((resolve, reject) => {
                    fetch(`${URL}`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `${Utils.account.secret}`
                        }
                    }).then((response) => response.text()).then((responseText) => {
                        let response = JSON.parse(responseText);
                        if (response.status === 1) {
                            //resolve
                            resolve(response);
                        } else {
                            console.log("something is wrong");
                            //TODO: ADD SOME CATCH

                            reject(Error(response.status));
                        }
                    }).catch(err => {
                        console.log(err);
                        return Utils.cFunctions.fetch.get(URL);
                    });
                });
            },
            post: (URL, body) => {
                return new Promise((resolve, reject) => {
                    fetch(`${URL}`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `${Utils.account.secret}`
                        },
                        body: JSON.stringify(body)
                    }).then((response) => response.text()).then((responseText) => {
                        let response = JSON.parse(responseText);
                        if (response.status === 1) {
                            //resolve
                            resolve(response);
                        } else {
                            console.log("something is wrong");
                            //TODO: ADD SOME CATCH

                            reject(Error(response.status));
                        }
                    }).catch(err => {
                        console.log(err);
                        reject(err);
                    });
                });
            },
            put: (URL, body) => {
                return new Promise((resolve, reject) => {
                    fetch(`${URL}`, {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `${Utils.account.secret}`
                        },
                        body: JSON.stringify(body)
                    }).then((response) => response.text()).then((responseText) => {
                        let response = JSON.parse(responseText);
                        if (response.status === 1) {
                            //resolve
                            resolve(response);
                        } else {
                            console.log("something is wrong");
                            //TODO: ADD SOME CATCH

                            reject(Error(response.status));
                        }
                    }).catch(err => {
                        console.log(err);
                        reject(err);
                    });
                });
            }
        },
        getCardMatrix: (width)=>{
            let widthNew = width * 0.985;
            let height = widthNew / Utils.ratio;
            return {
                width: widthNew,
                height: height,
                unitFont: Math.sqrt((height*height)+(widthNew*widthNew))/100
            };
        },
        validatePhone: (number)=> {
            number = number.trim();
            let first = 0;
            let last = 0;
            for(let i = 0;i < number.length; i++){
                if(!isNaN(number.charAt(i))){
                    if(number.charAt(i) !== ' '){
                        first = i;
                        break;
                    }
                }
            }
            for(let i = number.length-1;i >= first; i--){
                if(!isNaN(number.charAt(i))){
                    if(number.charAt(i) !== ' '){
                        last = i;
                        break;
                    }
                }
            }
            return number.substring(first,last+1).trim();
        },
        validateEmail: (email)=>{
            email = email.trim();
            //check :
            if(email.indexOf(":" >= 0)){
                email = email.substring(email.indexOf(":")+1).trim();
            }
            // check space
            while(email.indexOf(" ") > 0){
                if(email.substring(0,email.indexOf(" ")).indexOf("@") >= 0){
                    email = email.substring(0,email.indexOf(" "));
                }else{
                    email = email.substring(email.indexOf(" ")+1);
                }
                email = email.trim();
            }
            return email;
        },
        sortAllCards: (cards)=>{
            let allCards = [];
            for(let i = 0; i < cards.length; i++){
                if(cards[i].group === Utils.action.defaultGroup){
                    let temp = [];
                    temp.push(cards[i]);
                    allCards = temp.concat(allCards);
                }else{
                    allCards.push(cards[i]);
                }
            }
            return allCards;
        },
        updateMyCardsLocal: (lastEdit,cards,id)=>{
            PStorage.save({
                key: `${Utils.action.lastEdit+id}`,
                data: `${lastEdit}`
            });
            PStorage.save({
                key: `${Utils.action.myCards+id}`,
                data: {
                    cards:JSON.stringify({cards: cards})
                }
            });
        },
        updateAllCardsLocal: (lastUpdate,allCards,id,isSync)=>{
            PStorage.save({
                key: `${Utils.action.lastUpdate+id}`,
                data: `${lastUpdate}`
            });
            PStorage.save({
                key: `${Utils.action.allCards+id}`,
                data: {
                    cards:JSON.stringify({cards: allCards})
                }
            });
            if(isSync){
                //TODO: sync
            }
        },
        updateAccountCard: (card,id) => {
            PStorage.save({
                key: `${card.cardId+id}`,
                data: {
                    card:JSON.stringify(card)
                }
            });
        },
        deleteAccountCard: (cardId,id)=>{
            PStorage.remove({
                key: `${cardId+id}`
            });
        }
    }
};

export default Utils;