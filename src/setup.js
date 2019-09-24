import React, { Component } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

import App from './app';
import theme from './assets/theme';
console.disableYellowBox = true;

export default class Setup extends Component {
    render() {
        return (
            <PaperProvider theme={theme}>
                <App />
            </PaperProvider>
        );
    }
}
