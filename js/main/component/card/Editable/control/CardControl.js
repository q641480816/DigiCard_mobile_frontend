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
import { ThemeProvider } from 'react-native-material-ui';
import Button from 'apsl-react-native-button';

import Utils from '../../../../../common/util';
import Modal from '../../../../component/modal/ModalFarme';

export default class CardControl extends Component{
    constructor(props) {
        super(props);

        this.state = {
            index: -1,
            action: '',
            cardValue: null,
            component: null,
            editProperty: null,
            content: {
                name: 'Card Name',
                delete: "Delete this card",
                create: 'Create New Card',
                save: 'Save All Changes'
            }
        };

        this.setEdit = this.setEdit.bind(this);
        this.updateCardProperty = this.updateCardProperty.bind(this);
    }

    componentWillMount(){
        this.setState({
            action: this.props.action,
            cardValue: this.props.cardValue
        })
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            action: nextProps.action,
            cardValue: nextProps.cardValue
        })
    }

    setEdit(index, component, cardValue){
        this.setState({component:component,cardValue:cardValue})
    }

    //update function

    updateCardProperty(value,isFinal){
        let temp = this.state.cardValue;
        if(!isFinal){
            switch (this.state.editProperty){
                case 'name':
                    temp.cardName = value;
                    break;
            }
        }else{
            if(temp.cardName.length === 0){
                temp.cardName = 'Edit Card Name'
            }
            this.setState({editProperty:null});
        }
        this.props.setCardValue(temp);
    }

    render(){
        if(this.state.component !== null){
            return(<View/>);
        }else{
            return(
                <ThemeProvider uiTheme={Utils.MaterialUITheme}>
                    <ScrollView style={[styles.controlPanel]}>
                        <View style={[styles.fullLength,styles.column,styles.attrControl,{marginTop: Utils.size.height*0.04}]}>
                            <Ripple onPress={()=>this.setState({editProperty: 'name'})}>
                                <Sae
                                    label={this.state.content.name}
                                    iconClass={FontAwesomeIcon}
                                    iconName={'pencil'}
                                    iconColor={Utils.colors.primaryColor}
                                    labelStyle={styles.input}
                                    inputStyle={styles.input}
                                    editable={false}
                                    value={this.state.cardValue.cardName}
                                />
                            </Ripple>
                        </View>
                        <View style={[styles.fullLength,styles.attrControl,{marginBottom: 30,marginTop:30},{display:this.state.action==='edit'?'flex':'none'}]}>
                            <Button style={[styles.buttonStyle]} onPress={() => {this.props.saveCard()}}>
                                <Text style={{textAlign: 'center', fontWeight: 'normal',fontSize:responsiveFontSize(1.9)}}>
                                    {this.state.content.save}
                                </Text>
                            </Button>
                        </View>
                        <View style={[styles.fullLength,styles.attrControl,{marginBottom: 30,marginTop:30},{display:this.state.action==='new'?'flex':'none'}]}>
                            <Button style={[styles.buttonStyle]} onPress={() => {this.props.saveCard()}}>
                                <Text style={{textAlign: 'center', fontWeight: 'normal',fontSize:responsiveFontSize(1.9)}}>
                                    {this.state.content.create}
                                </Text>
                            </Button>
                        </View>
                        <Modal isShow={this.state.editProperty === 'name'}
                               bgPress={() => this.updateCardProperty("",true)}
                               backPress={() => this.updateCardProperty("",true)}>
                            <View style={{width: Utils.size.width*0.9}}>
                                <Sae
                                    label={this.state.content.name}
                                    iconClass={FontAwesomeIcon}
                                    iconName={'pencil'}
                                    iconColor={'white'}
                                    labelStyle={[styles.input,{color: 'white'}]}
                                    inputStyle={[styles.input,{color: 'white'}]}
                                    value={this.state.cardValue.cardName}
                                    onChangeText={(value) => this.updateCardProperty(value,false)}
                                />
                            </View>
                        </Modal>
                    </ScrollView>
                </ThemeProvider>
            );
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

CardControl.propTypes = {
    action: PropTypes.string,
    cardValue: PropTypes.object,
    setCardValue: PropTypes.func,
    deleteCard: PropTypes.func,
    saveCard: PropTypes.func
};