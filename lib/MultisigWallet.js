import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Text, Input, Table } from '@bpanel/bpanel-ui';

import { preventDefault, buildSingleRowTable } from './utilities';

import styles from './styles';

export default class MultisigWallet extends Component {
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
      selectedXPUB,
      multisigWallets = [],
      proposalNameInput,
      joinXpubInput,
      joinKeyInput,
      cosignerPathInput,
      selectedMultisigWallet,
      multisigSendBalanceInput,
      multisigTransactionFeeInput,
      multisigRecipientInput,
      proposalCosignerTokenInput,
      multisigInfo = {}
    } = this.props;

    // generate table data
    const multisigWalletTableData = buildSingleRowTable(multisigWallets, 'Name');

    // build info block
    const _multisigInfo = multisigInfo[selectedMultisigWallet] || {};
    const { balance = {}, cosigners = [], account = {}, id } = _multisigInfo;
    const multisigWalletInfo =
      (!!selectedMultisigWallet)
      ? (<div>
          <Text type="p">ID: {id}</Text>
          <Text type="p">Balance: {balance.coin}</Text>
          <Text type="strong">Cosigners:</Text>
          {cosigners.map((c, i) => {
            return (<Text type="p" key={i}>Name: {c.name}</Text>);
          })}
          <Text type="p">Receive Address: {account.receiveAddress}</Text>
        </div>)
      : (<Header type="h5">No wallet selected</Header>);

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
              placeholder="multisig wallet name"
              className="form-control"
              value={multisigWalletNameInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'multisigWalletNameInput')}
            />
            <Header type="h5">Cosigner Name</Header>
            <Input
              type="text"
              name="cosignerName"
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
              className="form-control"
              min="1"
              value={createWalletMInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'createWalletMInput')}
            />
            <Header type="h5">Number of Participants (N)</Header>
            <input
              type="number"
              name="multisig-n"
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
            <Header type="h5">Multisig Wallets</Header>
            <Table
              colHeaders={['Name']}
              styles={Object.assign(styles.selectListStyle, styles.halfWidth)}
              tableData={multisigWalletTableData}
              onRowClick={e => handleSelect(preventDefault(e).rowData['Name'], 'multisigWallet')}
            />
          </div>
          <div className="col-sm" styles={styles.halfWidth}>
            <Header type="h5">Wallet Info</Header>
            {multisigWalletInfo}
          </div>
        </div>
        <div className="row">
          <Header type="h3">Join Multisig Wallet</Header>
        </div>
        <div className="row">
          <div className="col-sm">
            <Header type="h5">Cosigner Name</Header>
            <Input
              type="text"
              name="cosignerName"
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
              className="form-control"
              value={joinKeyInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'joinKeyInput')}
            />
            <Header type="h5">xpub</Header>
            <Input
              type="text"
              name="xpub"
              placeholder="xpub"
              className="form-control"
              value={joinXpubInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'joinXpubInput')}
            />
          </div>
        </div>
        <div className="row">
          <Button
            type="action"
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
              className="form-control"
              value={proposalNameInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'proposalNameInput')}
            />
            <Header type="h5">Cosigner Token</Header>
            <Input
              type="text"
              name="proposalTokenInput"
              placeholder="cosigner token"
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
              value={multisigRecipientInput.value}
              style={styles.inputStyle}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'multisigRecipientInput')}
            />
            <Input
              type="text"
              name="transactionFeeInput"
              placeholder="rate (satoshis/kb)"
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
      </div>
    );
  }
}

