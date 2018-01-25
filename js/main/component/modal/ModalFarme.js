import React, { Component } from 'react';
import {
    StyleSheet,
    Modal,
    View,
    Animated,
    Easing,
    ScrollView,
    Keyboard,
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
            height: 0,
            position: '',
            duration: 0,
            config: {
                opacity: new Animated.Value(0)
            }
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.keyboardShow = this.keyboardShow.bind(this);
        this.keyboardHide = this.keyboardHide.bind(this);
    }

    componentWillMount(){
        this.setState({
            position: this.props.position,
            height: Utils.size.realVerticalH,
            duration: this.props.duration
        })
        //
    }

    componentDidMount(){
        //
    }

    componentWillUnmount() {
        //
    }

    componentWillReceiveProps(nextProps){
        //
        if (nextProps.isShow && nextProps.isShow !== this.state.isShow){
            this.open();
        }else if(!nextProps.isShow && nextProps.isShow !== this.state.isShow){
            this.close();
        }

    }

    keyboardShow(e){
        this.setState({
            height: Utils.size.realVerticalH - e.endCoordinates.height
        });
    }

    keyboardHide(e){
        this.setState({
            height: Utils.size.realVerticalH
        });
    }

    open(){
        if(this.state.height === 0){
            this.setState({
                isShow: true,
                height: Utils.size.realVerticalH
            });
        }else {
            this.setState({
                isShow: true
            });
        }
        Animated.timing(this.state.config.opacity, {
            toValue: 1,
            duration: this.state.duration,
            easing: Easing.spring
        }).start(()=>{
            Keyboard.addListener('keyboardDidShow', this.keyboardShow);
            Keyboard.addListener('keyboardDidHide', this.keyboardHide);
        });
    }

    close(){
        Animated.timing(this.state.config.opacity, {
            toValue: 0,
            duration: this.state.duration,
            easing: Easing.spring
        }).start(()=>{
            Keyboard.removeListener('keyboardDidShow',this.keyboardShow);
            Keyboard.removeListener('keyboardDidHide', this.keyboardHide);
            this.setState({
                isShow: false,
                height: Utils.size.realVerticalH
            });
        });
    }

    render(){
        const children = this.props.children;
        return(
            <Modal visible={this.state.isShow} transparent={true} animationType={'none'} onRequestClose={() => this.props.backPress()}>
                <Animated.View style={[styles.container,{opacity: this.state.config.opacity, height: this.state.height}]}>
                    <View style={[styles.cover,{height: this.state.height}]}/>
                    <TouchableWithoutFeedback onPress={()=>{
                        this.props.bgPress()
                    }}>
                        <View style={[styles.content,{height: this.state.height, justifyContent: this.state.position}]}>
                            {children}
                        </View>
                    </TouchableWithoutFeedback>
                </Animated.View>
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
        opacity: 0.65,
        zIndex: 1
    },
    content:{
        width: Utils.size.width,
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'transparent',
        alignItems: 'center',
        zIndex:2
    }
});

ModalFrame.propTypes = {
    isShow: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    backPress: PropTypes.func,
    bgPress: PropTypes.func,
    position: PropTypes.string,
    duration: PropTypes.number
};

ModalFrame.defaultProps = {
    isShow: false,
    node: null,
    backPress: ()=>{},
    bgPress: ()=>{},
    position: 'center',
    duration: 300
};