import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text
} from 'react-native';
import { responsiveFontSize } from '../component/responsive/responsive';

import Ripple from "react-native-material-ripple";
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import ElevatedView from "../component/elevatedView/ElevatedView";
import Utils from "../../common/util";
import Toolbar from "../component/toolbar/Toolbar";

export default class Grouping extends Component{
    constructor(props) {
        super(props);

        this.state = {
            groups: null,
            index: 0,
            gIndex: 0,
            content: {
                title: 'Grouping',
                cancel: 'Cancel'
            }
        };

        this.groups = [];
        this.onGroupSelected = this.onGroupSelected.bind(this);
    }

    componentWillMount(){
        this.setState({
            index: this.props.navigation.state.params.index,
            groups: this.props.navigation.state.params.groups,
            gIndex: this.props.navigation.state.params.gIndex
        })
    }

    onGroupSelected(gIndex){
        if(gIndex !== this.state.gIndex){
            this.setState({gIndex: gIndex});
            this.props.navigation.state.params.updateGroup(gIndex);
        }
        setTimeout(()=>{
            this.props.navigation.goBack(null);
        },200);
    }

    render(){
        this.groups = [];
        for(let i = 2; i < this.state.groups.length; i++){
            this.groups.push(
                <Ripple key={i} onPress={()=>this.onGroupSelected(i)}>
                    <ElevatedView elevation={1} style={styles.row}>
                        <Text style={styles.gName}>{this.state.groups[i].groupName}</Text>
                        <View style={{display: i===this.state.gIndex?'flex':'none',paddingRight:15}}>
                            <EvilIcons name={'check'} size={30} color={'green'}/>
                        </View>
                    </ElevatedView>
                </Ripple>
            );
        }

        return(
            <View style={styles.container}>
                <Toolbar title={this.state.content.title} loading={false}/>
                <ScrollView style={{flex:1,width:Utils.size.width}}>
                    {this.groups}
                </ScrollView>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: 'grey',
        borderBottomWidth:0.5
    },
    gName:{
        paddingLeft: 15,
        fontSize: responsiveFontSize(2.2),
        paddingTop:20,
        paddingBottom:20
    }
});
