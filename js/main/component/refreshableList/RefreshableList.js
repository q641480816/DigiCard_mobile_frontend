import React, { Component } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    RefreshControl
} from 'react-native';
import PropTypes from 'prop-types';
import { responsiveFontSize,responsiveHeight,responsiveWidth } from '../../component/responsive/responsive';
import Utils from "../../../common/util";

export default class RefreshableList extends Component{
    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
            data: []
        };

        this.count = 0;
        this.renderRow = this.renderRow.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
    }

    componentWillMount(){
        this.setState({
            data: this.props.data,
        });
    }

    componentWillReceiveProps(nextProps){
            this.setState({
                data: nextProps.data,
            })
    }

    renderRow(item){
        return this.props.renderRow(item);
    }

    renderFooter(){
        return this.props.renderFooter();
    }

    render(){
        this.count = 0;
        return(
            <View style={[styles.container]}>
                <FlatList
                    data={this.state.data}
                    renderItem={({item}) => this.renderRow(item)}
                    ListFooterComponent={() => this.renderFooter()}
                    keyExtractor={()=>{
                        this.count++;
                        return this.count;
                    }}
                    refreshControl={
                        <RefreshControl
                            colors={[Utils.colors.secondaryColor]}
                            refreshing={this.state.refreshing}
                            onRefresh={() => {
                                this.setState({
                                    refreshing: true
                                });
                                this.props.refresh().then(()=>{
                                    this.setState({
                                        refreshing: false
                                    });
                                }).catch(err =>{
                                    //TODO: CATCH
                                    console.log(err);
                                    this.setState({
                                        refreshing: false
                                    });
                                })
                            }}/>
                    }
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: 'white'
    },
    refresh:{
        width: Utils.size.width,
        flexDirection: 'row',
        backgroundColor: '#E0E0E0'
    }
});

RefreshableList.propTypes = {
    data: PropTypes.array.isRequired,
    renderRow: PropTypes.func.isRequired,
    renderFooter: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired
};