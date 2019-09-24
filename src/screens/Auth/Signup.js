import React, { Component } from 'react';
import {
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Alert
} from 'react-native';
import { Content, Form, Item, Input, Icon, Text } from 'native-base';

import LoginBackground from '../../assets/images/LoginBackground.jpg';

export default class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            username: '',
            password: '',
            password2: ''
        };
    }

    render() {
        return (
            <ImageBackground
                source={LoginBackground}
                style={styles.backgroundImage}
            >
                <Content padder contentContainerStyle={styles.content}>
                    <Form style={styles.form}>
                        <Item rounded style={styles.textInput}>
                            <Icon active name="mail" style={styles.whiteText} />
                            <Input
                                placeholder="Email"
                                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                style={styles.whiteText}
                                onChangeText={email => this.setState({ email })}
                                value={this.state.email}
                            />
                        </Item>
                        <Item rounded style={styles.textInput}>
                            <Icon
                                active
                                name="person"
                                style={styles.whiteText}
                            />
                            <Input
                                placeholder="Username"
                                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                style={styles.whiteText}
                                onChangeText={username =>
                                    this.setState({ username })
                                }
                                value={this.state.username}
                            />
                        </Item>
                        <Item rounded style={styles.textInput}>
                            <Icon active name="lock" style={styles.whiteText} />
                            <Input
                                placeholder="Password"
                                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                style={styles.whiteText}
                                secureTextEntry
                                onChangeText={password =>
                                    this.setState({ password })
                                }
                                value={this.state.password}
                            />
                        </Item>
                        <Item rounded style={styles.textInput}>
                            <Icon active name="lock" style={styles.whiteText} />
                            <Input
                                placeholder="Confirm Password"
                                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                style={styles.whiteText}
                                secureTextEntry
                                onChangeText={password2 =>
                                    this.setState({ password2 })
                                }
                                value={this.state.password2}
                            />
                        </Item>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.signupButton}
                            onPress={async () => {
                                if (
                                    this.state.password === this.state.password2
                                ) {
                                    await this.props.screenProps.signup(
                                        this.state.email,
                                        this.state.username,
                                        this.state.password
                                    );
                                } else {
                                    Alert.alert('Password is not consistent.');
                                    this.setState({
                                        password: '',
                                        password2: ''
                                    });
                                }
                            }}
                        >
                            <Text style={styles.signupText}>Sign Up</Text>
                        </TouchableOpacity>
                    </Form>
                </Content>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: null,
        height: null
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: 50
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 40,
        alignSelf: 'center'
    },
    form: {
        marginLeft: 20,
        marginRight: 20
    },
    textInput: {
        marginBottom: 10,
        paddingLeft: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderColor: 'transparent'
    },
    signupButton: {
        height: 50,
        marginTop: 10,
        backgroundColor: 'rgba(92, 55, 158, 0.9)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 0,
        borderRadius: 25
    },
    whiteText: { color: 'rgba(255, 255, 255, 0.7)' },
    signupText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 20,
        fontWeight: 'bold'
    }
});
