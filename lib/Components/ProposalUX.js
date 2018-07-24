import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Input } from '@bpanel/bpanel-ui';
import styles from '../styles';

import { safeEval, preventDefault } from '../utilities';
import { PLUGIN_NAMESPACE } from '../constants';

class ProposalUX extends Component {
  constructor() {
    super();
  }

  static get propTypes() {
    return {
      handleCreate: PropTypes.func,
      handleFieldUpdate: PropTypes.func,
      selectedMultisigWallet: PropTypes.string,
      proposalUXCosignerTokenInput: PropTypes.object,
      proposalUXCosignerAccountInput: PropTypes.object,
      selectedProposalInfo: PropTypes.object,
    };
  }

  render() {
    const {
      handleCreate,
      handleFieldUpdate,
      selectedMultisigWallet,
      selectedProposalInfo,
      proposalUXCosignerTokenInput,
      proposalUXCosignerAccountInput,
    } = this.props;

    return (
      <div>
        <div className="row">
          <Input
            type="text"
            name="proposalUXCosignerTokenInput"
            placeholder="cosigner token"
            style={styles.inputStyle}
            className="form-control"
            value={proposalUXCosignerTokenInput.value}
            onChange={e =>
              handleFieldUpdate(
                preventDefault(e).target.value,
                'proposalUXCosignerTokenInput'
              )
            }
          />
        </div>
        <div className="row">
          <Input
            type="number"
            name="proposalUXCosignerAccountInput"
            placeholder="cosigner account"
            style={styles.inputStyle}
            className="form-control"
            value={`${proposalUXCosignerAccountInput.value}`}
            onChange={e =>
              handleFieldUpdate(
                preventDefault(e).target.value,
                'proposalUXCosignerAccountInput'
              )
            }
          />
        </div>
        <div className="row">
          <div className="col-sm">
            <Button
              type="action"
              style={styles.wideButton}
              onClick={() =>
                handleCreate(
                  {
                    walletId: selectedMultisigWallet,
                    proposalId: selectedProposalInfo.name,
                    token: proposalUXCosignerTokenInput.value,
                    account: proposalUXCosignerAccountInput.value,
                  },
                  'multisigApprove'
                )
              }
            >
              Approve
            </Button>
          </div>
          <div className="col-sm">
            <Button
              type="action"
              style={styles.wideButton}
              onClick={() =>
                handleCreate(
                  {
                    proposalId: selectedProposalInfo.name,
                    walletId: selectedMultisigWallet,
                  },
                  'multisigReject'
                )
              }
            >
              Reject
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, otherProps) => {
  const pluginState = state.plugins[PLUGIN_NAMESPACE] || {};
  const {
    selectedMultisigWallet,
    selectedProposal,
    textFields = {},
  } = pluginState;
  const proposals = safeEval(
    () => state.wallets.proposals[selectedMultisigWallet],
    []
  );
  const selectedProposalInfo =
    proposals.find(p => p.name === selectedProposal) || {};

  const {
    proposalUXCosignerTokenInput = { value: '', valid: true },
    proposalUXCosignerAccountInput = { value: '', valid: true },
  } = textFields;

  return {
    selectedMultisigWallet,
    selectedProposalInfo,
    proposalUXCosignerTokenInput,
    proposalUXCosignerAccountInput,
    ...otherProps,
  };
};

export default connect(mapStateToProps)(ProposalUX);
