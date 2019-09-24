import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { ActivityIndicator, IconButton } from 'react-native-paper';

export default class FindChatRoomsMapView extends Component {
    constructor(props) {
        super(props);
        this.state = { showJoinedRooms: false };
    }

    render() {
        return (
            <View style={styles.container}>
                {this.props.screenProps.loading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <View style={styles.fill}>
                        <MapView
                            style={styles.fill}
                            region={{
                                ...this.props.screenProps.currentLocation,
                                latitudeDelta:
                                    (this.props.screenProps.range
                                        ? this.props.screenProps.range
                                        : 5) * 0.0011,
                                longitudeDelta:
                                    (this.props.screenProps.range
                                        ? this.props.screenProps.range
                                        : 5) * 0.022
                            }}
                        >
                            {this.props.screenProps.joinableRooms.map(room => (
                                <Marker
                                    key={room.id}
                                    coordinate={room.customData.location}
                                    title={`Room: ${room.name}`}
                                    description={`(Click to join) ${room.distance.toFixed(
                                        2
                                    )}km away`}
                                    onCalloutPress={() =>
                                        this.props.screenProps.joinRoom(room.id)
                                    }
                                />
                            ))}
                            {this.state.showJoinedRooms &&
                                this.props.screenProps.joinedRooms.map(room => (
                                    <Marker
                                        key={room.id}
                                        coordinate={room.customData.location}
                                        title={`Room: ${room.name}`}
                                        description={`(Joined) ${room.distance.toFixed(
                                            2
                                        )}km away`}
                                        onCalloutPress={() =>
                                            this.props.screenProps.enterRoom(
                                                room
                                            )
                                        }
                                        pinColor="green"
                                    />
                                ))}
                            <Circle
                                center={this.props.screenProps.currentLocation}
                                radius={
                                    (this.props.screenProps.range
                                        ? Number(this.props.screenProps.range)
                                        : 5) * 1000
                                }
                                strokeColor="rgba(50, 75, 200, 0.5)"
                                strokeWidth={2}
                            />
                        </MapView>
                        <View style={styles.buttonsContainer}>
                            <View style={styles.toggleButtonContainer}>
                                <TouchableOpacity
                                    style={styles.toggleButton}
                                    onPress={() =>
                                        this.setState(prevState => ({
                                            showJoinedRooms: !prevState.showJoinedRooms
                                        }))
                                    }
                                >
                                    <IconButton
                                        icon={
                                            this.state.showJoinedRooms
                                                ? 'visibility'
                                                : 'visibility-off'
                                        }
                                        size={30}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
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
    fill: {
        ...StyleSheet.absoluteFillObject
    },
    buttonsContainer: {
        position: 'absolute',
        bottom: 10,
        flexDirection: 'row',
        alignSelf: 'flex-end'
    },
    toggleButtonContainer: {
        backgroundColor: 'rgba(138,43,226, 0.7)',
        borderRadius: 10,
        marginRight: 10
    },
    toggleButton: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});
