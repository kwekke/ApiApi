import React, { Component } from 'react';
import { Alert, PermissionsAndroid } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { Appbar, IconButton } from 'react-native-paper';

import { db, GeoPoint, FieldValue } from '../../api/firebase';
import { API_API_SERVER } from '../../api/apiapi-server';

import MyChats from './Tabs/MyChats';
import FindChatRooms from './Tabs/FindChatRooms';
import Friends from './Tabs/Friends';
import Profile from './Tabs/Profile';
import ChatRoom from './ChatRoom';
import CreateRoom from './CreateRoom';
import UserProfile from './UserProfile';
import PmRoom from './PmRoom';
import MyFriends from './MyFriends';

import CustomHeader from '../../components/CustomHeader';

const MainAppNavigator = createAppContainer(
    createStackNavigator({
        Tabs: {
            screen: createMaterialBottomTabNavigator({
                MyChats: {
                    screen: createStackNavigator({
                        MyChats: {
                            screen: MyChats,
                            navigationOptions: ({
                                navigation,
                                screenProps
                            }) => {
                                return {
                                    header: (
                                        <CustomHeader
                                            title={'My Chats'}
                                            logout={screenProps.logout}
                                            right={
                                                <Appbar.Action
                                                    icon="add"
                                                    onPress={() =>
                                                        navigation.navigate(
                                                            'CreateRoom'
                                                        )
                                                    }
                                                />
                                            }
                                        />
                                    )
                                };
                            }
                        }
                    }),
                    navigationOptions: () => ({
                        title: 'Chats',
                        tabBarIcon: ({ tintColor }) => (
                            <IconButton
                                icon="chat"
                                color={tintColor}
                                size={24}
                                style={{ bottom: 13 }}
                            />
                        )
                    })
                },
                FindChatRooms: {
                    screen: FindChatRooms,
                    navigationOptions: () => ({
                        title: 'Explore',
                        tabBarIcon: ({ tintColor }) => (
                            <IconButton
                                icon="explore"
                                color={tintColor}
                                size={24}
                                style={{ bottom: 13 }}
                            />
                        )
                    })
                },
                Friends: {
                    screen: createStackNavigator({
                        Friends: {
                            screen: Friends,
                            navigationOptions: ({
                                navigation,
                                screenProps
                            }) => {
                                return {
                                    header: (
                                        <CustomHeader
                                            title={'Friends'}
                                            logout={screenProps.logout}
                                            right={
                                                <Appbar.Action
                                                    icon="people-outline"
                                                    onPress={() =>
                                                        navigation.navigate(
                                                            'MyFriends'
                                                        )
                                                    }
                                                />
                                            }
                                        />
                                    )
                                };
                            }
                        }
                    }),
                    navigationOptions: () => ({
                        title: 'Friends',
                        tabBarIcon: ({ tintColor }) => (
                            <IconButton
                                icon="people"
                                color={tintColor}
                                size={24}
                                style={{ bottom: 13 }}
                            />
                        )
                    })
                },
                Profile: {
                    screen: createStackNavigator({
                        Dummy: {
                            screen: Profile,
                            navigationOptions: ({ screenProps }) => ({
                                header: (
                                    <CustomHeader
                                        title={'Profile'}
                                        logout={screenProps.logout}
                                    />
                                )
                            })
                        }
                    }),
                    navigationOptions: () => ({
                        title: 'Profile',
                        tabBarIcon: ({ tintColor }) => (
                            <IconButton
                                icon="account-box"
                                color={tintColor}
                                size={24}
                                style={{ bottom: 13 }}
                            />
                        )
                    })
                }
            }),
            navigationOptions: () => ({ header: null })
        },
        ChatRoom: {
            screen: ChatRoom,
            navigationOptions: ({ navigation, screenProps }) => {
                const room = navigation.getParam('room', {
                    name: 'Room not found'
                });
                return {
                    header: (
                        <CustomHeader
                            title={room.name}
                            goBack={() => {
                                screenProps.exitRoom(room.id);
                                navigation.popToTop();
                            }}
                        />
                    )
                };
            }
        },
        CreateRoom: {
            screen: CreateRoom,
            navigationOptions: ({ navigation }) => ({
                header: (
                    <CustomHeader
                        title={'Create New Room'}
                        goBack={navigation.goBack}
                    />
                )
            })
        },
        UserProfile: {
            screen: UserProfile,
            navigationOptions: ({ navigation }) => {
                const user = navigation.getParam('user', {
                    _id: '0',
                    name: 'No name found'
                });
                return {
                    header: (
                        <CustomHeader
                            title={`${user.name}'s Profile`}
                            goBack={navigation.goBack}
                        />
                    )
                };
            }
        },
        PmRoom: {
            screen: PmRoom,
            navigationOptions: ({ navigation, screenProps }) => {
                const roomId = navigation.getParam('roomId', '0');
                const username = navigation.getParam('username', 'No Username');
                return {
                    header: (
                        <CustomHeader
                            title={username}
                            goBack={() => {
                                screenProps.exitRoom(roomId);
                                navigation.goBack();
                            }}
                        />
                    )
                };
            }
        },
        MyFriends: {
            screen: MyFriends,
            navigationOptions: ({ navigation }) => ({
                header: (
                    <CustomHeader
                        title={'My Friends'}
                        goBack={() => {
                            navigation.goBack();
                        }}
                    />
                )
            })
        }
    })
);

