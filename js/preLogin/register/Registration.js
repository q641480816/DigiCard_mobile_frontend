import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
    ScrollView,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import {responsiveFontSize} from "../../main/component/responsive/responsive";

import LinearGradient from "react-native-linear-gradient";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-spinkit';
import { Sae } from 'react-native-textinput-effects';
import Button from 'apsl-react-native-button';

import PStorage from '../../common/persistantStorage';
import Utils from '../../common/util';
import Toast from '../../main/component/toast/Toast';

export default class Registration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isActivation: false,
            isSubmitting: false,
            isActivationSubmitting: false,
            content:{
                bigTitle: "Register via Email",
                activeBidTitle: "Activation",
                Register: 'Register >',
                active: 'Active Account',
                email: 'Email Address',
                password: 'Password (At least 8 chars)',
                invalidEmail: 'Invalid Email',
                invalidPassword: 'Invalid Password'
            },
            account: {
                email: "",
                password: ''
            },
            activeCode:''
        };

        this.register = this.register.bind(this);
        this.active = this.active.bind(this);
        this.saveUser = this.saveUser.bind(this);
    }

    register() {
        if (!this.state.isSubmitting) {
            this.setState({isSubmitting: true});
            let isLegal = true;
            if(this.state.account.email.indexOf("@") < 0){
                this.refs.toast.show(this.state.content.invalidEmail);
                isLegal = false;
            }

            if(isLegal && this.state.account.password.length < 8){
                this.refs.toast.show(this.state.content.invalidPassword);
                isLegal = false;
            }

            if(isLegal){
                //Checking status
                let url = Utils.baseURL + 'accounts/';
                fetch(`${url}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: this.state.account.email,
                        password: this.state.account.password,
                    })
                }).then((response) => response.text()).then((responseText) => {
                    let response = JSON.parse(responseText);
                    if(response.status !== 0){
                        this.setState({isActivation:true});
                    }else{
                        this.refs.toast.show(response.message);
                        this.setState({isSubmitting: false});
                    }
                }).catch(function (err) {
                    this.setState({isSubmitting: false});
                    console.log(err);
                });
            }else{
                this.setState({isSubmitting: false});
            }
        }
    }

    active(){
        if (!this.state.isActivationSubmitting) {
            this.setState({isActivationSubmitting: true});
            let url = Utils.baseURL + 'activation/';
            fetch(`${url}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    activationKey: this.state.activeCode,
                })
            }).then((response) => response.text()).then((responseText) => {
                let response = JSON.parse(responseText);
                if(response.status === 1){
                    Utils.account = response.data;
                    this.saveUser();
                    this.props.navigation.dispatch(resetAction);
                }else{
                    this.refs.toast.show(response.message);
                    this.setState({isActivationSubmitting: false,activeCode: ''});
                }
            }).catch((err)=>{
                console.log(err);
                this.setState({isActivationSubmitting: false});
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
            <TouchableWithoutFeedback>
                <ScrollView style={[styles.fullLength,{backgroundColor: '#FBFBFF'}]}>
                    <View>
                        <LinearGradient colors={['#B0C4DE', '#FBFBFF']}
                                        style={[styles.fullLength,{height:Utils.size.height*2/5,position:'absolute',top:0}]}
                        />
                        <View style={styles.top}>
                            <Text style={[styles.titleText,{fontSize: responsiveFontSize(5.5)}]}>
                                {this.state.isActivation?this.state.content.activeBidTitle:this.state.content.bigTitle}
                            </Text>
                        </View>
                        <View style={styles.bottom}>
                            <View style={[{width:Utils.size.width*0.9}]}>
                                <Sae
                                    label={this.state.content.email}
                                    iconClass={MaterialIcons}
                                    iconName={'email'}
                                    iconColor={Utils.colors.tertiaryColor}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    style={{display: this.state.isActivation?'none':'flex'}}
                                    inputStyle={{ color: Utils.colors.primaryColor}}
                                    onChangeText={(text) => { this.setState({account: {email:text,password:this.state.account.password}})}}
                                />
                                <Sae
                                    label={this.state.content.password}
                                    iconClass={MaterialIcons}
                                    iconName={'vpn-key'}
                                    iconColor={Utils.colors.tertiaryColor}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    secureTextEntry={true}
                                    style={{marginBottom: this.state.isActivation? 0:25,display: this.state.isActivation?'none':'flex'}}
                                    inputStyle={{ color: Utils.colors.primaryColor}}
                                    onChangeText={(text) => { this.setState({account: {email:this.state.account.email,password:text}})}}
                                />
                                <Sae
                                    label={'Activation Code'}
                                    iconClass={MaterialIcons}
                                    iconName={'vpn-key'}
                                    iconColor={Utils.colors.tertiaryColor}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    style={{marginBottom: 25,display: !this.state.isActivation?'none':'flex'}}
                                    inputStyle={{ color: Utils.colors.primaryColor}}
                                    value={this.state.activeCode}
                                    onChangeText={(text) => { this.setState({activeCode: text})}}
                                />
                                <Button style={[styles.buttonStyle,{display: this.state.isActivation?'none':'flex'}]} onPress={() => this.register()}>
                                    <Text style={{textAlign: 'center', fontWeight: 'normal',fontSize:responsiveFontSize(1.9),display: !this.state.isSubmitting? 'flex':'none'}}>
                                        {this.state.content.Register}
                                    </Text>
                                    <View style={{display: this.state.isSubmitting? 'flex':'none'}}>
                                        <Spinner type={'Bounce'} size={15} color={Utils.colors.tertiaryColor} isVisible={this.state.isSubmitting}/>
                                    </View>
                                </Button>
                                <Button style={[styles.buttonStyle,{display: !this.state.isActivation?'none':'flex'}]} onPress={() => this.active()}>
                                    <Text style={{textAlign: 'center', fontWeight: 'normal',fontSize:responsiveFontSize(1.9),display: !this.state.isActivationSubmitting? 'flex':'none'}}>
                                        {this.state.content.active}
                                    </Text>
                                    <View style={{display: this.state.isActivationSubmitting? 'flex':'none'}}>
                                        <Spinner type={'Bounce'} size={15} color={Utils.colors.tertiaryColor} isVisible={this.state.isActivationSubmitting}/>
                                    </View>
                                </Button>
                            </View>
                        </View>
                        <Toast ref={'toast'} duration={1000}/>
                    </View>
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


