import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { TextInput } from 'react-native-paper';

export default class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room: {
                id: '0',
                name: 'Error',
                distance: Infinity
            },
            messages: []
        };
    }

    async componentDidMount() {
        const room = this.props.navigation.getParam('room', {
            id: '0',
            name: 'Error',
            distance: Infinity
        });
        this.setState({ room });
        const roomId = room.id;
        try {
            await this.props.screenProps.chatkitUser.subscribeToRoomMultipart({
                roomId,
                hooks: {
                    onMessage: message => {
                        this.setState(previousState => ({
                            messages: GiftedChat.append(
                                previousState.messages,
                                this.parseMessage(message)
                            )
                        }));
                    }
                },
                messageLimit: 0
            });
            const responseArr = await this.props.screenProps.chatkitUser.fetchMultipartMessages(
                { roomId }
            );
            const messages = [];
            responseArr.forEach(message => {
                messages.unshift(this.parseMessage(message));
            });
            this.setState({ messages });
            console.log('Messages: ', responseArr);
        } catch (error) {
            console.log('Error from mounting', error);
        }
    }

    parseMessage = ({ id, parts, createdAt, senderId, sender }) => {
        return {
            _id: id,
            text: parts[0].payload.content,
            createdAt,
            user: {
                _id: senderId,
                name: sender.name
            }
        };
    };

    onSend = async (messages = []) => {
        try {
            await this.props.screenProps.chatkitUser.sendSimpleMessage({
                roomId: this.state.room.id,
                text: messages[0].text
            });
        } catch (error) {
            console.log(error);
        }
    };

    render() {
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: this.props.screenProps.chatkitUser.id
                }}
                loadEarlier={true}
                onLoadEarlier={() => console.log('loading earlier msgs...')}
                onPressAvatar={user =>
                    this.props.navigation.navigate('UserProfile', {
                        user: { id: user._id, name: user.name }
                    })
                }
                renderInputToolbar={
                    this.state.room.distance <= this.props.screenProps.range
                        ? undefined
                        : () => (
                              <TextInput
                                  disabled={true}
                                  placeholder="Disabled chatting (Out of range)"
                              />
                          )
                }
            />
        );
    }
}
