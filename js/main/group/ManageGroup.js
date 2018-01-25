import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    TouchableWithoutFeedback,
    Alert
} from 'react-native';
import { responsiveFontSize } from '../component/responsive/responsive';

import Ripple from "react-native-material-ripple";
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import { Sae } from 'react-native-textinput-effects';

import ElevatedView from "../component/elevatedView/ElevatedView";
import Utils from "../../common/util";
import Toolbar from "../component/toolbar/Toolbar";
import Modal from "../component/modal/ModalFarme";

export default class ManageGroup extends Component{
    constructor(props) {
        super(props);

        this.state = {
            groups: null,
            editProperty: null,
            newGroupName: '',
            tempGroupName: '',
            content: {
                title: 'Manage Group',
                addGroup: 'Add Group',
                newGroupLabel: 'New Group Name',
                newGroupTitle: 'New Group',
                editGroupLabel: 'Group Name',
                editGroupTitle: 'Edit Group Name',
                confirm: 'Confirm',
                cancel: 'Cancel',
                alert: {
                    deleteGroup: {
                        deleteGroupTitle: 'Group Deletion',
                        deleteGroupBody: 'All Cards under this group will be moved to Ungrouped.'
                    }
                }
            }
        };

        this.groups = [];
        this.addNewGroup = this.addNewGroup.bind(this);
        this.updateGroupName = this.updateGroupName.bind(this);
        this.deleteGroupAlert = this.deleteGroupAlert.bind(this);
        this.deleteGroup = this.deleteGroup.bind(this);
    }

    componentWillMount(){
        this.setState({
            groups: this.props.navigation.state.params.groups,
        })
    }

    addNewGroup(){
        this.refs.toolbar.setLoadingShow(true);
        let url = Utils.baseURL + 'accountCards';
        Utils.cFunctions.fetch.post(url,{
            accountId: Utils.account.accountId,
            group: this.state.newGroupName
        }).then(response => {
            this.refs.toolbar.setLoadingShow(false);
            let groups = this.state.groups;
            groups.push({group:this.state.newGroupName,cards:[]});
            this.setState({groups:groups,newGroupName:'',editProperty:null});
            this.props.navigation.state.params.updateCardMini(groups,response.data.account.lastUpdate,()=>{},false);
        }).catch(err=>{
            //TODO
            console.log(err);
            this.refs.toolbar.setLoadingShow(false);
            console.log(err);
        });
    }

    updateGroupName(){
        let attr = this.state.editProperty.split(",");
        if(this.state.tempGroupName !== this.state.groups[Number(attr[1])].group) {
            this.refs.toolbar.setLoadingShow(true);
            let url = Utils.baseURL + 'accountCards';
            Utils.cFunctions.fetch.put(url, {
                accountId: Utils.account.accountId,
                group: this.state.groups[Number(attr[1])].group,
                newGroup: this.state.tempGroupName
            }).then(response => {
                this.refs.toolbar.setLoadingShow(false);
                let groups = this.state.groups;
                let gIndex = -1;
                for (let i = 1; i < this.state.groups.length; i++) {
                    if (groups[i].group === this.state.tempGroupName) {
                        gIndex = i;
                        break;
                    }
                }
                if (gIndex < 0) {
                    // new
                    groups[Number(attr[1])].group = this.state.tempGroupName;
                } else {
                    groups[gIndex].cards = groups[gIndex].cards.concat(groups[Number(attr[1])].cards);
                    groups.splice(Number(attr[1]), 1);
                }
                this.setState({groups: groups, tempGroupName: '', editProperty: null});
                this.props.navigation.state.params.updateCardMini(groups, response.data.lastUpdate, () => {}, false);
            }).catch(err => {
                this.refs.toolbar.setLoadingShow(false);
                //TODO
                console.log(err);
            });
        }else{
            //no need to update
            this.setState({tempGroupName: '', editProperty: null});
        }
    }

