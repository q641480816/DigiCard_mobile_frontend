import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback
} from 'react-native';
import PropTypes from 'prop-types';

import Utils from '../../../../common/util';
import EditableTextContent from './cardContent/EditableTextContent';
import EditableImageContent from './cardContent/EditableImageContent';
import EditCardFab from './common/EditCardFab';
import TextControl from './control/TextControl';
import ImageControl from './control/ImageControl';
import CardControl from './control/CardControl';
import ElevatedView from "../../elevatedView/ElevatedView";

export default class EditableCard extends  Component{
    constructor(props) {
        super(props);

        this.state = {
            action: '',
            card:{width:0,height:0,unitFont:0},
            cardValue:{id:0,name:'',contentSet:[]}
        };

        this.content = [];
        this.saveCard = this.saveCard.bind(this);
        this.deleteCard = this.deleteCard.bind(this);
        this.setCardValue = this.setCardValue.bind(this);
        this.setParentComponentPosition = this.setParentComponentPosition.bind(this);
        this.setParentComponentProperty = this.setParentComponentProperty.bind(this);
        this.setComponentProperty = this.setComponentProperty.bind(this);
        this.addTextComponent = this.addTextComponent.bind(this);
        this.addImageComponent = this.addImageComponent.bind(this);
        this.editComponent = this.editComponent.bind(this);
        this.setComponentPosition = this.setComponentPosition.bind(this);
        this.deleteComponent = this.deleteComponent.bind(this);
        this.resetControl = this.resetControl.bind(this);
    }

    componentWillMount(){
        let width = this.props.width;
        this.setState({
            action: this.props.action,
            card: Utils.cFunctions.getCardMatrix(width),
            cardValue: this.props.cardValue
        })
    }

    componentWillReceiveProps(nextProps){
        let width = nextProps.width;
        this.setState({
            action: nextProps.action,
            card: Utils.cFunctions.getCardMatrix(width),
            cardValue: nextProps.cardValue
        })
    }

    saveCard(){
        this.props.saveCard();
    }

    deleteCard(){
        this.props.deleteCard();
    }

    setCardValue(cardValue){
        this.props.setCardValue(cardValue);
    }

    setParentComponentProperty(index,component){
        //when component changed reflect to the parent
        this.props.setComponentProperty(index,component);
    }

    setParentComponentPosition(top, left, index, size,content){
        let maxLeft = (this.state.card.width - size.width)/this.state.card.width*100;
        let maxTop = (this.state.card.height - size.height)/this.state.card.height*100;
        let toUpdate = false;
        if(left > maxLeft){
            left = maxLeft;
            toUpdate = true;
        }
        if(top > maxTop){
            top = maxTop;
            toUpdate = true;
        }
        if(toUpdate){
            content.location = {
                left: left,
                top: top
            };
            this.setComponentPosition(content);
        }
        this.props.setComponentPosition(top,left,index,null);
    }

    editComponent(index,content,size){
        this.refs["fab"].setShow(false);
        this.refs["cardControl"].setEdit(-1,content,this.state.cardValue);
        this.refs["textControl"].setEdit(index,content,size);
        this.refs["imageControl"].setEdit(index,content,size);
    }

    setComponentProperty(index,content){
        this.refs['component'+index].updateProperty(content);
    }

    setComponentPosition(content){
        if(content.type === 'text') {
            this.refs["textControl"].locationToBeUpdate(content);
        }else if(content.type === 'img'){
            this.refs["imageControl"].locationToBeUpdate(content);
        }
    }

    addTextComponent(){
        this.props.addTextComponent();
    }

    addImageComponent(){
        this.props.addImageComponent();
    }

    deleteComponent(index){
        this.props.deleteComponent(index);
    }

    resetControl(){
        this.refs["fab"].setShow(true);
        this.refs["cardControl"].setEdit(-1,null,this.state.cardValue);
        this.refs["textControl"].setEdit(-1,null);
        this.refs["imageControl"].setEdit(-1,null);
    }

    render() {
        this.content = [];
        for(let i = 0; i < this.state.cardValue.contentSet.length; i++){
            let temp = this.state.cardValue.contentSet[i];
            if(temp.type === 'text'){
                this.content.push(
                    <EditableTextContent ref={'component'+i}
                                         key={i} index={i} card={this.state.card} content={temp}
                                         setComponentPosition={this.setParentComponentPosition}
                                         editComponent={this.editComponent} movingPositionUpdate={this.setComponentPosition}
                    />
                );
            }else if(temp.type === 'img'){
                this.content.push(
                    <EditableImageContent
                        ref={'component' + i}
                        key={i} index={i} card={this.state.card} content={temp}
                        setComponentPosition={this.setParentComponentPosition}
                        editComponent={this.editComponent} movingPositionUpdate={this.setComponentPosition}
                    />
                );
            }
        }

        return(
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => this.resetControl()}>
                    <View style={styles.topCard}>
                        <ElevatedView ref={"card"} elevation={3} style={[styles.card,{width: this.state.card.width,height:this.state.card.height}]}>
                            { this.content }
                        </ElevatedView>
                    </View>
                </TouchableWithoutFeedback>
                <CardControl ref={'cardControl'} cardValue={this.state.cardValue} setCardValue={this.setCardValue}
                             deleteCard={this.deleteCard} action={this.state.action} saveCard={this.saveCard}
                />
                <TextControl ref={'textControl'} card={this.state.card} setContentProperty={this.setComponentProperty}
                             setParentComponentProperty={this.setParentComponentProperty} deleteComponent={this.deleteComponent}
                />
                <ImageControl ref={'imageControl'} card={this.state.card} setContentProperty={this.setComponentProperty}
                              setParentComponentProperty={this.setParentComponentProperty} deleteComponent={this.deleteComponent}
                />
                <EditCardFab ref={'fab'} addTextComponent={this.addTextComponent} addImageComponent={this.addImageComponent}/>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    fullLength:{
        width: Utils.size.width
    },
    rowStratch:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'stretch'
    },
    rowCenter:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    topCard:{
        width: Utils.size.width,
        height: Utils.size.width / Utils.ratio,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    card:{
        backgroundColor: 'white',
        borderRadius: 2,
        borderWidth: 0.5,
        borderColor: '#787878',
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: Utils.colors.secondaryColor,
    }
});

EditableCard.propTypes = {
    action: PropTypes.string,
    width: PropTypes.number.isRequired,
    cardValue: PropTypes.object,
    addTextComponent: PropTypes.func,
    addImageComponent: PropTypes.func,
    setComponentPosition: PropTypes.func,
    setComponentProperty: PropTypes.func,
    deleteComponent: PropTypes.func,
    setCardValue: PropTypes.func,
    deleteCard: PropTypes.func,
    saveCard: PropTypes.func
};