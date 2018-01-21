import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Slider,
    ScrollView
} from 'react-native';
import PropTypes from 'prop-types';
import {responsiveFontSize} from "../../../responsive/responsive";

import Modal from 'react-native-modal';
import { Sae } from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ripple from 'react-native-material-ripple';
import { ThemeProvider } from 'react-native-material-ui';
import Button from 'apsl-react-native-button';

import Utils from '../../../../../common/util';

export default class CardTextControl extends Component{
    constructor(props) {
        super(props);

        this.state = {
            index: -1,
            card: {width:0,height:0},
            size:{width:0,height:0},
            locationText: {left:'',top:'',right:'',bottom:''},
            component: null,
            editProperty: null,
            content: {
                size: 'Size',
                tag: 'Tag',
                x: 'X Axis',
                y: 'Y Axis',
                left: 'Position to Left (%)',
                right: 'Position to Right (%)',
                top: 'Position to Top (%)',
                bottom: 'Position to Bottom (%)',
                position: 'Position: ',
                delete: 'Delete Component'
            }
        };

        this.setEdit = this.setEdit.bind(this);
        this.locationToBeUpdate = this.locationToBeUpdate.bind(this);
        this.updateImageSize = this.updateImageSize.bind(this);
        this.updateInputProperty = this.updateInputProperty.bind(this);
        this.updateInputLocation = this.updateInputLocation.bind(this);
    }

