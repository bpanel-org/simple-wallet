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
      selectedXPUB
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
      </div>
    );
  }
}
