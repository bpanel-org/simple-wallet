import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Text, Input, Table } from '@bpanel/bpanel-ui';

import { preventDefault } from './utilities';

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
      cosignerNameInput,
      selectedXPUB,
      multisigWallets = [],
      proposalNameInput,
      joinXpubInput,
      joinKeyInput,
      cosignerPathInput
    } = this.props;
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
              value={cosignerNameInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'cosignerNameInput')}
            />
          </div>
          <div className="col-sm">
            <Header type="h5">Number of Participants (M)</Header>
            <input
              type="number"
              name="multisig-m"
              className="form-control"
              min="0"
              value={createWalletMInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'createWalletMInput')}
            />
            <Header type="h5">Number of Participants (N)</Header>
            <input
              type="number"
              name="multisig-n"
              className="form-control"
              min="0"
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
              cosignerName: cosignerNameInput.value,
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
              colHeaders={['Multisig Wallets']}
              styles={styles.selectListStyle}
              tableData={multisigWallets}
              onRowClick={e => handleSelect(preventDefault(e).rowData['Multisig Wallets'], 'multisigWallet')}
            />
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
              value={''}
              onChange={e => handleUpdate(preventDefault(e).target.value, '')}
            />
            <Header type="h5">Cosigner Path</Header>
            <Input
              type="text"
              name="cosignerPath"
              placeholder="cosigner path"
              className="form-control"
              value={cosignerPathInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, '')}
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
            onClick={() => handleCreate({}, 'join')}
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
              name=""
              placeholder="proposal name"
              className="form-control"
              value={proposalNameInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'proposalNameInput')}
            />
          </div>
          <div className="col-sm">
            <Input
              type="text"
              name="sendBalanceInput"
              placeholder="amount (satoshis)"
              className="form-control"
              value={''}
              style={styles.inputStyle}
              onChange={e =>
                handleUpdate(preventDefault(e).target.value, 'sendBalanceInput')
              }
            />
            <Input
              type="text"
              name="recipientInput"
              placeholder="recipient address"
              className="form-control"
              style={styles.inputStyle}
              value={''}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'recipientInput')}
            />
            <Input
              type="text"
              name="transactionFeeInput"
              placeholder="rate (satoshis/kb)"
              className="form-control"
              style={styles.inputStyle}
              value={''}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'transactionFeeInput')}
            />
            <Button
              type="action"
              style={styles.wideButton}
              onClick={() =>
                handleCreate(
                  {
                    outputs: [
                      {
                        value: '',
                        address: ''
                      }
                    ],
                    rate: ''
                  },
                  'createProposal'
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

