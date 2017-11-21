import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Image,
    Text
} from 'react-native';
import { StackNavigator,NavigationActions} from 'react-navigation';

import Utils from './js/common/util';
import PStorage from './js/common/persistantStorage';
import Login from './js/preLogin/login/Login';
import Onboarding from './js/preLogin/onboarding/Onboarding';
import Registration from './js/preLogin/register/Registration';
import ForgetPassword from './js/preLogin/forgetPassword/ForgetPassword';
import Home from './js/main/home/Home';
import EditCard from './js/main/editCard/EditCard';
import CardDetail from './js/main/cardDetail/CardDetail';
import ReadQr from './js/main/readQR/ReadQr';
import Grouping from "./js/main/group/Grouping";
import ManageGroup from "./js/main/group/ManageGroup";

import TestEdit from './js/main/test/TestEdit';

class Landing extends Component {
    constructor(props) {
        super(props);

        this.redirect = this.redirect.bind(this);
        this.login = this.login.bind(this);
        this.saveUser = this.saveUser.bind(this);
    }

    componentDidMount(){
        this.redirect();
    }

    redirect(){
        setTimeout(() => {
            PStorage.load({
                key: 'account'
            }).then(ret => {
                if(!ret.status){
                    this.props.navigation.dispatch(resetNoAcc);
                }else{
                    this.login(ret.email,ret.password);
                }
            }).catch(err=>{
                this.props.navigation.dispatch(resetNoAcc);
                console.log(err);
            });
        }, 800);
    }

    login(email,password){
        let url = Utils.baseURL + 'authentication';
        fetch(`${url}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then((response) => response.text()).then((responseText) => {
            let response = JSON.parse(responseText);
            if(response.status === 1){
                Utils.account = response.data;
                this.saveUser(email,password);
                this.props.navigation.dispatch(resetLogin);
            }else{
                this.props.navigation.dispatch(resetNoAcc);
            }
        }).catch((err)=>{
            console.log(err);
            this.props.navigation.dispatch(resetLogin);
        });
    }

    saveUser(email,password){
        PStorage.save({
            key: 'account',
            data: {
                email: email,
                password: password,
                status: true
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>DigiCard</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'row'
    },
    logo : {
        transform: [
            {scaleY : 0.25},
            {scaleX : 0.25},
            {translateY : -150}
        ],
    }
});

const resetNoAcc = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'Onboarding'}),
    ]
});

const resetLogin = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'Home'}),
    ]
});

const DigiCard = StackNavigator({
    Landing: {
        screen: Landing,
        navigationOptions: ({navigation}) => ({
            header: null
        }),
    },
    Onboarding: {
        screen : Onboarding,
        navigationOptions: ({navigation}) => ({
            header: null
        }),
    },
    Login: {
        screen: Login,
        navigationOptions: ({navigation}) => ({
            header: null
        }),
    },
    ForgetPassword: {
        screen: ForgetPassword,
        navigationOptions: ({navigation}) => ({
            header: null
        }),
    },
    Registration: {
        screen: Registration,
        navigationOptions: ({navigation}) => ({
            header: null
        }),
    },
    Home: {
        screen: Home,
        navigationOptions: ({navigation}) => ({
            header: null
        }),
    },
    EditCard: {
        screen: EditCard,
        navigationOptions: ({navigation}) => ({
            header: null
        }),
    },
    CardDetail: {
        screen: CardDetail,
        navigationOptions: ({navigation}) => ({
            header: null
        }),
    },
    ReadQr: {
        screen: ReadQr,
        navigationOptions: ({navigation}) => ({
            header: null
        }),
    },
    ManageGroup: {
        screen: ManageGroup,
        navigationOptions: ({navigation}) => ({
            header: null
        }),
    },
    Grouping: {
        screen: Grouping,
        navigationOptions: ({navigation}) => ({
            header: null
        }),
    },
    TestEdit: {
        screen : TestEdit,
        navigationOptions: ({navigation}) => ({
            header: null
        }),
    }
});

const prevGetStateForActionHomeStack = DigiCard.router.getStateForAction;
DigiCard.router.getStateForAction = (action, state) => {
    if (state && action.type === 'ReplaceCurrentScreen') {
        let routes = [];
        if(state.routes.length > 1) {
            routes = state.routes.slice(0, state.routes.length - 1);
        }else{
            routes = state.routes;
        }
        routes.push(action);
        return {
            ...state,
            routes,
            index: routes.length - 1,
        };
    }
    return prevGetStateForActionHomeStack(action, state);
};

AppRegistry.registerComponent('DigiCard', () => DigiCard);