    deleteGroupAlert(index){
        Alert.alert(
            this.state.content.alert.deleteGroup.deleteGroupTitle,
            this.state.content.alert.deleteGroup.deleteGroupBody,
            [
                {text: this.state.content.cancel, onPress: () => console.log('cancel')},
                {text: this.state.content.confirm, onPress: () => {
                    this.deleteGroup(index);
                }},
            ],
            { cancelable: true }
        )
    }

    deleteGroup(index){
        this.refs.toolbar.setLoadingShow(true);
        let url = Utils.baseURL + 'accountCards';
        Utils.cFunctions.fetch.put(url, {
            group: this.state.groups[index].group,
            accountId: Utils.account.accountId,
            newGroup: Utils.action.defaultGroup
        }).then(response => {
            this.refs.toolbar.setLoadingShow(false);
            let groups = this.state.groups;
            groups[0].cards = groups[0].cards.concat(groups[index].cards);
            groups.splice(index,1);
            this.setState({groups:groups});
            this.props.navigation.state.params.updateCardMini(groups,response.data.lastUpdate,()=>{},false);
        }).catch(err => {
            //TODO
            console.log(err);
            this.refs.toolbar.setLoadingShow(false);
            console.log(err);
        });
    }

    render(){
        this.groups = [];
        for(let i = 1; i < this.state.groups.length; i++){
            this.groups.push(
                <ElevatedView key={i} elevation={1} style={styles.row}>
                    <Ripple onPress={()=>this.deleteGroupAlert(i)} style={{width: 60,height: 60, alignItems:'center',justifyContent:'center'}}>
                        <View style={{paddingLeft:15,paddingRight:15}}>
                            <Ionicons name={'ios-remove-circle-outline'} size={30} color={'grey'}/>
                        </View>
                    </Ripple>
                    <Ripple style={{width: Utils.size.width-60,height: 60}} onPress={() => {
                        this.setState({
                            tempGroupName: this.state.groups[i].group,
                            editProperty: "editGroup," + i
                        })
                    }}>
                        <Text style={styles.gName}>{this.state.groups[i].group}</Text>
                    </Ripple>
                </ElevatedView>
            );
        }
        /*
        return(
            <View style={styles.container}>
                <Toolbar ref={'toolbar'} title={this.state.content.title} loading={true}/>
                <ScrollView style={{flex:1,width:Utils.size.width}}>
                    <Ripple onPress={()=>this.setState({editProperty:'newGroup'})}>
                        <ElevatedView elevation={1} style={styles.row}>
                            <View style={{paddingLeft:15,paddingRight:15}}>
                                <Ionicons name={'ios-add-circle-outline'} size={30} color={'grey'}/>
                            </View>
                            <Text style={styles.gName}>{this.state.content.addGroup}</Text>
                        </ElevatedView>
                    </Ripple>
                    {this.groups}
                </ScrollView>
                <Modal  isVisible={this.state.editProperty === 'newGroup'} animationInTiming={300} animationOutTiming={300}
                        animationIn={'fadeIn'}
                        animationOut={'fadeOut'}
                        onBackButtonPress={() => console.log('')}
                        onBackdropPress={() => console.log("")}
                        style={{alignItems:'center'}}>
                    <ElevatedView elevation={2}>
                        <View style={
                            {width: Utils.size.width*0.85,backgroundColor:'white',paddingLeft:15,paddingRight:15,paddingTop:10,alignItems:'center'}
                        }>
                            <Text style={{fontSize:responsiveFontSize(2.65),fontWeight:'bold',marginBottom:10}}>{this.state.content.newGroupTitle}</Text>
                            <View style={{width:Utils.size.width*0.85-30}}>
                                <Sae
                                    label={this.state.content.newGroupLabel}
                                    iconClass={FontAwesomeIcon}
                                    iconName={'pencil'}
                                    iconColor={Utils.colors.primaryColor}
                                    labelStyle={[styles.input,{color: Utils.colors.primaryColor}]}
                                    inputStyle={[styles.input,{color: Utils.colors.primaryColor}]}
                                    value={this.state.newGroupName}
                                    onChangeText={(value) => this.setState({newGroupName: value})}
                                />
                            </View>
                            <View style={{width:Utils.size.width*0.85-30,borderTopWidth:0.5,borderTopColor:'grey',marginTop:10,flexDirection:'row'}}>
                                <TouchableWithoutFeedback onPress={()=>this.addNewGroup()}>
                                    <View style={{width:(Utils.size.width*0.85-30)/2,alignItems: 'center',justifyContent:'center'}}>
                                        <Text style={styles.actionText}>{this.state.content.confirm}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>this.setState({editProperty:null,newGroupName: ''})}>
                                    <View style={{width:(Utils.size.width*0.85-30)/2,alignItems: 'center',justifyContent:'center'}}>
                                        <Text style={styles.actionText}>{this.state.content.cancel}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </ElevatedView>
                </Modal>
                <Modal  isVisible={this.state.editProperty !== null && this.state.editProperty.indexOf('editGroup') >= 0} animationInTiming={300} animationOutTiming={300}
                        animationIn={'fadeIn'}
                        animationOut={'fadeOut'}
                        onBackButtonPress={() => console.log('')}
                        onBackdropPress={() => console.log("")}
                        style={{alignItems:'center'}}>
                    <ElevatedView elevation={2}>
                        <View style={
                            {width: Utils.size.width*0.85,backgroundColor:'white',paddingLeft:15,paddingRight:15,paddingTop:10,alignItems:'center'}
                        }>
                            <Text style={{fontSize:responsiveFontSize(2.65),fontWeight:'bold',marginBottom:10}}>{this.state.content.editGroupTitle}</Text>
                            <View style={{width:Utils.size.width*0.85-30}}>
                                <Sae
                                    label={this.state.content.editGroupLabel}
                                    iconClass={FontAwesomeIcon}
                                    iconName={'pencil'}
                                    iconColor={Utils.colors.primaryColor}
                                    labelStyle={[styles.input,{color: Utils.colors.primaryColor}]}
                                    inputStyle={[styles.input,{color: Utils.colors.primaryColor}]}
                                    value={this.state.tempGroupName}
                                    onChangeText={(value) => this.setState({tempGroupName: value})}
                                />
                            </View>
                            <View style={{width:Utils.size.width*0.85-30,borderTopWidth:0.5,borderTopColor:'grey',marginTop:10,flexDirection:'row'}}>
                                <TouchableWithoutFeedback onPress={()=>this.updateGroupName()}>
                                    <View style={{width:(Utils.size.width*0.85-30)/2,alignItems: 'center',justifyContent:'center'}}>
                                        <Text style={styles.actionText}>{this.state.content.confirm}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>this.setState({editProperty:null,tempGroupName: ''})}>
                                    <View style={{width:(Utils.size.width*0.85-30)/2,alignItems: 'center',justifyContent:'center'}}>
                                        <Text style={styles.actionText}>{this.state.content.cancel}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </ElevatedView>
                </Modal>
            </View>
        );
        */
        return(
            <View style={styles.container}>
                <Toolbar ref={'toolbar'} title={this.state.content.title} loading={true}/>
                <ScrollView style={{flex:1,width:Utils.size.width}}>
                    <Ripple onPress={()=>this.setState({editProperty:'newGroup'})}>
                        <ElevatedView elevation={1} style={styles.row}>
                            <View style={{paddingLeft:15,paddingRight:15}}>
                                <Ionicons name={'ios-add-circle-outline'} size={30} color={'grey'}/>
                            </View>
                            <Text style={styles.gName}>{this.state.content.addGroup}</Text>
                        </ElevatedView>
                    </Ripple>
                    {this.groups}
                </ScrollView>
                <Modal isShow={this.state.editProperty === 'newGroup'}
                        backPress={() => console.log('')}
                        bgPress={() => console.log("")}
                        style={{alignItems:'center'}}>
                    <ElevatedView elevation={2}>
                        <View style={
                            {width: Utils.size.width*0.85,backgroundColor:'white',paddingLeft:15,paddingRight:15,paddingTop:10,alignItems:'center'}
                        }>
                            <Text style={{fontSize:responsiveFontSize(2.65),fontWeight:'bold',marginBottom:10}}>{this.state.content.newGroupTitle}</Text>
                            <View style={{width:Utils.size.width*0.85-30}}>
                                <Sae
                                    label={this.state.content.newGroupLabel}
                                    iconClass={FontAwesomeIcon}
                                    iconName={'pencil'}
                                    iconColor={Utils.colors.primaryColor}
                                    labelStyle={[styles.input,{color: Utils.colors.primaryColor}]}
                                    inputStyle={[styles.input,{color: Utils.colors.primaryColor}]}
                                    value={this.state.newGroupName}
                                    onChangeText={(value) => this.setState({newGroupName: value})}
                                />
                            </View>
                            <View style={{width:Utils.size.width*0.85-30,borderTopWidth:0.5,borderTopColor:'grey',marginTop:10,flexDirection:'row'}}>
                                <TouchableWithoutFeedback onPress={()=>this.addNewGroup()}>
                                    <View style={{width:(Utils.size.width*0.85-30)/2,alignItems: 'center',justifyContent:'center'}}>
                                        <Text style={styles.actionText}>{this.state.content.confirm}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>this.setState({editProperty:null,newGroupName: ''})}>
                                    <View style={{width:(Utils.size.width*0.85-30)/2,alignItems: 'center',justifyContent:'center'}}>
                                        <Text style={styles.actionText}>{this.state.content.cancel}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </ElevatedView>
                </Modal>
                <Modal  isShow={this.state.editProperty !== null && this.state.editProperty.indexOf('editGroup') >= 0}
                        style={{alignItems:'center'}}>
                    <ElevatedView elevation={2}>
                        <View style={
                            {width: Utils.size.width*0.85,backgroundColor:'white',paddingLeft:15,paddingRight:15,paddingTop:10,alignItems:'center'}
                        }>
                            <Text style={{fontSize:responsiveFontSize(2.65),fontWeight:'bold',marginBottom:10}}>{this.state.content.editGroupTitle}</Text>
                            <View style={{width:Utils.size.width*0.85-30}}>
                                <Sae
                                    label={this.state.content.editGroupLabel}
                                    iconClass={FontAwesomeIcon}
                                    iconName={'pencil'}
                                    iconColor={Utils.colors.primaryColor}
                                    labelStyle={[styles.input,{color: Utils.colors.primaryColor}]}
                                    inputStyle={[styles.input,{color: Utils.colors.primaryColor}]}
                                    value={this.state.tempGroupName}
                                    onChangeText={(value) => this.setState({tempGroupName: value})}
                                />
                            </View>
                            <View style={{width:Utils.size.width*0.85-30,borderTopWidth:0.5,borderTopColor:'grey',marginTop:10,flexDirection:'row'}}>
                                <TouchableWithoutFeedback onPress={()=>this.updateGroupName()}>
                                    <View style={{width:(Utils.size.width*0.85-30)/2,alignItems: 'center',justifyContent:'center'}}>
                                        <Text style={styles.actionText}>{this.state.content.confirm}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>this.setState({editProperty:null,tempGroupName: ''})}>
                                    <View style={{width:(Utils.size.width*0.85-30)/2,alignItems: 'center',justifyContent:'center'}}>
                                        <Text style={styles.actionText}>{this.state.content.cancel}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </ElevatedView>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    row:{
        width: Utils.size.width,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottomColor: 'grey',
        borderBottomWidth:0.5
    },
    gName:{
        paddingLeft: 15,
        fontSize: responsiveFontSize(2.2),
        paddingTop:20,
        paddingBottom:20
    },
    input: {
        fontSize: responsiveFontSize(2),
        color: Utils.colors.secondaryColor
    },
    actionText:{
        fontSize: responsiveFontSize(2.25),
        paddingTop:15,
        paddingBottom:15
    }
});