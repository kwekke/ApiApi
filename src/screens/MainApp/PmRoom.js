import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';

export default class PmRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomId: '0',
            messages: []
        };
    }

    async componentDidMount() {
        const roomId = this.props.navigation.getParam('roomId', '0');
        this.setState({ roomId });
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
                roomId: this.state.roomId,
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
                renderAvatar={null}
            />
        );
    }
}
