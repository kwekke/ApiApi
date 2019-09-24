import React, { Component } from 'react';
import { View } from 'react-native';
import { Thumbnail } from 'native-base';
import { Button, ActivityIndicator, Title, Text } from 'react-native-paper';

export default class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                id: '0',
                name: 'Name not Found'
            },
            status: 'status not loaded',
            loading: true
        };
    }

    async componentDidMount() {
        const user = this.props.navigation.getParam('user', {
            id: '0',
            name: 'Name not Found'
        });
        await this.setState({ user });
        await this.updateStatus();
        this.setState({ loading: false });
    }

    updateStatus = async () => {
        const status = await this.props.screenProps.friendStatusCheck(
            this.state.user.id
        );
        this.setState({ status });
    };

    enterPmRoom = roomId => {
        console.log('entering pm room...');
        this.props.navigation.push('PmRoom', {
            roomId,
            userId: this.state.user.id,
            username: this.state.user.name
        });
    };

    displayRequestButton = () => {
        if (this.state.status === 'Friends') {
            return (
                <Button
                    uppercase={false}
                    style={{ width: '80%' }}
                    mode="outlined"
                    onPress={async () => {
                        await this.props.screenProps.unfriend(
                            this.state.user.id
                        );
                        this.updateStatus();
                    }}
                >
                    Unfriend
                </Button>
            );
        } else if (this.state.status === 'Request Sent') {
            return (
                <Button
                    uppercase={false}
                    style={{ width: '80%' }}
                    mode="outlined"
                    onPress={async () => {
                        await this.props.screenProps.cancelFriendRequest(
                            this.state.user.id
                        );
                        this.updateStatus();
                    }}
                >
                    Cancel Friend Request
                </Button>
            );
        } else if (this.state.status === 'Request Received') {
            return (
                <View
                    style={{
                        flexDirection: 'row',
                        width: '80%',
                        justifyContent: 'space-between'
                    }}
                >
                    <Button
                        style={{ width: '48%' }}
                        mode="contained"
                        onPress={async () => {
                            await this.props.screenProps.acceptFriendRequest(
                                this.state.user.id
                            );
                            this.updateStatus();
                        }}
                    >
                        <Text style={{ fontSize: 13, color: 'white' }}>
                            Accept Request
                        </Text>
                    </Button>
                    <Button
                        style={{ width: '48%' }}
                        mode="outlined"
                        onPress={async () => {
                            await this.props.screenProps.declineFriendRequest(
                                this.state.user.id
                            );
                            this.updateStatus();
                        }}
                    >
                        <Text style={{ fontSize: 13, color: '#5b1cc7' }}>
                            Decline Request
                        </Text>
                    </Button>
                </View>
            );
        } else if (this.state.status === 'Not Friends') {
            return (
                <Button
                    uppercase={false}
                    style={{ width: '80%' }}
                    mode="contained"
                    onPress={async () => {
                        await this.props.screenProps.sendFriendRequest(
                            this.state.user.id
                        );
                        this.updateStatus();
                    }}
                >
                    Send Friend Request
                </Button>
            );
        } else {
            console.log('Error in displaying request button in user profile');
        }
    };

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                {this.state.loading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <View
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                paddingLeft: 30,
                                paddingRight: 30,
                                marginTop: 30,
                                marginBottom: 30
                            }}
                        >
                            <Thumbnail
                                large
                                source={{
                                    uri: `https://api.adorable.io/avatars/285/${
                                        this.state.user.id
                                    }.png`
                                }}
                            />
                            <Title style={{ marginLeft: 30 }}>
                                {this.state.user.name}
                            </Title>
                        </View>
                        {this.displayRequestButton()}
                        {this.state.status === 'Friends' && (
                            <Button
                                uppercase={false}
                                style={{ marginTop: 20, width: '80%' }}
                                mode="contained"
                                onPress={async () => {
                                    const roomId = await this.props.screenProps.getPmRoomId(
                                        this.state.user.id
                                    );
                                    this.enterPmRoom(roomId);
                                }}
                            >
                                Chat
                            </Button>
                        )}
                        <Button
                            uppercase={false}
                            style={{ marginTop: 20, width: '80%' }}
                            mode="contained"
                            onPress={() =>
                                this.props.screenProps.reportUser(
                                    this.state.user.id
                                )
                            }
                        >
                            Report
                        </Button>
                    </View>
                )}
            </View>
        );
    }
}
