import React, { Component } from 'react';
import { Alert } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import Login from './Login';
import Signup from './Signup';

import CustomHeader from '../../components/CustomHeader';

const AuthNavigator = createAppContainer(
    createStackNavigator({
        Login: {
            screen: Login,
            navigationOptions: () => ({
                header: null
            })
        },
        Signup: {
            screen: Signup,
            navigationOptions: ({ navigation }) => ({
                header: (
                    <CustomHeader
                        title={'Create a new account'}
                        goBack={navigation.goBack}
                    />
                )
            })
        }
    })
);

export default class Auth extends Component {
    componentDidUpdate() {
        if (this.props.screenProps.signedIn) {
            this.props.navigation.navigate('App');
        }
    }

    signup = async (email, username, password) => {
        try {
            await this.props.screenProps.signup(email, username, password);
            Alert.alert('Sign up successful. You are now logged in');
        } catch (error) {
            console.log(error);
            Alert.alert(error.message);
        }
    };

    login = async (email, password) => {
        try {
            await this.props.screenProps.login(email, password);
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    render() {
        return (
            <AuthNavigator
                screenProps={{ signup: this.signup, login: this.login }}
            />
        );
    }
}
