import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import PropTypes from 'prop-types';
import {responsiveFontSize} from "../../component/responsive/responsive";


import Utils from '../../../common/util';
import Modal from '../../component/modal/ModalFarme';
import AllCardContent from './AllCardContent';
import Card from '../../component/card/Display/Card';
import Toolbar from "../../component/toolbar/Toolbar";

export default class AllCard extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isShowCardModal: false,
            isInitialized: false,
            selectedCard: {},
            contentHeight: Utils.size.height*0.85,
            content: {
                title: 'All Cards'
            }
        };

        this.measureHeight = this.measureHeight.bind(this);
        this.showCardModal = this.showCardModal.bind(this);
        this.getAllGroups = this.getAllGroups.bind(this);
        this.updateCardMini = this.updateCardMini.bind(this);
        this.seeProfile = this.seeProfile.bind(this);
        this.setHttp =this.setHttp.bind(this);
    }

    measureHeight(event){
        if(!this.state.isInitialized) {
            this.setState({
                isInitialized: true,
                contentHeight: (event.nativeEvent.layout.height - Utils.size.height * 0.075)
            });
        }
    }

    showCardModal(card){
        this.setState({selectedCard: card,isShowCardModal:true})
    }

    seeProfile(){
        this.props.navigation.navigate('TestEdit');
    }

    setHttp(isHttp){
        this.refs['toolbar'].setLoadingShow(isHttp);
    }

    getAllGroups(){
        return this.refs.content.getAllGroups();
    }

    updateCardMini(allCardsMini,lastUpdate,callback,isSync){
        this.refs.content.updateCardMini(allCardsMini,lastUpdate,callback,isSync);
    }

    render(){
        return(
            <View style={[styles.container]} onLayout={(event)=>this.measureHeight(event)}>
                <Toolbar ref={'toolbar'} title={this.state.content.title} rightElement={'user'} loading={true} rightElementAction={this.seeProfile} rightText={null}/>
                <View style={[styles.content,{height:this.state.contentHeight}]}>
                    <AllCardContent ref={'content'} showCardModal={this.showCardModal} navigation={this.props.navigation} setHttp={this.setHttp}/>
                </View>
                <Modal isShow={this.state.isShowCardModal}
                       backPress={() => this.setState({isShowCardModal: false})}
                       bgPress={() => this.setState({isShowCardModal: false})}>
                    <Card width={Utils.size.width} index={0} cardValue={this.state.selectedCard}/>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Utils.size.width,
        flexDirection: "column"
    },
    content:{
        width: Utils.size.width,
        flexDirection: 'column'
    },
    search:{
        width: Utils.size.width
    }
});

AllCard.propTypes = {
    navigation: PropTypes.object
};