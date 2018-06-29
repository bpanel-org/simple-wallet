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
    return {}
  }

  render() {
    const {
      handleCreate,
      handleUpdate,
      selectedMultisigWallet,
      selectedProposalInfo,
      proposalUXCosignerTokenInput
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
           onChange={e => handleUpdate(preventDefault(e).target.value, 'proposalUXCosignerTokenInput')}
         />
       </div>
       <div className="row">
         <div className="col-sm">
           <Button
             type="action"
             style={styles.wideButton}
             onClick={() => handleCreate({
               walletId: selectedMultisigWallet,
               proposalId: selectedProposalInfo.name,
               token: proposalUXCosignerTokenInput.value
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
      </div>
    )
  }
}

const mapStateToProps = (state, otherProps) => {
  const pluginState = state.plugins[PLUGIN_NAMESPACE] || {};
  const { selectedMultisigWallet, selectedProposal } = pluginState;
  const proposals = safeEval(() => state.wallets.proposals[selectedMultisigWallet], []);
  const selectedProposalInfo = proposals.find(p => p.name === selectedProposal) || {};

  return {
    selectedMultisigWallet,
    selectedProposalInfo,
    ...otherProps
  }
}

export default connect(mapStateToProps)(ProposalUX);
