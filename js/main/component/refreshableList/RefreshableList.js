import React, { Component } from 'react';
import {
    ListView,
    StyleSheet,
    Text,
    View,
    Animated,
    PanResponder, Easing
} from 'react-native';
import PropTypes from 'prop-types';
import { responsiveFontSize,responsiveHeight,responsiveWidth } from '../../component/responsive/responsive';
import Utils from "../../../common/util";

export default class RefreshableList extends Component{
    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            isRefreshing: false,
            dataSource: this.ds.cloneWithRows([]),
            dis: 0,
            config: {
                height: new Animated.Value(0)
            }
        };

        this.listviewOffsetY = 0;
        this.setPanResponder = this.setPanResponder.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
    }

    componentWillMount(){
        this.setState({
            dataSource: this.ds.cloneWithRows(this.props.cards)
        });
        this.setPanResponder();
    }

    componentWillReceiveProps(nextProps){
        if (this.state.dis !== 0){
            this.setState({
                dataSource: this.ds.cloneWithRows(nextProps.cards),
                dis: 0,
                isRefreshing: false
            });
            Animated.timing(this.state.config.height, {
                toValue: 0,
                duration: 500,
                easing: Easing.spring
            }).start();
        }else{
            this.setState({
                dataSource: this.ds.cloneWithRows(nextProps.cards)
            })
        }
    }

    setPanResponder() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                //console.log(gestureState.dy)
                if (this.state.isRefreshing){
                    return false;
                }else if(this.listviewOffsetY !== 0){
                    return false;
                }else if(gestureState.dy < 0){
                    return false;
                }
                return true;
            },
            onPanResponderGrant: (evt, gestureState) => {
                console.log("Grant")
            },
            onPanResponderMove: (evt, gestureState) => {
                let dis = gestureState.dy*0.7;
                this.setState({
                    dis: dis,
                    config:{
                        height: new Animated.Value(dis)
                    }
                });
            },
            onPanResponderRelease: () => {
                let end = 0;
                if(this.state.dis >= Utils.size.height*0.1){
                    end = Utils.size.height*0.1;
                    this.setState({
                        isRefreshing: true
                    })
                }
                Animated.timing(this.state.config.height, {
                    toValue: end,
                    duration: 500,
                    easing: Easing.spring
                }).start(() => this.props.refresh());
            }
        });
    }

    renderRow(card){
        return this.props.renderRow(card);
    }

    renderFooter(){
        return this.props.renderFooter();
    }

    render(){
        return(
            <View style={[styles.container]} {...this._panResponder.panHandlers}>
                <Animated.View style={[styles.refresh,{width: Utils.size.width, height:this.state.config.height}]}>

                </Animated.View>
                <ListView
                    onScroll={(e) => {this.listviewOffsetY = e.nativeEvent.contentOffset.y; console.log(this.listviewOffsetY)}}
                    style={{marginTop: 5}}
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    renderRow={(card) => this.renderRow(card)}
                    renderFooter={() => this.renderFooter()}
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
    cards: PropTypes.array.isRequired,
    renderRow: PropTypes.func.isRequired,
    renderFooter: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired
};