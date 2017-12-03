import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Animated,
    Text,
    TouchableWithoutFeedback,
    Easing,
    TextInput,
    Image
} from 'react-native';
import PropTypes from 'prop-types';
import { responsiveFontSize } from '../../component/responsive/responsive';

import Utils from "../../../common/util";
import Data from "../../../common/Data";

export default class Search extends Component{

    constructor(props) {
        super(props);

        this.state = {
            isSearch: false,
            searchKey: '',
            placeholder: '',
            cancel: '',
            config: {
                iconMatrix: 24,
                barWidth: new Animated.Value(Utils.size.width),
                cancelSize: 70,
                inputMargin: new Animated.Value(Utils.size.width/2-24/2-5)
            },
            content: {

            }
        };

        this.onFocus = this.onFocus.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    componentWillMount(){
        this.setState({
            placeholder: this.props.placeholder,
            cancel: this.props.cancel
        });
    }

    onFocus(){
        if(!this.state.isSearch) {
            this.props.onFocus();
            this.setState({isSearch: true});
            Animated.parallel([
                Animated.timing(this.state.config.barWidth, {
                    toValue: Utils.size.width-this.state.config.cancelSize,
                    duration: 300,
                    easing: Easing.spring
                }),
                Animated.timing(this.state.config.inputMargin, {
                    toValue: 5,
                    duration: 300,
                    easing: Easing.spring
                })
            ]).start(() => this.refs.search.focus());
        }
    }

    onCancel(){
        this.props.onCancel();
        this.setState({isSearch: false,searchKey: ''});
        Animated.parallel([
            Animated.timing(this.state.config.barWidth, {
                toValue: Utils.size.width,
                duration: 300,
                easing: Easing.spring
            }),
            Animated.timing(this.state.config.inputMargin, {
                toValue: Utils.size.width/2-24/2-5,
                duration: 300,
                easing: Easing.spring
            })
        ]).start(() => console.log(""));
    }

    onTextChange(text){
        this.props.onTextChange(text);
        this.setState({searchKey: text});
    }

    onDelete(){
        this.props.onTextChange('');
        this.setState({searchKey: ''});
    }

    render(){
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={()=>{this.onFocus()}}>
                    <Animated.View style={[styles.searchBox,{width: this.state.config.barWidth}]}>
                        <Animated.View style={[styles.searchBody]}>
                            <View style={{flexDirection:"row",alignItems:"center",height:32}}>
                                <Animated.Image
                                    style={{width: this.state.config.iconMatrix, height: this.state.config.iconMatrix,marginLeft:this.state.config.inputMargin}}
                                    source={{uri: Data.searchIcon}}
                                />
                                <TextInput ref={'search'} style={{
                                    marginLeft: 5,
                                    display: !this.state.isSearch? "none":'flex',
                                    width: Utils.size.width,
                                    padding:0,
                                    margin:0
                                }}
                                           placeholder={this.state.placeholder}
                                           underlineColorAndroid={'transparent'}
                                           value={this.state.searchKey}
                                           onChangeText={(text) => this.onTextChange(text)}
                                />
                                <TouchableWithoutFeedback onPress={()=>this.setState({searchKey: ''})}>
                                    <Image style={{
                                        position:'absolute',
                                        width: this.state.config.iconMatrix-4,
                                        height: this.state.config.iconMatrix-4,
                                        display: !this.state.isSearch? "none":'flex',
                                        right:5
                                    }}
                                           source={{uri: Data.deleteIcon}}
                                    />
                                </TouchableWithoutFeedback>
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
        marginRight: 5,
        marginTop: 3.5,
        backgroundColor:'#E0E0E0',
        borderRadius:2,
        height:32,
        justifyContent:'center',
    }
});

Search.propTypes = {
    placeholder: PropTypes.string.isRequired,
    cancel: PropTypes.string.isRequired,
    onFocus: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onTextChange: PropTypes.func.isRequired
};