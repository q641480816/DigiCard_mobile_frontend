import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView
} from 'react-native';
import PropTypes from 'prop-types';
import {responsiveFontSize} from "../../../../responsive/responsive";

import Ripple from 'react-native-material-ripple';

import Util from '../../../../../../common/util';
import Data from '../../../../../../common/Data';
import ElevatedView from "../../../../elevatedView/ElevatedView";

export default class ColorPicker extends Component{
    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            selected: null,
            tempColor: null,
            dataSource: this.ds.cloneWithRows(Data.availableColors),
            content:{
                cancel: 'Cancel',
                confirm: 'Confirm'
            }
        };

        this.startPiker = this.startPiker.bind(this);
        this.stopPiker = this.stopPiker.bind(this);
        this.renderRow = this.renderRow.bind(this);
    }

    componentWillMount() {
        this.setState({
            selected: this.props.component.property.color,
            tempColor: this.props.component.property.color,
        });
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            selected: nextProps.component.property.color
        });
    }

    startPiker(){
        this.setState({
            isEditing: true
        })
    }

    stopPiker(){
        this.setState({
            isEditing: false
        })
    }

    renderRow(c){
        return(
            <Ripple onPress={()=> {this.setState({selected: c});this.props.updatePicker(c,false)}}>
                <View style={[styles.fullLength,{height: Util.size.height*0.075,alignItems:'center',justifyContent:"center"}]}>
                    <Text style={[styles.textCommon,{color:c}]}>{c}</Text>
                </View>
            </Ripple>
        );
    }

    render(){
        return(
            <View style={styles.picker}>
                <ElevatedView elevation={1} style={[styles.fullLength,{height: Util.size.height*0.075,backgroundColor:'white',flexDirection:'row',alignItems:'center',justifyContent:'center'}]}>
                    <Ripple style={{flex: 2,alignItems:'center',justifyContent:'center'}}
                            onPress={()=> this.props.updatePicker(this.state.tempColor,true)}>
                        <Text style={[styles.textCommon,{color: Util.colors.tertiaryColor}]}>{this.state.content.cancel}</Text>
                    </Ripple>
                    <View style={{flex: 4,alignItems:'center',justifyContent:'center'}}>
                        <Text style={[styles.textCommon,{color: this.state.selected}]}>{this.state.selected}</Text>
                    </View>
                    <Ripple style={{flex: 2,alignItems:'center',justifyContent:'center'}}
                            onPress={()=> this.props.updatePicker(this.state.selected,true)}>
                        <Text style={[styles.textCommon,{color: Util.colors.secondaryColor}]}>{this.state.content.confirm}</Text>
                    </Ripple>
                </ElevatedView>
                <ListView
                    enableEmptySections={true}
                    style={[styles.fullLength,{height: Util.size.height*0.375,backgroundColor: '#f8f8ff'}]}
                    dataSource={this.state.dataSource}
                    renderRow={(color) => this.renderRow(color)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    picker: {
        width: Util.size.width,
        height: Util.size.height*0.45
    },
    fullLength:{
        width: Util.size.width
    },
    textCommon: {
        fontSize: responsiveFontSize(2.5)
    }
});

ColorPicker.propTypes = {
    component: PropTypes.object,
    updatePicker: PropTypes.func
};

