import React, {Component} from 'react';
import {Router, Stack, Scene} from 'react-native-router-flux';
import OutletList from './components/outletlist.js';
import Settings from './components/settings.js';

export default class App extends Component {
  render() {
    return(
      <Router>
        <Stack key="root" hideNavBar={true}>
          <Scene key="OutletList" component={OutletList} title="Pilets" initial={true} />
          <Scene key="Settings" component={Settings} title="Settings" />
        </Stack>
      </Router>
    );
  }
}
