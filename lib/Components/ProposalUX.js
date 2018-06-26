import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from '@bpanel/bpanel-ui';
import styles from '../styles';

import { safeEval } from '../utilities';
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
      selectedMultisigWallet,
      selectedProposalInfo
    } = this.props;

    return (
       <div className="row">
         <div className="col-sm">
           <Button
             type="action"
             style={styles.wideButton}
             onClick={() => handleCreate({
               walletId: selectedMultisigWallet,
               proposalId: selectedProposalInfo.name
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
