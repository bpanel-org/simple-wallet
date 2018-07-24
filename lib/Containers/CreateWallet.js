import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Header, Input } from '@bpanel/bpanel-ui';

import { preventDefault } from '../utilities';
import { PLUGIN_NAMESPACE } from '../constants';

class CreateWallet extends Component {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      handleCreate: PropTypes.func,
      handleFieldUpdate: PropTypes.func,
      // text field objects
      walletNameInput: PropTypes.object,
      createWalletPassphraseInput: PropTypes.object,
    };
  }

  createWallet(name, passphrase) {
    this.props.handleCreate({ name, passphrase }, 'newWallet');
  }

  render() {
    const {
      handleFieldUpdate,
      walletNameInput,
      createWalletPassphraseInput,
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
              onChange={e =>
                handleFieldUpdate(
                  preventDefault(e).target.value,
                  'walletNameInput'
                )
              }
            />
          </div>
          <div className="col-sm">
            <Input
              type="text"
              name="walletPassphraseText"
              placeholder="encryption passphrase (optional)"
              className="form-control"
              value={createWalletPassphraseInput.value}
              onChange={e =>
                handleFieldUpdate(
                  preventDefault(e).target.value,
                  'createWalletPassphraseInput'
                )
              }
            />
          </div>
          <div className="col-sm">
            <Button
              type="action"
              onClick={() =>
                this.createWallet(
                  walletNameInput.value,
                  createWalletPassphraseInput.value
                )
              }
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, otherProps) => {
  const pluginState = state.plugins[PLUGIN_NAMESPACE] || {};
  const { textFields = {} } = pluginState;

  const {
    walletNameInput = { value: '', valid: true },
    createWalletPassphraseInput = { value: '', valid: true },
  } = textFields;

  return {
    walletNameInput,
    createWalletPassphraseInput,
    ...otherProps,
  };
};

export default connect(mapStateToProps)(CreateWallet);
