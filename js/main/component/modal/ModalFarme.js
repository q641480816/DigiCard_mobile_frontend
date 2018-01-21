import React, { Component } from 'react';
import {
    StyleSheet,
    Modal,
    View,
    Animated,
    Easing,
    ScrollView,
    TouchableWithoutFeedback
} from 'react-native';
import PropTypes from 'prop-types';
import { responsiveFontSize,responsiveHeight,responsiveWidth } from '../../component/responsive/responsive';
import Utils from "../../../common/util";

export default class ModalFrame extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isShow: false,
            config: {
                opacity: new Animated.Value(0)
            }
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);

    }

    componentWillMount(){
        //
    }

    componentDidMount(){

    }

    componentWillReceiveProps(nextProps){
        //
        if (nextProps.isShow && nextProps.isShow !== this.state.isShow){
            this.open();
        }else if(!nextProps.isShow && nextProps.isShow !== this.state.isShow){
            this.close();
        }

    }

    open(){
        this.setState({
            isShow: true
        });
        Animated.timing(this.state.config.opacity, {
            toValue: 1,
            duration: 300,
            easing: Easing.spring
        }).start();
    }

    close(){
        Animated.timing(this.state.config.opacity, {
            toValue: 0,
            duration: 300,
            easing: Easing.spring
        }).start(()=>{
            this.setState({
                isShow: false
            });
        });
    }

    render(){
        const children = this.props.children;
        return(
            <Modal visible={this.state.isShow} transparent={true} animationType={'none'} onRequestClose={() => this.props.backPress()}>
                <ScrollView>
                    <Animated.View style={[styles.container,{opacity: this.state.config.opacity, height: Utils.size.realVerticalH}]}>
                        <View style={[styles.cover,{height: Utils.size.realVerticalH}]}/>
                        <TouchableWithoutFeedback onPress={()=>{
                            this.props.bgPress()
                        }}>
                            <View style={[styles.content,{height: Utils.size.realVerticalH}]}>
                                {children}
                            </View>
                        </TouchableWithoutFeedback>
                    </Animated.View>
                </ScrollView>
            </Modal>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        width: Utils.size.width,
        backgroundColor: 'transparent'
    },
    cover: {
        width: Utils.size.width,
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'black',
        opacity: 0.55,
        zIndex: 1
    },
    content:{
        width: Utils.size.width,
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex:2
    }
});

ModalFrame.propTypes = {
    isShow: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    backPress: PropTypes.func,
    bgPress: PropTypes.func
};

ModalFrame.defaultProps = {
    isShow: false,
    node: null,
    backPress: null,
    bgPress: ()=>{}
};