import React, { Component } from 'react';
import {
    StyleSheet,
    PermissionsAndroid
} from 'react-native';
import PropTypes from 'prop-types';

import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Utils from '../../../../../common/util';

export default class EditCardFab extends Component{

    constructor(props) {
        super(props);

        this.state = {
            show: true,
            content: {
                text: 'Text',
                image: 'Local Image'
            }
        };

        this.setShow = this.setShow.bind(this);
        this.addImage = this.addImage.bind(this);
    }

    setShow(isShow){
        this.setState({
            show: isShow
        })
    }

    addImage(){
        if(Utils.OS === 'android'){
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then((result)=>{
                if(result){
                    this.props.addImageComponent();
                }else{
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then((result)=> {
                        if(result === 'granted'){
                            this.props.addImageComponent();
                        }
                    })
                }
            });
        }
    }

    render(){
        return(
            <ActionButton hideShadow={true} buttonColor={Utils.colors.primaryColor} position={'right'} style={{display:this.state.show? 'flex':'none'}}>
                <ActionButton.Item buttonColor='#9b59b6' title={this.state.content.image} onPress={() => this.addImage()}>
                    <Icon name="text-fields" style={styles.actionButtonIcon} />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='#9b59b6' title={this.state.content.text} onPress={() => this.props.addTextComponent()}>
                    <Icon name="text-fields" style={styles.actionButtonIcon} />
                </ActionButton.Item>
            </ActionButton>
        );
    }
}

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: Utils.colors.secondaryColor,
    }
});

EditCardFab.propTypes = {
    addTextComponent: PropTypes.func,
    addImageComponent: PropTypes.func
};