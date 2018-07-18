import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Header, Button, Input } from '@bpanel/bpanel-ui';
import styles from '../styles';

import { safeEval, preventDefault } from '../utilities';
import { PLUGIN_NAMESPACE } from '../constants';

class CreateMultisigWallet extends Component {
  constructor() {
    super();
  }

  static get propTypes() {
    return {
      handleFieldUpdate: PropTypes.func,
      handleCreate: PropTypes.func,
      createCosignerNameInput: PropTypes.object,
      createWalletMInput: PropTypes.object,
      createWalletNInput: PropTypes.object,
      hardwareAccountInput: PropTypes.object,
      multisigWalletNameInput: PropTypes.object
    };
  }

  render() {
    const {
      handleFieldUpdate,
      handleCreate,
      createCosignerNameInput,
      createWalletMInput,
      createWalletNInput,
      hardwareAccountInput,
      multisigWalletNameInput
    } = this.props;

    return (
      <div>
        <div className="row">
          <Header type="h3">Create Multisig Wallet</Header>
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
              onChange={e =>
                handleFieldUpdate(
                  preventDefault(e).target.value,
                  'multisigWalletNameInput'
                )
              }
            />
            <Header type="h5">Cosigner Name</Header>
            <Input
              type="text"
              name="cosignerName"
              style={styles.inputStyle}
              placeholder="cosigner name"
              className="form-control"
              value={createCosignerNameInput.value}
              onChange={e =>
                handleFieldUpdate(
                  preventDefault(e).target.value,
                  'createCosignerNameInput'
                )
              }
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
              onChange={e =>
                handleFieldUpdate(
                  preventDefault(e).target.value,
                  'createWalletMInput'
                )
              }
            />
            <Header type="h5">Number of Participants (N)</Header>
            <input
              type="number"
              name="multisig-n"
              style={styles.inputStyle}
              className="form-control"
              min="1"
              value={createWalletNInput.value}
              onChange={e =>
                handleFieldUpdate(
                  preventDefault(e).target.value,
                  'createWalletNInput'
                )
              }
            />
          </div>
        </div>
        <div className="row">
          <Button
            type="action"
            style={styles.wideButton}
            onClick={() =>
              handleCreate(
                {
                  m: createWalletMInput.value,
                  n: createWalletNInput.value,
                  hardwareAccountInput: hardwareAccountInput.value,
                  cosignerName: createCosignerNameInput.value,
                  name: multisigWalletNameInput.value
                },
                'newMultisigWallet'
              )
            }
          >
            Create
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, otherProps) => {
  const pluginState = state.plugins[PLUGIN_NAMESPACE] || {};
  const { textFields = {} } = pluginState;
  const {
    multisigWalletNameInput = { value: '', valid: true },
    createCosignerNameInput = { value: '', valid: true },
    createWalletMInput = { value: '', valid: true },
    createWalletNInput = { value: '', valid: true },
    hardwareAccountInput = { value: '', valid: true }
  } = textFields;

  return {
    createCosignerNameInput,
    createWalletMInput,
    createWalletNInput,
    hardwareAccountInput,
    multisigWalletNameInput,
    ...otherProps
  };
};

export default connect(mapStateToProps)(CreateMultisigWallet);
