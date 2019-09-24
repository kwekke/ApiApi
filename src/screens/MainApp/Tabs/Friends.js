import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { ListItem, Left, Body, Thumbnail, Text, Right } from 'native-base';
import { ActivityIndicator, Title, IconButton } from 'react-native-paper';

export default class Friends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            friendRequests: [],
            nearbyUsers: [],
            loading: true
        };
    }

    componentDidMount() {
        this.props.navigation.addListener('didFocus', async () => {
            this.setState({ loading: true });
            await this.updateFriends();
            this.setState({ loading: false });
        });
    }

    updateFriends = async () => {
        const friendRequests = await this.props.screenProps.getFriendRequests();
        const nearbyUsers = await this.props.screenProps.getNearbyUsers();
        this.setState({ friendRequests, nearbyUsers });
    };

    renderFriendRequest = ({ item: { id, username } }) => {
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
                                icon="check"
                                onPress={async () => {
                                    await this.props.screenProps.acceptFriendRequest(
                                        id
                                    );
                                    this.updateFriends();
                                }}
                            />
                            <IconButton
                                icon="close"
                                onPress={async () => {
                                    await this.props.screenProps.declineFriendRequest(
                                        id
                                    );
                                    this.updateFriends();
                                }}
                            />
                        </Right>
                    </View>
                </TouchableOpacity>
            </ListItem>
        );
    };

    renderNearbyUsers = ({ item: { id, username, distance } }) => {
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
                            <Text note>{`${distance.toFixed(2)}km away`}</Text>
                        </Body>
                        <Right style={styles.listItemContainer}>
                            <IconButton
                                icon="person-add"
                                onPress={async () => {
                                    await this.props.screenProps.sendFriendRequest(
                                        id
                                    );
                                    this.updateFriends();
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
                            <Title>Friend Requests</Title>
                        </View>
                        <FlatList
                            data={this.state.friendRequests}
                            renderItem={item => this.renderFriendRequest(item)}
                            keyExtractor={item => item.id}
                        />
                        <View style={styles.titleContainer}>
                            <Title>Recommended Friends Nearby</Title>
                        </View>
                        <FlatList
                            data={this.state.nearbyUsers}
                            renderItem={item => this.renderNearbyUsers(item)}
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
