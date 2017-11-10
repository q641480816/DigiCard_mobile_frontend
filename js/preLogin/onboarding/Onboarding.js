import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import {responsiveFontSize} from "../../main/component/responsive/responsive";
import Orientation from 'react-native-orientation';

import LinearGradient from 'react-native-linear-gradient';
import Button from 'apsl-react-native-button';

import Utils from '../../common/util';

export default class Onboarding extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: {
                bigTitle: 'Digi Card',
                subTitle: 'Boost your Business',
                join: 'Join Today!',
                SignIn: 'Sign in with Email',
                middleText: 'Or you have an account'
            }
        };

        this.redirect = this.redirect.bind(this);
    }

    componentDidMount() {
        Orientation.lockToPortrait();
    }

    redirect(page){
        this.props.navigation.navigate(page);
    }

    render(){
        return(
            <View style={styles.container}>
                <LinearGradient colors={['#B0C4DE', '#FBFBFF']}
                                style={[styles.fullLength,{height:Utils.size.height*2/5,position:'absolute',top:0}]}
                />
                <View style={styles.fullSize}>
                    <View style={styles.top}>
                        <Text style={[styles.titleText,{fontSize: responsiveFontSize(5.5)}]}>
                            {this.state.content.bigTitle}
                        </Text>
                        <Text style={[styles.titleText,{fontSize: responsiveFontSize(2.25), fontWeight:'normal', marginTop: 10}]}>
                            {this.state.content.subTitle}
                        </Text>
                    </View>
                    <View style={styles.bottom}>
                        <View style={{flex:1}}/>
                        <View style={[{width:Utils.size.width*0.9,flex:4}]}>
                            <Button style={[styles.buttonStyle,{marginBottom:20}]} onPress={() => this.redirect("Registration")}>
                                <Text style={{textAlign: 'center', fontWeight: 'bold',fontSize:responsiveFontSize(1.9)}}>
                                    {this.state.content.join}
                                </Text>
                            </Button>
                            <Button style={[styles.buttonStyle]} onPress={() => this.redirect("Login")}>
                                <Text style={{textAlign: 'center', fontWeight: 'normal',fontSize:responsiveFontSize(1.9)}}>
                                    {this.state.content.SignIn}
                                </Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Utils.size.width,
        height: Utils.size.height,
        flexDirection: 'column',
        backgroundColor: '#FBFBFF'
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
        flex: 2,
        width: Utils.size.width,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems:'center'
    },
    bottom: {
        flex: 3,
        width: Utils.size.width,
        flexDirection: 'column',
        alignItems: 'center'
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