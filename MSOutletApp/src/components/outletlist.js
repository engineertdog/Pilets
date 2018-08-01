import React, {Component} from 'react';
import {Root, Container, Content, Header, Left, Right, Body, Title, Text, Button, Spinner, List, ListItem, CheckBox, Icon, Toast} from 'native-base';
import {TouchableOpacity, RefreshControl, NetInfo, AsyncStorage} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Actions} from 'react-native-router-flux';
import {getOutlets, errorAPI, getRepoThunk, updateRepo} from '../actions/index';
import OfflineBar from './offlinebar';

const offlineStatus = offlineCheck = 0;
const onlineStatus = 1;
const offlineColor = "red";

class OutletList extends Component {
    constructor(props) {
        super(props);
        this.state = {refreshing: false, settings: false, isConnected: true};
    }

    componentWillMount = async () => {
        const api_url = await AsyncStorage.getItem('api_url', (err, result) => {
            this.setState({api_url: result});
        });
        const api_key = await AsyncStorage.getItem('api_key', (err, result) => {
            this.setState({api_key: result});
        });
        const api_token = await AsyncStorage.getItem('api_token', (err, result) => {
            this.setState({api_token: result});
        });
        
        if ((api_url !== null) && (api_key !== null) && (api_token !== null)) {
            this.grab();
        } else {
            goSettings();
        }
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
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

    grab = async () => {
        this.setState({noData: false});

        try {            
            if ((this.state.api_url !== null) && (this.state.api_key !== null) && (this.state.api_token !== null)) {
                await this.props.getRepoThunk(this.state.api_url, this.state.api_key, this.state.api_token);
            } else {
                goSettings();
            }
        } catch (error) {
            goSettings();
        }
    }

    componentDidUpdate = async (prevProps, prevState) => {
        if (JSON.stringify(this.props.repo) !== JSON.stringify(prevProps.repo)) {
            if (this.props.repo.length !== 0) {
                if (this.props.repo === false) {
                    goSettings();
                } else if ((this.props.repo !== null)) {
                    if (this.state.updateID !== undefined) {
                        var id = this.state.updateID;
                        var command = this.props.repo[id - 1].command;

                        if (id <= 8) {
                            var position = (command == 1) ? "on" : "off";
                            var toastText = "Outlet #" + id + " turned " + position;
                
                            doToast(toastText, "success");
                        } else if (id == 9) {
                                this.props.repo[id - 1].checked = (command == 1) ? false : true;
                
                                this.props.repo.map((theData, index) => {
                                if (index <= 7) {
                                    this.props.repo[index].status = offlineStatus;
                                    this.props.repo[index].color = offlineColor;
                                    this.props.repo[index].checked = offlineCheck;
                                }
                            });
                
                            doToast("PI Rebooting", "warning");
                        }
                    }
                }
            }
        } 

        if (JSON.stringify(this.props.error) !== JSON.stringify(prevProps.error)) {
            if (this.props.error == "Bad update") {
                doToast("Could not update the outlet.", "warning");
            } else if (this.props.error === "No data") {
                this.setState({noData: true});
            }
        }
    }

    handleUpdate = async (id, status) => {
        var command;

        if (id <= 8) {
            command = (status == 1) ? offlineStatus : onlineStatus;
        } else if (id == 9) {
            command = (status == 1) ? onlineStatus : offlineStatus;
        }

        await this.props.updateRepo(this.state.api_url, this.state.api_key, this.state.api_token, id, command)
            .then(() => {
                this.setState({updateID: id});
            });
    }

    render() {
        let content, offline;

        if (!this.state.isConnected) {
            offline = <OfflineBar />
        }

        if (this.state.noData) {
            content =   <Content contentContainerStyle={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                            refreshControl = {
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={() => this.grab()}
                                />
                            }
                        >
                            <Text>Data not available.</Text>
                        </Content>
        } else {
            if (this.props.repo == null || this.props.repo.length === 0) {
                content =   <Content contentContainerStyle={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Spinner />
                                <Text>Fetching Data</Text>
                            </Content>
            } else {
                content =   <Content
                                refreshControl = {
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={() => this.grab()}
                                    />
                                }
                            >
                                <List dataArray = {this.props.repo}
                                    renderRow = {(item) =>
                                        <ListItem>
                                            <TouchableOpacity onPress={() => this.handleUpdate(item.id, item.status)} hitSlop={{top: 25, bottom: 25, left: 25, right: 25}}>
                                                <CheckBox checked={(item.checked == 1) ? true : false} color={item.color} />
                                            </TouchableOpacity>
                                            <Body>
                                                <Text>{item.name}</Text>
                                            </Body>
                                        </ListItem>
                                    }
                                />
                            </Content>
            }
        }

        return (
            <Root>
                <Container>
                    <Header>
                        <Left />
                        <Body>
                            <Title>Pilets</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress= {()=>goSettings(true, false)}>
                                <Icon type='FontAwesome' name='gears' />
                            </Button>
                        </Right>
                    </Header>

                    {offline}
                    {content}
                </Container>
            </Root>
        );
    }
}

function goSettings(button = false, settings = true) {
    Actions.Settings({headerButton: button, badSettings: settings});
}

function doToast(text, type) {
    Toast.show({
        text: text,
        duration: 3000,
        type: type
    });
}

function mapStateToProps(state) {
    return {
        repo : state.repo,
        error : state.error
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({getOutlets: getOutlets, errorAPI: errorAPI, getRepoThunk: getRepoThunk, updateRepo: updateRepo}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(OutletList);