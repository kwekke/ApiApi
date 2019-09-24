import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Card, Paragraph } from 'react-native-paper';

export default class Banned extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Card elevation={2} style={styles.card}>
                    <Card.Title
                        title="Banned"
                        left={props => <Avatar.Icon {...props} icon="block" />}
                    />
                    <Card.Content>
                        <Paragraph>
                            You have been banned from ApiApi due to
                            inappropriate behaviour.
                        </Paragraph>
                    </Card.Content>
                </Card>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fbeeff'
    },
    card: { width: '95%' }
});
