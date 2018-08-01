import React, {Component} from 'react';
import {Root, Container, Content, Header, Left, Right, Body, Title, Text, Button, Form, Item, Input, Label, View, Toast} from 'native-base';
import {AsyncStorage, StyleSheet, NetInfo} from 'react-native';
import {Actions} from 'react-native-router-flux';
import OfflineBar from './offlinebar';

class Settings extends Component{
    constructor(props) {
        super(props);
        this.state = {
            failed: false,
            api_url: "",
            api_key: "",
            api_token: "",
            isConnected: true
        }
    }

    componentWillMount = async () => {
        await AsyncStorage.getItem('api_url', (err, result) => {
            if (result !== null) {
                this.setState({api_url: result});
            }
        });

        await AsyncStorage.getItem('api_key', (err, result) => {
            if (result !== null) {
                this.setState({api_key: result});
            }
        });

        await AsyncStorage.getItem('api_token', (err, result) => {
            if (result !== null) {
                this.setState({api_token: result});
            }
        });

        if (this.props.badSettings) {
            doToast("Check your settings & ensure they are valid.", "danger");
        }
    }

    componentDidMount = async () => {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }

    componentDidUpdate = async () => {
        if (this.state.saveError) {
            await this.setState({saveError: false});
            doToast("Unable to update settings.", "danger");
        }

        if (this.state.failed) {
            await this.setState({failed: false});
            doToast("Unable to update settings.", "danger");
        }
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }

    handleConnectivityChange = isConnected => {
        if (isConnected) {
            this.setState({isConnected});
        } else {
            this.setState({isConnected});
        }
    };

    saveSettings = async () => {
        let empty;

        try {
            if (this.state.api_token != (null || "")) {
                await AsyncStorage.setItem('api_url', this.state.api_url, () => {
                    AsyncStorage.getItem('api_url', (err, result) => {
                        if (err) {
                            this.setState({failed: true});
                        }
                    });
                });
            } else {
                empty = true;
            }

            if (this.state.api_token != (null || "")) {
                await AsyncStorage.setItem('api_key', this.state.api_key, () => {
                    AsyncStorage.getItem('api_key', (err, result) => {
                        if (err) {
                            this.setState({failed: true});
                        }
                    });
                });
            } else {
                empty = true;
            }

            if (this.state.api_token != (null || "")) {
                await AsyncStorage.setItem('api_token', this.state.api_token, () => {
                    AsyncStorage.getItem('api_token', (err, result) => {
                        if (err) {
                            this.setState({failed: true});
                        }
                    });
                });
            } else {
                empty = true;
            }
        } catch (error) {
            await this.setState({saveError: true});
        }

        if (empty) {
            doToast("Fill out all of the settings fields.", "danger");
        } else {
            Actions.OutletList();
        }
    }

    render() {
        let offline;

        if (!this.state.isConnected) {
            offline = <OfflineBar />
        }

        return (
            <Root>
                <Container>
                    <Header>
                        <Left />
                        <Body>
                            <Title>Settings</Title>
                        </Body>
                        <Right>
                            <SeeButton view={this.props.headerButton} />
                        </Right>
                    </Header>

                    {offline}
                    <Content>
                        <Form>
                            <Item floatingLabel>
                                <Label>API URL</Label>
                                <Input
                                    onChangeText = {(api_url) => this.setState({api_url})}
                                    value = {this.state.api_url}
                                    onBlur = {() => this.state.api_url.trim() === "" && fillField("API URL")}
                                />
                            </Item>
                            <Item floatingLabel>
                                <Label>API Key</Label>
                                <Input 
                                    onChangeText = {(api_key) => this.setState({api_key})}
                                    value = {this.state.api_key}
                                    onBlur = {() => this.state.api_key.trim() === "" && fillField("API Key")}
                                />
                            </Item>
                            <Item floatingLabel last>
                                <Label>API Token</Label>
                                <Input 
                                    onChangeText = {(api_token) => this.setState({api_token})}
                                    value = {this.state.api_token}
                                    onBlur = {() => this.state.api_token.trim() === "" && fillField("API Token")}
                                />
                            </Item>
                            <View style={styles.buttonContainer}>
                                <Button onPress = {() => this.saveSettings()}>
                                    <Text>Save</Text>
                                </Button>
                            </View>
                        </Form>
                    </Content>
                </Container>
            </Root>
        );
    }
}

function fillField(text) {
    doToast("Please fill out the " + text + " field.", "warning");
}

function doToast(text, type) {
    Toast.show({
        text: text,
        duration: 3000,
        type: type
    });
}

function SeeButton(props) {
    if (props.view) {
        return (
            <Button transparent onPress = {() => Actions.pop()}>
                <Text>Cancel</Text>
            </Button>
        );
    } else {
        return (null);
    }
}

var styles = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 25,
    }
});

export default Settings;
