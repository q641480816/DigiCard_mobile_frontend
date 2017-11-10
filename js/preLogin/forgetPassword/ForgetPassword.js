import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
    ScrollView,
} from 'react-native';
import {responsiveFontSize} from "../../main/component/responsive/responsive";

import LinearGradient from "react-native-linear-gradient";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Sae } from 'react-native-textinput-effects';
import Button from 'apsl-react-native-button';
import Spinner from 'react-native-spinkit';

import Utils from '../../common/util';

export default class ForgetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content:{
                bigTitle: "Forget Password",
                Request: 'Request authentication code >',
                reset: 'Reset'
            },
            account: {
                email: ""
            },
            password: {
                password:'',
                cPassword:''
            },
            isRequesting: false,
            secret: null
        };

        this.reset = this.reset.bind(this);
        this.request = this.request.bind(this);
    }

    request(){
        if (!this.state.isRequesting) {
            this.setState({isRequesting: true});
            let url = Utils.baseURL + 'forgetPassword';
            fetch(`${url}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.account.email,
                })
            }).then((response) => response.text()).then((responseText) => {
                let response = JSON.parse(responseText);
                if(response.status === 1){
                    this.setState({secret:response.data.secret})
                }else{
                    this.refs.toast.show(response.message);
                    this.setState({isRequesting: false});
                }
            }).catch((err)=>{
                console.log(err);
                this.setState({isRequesting: false});
            });
        }
        //this.setState({isAuthentication:true});
    }

    reset(){
        this.props.navigation.goBack(null);
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
                                style={{display: this.state.secret===null?'none':'flex'}}
                                inputStyle={{ color: Utils.colors.primaryColor}}
                                onChangeText={(text) => { this.setState({account: {email:text}})}}
                            />
                            <Sae
                                label={'New Password'}
                                iconClass={MaterialIcons}
                                iconName={'vpn-key'}
                                iconColor={Utils.colors.tertiaryColor}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                style={{marginBottom: 25,display: !this.state.secret===null?'none':'flex'}}
                                inputStyle={{ color: Utils.colors.primaryColor}}
                                value={this.state.password.password}
                                onChangeText={(text) => { this.setState({password: {password: text,cPassword:this.state.password.cPassword}})}}
                            />
                            <Sae
                                label={'Confirm Password'}
                                iconClass={MaterialIcons}
                                iconName={'vpn-key'}
                                iconColor={Utils.colors.tertiaryColor}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                style={{marginBottom: 25,display: !this.state.secret===null?'none':'flex'}}
                                inputStyle={{ color: Utils.colors.primaryColor}}
                                valur={this.state.password.cPassword}
                                onChangeText={(text) => { this.setState({password: {password: this.state.password.password,cPassword:text}})}}
                            />
                            <Button style={[styles.buttonStyle,{display: this.state.secret?'none':'flex'}]} onPress={() => this.request()}>
                                <Text style={{textAlign: 'center', fontWeight: 'normal',fontSize:responsiveFontSize(1.9),display: !this.state.isRequesting}}>
                                    {this.state.content.Request}
                                </Text>
                                <View style={{display: this.state.isRequesting? 'flex':'none'}}>
                                    <Spinner type={'Bounce'} size={15} color={Utils.colors.tertiaryColor} isVisible={this.state.isRequesting}/>
                                </View>
                            </Button>
                            <Button style={[styles.buttonStyle,{display: !this.state.secret?'none':'flex'}]} onPress={() => this.reset()}>
                                <Text style={{textAlign: 'center', fontWeight: 'normal',fontSize:responsiveFontSize(1.9)}}>
                                    {this.state.content.reset}
                                </Text>
                            </Button>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        );
    }
}

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


