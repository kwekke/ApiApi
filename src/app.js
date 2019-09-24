import React, { Component } from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import { auth, db } from './api/firebase';
import {
    ChatManager,
    TokenProvider,
    tokenUrl,
    instanceLocator
} from './api/pusher-chatkit';
import { API_API_SERVER } from './api/apiapi-server';

import AuthLoading from './screens/AuthLoading';
import Auth from './screens/Auth';
import MainApp from './screens/MainApp';
import Banned from './screens/Banned';

const SwitchNavigator = createAppContainer(
    createSwitchNavigator({
        AuthLoading: AuthLoading,
        App: MainApp,
        Auth: Auth,
        Banned: Banned
    })
);

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doneLoading: false,
            signedIn: false,
            user: null,
            chatkitUser: null,
            signingUp: false
        };
    }

    componentDidMount() {
        auth.onAuthStateChanged(async user => {
            console.log(
                user,
                user ? 'Signed into ApiApi' : 'Signed out of ApiApi'
            );
            if (user && !this.state.signingUp) {
                const chatkitUser = await this._connectToChatkit(user);
                await this.setState({ user, chatkitUser, signedIn: true });
            } else {
                await this.setState({
                    user,
                    chatkitUser: null,
                    signedIn: false
                });
            }
            if (!this.doneLoading) {
                await this.setState({ doneLoading: true });
            }
        });
    }

    _connectToChatkit = async user => {
        const chatManager = new ChatManager({
            instanceLocator,
            userId: user.uid,
            tokenProvider: new TokenProvider({
                url: tokenUrl
            })
        });
        return await chatManager.connect();
    };

    login = async (email, password) => {
        await auth.signInWithEmailAndPassword(email, password);
    };

    signup = async (email, username, password) => {
        await this.setState({ signingUp: true });
        const response1 = await auth.createUserWithEmailAndPassword(
            email,
            password
        );
        const user = response1.user;
        const response2 = await fetch(`${API_API_SERVER}users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: user.uid, username })
        });
        user.updateProfile({ displayName: username });
        db.collection('users')
            .doc(user.uid)
            .set({ username, reports: [] });
        db.collection('settings')
            .doc(user.uid)
            .set({ range: '5' });
        db.collection('friends')
            .doc(user.uid)
            .set({});
        db.collection('rooms')
            .doc(user.uid)
            .set({});
        this.setState({ signingUp: false });
        if (response2.ok) {
            const chatkitUser = await this._connectToChatkit(user);
            await this.setState({ user, chatkitUser, signedIn: true });
            return;
        } else {
            throw await response2.json();
        }
    };

    logout = async () => {
        await auth.signOut();
    };

    render() {
        return (
            <SwitchNavigator
                screenProps={{
                    ...this.state,
                    login: this.login,
                    signup: this.signup,
                    logout: this.logout
                }}
            />
        );
    }
}
