import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Animated,
    Text,
    TouchableWithoutFeedback,
    Easing,
    TextInput
} from 'react-native';
import PropTypes from 'prop-types';
import { responsiveFontSize } from '../../component/responsive/responsive';

import EvilIcons from "react-native-vector-icons/EvilIcons";

import Utils from "../../../common/util";

export default class Search extends Component{

    constructor(props) {
        super(props);

        this.state = {
            isSearch: false,
            searchKey: '',
            placeholder: '',
            cancel: '',
            config: {
                barWidth: new Animated.Value(Utils.size.width),
                boxRightMargin: new Animated.Value(5)
            },
            content: {

            }
        };

        this.onFocus = this.onFocus.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
    }

    componentWillMount(){
        this.setState({
            placeholder: this.props.placeholder,
            cancel: this.props.cancel
        });
    }

    onFocus(){
        if(!this.state.isSearch) {
            this.setState({isSearch: true});
            Animated.parallel([
                Animated.timing(this.state.config.barWidth, {
                    toValue: Utils.size.width-70,
                    duration: 300,
                    easing: Easing.spring
                }),
                Animated.timing(this.state.config.boxRightMargin, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.spring
                })
            ]).start(() => console.log(""));
        }
    }

    onCancel(){
        this.setState({isSearch: false,searchKey: ''});
        Animated.parallel([
            Animated.timing(this.state.config.barWidth, {
                toValue: Utils.size.width,
                duration: 300,
                easing: Easing.spring
            }),
            Animated.timing(this.state.config.boxRightMargin, {
                toValue: 5,
                duration: 300,
                easing: Easing.spring
            })
        ]).start(() => console.log(""));
    }

    onTextChange(text){

    }

    render(){
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={()=>{this.onFocus()}}>
                    <Animated.View style={[styles.searchBox,{width: this.state.config.barWidth}]}>
                        <Animated.View style={[styles.searchBody,{alignItems: this.state.isSearch? 'flex-start':'center',marginRight: this.state.config.boxRightMargin}]}>
                            <View style={{flexDirection:"row",alignItems:"center", justifyContent:"center"}}>
                                <EvilIcons name={'search'} size={30}/>
                                <TextInput style={{marginLeft: 1, fontSize: responsiveFontSize(2), display: !this.state.isSearch? "none":'flex', width: Utils.size.width-100}}
                                           placeholder={this.state.placeholder}
                                           underlineColorAndroid={'transparent'}
                                           onChangeText={(text) => this.onTextChange(text)}
                                />
                            </View>
                        </Animated.View>
                    </Animated.View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={()=>{this.onCancel()}}>
                    <View style={{height: 35, width:70, alignItems: 'center',justifyContent:'center'}}>
                        <Text style={{fontSize: responsiveFontSize(2),color: Utils.colors.tertiaryColor}}>{this.state.cancel}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchBox : {
        height: 40,
        backgroundColor:'white',
        flexDirection:'row',
        alignItems:'flex-start',
        justifyContent:'center'
    },
    searchBody: {
        flex: 1,
        marginLeft:5,
        marginBottom: 3.5,
        marginTop: 3.5,
        backgroundColor:'#E0E0E0',
        borderRadius:2,
        height:35,
        justifyContent:'center',
    }
});

Search.propTypes = {
    placeholder: PropTypes.string.isRequired,
    cancel: PropTypes.string.isRequired
};