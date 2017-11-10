import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    BackHandler, Text, Button
} from 'react-native';
import { ThemeProvider } from 'react-native-material-ui';
import { NavigationActions } from 'react-navigation';

import Utils from '../../common/util';
import PStorage from '../../common/persistantStorage';

class TestEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            card:{
                width:Utils.size.width * 0.98,
                height:Utils.size.width * 0.98 / Utils.ratio
            },
            contentSet:[],
            account: null
        };

        this.logout = this.logout.bind(this);
    }

    componentWillMount(){
        this.setState({account: Utils.account});
    }

    logout(){
        Utils.account = null;
        PStorage.load({
            key: 'account'
        }).then(ret => {
            PStorage.save({
                key: 'account',
                data: {
                    email: ret.email,
                    password: ret.password,
                    status: false
                }
            })
        }).catch(err=>{
            console.log(err);
        });
        this.props.navigation.dispatch(resetAction);
    }

    render() {
        return(
            <ThemeProvider uiTheme={Utils.MaterialUITheme}>
                <View style={styles.container}>
                    <Text>
                        Account View
                    </Text>
                    <Text>
                        Email: {this.state.account.email}
                    </Text>
                    <Text>
                        Secret: {this.state.account.secret}
                    </Text>
                    <Button
                        onPress={()=>this.logout()}
                        title="Log out"
                        color="#841584"
                    />
                </View>
            </ThemeProvider>
        )
    }
}

const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'Onboarding'}),
    ]
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    }
});

module.exports = TestEdit;


