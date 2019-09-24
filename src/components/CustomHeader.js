import React, { Component } from 'react';

import { Appbar } from 'react-native-paper';

export default class CustomHeader extends Component {
    render() {
        return (
            <Appbar.Header>
                {this.props.goBack && (
                    <Appbar.BackAction onPress={() => this.props.goBack()} />
                )}
                {this.props.logout && (
                    <Appbar.Action
                        icon="exit-to-app"
                        onPress={this.props.logout}
                    />
                )}
                <Appbar.Content
                    title={this.props.title}
                    subtitle={this.props.subtitle}
                />
                {this.props.right}
            </Appbar.Header>
        );
    }
}
