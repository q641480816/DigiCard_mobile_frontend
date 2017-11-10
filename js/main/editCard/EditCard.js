import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Alert,
    BackHandler
} from 'react-native';
import {responsiveFontSize} from "../component/responsive/responsive";
import Orientation from 'react-native-orientation';

import ImagePicker from 'react-native-image-crop-picker';
import Spinner from 'react-native-spinkit';
import Ripple from 'react-native-material-ripple';

import Utils from '../../common/util';
import Data from '../../common/Data';
import PStorage from '../../common/persistantStorage';
import EditableCard from '../component/card/Editable/EditableCard';
import ToolbarMenu from '../component/toolbarMenu/ToolbarMenu';
import ElevatedView from "../component/elevatedView/ElevatedView";

export default class EditCard extends Component{
    constructor(props) {
        super(props);

        this.state = {
            edited: false,
            action: "",
            card:{
                width:Utils.size.width,
            },
            cardValue: null,
            content: {
                title: 'Edit Card',
                loading: 'Initializing Editor',
                save: 'Save',
                deleteComponentTitle: 'Deletion',
                deleteComponentBody: 'Are you sure you want to delete this component?',
                deleteCardTitle: 'Deletion',
                deleteCardBody: 'Confirm to delete this card?',
                saveTitle: 'Save changes',
                saveBody: 'You have changes, save then before exit?',
                discard: 'Discard',
                discardTitle: 'Discard',
                discardBody:'Are you sure you want to discard all changes?',
                options:{
                    discard: 'Discard',
                    delete: 'Delete',
                    rotate: 'Rotate',
                    save: 'Save'
                },
                option: 'Options'
            }
        };

        this.getCardByIndex = this.getCardByIndex.bind(this);
        this.saveCard = this.saveCard.bind(this);
        this.discardChanges = this.discardChanges.bind(this);
        this.deleteCard = this.deleteCard.bind(this);
        this.setCardValue = this.setCardValue.bind(this);
        this.setComponentPosition = this.setComponentPosition.bind(this);
        this.addTextComponent = this.addTextComponent.bind(this);
        this.addImageComponent = this.addImageComponent.bind(this);
        this.setComponentProperty = this.setComponentProperty.bind(this);
        this.deleteComponent = this.deleteComponent.bind(this);
        this.removeComponent = this.removeComponent.bind(this);
        this.editHandler = this.editHandler.bind(this);
        this.newHandler = this.newHandler.bind(this);
        this.rotate = this.rotate.bind(this);
    }

    componentDidMount(){
            if(this.props.navigation.state.params.action === 'edit'){
            this.getCardByIndex(this.props.navigation.state.params.index,this.props.navigation.state.params.action);
            BackHandler.addEventListener('edit',this.editHandler);
        }else if(this.props.navigation.state.params.action === 'new'){
            this.setState({
                action: this.props.navigation.state.params.action,
                cardValue: Data.newCard
            });
            BackHandler.addEventListener('new',this.newHandler);
        }
    }

    componentWillUnmount() {
        //Set orientation back to Portrait
        Orientation.lockToPortrait();
        //remove all Listeners
        if(this.state.action === 'edit') {
            BackHandler.removeEventListener('edit', this.editHandler);
        }else if(this.state.action === 'new'){
            BackHandler.removeEventListener('new', this.newHandler)
        }
    }

    editHandler(){
        if(this.state.edited){
            Alert.alert(
                this.state.content.saveTitle,
                this.state.content.saveBody,
                [
                    {text: this.state.content.discard, onPress: () => this.props.navigation.goBack(null)},
                    {text: 'OK', onPress: () => this.saveCard()},
                ],
                { cancelable: true }
            );
            return true;
        }else{
            return false;
        }
    };

    newHandler(){
        Alert.alert(
            this.state.content.saveTitle,
            this.state.content.saveBody,
            [
                {text: this.state.content.discard, onPress: () => {
                    this.props.navigation.state.params.updateView(1);
                    this.props.navigation.goBack(null);
                }},
                {text: 'OK', onPress: () => this.saveCard()},
            ],
            { cancelable: true }
        );
        return true;
    }

    rotate(){
        Orientation.getOrientation((err, orientation) => {
            if(orientation === 'PORTRAIT'){
                Orientation.lockToLandscape();
            }else{
                Orientation.lockToPortrait();
            }
        });
    }

    getCardByIndex(index, action){
        PStorage.load({
            key: `${Utils.action.myCards+Utils.account.accountId}`,
            autoSync: false,
        }).then(ret => {
            setTimeout(()=> {
                this.setState({
                    action: action,
                    cardValue: (JSON.parse(ret.cards)).cards[index]
                })
            }, 500);
        }).catch(err => {
            switch (err.name) {
                case 'NotFoundError':
                    // TODO
                    break;
                case 'ExpiredError':
                    // TODO
                    break;
            }
        })
    }

    saveCard(){
        if(this.state.action === 'edit'){
            this.props.navigation.state.params.saveEdit(this.props.navigation.state.params.index,this.state.cardValue);
        }else if(this.state.action === 'new'){
            let card = this.state.cardValue;
            card.ownerName = card.contentSet[0].value;
            card.phone = card.contentSet[1].value;
            card.email = card.contentSet[2].value;
            card.ownerId = Utils.account.accountId;
            this.props.navigation.state.params.saveNew(card);
        }
        this.props.navigation.goBack(null);
    }

    discardChanges(){
        Alert.alert(
            this.state.content.discardTitle,
            this.state.content.discardBody,
            [
                {text: 'Cancel', onPress: () => console.log('cancel')},
                {text: 'OK', onPress: () => {
                    if(this.state.action === 'new'){
                        this.props.navigation.state.params.updateView(1);
                    }
                    this.props.navigation.goBack(null);
                }},
            ],
            { cancelable: true }
        )
    }

