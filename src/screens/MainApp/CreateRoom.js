import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import {
    Button,
    Container,
    Content,
    Form,
    Input,
    Item,
    Text
} from 'native-base';

export default class CreateRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomName: ''
        };
    }

    render() {
        return (
            <Container>
                <Content>
                    <Form>
                        <Item>
                            <Input
                                placeholder="Enter room name here"
                                onChangeText={roomName =>
                                    this.setState({ roomName })
                                }
                                value={this.state.roomName}
                            />
                        </Item>
                        <Button
                            full
                            style={styles.button}
                            onPress={async () => {
                                const room = await this.props.screenProps.createRoom(
                                    this.state.roomName
                                );
                                this.props.navigation.navigate('ChatRoom', {
                                    room
                                });
                            }}
                        >
                            <Text>Create Room</Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30
    }
});