    componentWillMount(){
        this.setState({
            card: this.props.card
        })
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            card: nextProps.card
        })
    }

    setEdit(index, component, size){
        if(component === null){
            this.setState({
                index: index,
                component: component
            });
        }else {
            this.setState({
                index: index,
                locationText: {
                    left: component.location.left.toFixed(2),
                    top: component.location.top.toFixed(2),
                    right: (100-component.location.left-size.width/this.state.card.width*100).toFixed(2),
                    bottom: (100-component.location.top-size.height/this.state.card.height*100).toFixed(2)
                },
                size:size,
                component: component
            });
        }
    }

    locationToBeUpdate(component){
        this.setState({
            locationText: {
                left: component.location.left.toFixed(2),
                top: component.location.top.toFixed(2),
                right: (100-component.location.left-component.property.width*100).toFixed(2),
                bottom: (100-component.location.top-this.state.size.height/this.state.card.height*100).toFixed(2)
            },
            component: component
        })
    }

    //update function
    updateImageSize(value, isToParent){
        let temp = this.state.component;
        temp.property.width = Number(value.toFixed(2));
        let size = this.state.size;
        size.width = this.state.card.width*value;
        size.height = size.width/this.state.component.property.whRatio;
        let tempLocation = this.state.locationText;
        tempLocation.right = (100-this.state.component.location.left-value*100).toFixed(2);
        tempLocation.bottom = (100-this.state.component.location.left - size.height/this.state.card.height*100).toFixed(2);
        this.setState({size: size,locationText: tempLocation,component: temp});
        if(isToParent){
            this.props.setParentComponentProperty(this.state.index,temp)
        }else {
            this.props.setContentProperty(this.state.index, temp);
        }
    }

    updateInputProperty(value,isToParent){
        let temp = this.state.component;
        if(isToParent){
            this.setState({
                editProperty: null
            });
            this.props.setParentComponentProperty(this.state.index,temp);
        }else{
            switch (this.state.editProperty) {
                case 'tag':
                    temp.tag = value;
                    break;
            }
            this.setState({
                component: temp
            });
            this.props.setContentProperty(this.state.index,temp);
        }
    }

    updateInputLocation(value, isToParent) {
        if(isToParent){
            this.setState({
                editProperty: null
            });
            this.props.setParentComponentProperty(this.state.index,this.state.component);
        }else {
            if (value.length === 0) {
                value = '0';
            }
            let isToUpdate = true;
            if (!isNaN(value)) {
                let v = Number(value);
                isToUpdate = (v <= 100 && v >= 0);
            } else {
                isToUpdate = false;
            }
            if (isToUpdate) {
                let tempLocationText = this.state.locationText;
                let temp = this.state.component;
                switch (this.state.editProperty) {
                    case 'left':
                        tempLocationText.left = value;
                        temp.location.left = Number(value);
                        break;
                    case 'right':
                        let r = 100 - Number(value) - this.state.size.width/this.state.card.width*100;
                        tempLocationText.left = r.toFixed(2);
                        tempLocationText.right = value;
                        temp.location.left = r;
                        break;
                    case 'top':
                        tempLocationText.top = value;
                        temp.location.top = Number(value);
                        break;
                    case 'bottom':
                        let b = 100 - Number(value) - this.state.size.height/this.state.card.height*100;
                        tempLocationText.top = b.toFixed(2);
                        tempLocationText.bottom = value;
                        temp.location.top = b;
                }
                this.setState({
                    locationText: tempLocationText
                });
                this.props.setContentProperty(this.state.index, temp);
            } else {
                this.setState({
                    locationText: this.state.locationText
                })
            }
        }
    }

    render(){
        if(this.state.component === null){
            return(<View/>);
        }else if(this.state.component.type === 'img'){
            return(
                <ThemeProvider uiTheme={Utils.MaterialUITheme}>
                    <ScrollView style={[styles.controlPanel]}>
                        <View style={[styles.fullLength,styles.row,styles.attrControl]}>
                            <View style={[{flex: 2}]}>
                                <Text style={styles.attrTitle}>{this.state.content.size}:</Text>
                            </View>
                            <View style={{flex:2}}>
                                <Text style={styles.attrTitle}>{this.state.component.property.width.toFixed(2)}</Text>
                            </View>
                            <View style={[{flex: 8}]}>
                                <Slider step={0.02} minimumValue={0.1} maximumValue={0.8} value={this.state.component.property.width}
                                        onValueChange={(value)=> this.updateImageSize(value,false)} onSlidingComplete={(value)=> this.updateImageSize(value,true)}/>
                            </View>
                        </View>
                        <View style={[styles.fullLength,styles.row,styles.attrControl]}>
                            <Ripple onPress={()=>this.setState({editProperty: 'left'})} style={{flex: 4}}>
                                <Sae
                                    label={this.state.content.left}
                                    iconClass={FontAwesomeIcon}
                                    iconName={'pencil'}
                                    iconColor={Utils.colors.primaryColor}
                                    labelStyle={styles.input}
                                    inputStyle={styles.input}
                                    editable={false}
                                    value={this.state.locationText.left}
                                />
                            </Ripple>
                            <View style={{flex:1}}/>
                            <Ripple onPress={()=>this.setState({editProperty: 'right'})} style={{flex: 4}}>
                                <Sae
                                    label={this.state.content.right}
                                    iconClass={FontAwesomeIcon}
                                    iconName={'pencil'}
                                    iconColor={Utils.colors.primaryColor}
                                    inputStyle={styles.input}
                                    labelStyle={styles.input}
                                    editable={false}
                                    value={this.state.locationText.right}
                                />
                            </Ripple>
                        </View>
                        <View style={[styles.fullLength,styles.row,styles.attrControl]}>
                            <Ripple onPress={()=>this.setState({editProperty: 'top'})}  style={{flex: 4}}>
                                <Sae
                                    label={this.state.content.top}
                                    iconClass={FontAwesomeIcon}
                                    iconName={'pencil'}
                                    iconColor={Utils.colors.primaryColor}
                                    labelStyle={styles.input}
                                    inputStyle={styles.input}
                                    editable={false}
                                    value={this.state.locationText.top}
                                />
                            </Ripple>
                            <View style={{flex:1}}/>
                            <Ripple onPress={()=>this.setState({editProperty: 'bottom'})} style={{flex: 4}}>
                                <Sae
                                    label={this.state.content.bottom}
                                    iconClass={FontAwesomeIcon}
                                    iconName={'pencil'}
                                    iconColor={Utils.colors.primaryColor}
                                    inputStyle={styles.input}
                                    labelStyle={styles.input}
                                    editable={false}
                                    value={this.state.locationText.bottom}
                                />
                            </Ripple>
                        </View>
                        <View style={[styles.fullLength,styles.column,styles.attrControl]}>
                            <Ripple onPress={()=>this.setState({editProperty: 'tag'})}>
                                <Sae
                                    label={this.state.content.tag}
                                    iconClass={FontAwesomeIcon}
                                    iconName={'pencil'}
                                    iconColor={Utils.colors.primaryColor}
                                    labelStyle={styles.input}
                                    inputStyle={styles.input}
                                    editable={false}
                                    value={this.state.component.tag}
                                />
                            </Ripple>
                        </View>
                        <View style={[styles.fullLength,styles.attrControl,{marginBottom: 30,marginTop:30}]}>
                            <Button style={[styles.buttonStyle]} onPress={() => this.props.deleteComponent(this.state.index)}>
                                <Text style={{textAlign: 'center', fontWeight: 'normal',fontSize:responsiveFontSize(1.9)}}>
                                    {this.state.content.delete}
                                </Text>
                            </Button>
                        </View>
                        <Modal  isVisible={this.state.editProperty === 'tag'} animationInTiming={300} animationOutTiming={300}
                                animationIn={'fadeIn'}
                                animationOut={'fadeOut'}
                                onBackButtonPress={() => this.updateInputProperty("",true)}
                                onBackdropPress={() => this.updateInputProperty("",true)}>
                            <Sae
                                label={this.state.content.tag}
                                iconClass={FontAwesomeIcon}
                                iconName={'pencil'}
                                iconColor={'white'}
                                labelStyle={[styles.input,{color: 'white'}]}
                                inputStyle={[styles.input,{color: 'white'}]}
                                value={this.state.component.tag}
                                onChangeText={(value) => this.updateInputProperty(value,false)}
                            />
                        </Modal>
                        <Modal  isVisible={this.state.editProperty === 'left'} animationInTiming={300} animationOutTiming={300}
                                animationIn={'fadeIn'}
                                animationOut={'fadeOut'}
                                onBackButtonPress={() => this.updateInputLocation("",true)}
                                onBackdropPress={() => this.updateInputLocation("",true)}>
                            <Sae
                                label={this.state.content.left}
                                iconClass={FontAwesomeIcon}
                                iconName={'pencil'}
                                iconColor={'white'}
                                labelStyle={[styles.input,{color: 'white'}]}
                                inputStyle={[styles.input,{color: 'white'}]}
                                value={this.state.locationText.left}
                                keyboardType={"numeric"}
                                onChangeText={(value) => this.updateInputLocation(value,false)}
                            />
                        </Modal>
                        <Modal  isVisible={this.state.editProperty === 'right'} animationInTiming={300} animationOutTiming={300}
                                animationIn={'fadeIn'}
                                animationOut={'fadeOut'}
                                onBackButtonPress={() => this.updateInputLocation("",true)}
                                onBackdropPress={() => this.updateInputLocation("",true)}>
                            <Sae
                                label={this.state.content.right}
                                iconClass={FontAwesomeIcon}
                                iconName={'pencil'}
                                iconColor={'white'}
                                labelStyle={[styles.input,{color: 'white'}]}
                                inputStyle={[styles.input,{color: 'white'}]}
                                value={this.state.locationText.right}
                                keyboardType={"numeric"}
                                onChangeText={(value) => this.updateInputLocation(value,false)}
                            />
                        </Modal>
                        <Modal  isVisible={this.state.editProperty === 'top'} animationInTiming={300} animationOutTiming={300}
                                animationIn={'fadeIn'}
                                animationOut={'fadeOut'}
                                onBackButtonPress={() => this.updateInputLocation("",true)}
                                onBackdropPress={() => this.updateInputLocation("",true)}>
                            <Sae
                                label={this.state.content.top}
                                iconClass={FontAwesomeIcon}
                                iconName={'pencil'}
                                iconColor={'white'}
                                labelStyle={[styles.input,{color: 'white'}]}
                                inputStyle={[styles.input,{color: 'white'}]}
                                value={this.state.locationText.top}
                                keyboardType={"numeric"}
                                onChangeText={(value) => this.updateInputLocation(value,false)}
                            />
                        </Modal>
                        <Modal  isVisible={this.state.editProperty === 'bottom'} animationInTiming={300} animationOutTiming={300}
                                animationIn={'fadeIn'}
                                animationOut={'fadeOut'}
                                onBackButtonPress={() => this.updateInputLocation("",true)}
                                onBackdropPress={() => this.updateInputLocation("",true)}>
                            <Sae
                                label={this.state.content.bottom}
                                iconClass={FontAwesomeIcon}
                                iconName={'pencil'}
                                iconColor={'white'}
                                labelStyle={[styles.input,{color: 'white'}]}
                                inputStyle={[styles.input,{color: 'white'}]}
                                value={this.state.locationText.bottom}
                                keyboardType={"numeric"}
                                onChangeText={(value) => this.updateInputLocation(value,false)}
                            />
                        </Modal>
                    </ScrollView>
                </ThemeProvider>
            );
        }else{
            return(<View/>);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fullLength:{
        width: Utils.size.width
    },
    controlPanel: {
        width: Utils.size.width,
        height: Utils.size.height * 0.925 - (Utils.size.width / Utils.ratio),
        paddingBottom: 25
    },
    row: {
        flexDirection: 'row'
    },
    column: {
        flexDirection:'column'
    },
    attrTitle: {
        fontWeight:'bold',
        fontSize: responsiveFontSize(2),
        color: Utils.colors.secondaryColor
    },
    attrControl: {
        paddingLeft: Utils.size.width*0.05,
        paddingRight: Utils.size.width*0.05,
        marginTop: Utils.size.height*0.02
    },
    input: {
        fontSize: responsiveFontSize(2),
        color: Utils.colors.secondaryColor
    },
    picker: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    buttonStyle: {
        borderColor: '#333',
        borderWidth: 2,
        borderRadius: 22,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

CardTextControl.propTypes = {
    card: PropTypes.object,
    setContentProperty: PropTypes.func,
    setParentComponentProperty: PropTypes.func,
    deleteComponent: PropTypes.func
};