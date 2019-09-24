import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export default class AuthLoading extends React.Component {
    componentDidUpdate() {
        if (this.props.screenProps.doneLoading) {
            this.props.navigation.navigate(
                this.props.screenProps.user ? 'App' : 'Auth'
            );
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
