import React, { Component } from 'react';

// bpanel imports
import { Header, TabMenu } from '@bpanel/bpanel-ui';
import {
  bwalletClient,
  bmultisigClient,
  bpanelClient
} from '@bpanel/bpanel-utils';

// local imports
import CreateWallet from './CreateWallet';
import SelectWallet from './SelectWallet';
import MultisigWallet from './MultisigWallet';
import ActionContainer from './ActionWrapper';

export default class MainContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // build tabs to render
    const tabs = [
      {
        header: 'Select Wallet',
        body: (
          <ActionContainer>
            <SelectWallet />
          </ActionContainer>
        )
      },
      {
        header: 'Create Wallet',
        body: (
          <ActionContainer>
            <CreateWallet />
          </ActionContainer>
        )
      },
      {
        header: 'Multisig Wallet',
        body: <MultisigWallet />
      }
    ];

    return (
      <div className="dashboard-container">
        <Header type="h2">Wallet Dashboard</Header>
        <TabMenu tabs={tabs} />
      </div>
    );
  }
}
