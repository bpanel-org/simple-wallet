import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Header, Text, Input, Table } from '@bpanel/bpanel-ui';

import { safeEval, preventDefault, buildSingleRowTable } from '../utilities';
import { PLUGIN_NAMESPACE } from '../constants';

import ProposalInfo from './ProposalInfo';

import styles from '../styles';

class CreateProposal extends Component {
  constructor() {
    super();
  }

  static get propTypes() {
    return {
      handleCreate: PropTypes.func,
      handleUpdate: PropTypes.func,
      selectedMultisigWallet: PropTypes.string,
      multisigWalletNameInput: PropTypes.object,
      proposalNameInput: PropTypes.object,
      multisigSendBalanceInput: PropTypes.object,
      multisigTransactionFeeInput: PropTypes.object,
      multisigRecipientInput: PropTypes.object,
      proposalCosignerTokenInput: PropTypes.object
    };
  }

  createProposal(proposalName, walletId, token, value, address, rate) {
    const input = {
      proposalName,
      walletId,
      token,
      outputs: [{ value, address }],
      rate
    };

    this.props.handleCreate(input, 'newProposal');
  }

  render() {
    const {
      handleCreate,
      handleUpdate,
      selectedMultisigWallet,
      multisigWalletNameInput,
      proposalNameInput,
      multisigSendBalanceInput,
      multisigTransactionFeeInput,
      multisigRecipientInput,
      proposalCosignerTokenInput
    } = this.props;

    return (
      <div>
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
              onChange={e =>
                handleUpdate(
                  preventDefault(e).target.value,
                  'proposalNameInput'
                )
              }
            />
            <Header type="h5">Cosigner Token</Header>
            <Input
              type="text"
              name="proposalTokenInput"
              placeholder="cosigner token"
              style={styles.inputStyle}
              className="form-control"
              value={proposalCosignerTokenInput.value}
              onChange={e =>
                handleUpdate(
                  preventDefault(e).target.value,
                  'proposalCosignerTokenInput'
                )
              }
            />
          </div>
          <div className="col-sm">
            <Input
              type="text"
              name="sendBalanceInput"
              placeholder="amount (satoshis)"
              className="form-control"
              style={styles.inputStyle}
              value={`${multisigSendBalanceInput.value}`}
              style={styles.inputStyle}
              onChange={e =>
                handleUpdate(
                  preventDefault(e).target.value,
                  'multisigSendBalanceInput'
                )
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
              onChange={e =>
                handleUpdate(
                  preventDefault(e).target.value,
                  'multisigRecipientInput'
                )
              }
            />
            <Input
              type="text"
              name="transactionFeeInput"
              placeholder="rate (satoshis/kb)"
              style={styles.inputStyle}
              className="form-control"
              style={styles.inputStyle}
              value={multisigTransactionFeeInput.value}
              onChange={e =>
                handleUpdate(
                  preventDefault(e).target.value,
                  'multisigTransactionFeeInput'
                )
              }
            />
            <Button
              type="action"
              style={styles.wideButton}
              onClick={() =>
                this.createProposal(
                  proposalNameInput.value,
                  selectedMultisigWallet,
                  proposalCosignerTokenInput.value,
                  multisigSendBalanceInput.value,
                  multisigRecipientInput.value,
                  multisigTransactionFeeInput.value
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

const mapStateToProps = (state, otherProps) => {
  const pluginState = state.plugins[PLUGIN_NAMESPACE] || {};
  const { selectedMultisigWallet } = pluginState;
  const { textFields = {} } = pluginState;

  const {
    multisigWalletNameInput = { value: '', valid: true },
    proposalNameInput = { value: '', valid: true },
    multisigSendBalanceInput = { value: '', valid: true },
    multisigTransactionFeeInput = { value: '', valid: true },
    multisigRecipientInput = { value: '', valid: true },
    proposalCosignerTokenInput = { value: '', valid: true }
  } = textFields;

  return {
    selectedMultisigWallet,
    multisigWalletNameInput,
    proposalNameInput,
    multisigSendBalanceInput,
    multisigTransactionFeeInput,
    multisigRecipientInput,
    proposalCosignerTokenInput,
    ...otherProps
  };
};

export default connect(mapStateToProps)(CreateProposal);
