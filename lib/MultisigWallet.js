import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Text, Input, Table } from '@bpanel/bpanel-ui';
import { connect } from 'react-redux';

import ProposalInfo from './Components/ProposalInfo';
import MultisigWalletInfo from './Components/MultisigWalletInfo';
import MultisigUX from './Components/MultisigUX';
import SelectHardware from './Components/SelectHardware';
import CreateMultisigWallet from './Components/CreateMultisigWallet';
import SelectMultisigWallet from './Components/SelectMultisigWallet';

import { safeEval, preventDefault, buildSingleRowTable } from './utilities';
import { PLUGIN_NAMESPACE } from './constants';

import styles from './styles';

class MultisigWallet extends Component {
  constructor(props) {
    super(props);

  }

  static get propTypes() {
    return {
      handleCreate: PropTypes.func,
      handleUpdate: PropTypes.func,
      // text field objects
      walletNameInput: PropTypes.object,
      createWalletPassphraseInput: PropTypes.object
    };
  }

  render() {
    const {
      handleCreate,
      handleUpdate,
      handleSelect,
      createWalletPassphraseInput,
      createWalletNInput,
      createWalletMInput,
      hardwareAccountInput,
      multisigWalletNameInput,
      createCosignerNameInput,
      joinCosignerNameInput,
      multisigWallets = [],
      proposalNameInput,
      joinXpubInput,
      joinKeyInput,
      cosignerPathInput,
      multisigSendBalanceInput,
      multisigTransactionFeeInput,
      multisigRecipientInput,
      proposalCosignerTokenInput,
      multisigInfo = {},
      proposals = [],
      pluginState = {},
      proposalMTXs,
      proposalMTX,
      selectedXPUB,
      selectedMultisigWallet,
      selectedProposal,
      selectedMultisigInfo,
      selectedProposalInfo,
      shouldRender,
    } = this.props;

    // data to render about proposal
    const { approvals, author, rejections } = selectedProposalInfo;
    const { tx = {} } = proposalMTX;

    const multisigWalletInfo = !!selectedMultisigWallet ? (<MultisigWalletInfo handleSelect={handleSelect} />) : (<div className="col-sm"><Header type="h5">No wallet selected</Header></div>);

    const selectedWalletUI = !!selectedMultisigWallet
      ? (<MultisigUX
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
          handleSelect={handleSelect}
          createWalletPassphraseInput={createWalletPassphraseInput}
          createWalletNInput={createWalletNInput}
          createWalletMInput={createWalletMInput}
          hardwareAccountInput={hardwareAccountInput}
          multisigWalletNameInput={multisigWalletNameInput}
          createCosignerNameInput={createCosignerNameInput}
          joinCosignerNameInput={joinCosignerNameInput}
          multisigWallets={multisigWallets}
          proposalNameInput={proposalNameInput}
          joinXpubInput={joinXpubInput}
          joinKeyInput={joinKeyInput}
          cosignerPathInput={cosignerPathInput}
          multisigSendBalanceInput={multisigSendBalanceInput}
          multisigTransactionFeeInput={multisigTransactionFeeInput}
          multisigRecipientInput={multisigRecipientInput}
          proposalCosignerTokenInput={proposalCosignerTokenInput}
        />)
      : (<div />)

    /*
     * TODO: implement like this
     *
        const components = [
          SelectHardware,
          CreateMultisigWallet,
          SelectMultisigWallet,
          MultisigWalletInfo,
          // joinwallet
          ProposalInfo,
          MultisigUX,
        ];
     *
     *
       components.map(c => {
         if shouldRender[c.name]
           return this.componentMap[c.name].component
         return this.componentMap[c.name].alt
       })

       // TODO: relocate input states
    */
    return (
      <div className="container">
        <SelectHardware
          handleSelect={handleSelect}
          hardwareAccountInput={hardwareAccountInput}
        />
        <CreateMultisigWallet
          handleUpdate={handleUpdate}
          handleCreate={handleCreate}
          multisigWalletNameInput={multisigWalletNameInput}
          createCosignerNameInput={createCosignerNameInput}
          createWalletMInput={createWalletMInput}
          createWalletNInput={createWalletNInput}
          hardwareAccountInput={hardwareAccountInput}
          multisigWalletNameInput={multisigWalletNameInput}
        />
        <SelectMultisigWallet
          handleSelect={handleSelect}
        />
        {multisigWalletInfo}
        {selectedWalletUI}
      </div>
    );
  }
}

const mapStateToProps = (state, otherProps) => {
  const pluginState = state.plugins[PLUGIN_NAMESPACE] || {};
  const { selectedMultisigWallet, selectedProposal, selectedXPUB } = pluginState;
  const proposalMTXs = state.wallets.proposalMTXs;
  const multisigInfo = state.wallets.multisigInfo;
  const proposalMTX = safeEval(() => proposalMTXs[selectedMultisigWallet][selectedProposal], {});
  const proposals = safeEval(() => state.wallets.proposals[selectedMultisigWallet], []);
  const selectedMultisigInfo = safeEval(() => multisigInfo[selectedMultisigWallet],  {});
  const selectedProposalInfo = proposals.find(p => p.name === selectedProposal) || {};

  const shouldRender = {
    ProposalInfo: !!selectedProposal,
    MultisigInfo: !!selectedMultisigWallet,
    MultisigUX: !!selectedMultisigWallet,
  }

  return {
    pluginState,
    multisigWallets: state.wallets.multisigWallets,
    multisigInfo,
    selectedXPUB,
    selectedMultisigWallet,
    selectedProposal,
    proposals,
    proposalMTXs,
    proposalMTX,
    selectedMultisigInfo,
    selectedProposalInfo,
    shouldRender,
    ...otherProps,
  }
}

export default connect(mapStateToProps)(MultisigWallet);