export default class MainApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLocation: {
                latitude: 1.3521,
                longitude: 103.8198
            },
            sortMethod: null,
            range: '5'
        };
    }

    async componentDidMount() {
        // Check if user is reported too many times
        const userDoc = await db
            .collection('users')
            .doc(this.props.screenProps.user.uid)
            .get();
        if (userDoc.data().reports.length >= 10) {
            await this.props.screenProps.logout();
            this.props.navigation.navigate('Banned');
            return;
        }

        // Request Permission to use Location Service
        const permissionGranted = await this._requestLocationPermission();
        if (!permissionGranted) {
            this.logout();
            Alert.alert('Logged out. Location service is required.');
        }

        // Client Location Listener
        this.watchId = navigator.geolocation.watchPosition(
            ({ coords: { latitude, longitude } }) => {
                db.collection('locations')
                    .doc(this.props.screenProps.user.uid)
                    .set({
                        currentLocation: new GeoPoint(latitude, longitude)
                    });
            },
            error => console.log('watch position error', error)
        );

        // DB Location Listener
        db.collection('locations')
            .doc(this.props.screenProps.user.uid)
            .onSnapshot(doc => {
                const { currentLocation } = doc.data();
                this.setState({
                    currentLocation: {
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude
                    }
                });
            });

        // DB Settings Listener
        db.collection('settings')
            .doc(this.props.screenProps.user.uid)
            .onSnapshot(doc => {
                const { range } = doc.data();
                this.setState({ range });
            });
    }

    // Helper functions used only in MainApp/index.js
    _requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message:
                        'ApiApi needs access to your location to function properly'
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.warn(err);
        }
    };

    _sortJoinableRooms = (joinableRooms, method) => {
        let sortedJoinableRooms = joinableRooms.slice();
        if (method === 'distance') {
            sortedJoinableRooms.sort(
                (room1, room2) => room1.distance - room2.distance
            );
        }
        return sortedJoinableRooms;
    };

    _getUsernameById = async userId => {
        const doc = await db
            .collection('users')
            .doc(userId)
            .get();
        return doc.data().username;
    };

    // Functions used in screenProps
    logout = async () => {
        try {
            await this.props.screenProps.logout();
            navigator.geolocation.clearWatch(this.watchId);
            this.props.navigation.navigate('Auth');
        } catch (error) {
            Alert.alert('Error Logging out');
        }
    };

    getJoinedRooms = () => {
        let joinedRooms = this.props.screenProps.chatkitUser.rooms;
        joinedRooms = joinedRooms
            .filter(room => !room.isPrivate)
            .map(room => {
                const distance = this.calcDistance(
                    this.state.currentLocation,
                    room.customData.location
                );
                room.distance = distance;
                return room;
            });
        console.log('Get joined rooms called', joinedRooms);
        return joinedRooms;
    };

    getJoinableRooms = async () => {
        let joinableRooms = await this.props.screenProps.chatkitUser.getJoinableRooms();
        joinableRooms = joinableRooms
            .map(room => {
                const distance = this.calcDistance(
                    this.state.currentLocation,
                    room.customData.location
                );
                room.distance = distance;
                return room;
            })
            .filter(room => room.distance <= this.state.range);
        joinableRooms = this._sortJoinableRooms(
            joinableRooms,
            this.state.sortMethod
        );
        console.log('Get joinable rooms called', joinableRooms);
        return joinableRooms;
    };

    getPmRooms = async () => {
        const doc = await db
            .collection('rooms')
            .doc(this.props.screenProps.user.uid)
            .get();
        const pmRooms = await Promise.all(
            Object.entries(doc.data()).map(async room => {
                const userId = room[0];
                const roomId = room[1];
                const username = await this._getUsernameById(userId);
                return { userId, username, roomId };
            })
        );
        console.log('Get pm rooms called', pmRooms);
        return pmRooms;
    };

    createRoom = async name => {
        console.log('creating room...');
        try {
            const room = await this.props.screenProps.chatkitUser.createRoom({
                name,
                customData: { location: this.state.currentLocation }
            });
            console.log('Room created:', room);
            return room;
        } catch (error) {
            console.log(error);
        }
    };

    joinRoom = async roomId => {
        try {
            await this.props.screenProps.chatkitUser.joinRoom({
                roomId
            });
            Alert.alert('Room added to your chats');
        } catch (error) {
            console.log(error);
        }
    };

    exitRoom = async roomId => {
        console.log('exiting room...');
        // cancel subscription using subscribe
        await this.props.screenProps.chatkitUser.subscribeToRoomMultipart({
            roomId
        });
    };

    leaveRoom = async roomId => {
        console.log('permanently leaving room...');
        await this.props.screenProps.chatkitUser.leaveRoom({ roomId });
    };

    deletePmRoom = async (roomId, userId) => {
        console.log('permanently deleting pm room...', roomId);
        const response = await fetch(`${API_API_SERVER}delete-room`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomId })
        });
        if (response.ok) {
            const roomObj1 = {};
            roomObj1[userId] = FieldValue.delete();
            db.collection('rooms')
                .doc(this.props.screenProps.user.uid)
                .update(roomObj1);

            const roomObj2 = {};
            roomObj2[this.props.screenProps.user.uid] = FieldValue.delete();
            db.collection('rooms')
                .doc(userId)
                .update(roomObj2);
        } else {
            console.log(await response2.json());
        }
    };

    calcDistance = (location1, location2) => {
        const { latitude: lat1, longitude: lon1 } = location1;
        const { latitude: lat2, longitude: lon2 } = location2;
        if (lat1 == lat2 && lon1 == lon2) {
            return 0;
        } else {
            const radlat1 = (Math.PI * lat1) / 180;
            const radlat2 = (Math.PI * lat2) / 180;
            const theta = lon1 - lon2;
            const radtheta = (Math.PI * theta) / 180;
            let dist =
                Math.sin(radlat1) * Math.sin(radlat2) +
                Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = (dist * 180) / Math.PI;
            dist = dist * 60 * 1.1515 * 1.609344;
            return dist;
        }
    };

    setSortMethod = sortMethod => {
        this.setState({ sortMethod });
    };

    setRange = range => {
        db.collection('settings')
            .doc(this.props.screenProps.user.uid)
            .update({ range });
    };

    friendStatusCheck = async userId => {
        const doc = await db
            .collection('friends')
            .doc(this.props.screenProps.user.uid)
            .get();
        const status = doc.data()[userId];
        if (status === true) {
            return 'Friends';
        } else if (status === false) {
            return 'Request Sent';
        } else if (status === undefined) {
            const otherDoc = await db
                .collection('friends')
                .doc(userId)
                .get();
            const otherStatus = otherDoc.data()[
                this.props.screenProps.user.uid
            ];
            if (otherStatus === false) {
                return 'Request Received';
            } else if (otherStatus === undefined) {
                return 'Not Friends';
            } else {
                return 'Error 1';
            }
        } else {
            return 'Error 2';
        }
    };

    sendFriendRequest = async userId => {
        const status = await this.friendStatusCheck(userId);
        if (status === 'Not Friends') {
            const friendObj = {};
            friendObj[userId] = false;
            db.collection('friends')
                .doc(this.props.screenProps.user.uid)
                .update(friendObj);
        } else {
            console.log('status: ', status);
            console.log('Wrong status, send friend request not allowed');
        }
    };

    acceptFriendRequest = async userId => {
        const status = await this.friendStatusCheck(userId);
        if (status === 'Request Received') {
            const friendObj1 = {};
            friendObj1[userId] = true;
            db.collection('friends')
                .doc(this.props.screenProps.user.uid)
                .update(friendObj1);

            const friendObj2 = {};
            friendObj2[this.props.screenProps.user.uid] = true;
            db.collection('friends')
                .doc(userId)
                .update(friendObj2);
        } else {
            console.log('status: ', status);
            console.log('Wrong status, accept friend request not allowed');
        }
    };

    declineFriendRequest = async userId => {
        const status = await this.friendStatusCheck(userId);
        if (status === 'Request Received') {
            const friendObj = {};
            friendObj[this.props.screenProps.user.uid] = FieldValue.delete();
            db.collection('friends')
                .doc(userId)
                .update(friendObj);
        } else {
            console.log('status: ', status);
            console.log('Wrong status, decline friend request not allowed');
        }
    };

    cancelFriendRequest = async userId => {
        const status = await this.friendStatusCheck(userId);
        if (status === 'Request Sent') {
            const friendObj = {};
            friendObj[userId] = FieldValue.delete();
            db.collection('friends')
                .doc(this.props.screenProps.user.uid)
                .update(friendObj);
        } else {
            console.log('status: ', status);
            console.log('Wrong status, cancel friend request not allowed');
        }
    };

    unfriend = async userId => {
        const status = await this.friendStatusCheck(userId);
        if (status === 'Friends') {
            const friendObj1 = {};
            friendObj1[userId] = FieldValue.delete();
            db.collection('friends')
                .doc(this.props.screenProps.user.uid)
                .update(friendObj1);

            const friendObj2 = {};
            friendObj2[this.props.screenProps.user.uid] = FieldValue.delete();
            db.collection('friends')
                .doc(userId)
                .update(friendObj2);
        } else {
            console.log('status: ', status);
            console.log('Wrong status, unfriend not allowed');
        }
    };

    reportUser = async userId => {
        const doc = await db
            .collection('users')
            .doc(userId)
            .get();
        if (doc.data().reports.includes(this.props.screenProps.user.uid)) {
            Alert.alert('Already reported this user');
        } else {
            db.collection('users')
                .doc(userId)
                .update({
                    reports: [
                        ...doc.data().reports,
                        this.props.screenProps.user.uid
                    ]
                });
        }
    };

    getFriendRequests = async () => {
        const { docs } = await db
            .collection('friends')
            .where(this.props.screenProps.user.uid, '==', false)
            .get();
        const friendRequests = await Promise.all(
            docs.map(async doc => {
                const id = doc.id;
                const username = await this._getUsernameById(id);
                return { id, username };
            })
        );
        console.log('Get friend requests called', friendRequests);
        return friendRequests;
    };

    getNearbyUsers = async () => {
        const { docs } = await db.collection('locations').get();
        const nearbyUsers = (await Promise.all(
            docs
                .filter(doc => doc.id !== this.props.screenProps.user.uid)
                .map(async doc => {
                    const id = doc.id;
                    const username = await this._getUsernameById(id);
                    const distance = this.calcDistance(
                        this.state.currentLocation,
                        doc.data().currentLocation
                    );
                    const status = await this.friendStatusCheck(id);
                    return { id, username, distance, status };
                })
        ))
            .filter(doc => doc.status === 'Not Friends')
            .filter(doc => doc.distance <= this.state.range)
            .sort((doc1, doc2) => doc1.distance - doc2.distance)
            .slice(0, 10);
        console.log('Get nearby friends called', nearbyUsers);
        return nearbyUsers;
    };

    getMyFriends = async () => {
        const doc = await db
            .collection('friends')
            .doc(this.props.screenProps.user.uid)
            .get();
        const myFriends = (await Promise.all(
            Object.entries(doc.data()).map(async user => {
                const id = user[0];
                const isFriend = user[1];
                const username = await this._getUsernameById(id);
                return { id, isFriend, username };
            })
        )).filter(user => user.isFriend);
        console.log('Get my friends called', myFriends);
        return myFriends;
    };

    getFriendRequestsSent = async () => {
        const doc = await db
            .collection('friends')
            .doc(this.props.screenProps.user.uid)
            .get();
        const friendRequestsSent = (await Promise.all(
            Object.entries(doc.data()).map(async user => {
                const id = user[0];
                const isFriend = user[1];
                const username = await this._getUsernameById(id);
                return { id, isFriend, username };
            })
        )).filter(user => !user.isFriend);
        console.log('Get friend requests sent called', friendRequestsSent);
        return friendRequestsSent;
    };

    getPmRoomId = async userId => {
        const doc = await db
            .collection('rooms')
            .doc(this.props.screenProps.user.uid)
            .get();
        if (doc.data()[userId] === undefined) {
            try {
                const newRoom = await this.props.screenProps.chatkitUser.createRoom(
                    {
                        name: 'private',
                        private: true,
                        addUserIds: [userId]
                    }
                );
                console.log('Room created:', newRoom);

                const roomObj1 = {};
                roomObj1[userId] = newRoom.id;
                db.collection('rooms')
                    .doc(this.props.screenProps.user.uid)
                    .update(roomObj1);
                const roomObj2 = {};

                roomObj2[this.props.screenProps.user.uid] = newRoom.id;
                db.collection('rooms')
                    .doc(userId)
                    .update(roomObj2);
                return newRoom.id;
            } catch (error) {
                console.log(error);
            }
        } else {
            return doc.data()[userId];
        }
    };

    render() {
        return (
            <MainAppNavigator
                screenProps={{
                    user: this.props.screenProps.user,
                    chatkitUser: this.props.screenProps.chatkitUser,
                    ...this.state,
                    logout: this.logout,
                    getJoinedRooms: this.getJoinedRooms,
                    getJoinableRooms: this.getJoinableRooms,
                    getPmRooms: this.getPmRooms,
                    createRoom: this.createRoom,
                    joinRoom: this.joinRoom,
                    exitRoom: this.exitRoom,
                    leaveRoom: this.leaveRoom,
                    deletePmRoom: this.deletePmRoom,
                    calcDistance: this.calcDistance,
                    setSortMethod: this.setSortMethod,
                    setRange: this.setRange,
                    friendStatusCheck: this.friendStatusCheck,
                    sendFriendRequest: this.sendFriendRequest,
                    acceptFriendRequest: this.acceptFriendRequest,
                    declineFriendRequest: this.declineFriendRequest,
                    cancelFriendRequest: this.cancelFriendRequest,
                    unfriend: this.unfriend,
                    reportUser: this.reportUser,
                    getFriendRequests: this.getFriendRequests,
                    getNearbyUsers: this.getNearbyUsers,
                    getMyFriends: this.getMyFriends,
                    getFriendRequestsSent: this.getFriendRequestsSent,
                    getPmRoomId: this.getPmRoomId
                }}
            />
        );
    }
}
