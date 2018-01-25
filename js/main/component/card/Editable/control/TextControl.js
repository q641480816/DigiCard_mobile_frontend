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

import { Sae } from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ripple from 'react-native-material-ripple';
import { Checkbox, ThemeProvider } from 'react-native-material-ui';
import Button from 'apsl-react-native-button';

import Utils from '../../../../../common/util';
import Modal from '../../../../component/modal/ModalFarme';
import ColorPicker from './component/ColorPicker';
import FontFamilyPicker from './component/FontFamilyPicker';

export default class CardTextControl extends Component{
    constructor(props) {
        super(props);

        this.state = {
            index: -1,
            card: {width:0,height:0,unitFont:0},
            size:{width:0,height:0},
            locationText: {left:'',top:'',right:'',bottom:''},
            component: null,
            editProperty: null,
            content: {
                size: 'Size',
                color: 'color',
                fontFamily: 'Font Family',
                value: 'Value',
                tag: 'Tag',
                x: 'X Axis',
                y: 'Y Axis',
                left: 'Position to Left (%)',
                right: 'Position to Right (%)',
                top: 'Position to Top (%)',
                bottom: 'Position to Bottom (%)',
                position: 'Position: ',
                styling: 'Styling',
                bold: 'Bold',
                italic: 'Italic',
                underline: 'Underline',
                delete: 'Delete Component',
                valueWarning: 'At least one char is required for this field'
            }
        };

        this.measureView = this.measureView.bind(this);
        this.setEdit = this.setEdit.bind(this);
        this.locationToBeUpdate = this.locationToBeUpdate.bind(this);
        this.updateFontSize = this.updateFontSize.bind(this);
        this.updateInputProperty = this.updateInputProperty.bind(this);
        this.updateInputStyle = this.updateInputStyle.bind(this);
        this.updateInputLocation = this.updateInputLocation.bind(this);
        this.updatePicker = this.updatePicker.bind(this);
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

    measureView(event){
        let temp = this.state.locationText;
        temp.right = (100-this.state.component.location.left-event.nativeEvent.layout.width/this.state.card.width*100).toFixed(2);
        temp.bottom = (100-this.state.component.location.top-event.nativeEvent.layout.height/this.state.card.height*100).toFixed(2);
        this.setState({
            locationText: temp,
            size:{
                width: event.nativeEvent.layout.width,
                height: event.nativeEvent.layout.height
            }
        });
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
                component: component
            });
        }
    }

    locationToBeUpdate(component){
        this.setState({
            locationText: {
                left: component.location.left.toFixed(2),
                top: component.location.top.toFixed(2),
                right: (100-component.location.left-this.state.size.width/this.state.card.width*100).toFixed(2),
                bottom: (100-component.location.top-this.state.size.height/this.state.card.height*100).toFixed(2)
            },
            component: component
        })
    }

    //update function
    updateFontSize(value,isToParent){
        let temp = this.state.component;
        temp.property.fontSize = Number(value.toFixed(1));
        this.setState({component: temp});
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
            if(temp.value.length === 0){
                temp.value = 'Edit';
            }
            this.props.setParentComponentProperty(this.state.index,temp);
        }else{
            switch (this.state.editProperty) {
                case 'value':
                    temp.value = value;
                    break;
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

    updateInputStyle(value, action){
        let temp = this.state.component;
        switch (action){
            case 'fontWeight':
                temp.property.fontWeight = (value? 'bold':'normal');
                break;
            case 'fontStyle' :
                temp.property.fontStyle = (value? 'italic':'normal');
                break;
            case 'textDecorationLine' :
                temp.property.textDecorationLine = (value? 'underline':'none');
                break;
        }
        this.props.setParentComponentProperty(this.state.index,temp);
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

    updatePicker(value,isToParent){
        let temp = this.state.component;
        switch (this.state.editProperty) {
            case 'color':
                temp.property.color = value;
                break;
            case 'font':
                temp.property.fontFamily = value;
                break;
        }
        //update
        if(isToParent){
            this.setState({
                editProperty: null
            });
            this.props.setParentComponentProperty(this.state.index,temp);
        }else{
            this.props.setContentProperty(this.state.index,temp);
        }
    }

    render(){
        if(this.state.component === null) {
            return (
                <View/>
            );
        }else if(this.state.component.type === 'text'){
            return(
                <ThemeProvider uiTheme={Utils.MaterialUITheme}>
                    <ScrollView style={[styles.controlPanel]}>
                        <View style={[styles.fullLength,styles.column,styles.attrControl,{marginTop: Utils.size.height*0.04}]}>
                        <Ripple onPress={()=>this.setState({editProperty: 'value'})}>
                            <Sae
                                label={this.state.content.value}
                                iconClass={FontAwesomeIcon}
                                iconName={'pencil'}
                                iconColor={Utils.colors.primaryColor}
                                labelStyle={styles.input}
                                inputStyle={styles.input}
                                editable={false}
                                value={this.state.component.value}
                            />
                        </Ripple>
                    </View>
                        <View style={[styles.fullLength,styles.column,styles.attrControl]}>
                            <Ripple onPress={()=>{if(!this.state.component.flag){this.setState({editProperty: 'tag'})}}}>
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
                        <View style={[styles.fullLength,styles.row,styles.attrControl]}>
                            <View style={[{flex: 2}]}>
                                <Text style={styles.attrTitle}>{this.state.content.color}:</Text>
                            </View>
                            <Ripple style={{flex:5}} onPress={()=>this.setState({editProperty: 'color'})}>
                                <Text style={[styles.attrTitle,{color: this.state.component.property.color,textDecorationLine:'underline'}]}>
                                    {this.state.component.property.color}
                                </Text>
                            </Ripple>
                        </View>
                        <View style={[styles.fullLength,styles.row,styles.attrControl]}>
                            <View style={[{flex: 2}]}>
                                <Text style={styles.attrTitle}>{this.state.content.fontFamily}:</Text>
                            </View>
                            <Ripple style={{flex:5}} onPress={()=>this.setState({editProperty: 'font'})}>
                                <Text style={[styles.attrTitle,{color: this.state.component.property.color,fontFamily: this.state.component.property.fontFamily}]}>
                                    {this.state.component.property.fontFamily}
                                </Text>
                            </Ripple>
                        </View>
                        <View style={[styles.fullLength,styles.row,styles.attrControl]}>
                            <View style={[{flex: 2}]}>
                                <Text style={styles.attrTitle}>{this.state.content.size}:</Text>
                            </View>
                            <View style={{flex:2}}>
                                <Text style={styles.attrTitle}>{this.state.component.property.fontSize.toFixed(1)}</Text>
                            </View>
                            <View style={[{flex: 8}]}>
                                <Slider step={0.2} minimumValue={2} maximumValue={6} value={this.state.component.property.fontSize}
                                        onValueChange={(value)=> this.updateFontSize(value,false)} onSlidingComplete={(value)=> this.updateFontSize(value,true)}/>
                            </View>
                        </View>
                        <View style={[styles.column,styles.attrControl,{marginBottom: 30}]}>
                            <View>
                                <Text style={styles.attrTitle}>{this.state.content.styling}</Text>
                            </View>
                            <View style={[styles.fullLength,styles.row,{marginTop: Utils.size.height*0.01}]}>
                                <View style={{flex:1}}>
                                    <Checkbox label={this.state.content.bold} checked={this.state.component.property.fontWeight === 'bold'} value={this.state.content.bold}
                                              onCheck={(checked) => this.updateInputStyle(checked,'fontWeight') }
                                    />
                                </View>
                                <View style={{flex:1}}>
                                    <Checkbox label={this.state.content.italic} checked={this.state.component.property.fontStyle === 'italic'} value={this.state.content.italic}
                                              onCheck={(checked) => this.updateInputStyle(checked,'fontStyle') }
                                    />
                                </View>
                                <View style={{flex:1}}>
                                    <Checkbox label={this.state.content.underline} checked={this.state.component.property.textDecorationLine === 'underline'} value={this.state.content.underline}
                                              onCheck={(checked) => this.updateInputStyle(checked,'textDecorationLine') }
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={[styles.fullLength,styles.attrControl,{marginBottom: 30,display: this.state.component.flag?'none':'flex'}]}>
                            <Button style={[styles.buttonStyle]} onPress={() => this.props.deleteComponent(this.state.index)}>
                                <Text style={{textAlign: 'center', fontWeight: 'normal',fontSize:responsiveFontSize(1.9)}}>
                                    {this.state.content.delete}
                                </Text>
                            </Button>
                        </View>
                        <Modal  isShow={this.state.editProperty === 'value'}
                                backPress={() => this.updateInputProperty("",true)}
                                bgPress={() => this.updateInputProperty("",true)}>
                            <View style={{width: Utils.size.width*0.9}}>
                                <Sae
                                    label={this.state.content.value}
                                    iconClass={FontAwesomeIcon}
                                    iconName={'pencil'}
                                    iconColor={'white'}
                                    labelStyle={[styles.input,{color: 'white'}]}
                                    inputStyle={[styles.input,{color: 'white'}]}
                                    value={this.state.component.value}
                                    onChangeText={(value) => this.updateInputProperty(value,false)}
                                />
                            </View>
                        </Modal>
                        <Modal isShow={this.state.editProperty === 'tag'}
                                bgPress={() => this.updateInputProperty("",true)}
                                backPress={() => this.updateInputProperty("",true)}>
                            <View style={{width: Utils.size.width*0.9}}>
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
                            </View>
                        </Modal>
                        <Modal  isShow={this.state.editProperty === 'left'}
                                backPress={() => this.updateInputLocation("",true)}
                                bgPress={() => this.updateInputLocation("",true)}>
                            <View style={{width: Utils.size.width*0.9}}>
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
                            </View>
                        </Modal>
                        <Modal  isShow={this.state.editProperty === 'right'}
                                bgPress={() => this.updateInputLocation("",true)}
                                backPress={() => this.updateInputLocation("",true)}>
                            <View style={{width: Utils.size.width*0.9}}>
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
                            </View>
                        </Modal>
                        <Modal  isShow={this.state.editProperty === 'top'}
                                backPress={() => this.updateInputLocation("",true)}
                                bgPress={() => this.updateInputLocation("",true)}>
                            <View style={{width: Utils.size.width*0.9}}>
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
                            </View>
                        </Modal>
                        <Modal  isShow={this.state.editProperty === 'bottom'}
                                bgPress={() => this.updateInputLocation("",true)}
                                backPress={() => this.updateInputLocation("",true)}>
                            <View style={{width: Utils.size.width*0.9}}>
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
                            </View>
                        </Modal>
                        <Modal isShow={this.state.editProperty === 'color'} position={'flex-end'}>
                            <ColorPicker component={this.state.component} updatePicker={this.updatePicker}/>
                        </Modal>
                        <Modal isShow={this.state.editProperty === 'font'} position={'flex-end'}>
                            <FontFamilyPicker component={this.state.component} updatePicker={this.updatePicker}/>
                        </Modal>
                        <View onLayout={(event) => this.measureView(event)} style={{position:'absolute',left:-Utils.size.width}}>
                            <Ripple>
                                <Text style={{
                                    fontSize: (this.state.card.unitFont * (this.state.component.property.fontSize)),
                                    fontFamily:this.state.component.property.fontFamily,
                                    fontWeight: this.state.component.property.fontWeight,
                                }}>{this.state.component.value}</Text>
                            </Ripple>
                        </View>
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