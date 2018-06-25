import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Text, Input, Table } from '@bpanel/bpanel-ui';
import { connect } from 'react-redux';

import ProposalInfo from './Components/ProposalInfo';

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
    // components.filter(c => shouldRender[c.name])

    // generate table data
    const multisigWalletTableData = buildSingleRowTable(multisigWallets, 'Name');

    // data to render about proposal
    const { approvals, author, rejections } = selectedProposalInfo;
    const { tx = {} } = proposalMTX;

    // TODO: rename this...
    const _selectedProposalInfo = !!selectedProposal ? (<ProposalInfo />) : (<div />);

    // build info block
    const { balance = {}, cosigners = [], account = {}, id, m, n } = selectedMultisigInfo;
    const multisigWalletInfo =
      (!!selectedMultisigWallet)
      ? (<div className="col-sm">
          <Header type="h5">M: {m}</Header>
          <Header type="h5">N: {n}</Header>
          <Header type="h5">Balance: {balance.confirmed}</Header>
          <Header type="h5">Cosigners:</Header>
          <Table
            colHeaders={['Name']}
            styles={Object.assign(styles.selectListStyle, styles.halfWidth)}
            tableData={buildSingleRowTable(cosigners.map(c => c.name), 'Name')}
            onRowClick={e => handleSelect(preventDefault(e).rowData['Name'], 'multisigCosigner')}
          />
          <Header type="h5">Receive Address: {account.receiveAddress}</Header>
        </div>)
      : (<div className="col-sm"><Header type="h5">No wallet selected</Header></div>);

    // only show join/create when a wallet is selected
    const selectedWalletUI =
      (!!selectedMultisigWallet)
    ? (<div>
        <div className="row">
          <Header type="h3">Join Multisig Wallet</Header>
        </div>
        <div className="row">
          <div className="col-sm">
            <Header type="h5">Cosigner Name</Header>
            <Input
              type="text"
              name="cosignerName"
              style={styles.inputStyle}
              placeholder="cosigner name"
              className="form-control"
              value={joinCosignerNameInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'joinCosignerNameInput')}
            />
            <Header type="h5">Cosigner Path</Header>
            <Input
              type="text"
              name="cosignerPath"
              placeholder="cosigner path"
              style={styles.inputStyle}
              className="form-control"
              value={cosignerPathInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'cosignerPathInput')}
            />
          </div>
          <div className="col-sm">
            <Header type="h5">Join Key</Header>
            <Input
              type="text"
              name=""
              placeholder="join key"
              style={styles.inputStyle}
              className="form-control"
              value={joinKeyInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'joinKeyInput')}
            />
            <Header type="h5">xpub</Header>
            <Input
              type="text"
              name="xpub"
              placeholder="xpub"
              style={styles.inputStyle}
              className="form-control"
              value={joinXpubInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'joinXpubInput')}
            />
          </div>
        </div>
        <div className="row">
          <Button
            type="action"
            style={styles.wideButton}
            onClick={() => handleCreate({
              walletName: selectedMultisigWallet,
              cosignerName: joinCosignerNameInput.value,
              cosignerPath: cosignerPathInput.value,
              joinKey: joinKeyInput.value,
              xpub: joinXpubInput.value,
            }, 'joinWallet')}
          >
            Join
          </Button>
        </div>
        <div className="row">
          <Header type="h3">Create Proposal</Header>
        </div>
        <div className="row">
          <div className="col-sm">
            <Header type="h5">Proposal Name</Header>
            <Input
              type="text"
              name="proposalNameInput"
              placeholder="proposal name"
              style={styles.inputStyle}
              className="form-control"
              value={proposalNameInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'proposalNameInput')}
            />
            <Header type="h5">Cosigner Token</Header>
            <Input
              type="text"
              name="proposalTokenInput"
              placeholder="cosigner token"
              style={styles.inputStyle}
              className="form-control"
              value={proposalCosignerTokenInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'proposalCosignerTokenInput')}
            />
          </div>
          <div className="col-sm">
            <Input
              type="text"
              name="sendBalanceInput"
              placeholder="amount (satoshis)"
              className="form-control"
              style={styles.inputStyle}
              value={multisigSendBalanceInput.value}
              style={styles.inputStyle}
              onChange={e =>
                handleUpdate(preventDefault(e).target.value, 'multisigSendBalanceInput')
              }
            />
            <Input
              type="text"
              name="recipientInput"
              placeholder="recipient address"
              className="form-control"
              style={styles.inputStyle}
              value={multisigRecipientInput.value}
              style={styles.inputStyle}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'multisigRecipientInput')}
            />
            <Input
              type="text"
              name="transactionFeeInput"
              placeholder="rate (satoshis/kb)"
              style={styles.inputStyle}
              className="form-control"
              style={styles.inputStyle}
              value={multisigTransactionFeeInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'multisigTransactionFeeInput')}
            />
            <Button
              type="action"
              style={styles.wideButton}
              onClick={() =>
                handleCreate(
                  {
                    proposalName: proposalNameInput.value,
                    walletId: selectedMultisigWallet,
                    token: proposalCosignerTokenInput.value,
                    outputs: [
                      {
                        value: multisigSendBalanceInput.value,
                        address: multisigRecipientInput.value
                      }
                    ],
                    rate: multisigTransactionFeeInput.value
                  },
                  'newProposal'
                )
              }
            >
              Create Proposal
            </Button>
          </div>
        </div>
        <div className="row">
          <Header type="h3">Proposals</Header>
        </div>
        <div className="row">
          <div className="col-sm">
            <Table
              colHeaders={['Name']}
              styles={Object.assign(styles.selectListStyle)}
              tableData={buildSingleRowTable(proposals.map(p => p.name), 'Name')}
              onRowClick={e => handleSelect(preventDefault(e).rowData['Name'], 'multisigProposal')}
            />
          </div>
        </div>
        {/* TODO: start here, need signedTx workflow */}
        <div className="row">
          {_selectedProposalInfo}
        </div>
        <div className="row">
          <div className="col-sm">
            <Button
              type="action"
              style={styles.wideButton}
              onClick={() => handleCreate({
                walletId: selectedMultisigWallet,
                proposalId: selectedProposalInfo.name
              }, 'multisigApprove')}
            >
              Approve
            </Button>
          </div>
          <div className="col-sm">
            <Button
              type="action"
              style={styles.wideButton}
              onClick={() => handleCreate({
                proposalId: selectedProposalInfo.name,
                walletId: selectedMultisigWallet
              }, 'multisigReject')}
            >
              Reject
            </Button>
          </div>
        </div>
      </div>)
    : (<div />)

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm">
            <Header type="h3">Insert Hardware Wallet</Header>
          </div>
          <div className="col-sm">
            <input
              type="number"
              name="ledgerAccountText"
              placeholder="ledger account"
              className="form-control"
              min="0"
              value={hardwareAccountInput.value}
              onChange={(e) => handleSelect(preventDefault(e).target.value, 'hardwareAccount')}
            />
          </div>
        </div>
        <div className="row">
          <Header type="h5">{selectedXPUB}</Header>
        </div>
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
