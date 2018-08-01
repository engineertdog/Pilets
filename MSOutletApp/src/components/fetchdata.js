import React, {Component} from 'react';
import {Container, Content, Header, Left, Right, Body, Title, Text, Spinner} from 'native-base';
import {AsyncStorage, NetInfo} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Actions} from 'react-native-router-flux';
import {getOutlets, getRepoThunk} from '../actions/index';
import OfflineBar from './offlinebar';

class FetchData extends Component {
    constructor(props) {
        super(props);
        this.state = {settings: false, isConnected: true};
    }

    componentWillMount = async () => {
        this.grab();
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
        try {
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
                await this.props.getRepoThunk(this.state.api_url, this.state.api_key, this.state.api_token);
            } else {
                goSettings();
            }
        } catch (error) {
            goSettings();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.repo != this.props.repo) {
            if (this.props.repo == null) {
                goSettings();
            } else {
                Actions.OutletList();
            }
        }
    }

    render() {
        let offline;

        if (!this.state.isConnected) {
            offline = <OfflineBar />
        }

        return (
            <Container>
                <Header>
                    <Left />
                    <Body>
                        <Title>Fetching Data</Title>
                    </Body>
                    <Right />
                </Header>

                {offline}
                <Content contentContainerStyle={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Spinner />
                    <Text>Fetching Data</Text>
                </Content>
            </Container>
        );
    }
}

function goSettings() {
    Actions.Settings({headerButton: false, badSettings: true});
}

function mapStateToProps(state) {
    return {
        repo : state.repo
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({getOutlets: getOutlets, getRepoThunk: getRepoThunk}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(FetchData);
