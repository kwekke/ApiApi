import React, { Component } from 'react';
import {
    Alert,
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    Container,
    Content,
    ListItem,
    Left,
    Body,
    Thumbnail,
    Text
} from 'native-base';
import { ActivityIndicator } from 'react-native-paper';
import Swipeout from 'react-native-swipeout';

export default class MyChats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            joinedRooms: [],
            pmRooms: [],
            loading: true
        };
        this.currentSwipeoutId = null;
        this.swipeoutRefs = {};
    }

    componentDidMount() {
        this.props.navigation.addListener('didFocus', async () => {
            this.setState({ loading: true });
            await this.updateRooms();
            this.setState({ loading: false });
        });
    }

    updateRooms = async () => {
        const joinedRooms = this.props.screenProps.getJoinedRooms();
        const pmRooms = await this.props.screenProps.getPmRooms();
        this.setState({ joinedRooms, pmRooms });
    };

    enterRoom = room => {
        console.log('entering room...', room);
        this.props.navigation.navigate('ChatRoom', {
            room
        });
    };

    enterPmRoom = (roomId, userId, username) => {
        console.log('entering pm room...');
        this.props.navigation.push('PmRoom', {
            roomId,
            userId,
            username
        });
    };

    renderPmRoom = ({ item: { roomId, userId, username } }) => {
        const swipeoutSettings = {
            ref: swipeoutRef => {
                this.swipeoutRefs[roomId] = swipeoutRef;
            },
            onOpen: () => {
                if (
                    this.currentSwipeoutId &&
                    this.swipeoutRefs[this.currentSwipeoutId]
                ) {
                    this.swipeoutRefs[this.currentSwipeoutId]._close();
                }
                this.currentSwipeoutId = roomId;
            },
            onClose: () => {
                if (this.currentSwipeoutId) {
                    this.currentSwipeoutId = null;
                }
            },
            right: [
                {
                    text: 'Delete',
                    type: 'delete',
                    onPress: () => {
                        Alert.alert(
                            'Delete Chat',
                            'Are you sure you want to permanently delete this chat?',
                            [
                                {
                                    text: 'No',
                                    onPress: () => {
                                        console.log('Cancel leave room');
                                        this.swipeoutRefs[
                                            this.currentSwipeoutId
                                        ]._close();
                                    },
                                    style: 'cancel'
                                },
                                {
                                    text: 'Yes',
                                    onPress: async () => {
                                        console.log('Confirmed leave room');
                                        await this.props.screenProps.deletePmRoom(
                                            this.currentSwipeoutId,
                                            userId
                                        );
                                        this.updateRooms();
                                    }
                                }
                            ],
                            { cancelable: false }
                        );
                    }
                }
            ],
            backgroundColor: '#ffffff'
        };
        return (
            <Swipeout {...swipeoutSettings}>
                <ListItem avatar>
                    <TouchableOpacity
                        style={styles.listItemTouchable}
                        onPress={() => {
                            this.enterPmRoom(roomId, userId, username);
                        }}
                    >
                        <View style={styles.listItemContainer}>
                            <Left>
                                <Thumbnail
                                    square
                                    style={styles.roomIcon}
                                    source={{
                                        uri: `https://api.adorable.io/avatars/285/${roomId}.png`
                                    }}
                                />
                            </Left>
                            <Body>
                                <Text style={styles.roomName}>{username}</Text>
                                <Text note>Private chat</Text>
                            </Body>
                        </View>
                    </TouchableOpacity>
                </ListItem>
            </Swipeout>
        );
    };

    renderJoinedRoom = ({ item }) => {
        const swipeoutSettings = {
            ref: swipeoutRef => {
                this.swipeoutRefs[item.id] = swipeoutRef;
            },
            onOpen: () => {
                if (
                    this.currentSwipeoutId &&
                    this.swipeoutRefs[this.currentSwipeoutId]
                ) {
                    this.swipeoutRefs[this.currentSwipeoutId]._close();
                }
                this.currentSwipeoutId = item.id;
            },
            onClose: () => {
                if (this.currentSwipeoutId) {
                    this.currentSwipeoutId = null;
                }
            },
            right: [
                {
                    text: 'Leave',
                    type: 'delete',
                    onPress: () => {
                        Alert.alert(
                            'Leaving Room',
                            'Are you sure you want to permanently leave this room?',
                            [
                                {
                                    text: 'No',
                                    onPress: () => {
                                        console.log('Cancel leave room');
                                        this.swipeoutRefs[
                                            this.currentSwipeoutId
                                        ]._close();
                                    },
                                    style: 'cancel'
                                },
                                {
                                    text: 'Yes',
                                    onPress: async () => {
                                        console.log('Confirmed leave room');
                                        await this.props.screenProps.leaveRoom(
                                            this.currentSwipeoutId
                                        );
                                        this.updateRooms();
                                    }
                                }
                            ],
                            { cancelable: false }
                        );
                    }
                }
            ],
            backgroundColor: '#ffffff'
        };
        return (
            <Swipeout {...swipeoutSettings}>
                <ListItem avatar>
                    <TouchableOpacity
                        style={styles.listItemTouchable}
                        onPress={() => {
                            this.enterRoom(item);
                        }}
                    >
                        <View style={styles.listItemContainer}>
                            <Left>
                                <Thumbnail
                                    square
                                    style={styles.roomIcon}
                                    source={{
                                        uri: `https://api.adorable.io/avatars/285/${
                                            item.id
                                        }.png`
                                    }}
                                />
                            </Left>
                            <Body>
                                <Text style={styles.roomName}>{item.name}</Text>
                                <Text note>{`${item.distance.toFixed(
                                    2
                                )}km away`}</Text>
                            </Body>
                        </View>
                    </TouchableOpacity>
                </ListItem>
            </Swipeout>
        );
    };

    render() {
        return (
            <View style={styles.container}>
                {this.state.loading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <View style={styles.listContainer}>
                        <FlatList
                            data={this.state.pmRooms}
                            renderItem={item => this.renderPmRoom(item)}
                            keyExtractor={item => item.roomId}
                        />
                        <FlatList
                            data={this.state.joinedRooms}
                            renderItem={item => this.renderJoinedRoom(item)}
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
    listItemTouchable: {
        flex: 1
    },
    listItemContainer: {
        flexDirection: 'row'
    },
    roomIcon: { height: 50, width: 50 },
    roomName: { fontSize: 25 }
});
