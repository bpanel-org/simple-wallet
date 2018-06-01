import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Text, Input } from '@bpanel/bpanel-ui';

import { preventDefault } from './utilities';

// TODO: syntax for PureComponent
export default class CreateWallet extends Component {
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
    // TODO: add text giving information about wallets
    const {
      handleCreate,
      handleUpdate,
      handleSelect,
      walletNameInput,
      createWalletPassphraseInput,
      createWalletNInput,
      createWalletMInput,
      hardwareAccountInput,
      multisigWalletNameInput,
      cosignerNameInput,
    } = this.props;
    return (
      <div className="container">
        <div className="row">
          <Header type="h3">Create a Wallet</Header>
        </div>
        <div className="row">
          <div className="col-sm">
            <Input
              type="text"
              name="createWallet"
              placeholder="wallet name"
              className="form-control"
              value={walletNameInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'walletNameInput')}
            />
          </div>
          <div className="col-sm">
            <Input
              type="text"
              name="walletPassphraseText"
              placeholder="encryption passphrase (optional)"
              className="form-control"
              value={createWalletPassphraseInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'createWalletPassphraseInput')}
            />
          </div>
          <div className="col-sm">
            <Button
              type="action"
              onClick={() =>
                handleCreate(
                  {
                    name: walletNameInput.value,
                    passphrase: createWalletPassphraseInput.value
                  },
                  'newWallet'
                )}
            >
              Create
            </Button>
          </div>
        </div>
        <div className="row">
          <Header type="h3">Create a Multisig Wallet</Header>
        </div>
        <div className="row">
          <div className="col-sm">
            <Input
              type="text"
              name="multisigWalletName"
              placeholder="multisig wallet name"
              className="form-control"
              value={multisigWalletNameInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'multisigWalletNameInput')}
            />
          </div>
          <div className="col-sm">
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
            <Button
              type="action"
              onClick={() =>
                handleCreate(
                  {
                    name: walletNameInput.value,
                    passphrase: createWalletPassphraseInput.value
                  },
                  'newWallet'
                )}
            >
              Create
            </Button>
          </div>
        </div>
        <div className="row">
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
          <div className="col-sm">
            <Header type="h5">Insert Ledger Device</Header>
            <div className="row">
              <div className="col-sm">
                <Header type="h5">XPUB: </Header>
                <input
                  type="number"
                  name="ledgerAccountText"
                  placeholder="ledger account"
                  className="form-control"
                  min="0"
                  value={hardwareAccountInput.value}
                  onChange={(e) => {
                    handleSelect(preventDefault(e).target.value, 'hardwareAccount');
                  }}
                />
              </div>
              <div className="col-sm">
                <Button
                  type="action"
                  onClick={() => handleCreate({
                    m: createWalletMInput.value,
                    n: createWalletNInput.value,
                    hardwareAccountInput: hardwareAccountInput.value,
                    cosignerName: cosignerNameInput.value,
                  }, 'newMultisigWallet')}
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