    deleteCard(){
        Alert.alert(
            this.state.content.deleteCardTitle,
            this.state.content.deleteCardBody,
            [
                {text: 'Cancel', onPress: () => console.log('cancel')},
                {text: 'OK', onPress: () => {
                    this.props.navigation.state.params.deleteCard(this.props.navigation.state.params.index,this.state.cardValue.cardId);
                    this.props.navigation.goBack(null);
                }},
            ],
            { cancelable: true }
        )
    }

    setCardValue(cardValue){
        this.setState({edited:true,cardValue: cardValue});
    }

    setComponentPosition(top,left,index,size){
        //update position
        let card = this.state.cardValue;
        card.contentSet[index].location = {
            left:left,
            top:top
        };
        this.setState({
            edited: true,
            cardValue: card
        });
    }

    setComponentProperty(index,component){
        let temp = this.state.cardValue;
        temp.contentSet[index] = component;
        this.setState({edited: true,cardValue: temp});
    }

    addTextComponent(){
        let card = this.state.cardValue;
        card.contentSet.push({
            type: 'text',
            tag: 'Edit tag',
            flag: false,
            value: 'Edit text ' + (card.contentSet.length+1),
            property:{
                fontSize: 3,
                fontWeight: 'normal',
                fontStyle: 'normal',
                textDecorationLine: 'none',
                color: '#808080'
            },
            location: {
                left: 2,
                top: 2
            }
        });
        this.setState({
            edited: true,
            cardValue: card
        });
    }

    addImageComponent(){
        ImagePicker.openPicker({
            multiple: false,
            includeBase64: true,
            compressImageQuality: 0.5,
        }).then(images => {
            let card = this.state.cardValue;
            let ratio = (images.width/images.height);
            card.contentSet.push({
                type: 'img',
                tag: 'Edit tag',
                flag: false,
                value: 'data:' + images.mime + ';base64,' + images.data,
                property:{
                    whRatio: ratio,
                    width: 0.20
                },
                location: {
                    left: 2,
                    top: 2
                }
            });
            this.setState({
                edited: true,
                cardValue: card
            });
        }).catch(e => console.log(e));
    }

    deleteComponent(index){
        Alert.alert(
            this.state.content.deleteComponentTitle,
            this.state.content.deleteComponentBody,
            [
                {text: 'Cancel', onPress: () => console.log('cancel')},
                {text: 'OK', onPress: () => {
                    this.removeComponent(index);
                    this.refs["main"].resetControl();
                }},
            ],
            { cancelable: true }
        )
    }

    removeComponent(index){
        let temp = this.state.cardValue;
        temp.contentSet.splice(index,1);
        this.setState({
            edited: true,
            cardValue: temp
        });
    }

    render(){
        if(this.state.cardValue === null){
            return(
                <View style={[{height: Utils.size.height,width: Utils.size.width,backgroundColor:'white'},{alignItems: 'center'}]}>
                    <Spinner style={{marginTop: 50}} isVisible={true} size={Utils.size.width*0.5} type={'Wave'} color={Utils.colors.tertiaryColor}/>
                    <Text style={styles.loading}>{this.state.content.loading}</Text>
                </View>
            );
        }else {
            return (
                <View style={styles.container}>
                    <ElevatedView elevation={3} style={styles.top}>
                        <Text style={styles.title}>{this.state.content.title}</Text>
                        <Ripple onPress={()=> {this.refs.menuEdit.showMenu()}} style={{height:Utils.size.height*0.075,justifyContent:'center',display:this.state.action==='edit'?'flex':'none'}}>
                            <Text style={[styles.title,{color: Utils.colors.tertiaryColor,marginRight:20}]}>{this.state.content.option}</Text>
                        </Ripple>
                        <Ripple onPress={()=> {this.refs.menuNew.showMenu()}} style={{height:Utils.size.height*0.075,justifyContent:'center',display:this.state.action!=='edit'?'flex':'none'}}>
                            <Text style={[styles.title,{color: Utils.colors.tertiaryColor,marginRight:20}]}>{this.state.content.option}</Text>
                        </Ripple>
                    </ElevatedView>
                    <EditableCard
                        ref={'main'}
                        action={this.state.action}
                        width={this.state.card.width}
                        cardValue={this.state.cardValue}
                        setCardValue={this.setCardValue}
                        deleteCard={this.deleteCard}
                        setComponentPosition={this.setComponentPosition}
                        setComponentProperty={this.setComponentProperty}
                        addTextComponent={this.addTextComponent}
                        addImageComponent={this.addImageComponent}
                        deleteComponent={this.deleteComponent}
                        saveCard={this.saveCard}
                    />
                    <ToolbarMenu ref={'menuEdit'} topOffset={Utils.size.height*0.075} withIcon={false}
                                 items={[{name: this.state.content.options.rotate,action:this.rotate},{name: this.state.content.options.discard,action: this.discardChanges},{name: this.state.content.options.save,action: this.saveCard},{name: this.state.content.options.delete,action: this.deleteCard}]}/>
                    <ToolbarMenu ref={'menuNew'} topOffset={Utils.size.height*0.075} withIcon={false}
                                 items={[{name: this.state.content.options.rotate,action:this.rotate},{name: this.state.content.options.discard,action: this.discardChanges}, {name: this.state.content.options.save,action: this.saveCard}]}/>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
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
    },
    loading:{
        fontSize: responsiveFontSize(3),
        color: Utils.colors.primaryColor,
        fontWeight:"bold",
        marginTop: 50
    }
});