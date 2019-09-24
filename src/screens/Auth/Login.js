import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ImageBackground,
    TouchableOpacity
} from 'react-native';
import { Content, Form, Item, Input, Thumbnail, Icon, Text } from 'native-base';

import LoginBackground from '../../assets/images/LoginBackground.jpg';
import Logo from '../../assets/images/Logo.png';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }

    render() {
        return (
            <ImageBackground
                source={LoginBackground}
                style={styles.backgroundImage}
            >
                <Content padder contentContainerStyle={styles.content}>
                    <Thumbnail source={Logo} style={styles.logo} />
                    <Form style={styles.form}>
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
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.loginButton}
                            onPress={() => {
                                this.props.screenProps.login(
                                    this.state.username,
                                    this.state.password
                                );
                                this.setState({ password: '' });
                            }}
                        >
                            <Text style={styles.loginText}>Log In</Text>
                        </TouchableOpacity>
                        <View style={styles.signUpButton}>
                            <Text style={styles.whiteText}>
                                Don't have an account? Sign up {''}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate('Signup');
                                }}
                            >
                                <Text style={{ color: '#ffffe0' }}>here</Text>
                            </TouchableOpacity>
                        </View>
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
        justifyContent: 'center'
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
    loginButton: {
        height: 50,
        marginTop: 10,
        backgroundColor: 'rgba(92, 55, 158, 0.9)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 0,
        borderRadius: 25
    },
    signUpButton: {
        alignSelf: 'center',
        flexDirection: 'row',
        position: 'absolute',
        bottom: -130
    },
    whiteText: { color: 'rgba(255, 255, 255, 0.7)' },
    loginText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 20,
        fontWeight: 'bold'
    }
});
