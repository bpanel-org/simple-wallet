import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Text, Input, Table } from '@bpanel/bpanel-ui';
import { connect } from 'react-redux';

import ProposalInfo from './Components/ProposalInfo';
import MultisigWalletInfo from './Components/MultisigWalletInfo';
import MultisigUX from './Components/MultisigUX';
import SelectHardware from './Components/SelectHardware';

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

    // list of all components
    // maybe map instead
    // components.filter(c => shouldRender[c.name])

    // generate table data
    const multisigWalletTableData = buildSingleRowTable(multisigWallets, 'Name');

    // data to render about proposal
    const { approvals, author, rejections } = selectedProposalInfo;
    const { tx = {} } = proposalMTX;

    // TODO: rename this...
    const _selectedProposalInfo = !!selectedProposal ? (<ProposalInfo />) : (<div />);

    const multisigWalletInfo = !!selectedMultisigWallet ? (<MultisigWalletInfo />) : (<div className="col-sm"><Header type="h5">No wallet selected</Header></div>);

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

    return (
      <div className="container">
        <SelectHardware
          handleSelect={handleSelect}
          hardwareAccountInput={hardwareAccountInput}
        />
        <div className="row">
          <Header type="h3">Create a Multisig Wallet</Header>
        </div>
        <div className="row">
          <div className="col-sm">
            <Header type="h5">Wallet Name</Header>
            <Input
              type="text"
              name="multisigWalletName"
              style={styles.inputStyle}
              placeholder="multisig wallet name"
              className="form-control"
              value={multisigWalletNameInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'multisigWalletNameInput')}
            />
            <Header type="h5">Cosigner Name</Header>
            <Input
              type="text"
              name="cosignerName"
              style={styles.inputStyle}
              placeholder="cosigner name"
              className="form-control"
              value={createCosignerNameInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'createCosignerNameInput')}
            />
          </div>
          <div className="col-sm">
            <Header type="h5">Number of Participants (M)</Header>
            <input
              type="number"
              name="multisig-m"
              style={styles.inputStyle}
              className="form-control"
              min="1"
              value={createWalletMInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'createWalletMInput')}
            />
            <Header type="h5">Number of Participants (N)</Header>
            <input
              type="number"
              name="multisig-n"
              style={styles.inputStyle}
              className="form-control"
              min="1"
              value={createWalletNInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'createWalletNInput')}
            />
          </div>
        </div>
        <div className="row">
          <Button
            type="action"
            style={styles.wideButton}
            onClick={() => handleCreate({
              m: createWalletMInput.value,
              n: createWalletNInput.value,
              hardwareAccountInput: hardwareAccountInput.value,
              cosignerName: createCosignerNameInput.value,
              name: multisigWalletNameInput.value,
            }, 'newMultisigWallet')}
          >
            Create
          </Button>
        </div>
        <div className="row">
          <Header type="h3">Select a Wallet</Header>
        </div>
        <div className="row">
          <div className="col-sm">
            <Table
              colHeaders={['Name']}
              styles={Object.assign(styles.selectListStyle, styles.halfWidth)}
              tableData={multisigWalletTableData}
              onRowClick={e => handleSelect(preventDefault(e).rowData['Name'], 'multisigWallet')}
            />
            {/* TABLE OF PROPOSALS */}
          </div>
        </div>
        <div className="row">
          {multisigWalletInfo}
        </div>
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

