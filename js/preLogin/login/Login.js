import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import {responsiveFontSize} from "../../main/component/responsive/responsive";

import LinearGradient from "react-native-linear-gradient";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Sae } from 'react-native-textinput-effects';
import Button from 'apsl-react-native-button';
import Spinner from 'react-native-spinkit';

import PStorage from '../../common/persistantStorage';
import Utils from '../../common/util';
import Toast from "../../main/component/toast/Toast";

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content:{
                bigTitle: "Login",
                SignIn: 'Log in >',
                forget: 'Forget Password'
            },
            account: {
                email: "",
                password: ''
            },
            isLoginning: false
        };

        this.login = this.login.bind(this);
        this.saveUser = this.saveUser.bind(this);
    }

    componentWillMount(){
        PStorage.load({
            key: 'account'
        }).then(ret => {
            this.setState({account:{email:ret.email,password:''}});
        }).catch(err=>{
            console.log(err);
        })
    }

    login(){
        if (!this.state.isLoginning) {
            this.setState({isLoginning: true});
            let url = Utils.baseURL + 'authentication';
            fetch(`${url}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.account.email,
                    password: this.state.account.password
                })
            }).then((response) => response.text()).then((responseText) => {
                let response = JSON.parse(responseText);
                if(response.status === 1){
                    Utils.account = response.data;
                    this.saveUser();
                    this.props.navigation.dispatch(resetAction);
                }else{
                    this.refs.toast.show(response.message);
                    this.setState({isLoginning: false});
                }
            }).catch((err)=>{
                console.log(err);
                this.setState({isLoginning: false});
            });
        }
    }

    saveUser(){
        PStorage.save({
            key: 'account',
            data: {
                email: this.state.account.email,
                password: this.state.account.password,
                status: true
            }
        });
    }

    render() {
        return (
            <TouchableWithoutFeedback style={styles.container}>
                <ScrollView style={[styles.fullSize,{backgroundColor: '#FBFBFF'}]}>
                    <LinearGradient colors={['#B0C4DE', '#FBFBFF']}
                                    style={[styles.fullLength,{height:Utils.size.height*2/5,position:'absolute',top:0}]}
                    />
                    <View style={styles.top}>
                        <Text style={[styles.titleText,{fontSize: responsiveFontSize(5.5)}]}>
                            {this.state.content.bigTitle}
                        </Text>
                    </View>
                    <View style={styles.bottom}>
                        <View style={[{width:Utils.size.width*0.9}]}>
                            <Sae
                                label={'Email Address'}
                                iconClass={MaterialIcons}
                                iconName={'email'}
                                iconColor={Utils.colors.tertiaryColor}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                inputStyle={{ color: Utils.colors.primaryColor}}
                                value={this.state.account.email}
                                onChangeText={(text) => { this.setState({account: {email:text,password:this.state.account.password}})}}
                            />
                            <Sae
                                label={'Password'}
                                iconClass={MaterialIcons}
                                iconName={'vpn-key'}
                                iconColor={Utils.colors.tertiaryColor}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                secureTextEntry={true}
                                style={{marginBottom: 25}}
                                value={this.state.account.password}
                                inputStyle={{ color: Utils.colors.primaryColor}}
                                onChangeText={(text) => { this.setState({account: {email:this.state.account.email,password:text}})}}
                            />
                            <Button style={[styles.buttonStyle]} onPress={() => this.login()}>
                                <Text style={{textAlign: 'center', fontWeight: 'normal',fontSize:responsiveFontSize(1.9),display:this.state.isLoginning?'none':'flex'}}>
                                    {this.state.content.SignIn}
                                </Text>
                                <View style={{display: this.state.isLoginning? 'flex':'none'}}>
                                    <Spinner type={'Bounce'} size={15} color={Utils.colors.tertiaryColor} isVisible={this.state.isLoginning}/>
                                </View>
                            </Button>
                            <View style={[{width:Utils.size.width*0.9},styles.rowCenter]}>
                                <TouchableOpacity style={styles.rowCenter} onPress={() => this.props.navigation.navigate("ForgetPassword")}>
                                    <Text style={{marginTop: 12.5}}>{this.state.content.forget}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <Toast ref={'toast'} duration={1000}/>
                </ScrollView>
            </TouchableWithoutFeedback>
        );
    }
}

const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'Home'}),
    ]
});

const styles = StyleSheet.create({
    container: {
        width: Utils.size.width,
        height: Utils.size.height,
        flexDirection: 'column',
    },
    fullLength:{
        width: Utils.size.width
    },
    fullSize: {
        width: Utils.size.width,
        height: Utils.size.height
    },
    rowCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    top: {
        height: Utils.size.height*2/5,
        width: Utils.size.width,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems:'center'
    },
    bottom: {
        width: Utils.size.width,
        height:Utils.size.height*5/11,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#FBFBFF'
    },
    titleText:{
        fontWeight: 'bold',
        color: Utils.colors.secondaryColor
    },
    buttonStyle: {
        borderColor: '#333',
        borderWidth: 2,
        borderRadius: 22,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
});
