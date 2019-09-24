import React, { Component } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import {
    ListItem,
    Left,
    Body,
    Right,
    Thumbnail,
    Text,
    Icon
} from 'native-base';
import { ActivityIndicator } from 'react-native-paper';

export default class FindChatRoomsListView extends Component {
    constructor(props) {
        super(props);
        this.state = { menuVisibility: false };
    }

    renderListItem = ({ item }) => {
        return (
            <ListItem avatar>
                <TouchableOpacity
                    style={styles.listItemTouchable}
                    onPress={() => {
                        this.props.screenProps.joinRoom(item.id);
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
                        <Right style={styles.addRoomIconContainer}>
                            <Icon
                                name="ios-add-circle-outline"
                                style={styles.addRoomIcon}
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
                {this.props.screenProps.loading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <FlatList
                        data={this.props.screenProps.joinableRooms}
                        renderItem={item => this.renderListItem(item)}
                        keyExtractor={item => item.id.toString()}
                    />
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
