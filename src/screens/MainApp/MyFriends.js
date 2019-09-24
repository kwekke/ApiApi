import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { ListItem, Left, Body, Thumbnail, Text, Right } from 'native-base';
import { ActivityIndicator, Title, IconButton } from 'react-native-paper';

export default class MyFriends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myFriends: [],
            friendRequestsSent: [],
            loading: true
        };
    }

    componentDidMount() {
        this.props.navigation.addListener('didFocus', async () => {
            this.setState({ loading: true });
            await this.updateMyFriends();
            this.setState({ loading: false });
        });
    }

    updateMyFriends = async () => {
        const myFriends = await this.props.screenProps.getMyFriends();
        const friendRequestsSent = await this.props.screenProps.getFriendRequestsSent();
        this.setState({ myFriends, friendRequestsSent });
    };

    renderMyFriends = ({ item: { id, username } }) => {
        return (
            <ListItem avatar>
                <TouchableOpacity
                    style={styles.listItemTouchable}
                    onPress={() => {
                        this.props.navigation.navigate('UserProfile', {
                            user: { id, name: username }
                        });
                    }}
                >
                    <View style={styles.listItemContainer}>
                        <Left>
                            <Thumbnail
                                square
                                style={styles.roomIcon}
                                source={{
                                    uri: `https://api.adorable.io/avatars/285/${id}.png`
                                }}
                            />
                        </Left>
                        <Body>
                            <Text style={styles.roomName}>{username}</Text>
                        </Body>
                    </View>
                </TouchableOpacity>
            </ListItem>
        );
    };

    renderFriendRequestsSent = ({ item: { id, username } }) => {
        return (
            <ListItem avatar>
                <TouchableOpacity
                    style={styles.listItemTouchable}
                    onPress={() => {
                        this.props.navigation.navigate('UserProfile', {
                            user: { id, name: username }
                        });
                    }}
                >
                    <View style={styles.listItemContainer}>
                        <Left>
                            <Thumbnail
                                square
                                style={styles.roomIcon}
                                source={{
                                    uri: `https://api.adorable.io/avatars/285/${id}.png`
                                }}
                            />
                        </Left>
                        <Body>
                            <Text style={styles.roomName}>{username}</Text>
                        </Body>
                        <Right style={styles.listItemContainer}>
                            <IconButton
                                icon="cancel"
                                onPress={async () => {
                                    await this.props.screenProps.cancelFriendRequest(
                                        id
                                    );
                                    this.updateMyFriends();
                                }}
                            />
                        </Right>
                    </View>
                </TouchableOpacity>
            </ListItem>
        );
    };

    render() {
        return (
            <View style={styles.container}>
                {this.state.loading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <View style={styles.listContainer}>
                        <View style={styles.titleContainer}>
                            <Title>My Friends</Title>
                        </View>
                        <FlatList
                            data={this.state.myFriends}
                            renderItem={item => this.renderMyFriends(item)}
                            keyExtractor={item => item.id}
                        />
                        <View style={styles.titleContainer}>
                            <Title>Friend Requests Sent</Title>
                        </View>
                        <FlatList
                            data={this.state.friendRequestsSent}
                            renderItem={item =>
                                this.renderFriendRequestsSent(item)
                            }
                            keyExtractor={item => item.id}
                        />
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    listContainer: {
        flex: 1,
        position: 'absolute',
        top: 0,
        width: '100%'
    },
    titleContainer: {
        backgroundColor: '#fbeeff',
        paddingLeft: 10
    },
    roomIcon: { height: 50, width: 50 },
    roomName: { fontSize: 25 },
    addRoomIconContainer: { justifyContent: 'center' },
    addRoomIcon: { color: 'black', fontSize: 25 },
    listItemTouchable: {
        flex: 1
    },
    listItemContainer: {
        flexDirection: 'row'
    }
});
