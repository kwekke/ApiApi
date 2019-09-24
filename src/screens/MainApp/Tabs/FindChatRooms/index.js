import React, { Component } from 'react';
import {
    createMaterialTopTabNavigator,
    createAppContainer,
    createStackNavigator
} from 'react-navigation';
import { Appbar, Menu } from 'react-native-paper';

import FindChatRoomsMapView from './FindChatRoomsMapView';
import FindChatRoomsListView from './FindChatRoomsListView';

import CustomHeader from '../../../../components/CustomHeader';

const FindChatRoomsNavigator = createAppContainer(
    createStackNavigator({
        FindChatRooms: {
            screen: createMaterialTopTabNavigator(
                {
                    FindChatRoomsMapView: {
                        screen: FindChatRoomsMapView,
                        navigationOptions: () => ({
                            title: 'Map View'
                        })
                    },
                    FindChatRoomsListView: {
                        screen: FindChatRoomsListView,
                        navigationOptions: () => ({
                            title: 'List View'
                        })
                    }
                },
                { tabBarOptions: { upperCaseLabel: false } }
            ),
            navigationOptions: ({ navigation, screenProps }) => ({
                header: (
                    <CustomHeader
                        title="Explore"
                        subtitle="Find Chat Rooms to Join"
                        logout={screenProps.logout}
                        right={[
                            navigation.state.index === 1 ? (
                                <Menu
                                    key="0"
                                    visible={screenProps.menuVisibility}
                                    onDismiss={() =>
                                        screenProps.setMenuVisibility(false)
                                    }
                                    anchor={
                                        <Appbar.Action
                                            icon="sort"
                                            color="white"
                                            onPress={() =>
                                                screenProps.setMenuVisibility(
                                                    true
                                                )
                                            }
                                        />
                                    }
                                >
                                    <Menu.Item
                                        onPress={() => {
                                            screenProps.setSortMethod(
                                                'distance'
                                            );
                                            screenProps.updateRooms();
                                            screenProps.setMenuVisibility(
                                                false
                                            );
                                        }}
                                        title="Sort by Distance"
                                    />
                                </Menu>
                            ) : null,
                            <Appbar.Action
                                icon="refresh"
                                onPress={() => screenProps.updateRooms()}
                                key="1"
                            />
                        ]}
                    />
                )
            })
        }
    })
);

export default class FindChatRooms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            joinedRooms: [],
            joinableRooms: [],
            loading: true,
            menuVisibility: false
        };
    }

    componentDidMount() {
        this.props.navigation.addListener('didFocus', () => {
            this.setState({ loading: true });
            this.updateRooms();
            this.watchId = navigator.geolocation.watchPosition(
                () => this.updateRooms(),
                error =>
                    console.log(
                        'watch position error in find chat rooms',
                        error
                    )
            );
            this.setState({ loading: false });
        });

        this.props.navigation.addListener('willBlur', () => {
            navigator.geolocation.clearWatch(this.watchId);
        });
    }

    updateRooms = async () => {
        const joinedRooms = this.props.screenProps.getJoinedRooms();
        const joinableRooms = await this.props.screenProps.getJoinableRooms();
        this.setState({ joinedRooms, joinableRooms });
    };

    enterRoom = room => {
        this.props.navigation.navigate('ChatRoom', { room });
    };

    joinRoom = async roomId => {
        await this.props.screenProps.joinRoom(roomId);
        this.updateRooms();
    };

    setMenuVisibility = menuVisibility => {
        this.setState({ menuVisibility });
    };

    render() {
        return (
            <FindChatRoomsNavigator
                screenProps={{
                    ...this.props.screenProps,
                    ...this.state,
                    updateRooms: this.updateRooms,
                    enterRoom: this.enterRoom,
                    joinRoom: this.joinRoom,
                    setMenuVisibility: this.setMenuVisibility
                }}
            />
        );
    }
}
