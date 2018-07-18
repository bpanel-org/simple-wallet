import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Header, Input, Button } from '@bpanel/bpanel-ui';

import styles from '../styles';
import { safeEval, preventDefault } from '../utilities';
import { PLUGIN_NAMESPACE } from '../constants';

class JoinWallet extends Component {
  constructor() {
    super();
  }

  static get propTypes() {
    return {
      handleFieldUpdate: PropTypes.func,
      handleCreate: PropTypes.func,
      selectedMultisigWallet: PropTypes.string,
      cosignerPathInput: PropTypes.object,
      joinKeyInput: PropTypes.object,
      joinCosignerNameInput: PropTypes.object,
      joinXpubInput: PropTypes.object
    };
  }

  render() {
    const {
      handleFieldUpdate,
      handleCreate,
      selectedMultisigWallet,
      cosignerPathInput,
      joinKeyInput,
      joinCosignerNameInput,
      joinXpubInput
    } = this.props;

    return (
      <div>
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
              onChange={e =>
                handleFieldUpdate(
                  preventDefault(e).target.value,
                  'joinCosignerNameInput'
                )
              }
            />
            <Header type="h5">Cosigner Path</Header>
            <Input
              type="text"
              name="cosignerPath"
              placeholder="cosigner path"
              style={styles.inputStyle}
              className="form-control"
              value={cosignerPathInput.value}
              onChange={e =>
                handleFieldUpdate(
                  preventDefault(e).target.value,
                  'cosignerPathInput'
                )
              }
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
              onChange={e =>
                handleFieldUpdate(preventDefault(e).target.value, 'joinKeyInput')
              }
            />
            <Header type="h5">xpub</Header>
            <Input
              type="text"
              name="xpub"
              placeholder="xpub"
              style={styles.inputStyle}
              className="form-control"
              value={joinXpubInput.value}
              onChange={e =>
                handleFieldUpdate(preventDefault(e).target.value, 'joinXpubInput')
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
                  walletName: selectedMultisigWallet,
                  cosignerName: joinCosignerNameInput.value,
                  cosignerPath: cosignerPathInput.value,
                  joinKey: joinKeyInput.value,
                  xpub: joinXpubInput.value
                },
                'joinWallet'
              )
            }
          >
            Join
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, otherProps) => {
  const pluginState = state.plugins[PLUGIN_NAMESPACE] || {};
  const { selectedMultisigWallet } = pluginState;

  const { textFields = {} } = pluginState;

  const {
    cosignerPathInput = { value: '', valid: true },
    joinKeyInput = { value: '', valid: true },
    joinCosignerNameInput = { value: '', valid: true },
    joinXpubInput = { value: '', valid: true }
  } = textFields;

  return {
    cosignerPathInput,
    joinKeyInput,
    joinCosignerNameInput,
    joinXpubInput,
    selectedMultisigWallet,
    ...otherProps
  };
};

export default connect(mapStateToProps)(JoinWallet);
