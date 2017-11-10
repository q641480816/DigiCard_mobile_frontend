import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import PropTypes from 'prop-types';
import {responsiveFontSize} from "../../component/responsive/responsive";

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ripple from 'react-native-material-ripple';
import Spinner from 'react-native-spinkit';

import Utils from '../../../common/util';
import ElevatedView from "../../component/elevatedView/ElevatedView";

export default class Toolbar extends Component{
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            rightElement: null,
            rightText: null,
            loading: null,
            isLoadingShow: false
        };

        this.setLoadingShow = this.setLoadingShow.bind(this);
        this.rightClick = this.rightClick.bind(this);
    }

    componentWillMount(){
        this.setState({
            title: this.props.title,
            rightElement: this.props.rightElement,
            loading: this.props.loading,
            rightText: this.props.rightText
        });
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            title: nextProps.title,
            rightElement: nextProps.rightElement,
            loading: nextProps.loading,
            rightText: nextProps.rightText
        });
    }

    setLoadingShow(isShow){
        this.setState({
            isLoadingShow: isShow
        })
    }

    rightClick(){
        if(typeof (this.props.rightElementAction) !== 'undefined'){
            this.props.rightElementAction();
        }
    }

    render(){
        if(this.state.loading) {
            if (this.state.rightElement === null) {
                if(this.state.rightText !== null){
                    return (
                        <ElevatedView elevation={3} style={styles.top}>
                            <Text style={styles.title}>{this.state.title}</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <Spinner isVisible={this.state.isLoadingShow} size={Utils.size.height * 0.055} type={'Circle'}
                                         color={Utils.colors.tertiaryColor}/>
                                <Ripple onPress={()=> this.props.rightElementAction()} style={{height:Utils.size.height*0.075,justifyContent:'center'}}>
                                    <Text style={[styles.title,{color: Utils.colors.tertiaryColor,marginRight:20}]}>{this.state.rightText}</Text>
                                </Ripple>
                            </View>
                        </ElevatedView>
                    );
                }else{
                    return(
                        <ElevatedView elevation={3} style={styles.top}>
                            <Text style={styles.title}>{this.state.title}</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <Spinner isVisible={this.state.isLoadingShow} size={Utils.size.height * 0.055} type={'Circle'}
                                         color={Utils.colors.tertiaryColor}/>
                            </View>
                        </ElevatedView>
                    );
                }
            } else {
                return (
                    <ElevatedView elevation={3} style={styles.top}>
                        <Text style={styles.title}>{this.state.title}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <Spinner isVisible={this.state.isLoadingShow} size={Utils.size.height * 0.055} type={'Circle'}
                                     color={Utils.colors.tertiaryColor}/>
                            <Ripple onPress={()=>this.rightClick()}>
                                <EvilIcons name={this.state.rightElement} color={Utils.colors.tertiaryColor}
                                           size={responsiveFontSize(5)}/>
                            </Ripple>
                        </View>
                    </ElevatedView>
                );
            }
        }else{
            if (this.state.rightElement === null) {
                if(this.state.rightText === null){
                    return (
                        <ElevatedView elevation={3} style={styles.top}>
                            <Text style={styles.title}>{this.state.title}</Text>
                            <Ripple onPress={()=> this.props.rightElementAction()} style={{height:Utils.size.height*0.075,justifyContent:'center'}}>
                                <Text style={[styles.title,{color: Utils.colors.tertiaryColor,marginRight:20}]}>{this.state.rightText}</Text>
                            </Ripple>
                        </ElevatedView>
                    );
                }else{
                    return(
                        <ElevatedView elevation={3} style={styles.top}>
                            <Text style={styles.title}>{this.state.title}</Text>
                        </ElevatedView>
                    );
                }
            } else {
                return (
                    <ElevatedView elevation={3} style={styles.top}>
                        <Text style={styles.title}>{this.state.title}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <Ripple onPress={()=>this.rightClick()}>
                                <EvilIcons name={this.state.rightElement} color={Utils.colors.tertiaryColor}
                                           size={responsiveFontSize(5)}/>
                            </Ripple>
                        </View>
                    </ElevatedView>
                );
            }
        }
    }
}

const styles = StyleSheet.create({
    top:{
        width:Utils.size.width,
        height:Utils.size.height*0.075,
        backgroundColor: Utils.colors.primaryColor,
        flexDirection: 'row',
        justifyContent:"space-between",
        alignItems:'center'
    },
    title:{
        fontSize: responsiveFontSize(2.5),
        color: 'white',
        marginLeft: 20
    }
});

Toolbar.propTypes = {
    title: PropTypes.string.isRequired,
    rightElement: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    rightElementAction: PropTypes.func,
    rightText: PropTypes.string
};