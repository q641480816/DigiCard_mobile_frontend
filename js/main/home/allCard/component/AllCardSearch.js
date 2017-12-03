import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ListView,
    Text
} from 'react-native';
import PropTypes from 'prop-types';
import { responsiveFontSize } from '../../../component/responsive/responsive';

import Ripple from "react-native-material-ripple";

import Utils from "../../../../common/util";

export default class AllCardSearch extends Component{

    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            groups: [],
            searchKey: '',
            dataSource: this.ds.cloneWithRows([]),
            content: {
                footer: 'Search Results'
            }
        };

        this.getMatchedCard = this.getMatchedCard.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
    }

    componentWillMount(){
        this.setState({
            groups: this.props.groups,
            searchKey: this.props.searchKey
        });
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.searchKey !== '') {
            let mGroup = this.getMatchedCard(nextProps.groups, nextProps.searchKey);
            this.setState({
                dataSource: this.ds.cloneWithRows(mGroup),
                searchKey: nextProps.searchKey,
                groups: nextProps.groups
            })
        }else{
            this.setState({
                dataSource: this.ds.cloneWithRows([]),
                searchKey: nextProps.searchKey,
                groups: nextProps.groups
            })
        }
    }

    getMatchedCard(groups,key){
        let mGroups = [];
        for(let i = 0; i < groups.length; i++){
            for(let j = 0; j < groups[i].cards.length; j++){
                let c = groups[i].cards[j];
                if(c.name.indexOf(key) >=0 || c.ownerName.indexOf(key) >=0 || c.phone.indexOf(key) >= 0 || c.email.indexOf(key) >= 0){
                    mGroups.push({
                        card: c,
                        index: j,
                        gIndex: i
                    })
                }
            }
        }
        return mGroups;
    }

    renderFooter(){
        return(
          <View style={{height: 30, width: Utils.size.width, alignItems:'center',justifyContent:'center'}}>
              <Text style={{fontSize: responsiveFontSize(1.75),color: 'grey'}}>{this.state.content.footer}</Text>
          </View>
        );
    }

    renderRow(c){
        let card = c.card;
        return(
            <View style={styles.card}>
                <Ripple style={{width:Utils.size.width}} onLongPress={()=>this.props.showCardModal(card.cardId+"")}
                        onPress={()=>this.props.navigateCardDetail(card.cardId+"",c.index,c.gIndex)}>
                    <View>
                        <Text style={[styles.detail,{marginTop:4,fontSize: responsiveFontSize(2),fontWeight:'bold'}]}>{card.name===null?'Add Name':card.name}</Text>
                        <Text style={{paddingLeft:15,fontSize:responsiveFontSize(1.75)}}>{card.ownerName}</Text>
                        <Text style={{marginBottom:4,paddingLeft:15,fontSize:responsiveFontSize(1.75)}}>{card.phone}</Text>
                    </View>
                </Ripple>
            </View>
        );
    }

    render(){
        return(
            <ListView
                enableEmptySections={true}
                dataSource={this.state.dataSource}
                renderRow={(card) => this.renderRow(card)}
                renderFooter={() => this.renderFooter()}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: Utils.size.width
    },
    card:{
        width: Utils.size.width,
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey',
        alignItems:'center'
    },
    detail: {
        marginBottom: 3,
        marginLeft: 10
    }
});

AllCardSearch.propTypes = {
    groups: PropTypes.array.isRequired,
    searchKey: PropTypes.string.isRequired,
    showCardModal: PropTypes.func.isRequired,
    navigateCardDetail: PropTypes.func.isRequired
};