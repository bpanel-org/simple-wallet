import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Text, Input, Table } from '@bpanel/bpanel-ui';
import { connect } from 'react-redux';

import ProposalInfo from './Components/ProposalInfo';
import MultisigWalletInfo from './Components/MultisigWalletInfo';
import SelectHardware from './Components/SelectHardware';
import CreateMultisigWallet from './Components/CreateMultisigWallet';
import SelectMultisigWallet from './Components/SelectMultisigWallet';
import ConditionalRender from './Components/ConditionalRender';

import CreateProposal from './Components/CreateProposal';
import JoinWallet from './Components/JoinWallet';
import ProposalUX from './Components/ProposalUX';
import ProposalList from './Components/ProposalList';
import ActionWrapper from './ActionWrapper.js';

import { preventDefault, buildSingleRowTable } from './utilities';
import { PLUGIN_NAMESPACE } from './constants';

import styles from './styles';

class MultisigWallet extends Component {
  constructor(props) {
    super(props);

    this.unselectedComponent = (
      <div className="col-sm">
        <Header type="h5">No wallet selected</Header>
      </div>
    );
  }

  static get propTypes() {
    return {
      shouldRender: PropTypes.object
    };
  }

  render() {
    const { shouldRender } = this.props;

    return (
      <div className="container">
        <ActionWrapper>
          <SelectHardware />
          <CreateMultisigWallet />
          <SelectMultisigWallet />
          <ConditionalRender
            shouldRender={shouldRender.MultisigInfo}
            alt={this.unselectedComponent}
          >
            <MultisigWalletInfo />
          </ConditionalRender>
          <ConditionalRender shouldRender={shouldRender.MultisigUX}>
            <JoinWallet />
            <CreateProposal />
            <ProposalList />
            <ConditionalRender shouldRender={shouldRender.SelectedProposal}>
              <ProposalInfo />
            </ConditionalRender>
            <ConditionalRender shouldRender={shouldRender.ProposalUX}>
              <ProposalUX />
            </ConditionalRender>
          </ConditionalRender>
        </ActionWrapper>
      </div>
    );
  }
}

const mapStateToProps = (state, otherProps) => {
  const pluginState = state.plugins[PLUGIN_NAMESPACE] || {};
  const { selectedMultisigWallet, selectedProposal } = pluginState;

  const shouldRender = {
    ProposalInfo: !!selectedProposal,
    MultisigInfo: !!selectedMultisigWallet,
    MultisigUX: !!selectedMultisigWallet,
    ProposalUX: !!selectedProposal,
    SelectedProposal: !!selectedProposal
  };

  return {
    shouldRender,
    ...otherProps
  };
};

export default connect(mapStateToProps)(MultisigWallet);
