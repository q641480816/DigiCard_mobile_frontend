import React, { Component } from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import PropTypes from 'prop-types';

import Utils from '../../../../common/util';
import TextContent from './content/TextContent';
import ImageContent from './content/ImageContent';
import ElevatedView from "../../elevatedView/ElevatedView";

export default class Card extends Component{
    constructor(props) {
        super(props);

        this.state = {
            index: -1,
            frame:{
                width: 0, height:0
            },
            card:{
                width:0,height:0,unitFont:0
            },
            cardValue: {}
        };

    }

    componentWillMount(){
        let width = this.props.width;
        this.setState({
            index: this.props.index,
            frame: {width: width,height:width/Utils.ratio},
            card: Utils.cFunctions.getCardMatrix(width),
            cardValue: this.props.cardValue
        });
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            index: nextProps.index,
            frame: {width: nextProps.width,height:nextProps.width/Utils.ratio},
            card: Utils.cFunctions.getCardMatrix(nextProps.width),
            cardValue: nextProps.cardValue
        });
    }

    render(){
        this.content = [];
        for(let i = 0; i < this.state.cardValue.contentSet.length; i++){
            let temp = this.state.cardValue.contentSet[i];
            if(temp.type === 'text'){
                this.content.push(
                    <TextContent key={i} index={i} content={temp} card={this.state.card}/>
                );
            }else if(temp.type === 'img'){
                this.content.push(
                    <ImageContent key={i} index={i} content={temp} card={this.state.card}/>
                );
            }
        }

        return(
            <View style={[styles.container,{width:this.state.frame.width,height:this.state.frame.height}]}>
                <ElevatedView ref={"card"} elevation={3} style={[styles.card,{width:this.state.card.width,height: this.state.card.height}]}>
                    { this.content }
                </ElevatedView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    card:{
        backgroundColor: 'white',
        borderRadius: 2,
        borderWidth: 0.5,
        borderColor: '#787878',
    }
});

Card.propTypes = {
    index: PropTypes.number,
    cardValue: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    enableScaling: PropTypes.bool
};