import React, { Component } from 'react';
import { View } from 'react-native';
import { Thumbnail } from 'native-base';
import { Title, List, Menu, Text } from 'react-native-paper';

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuVisibility: false
        };
    }

    render() {
        return (
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
                                this.props.screenProps.user.uid
                            }.png`
                        }}
                    />
                    <Title style={{ marginLeft: 30 }}>
                        {this.props.screenProps.user.displayName}
                    </Title>
                </View>
                <List.Section style={{ width: '100%' }}>
                    <List.Subheader>Settings</List.Subheader>
                    <Menu
                        visible={this.state.menuVisibility}
                        onDismiss={() =>
                            this.setState({ menuVisibility: false })
                        }
                        anchor={
                            <List.Item
                                onPress={() =>
                                    this.setState({
                                        menuVisibility: true
                                    })
                                }
                                title="Change chat room search range"
                                left={() => (
                                    <List.Icon icon="location-searching" />
                                )}
                                right={() => (
                                    <View
                                        style={{
                                            justifyContent: 'center',
                                            backgroundColor:
                                                'rgba(100, 100, 100, 0.5)',
                                            marginRight: 10,
                                            paddingLeft: 10,
                                            paddingRight: 10,
                                            borderRadius: 20
                                        }}
                                    >
                                        <Text>{`${
                                            this.props.screenProps.range
                                        }km`}</Text>
                                    </View>
                                )}
                            />
                        }
                    >
                        <Menu.Item
                            onPress={() => {
                                this.props.screenProps.setRange(1);
                                this.setState({ menuVisibility: false });
                            }}
                            title="1km"
                        />
                        <Menu.Item
                            onPress={() => {
                                this.props.screenProps.setRange(5);
                                this.setState({ menuVisibility: false });
                            }}
                            title="5km"
                        />
                        <Menu.Item
                            onPress={() => {
                                this.props.screenProps.setRange(10);
                                this.setState({ menuVisibility: false });
                            }}
                            title="10km"
                        />
                        <Menu.Item
                            onPress={() => {
                                this.props.screenProps.setRange(20);
                                this.setState({ menuVisibility: false });
                            }}
                            title="20km"
                        />
                    </Menu>
                </List.Section>
            </View>
        );
    }
}
