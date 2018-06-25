import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Header } from '@bpanel/bpanel-ui';

import { safeEval } from '../utilities';
import { PLUGIN_NAMESPACE } from '../constants';

class ProposalInfo extends Component {
  constructor() {
    super();
  }

  static get propTypes() {
    return {
      proposalInfo: PropTypes.object
    }
  }

  render() {
    const { approvals = [], author = {}, rejections = [] } = this.props.selectedProposalInfo;
    const { tx = {} } = this.props.proposalMTX;

    return (
      <div>
        <div className="row">
          <Header type="h3">Proposal Info</Header>
        </div>
        <div className="row">
          <Header type="h5">Author: {author.name}</Header>
          <Header type="h5">Approvals: {approvals.length}</Header>
          <Header type="h5">Rejections: {rejections.length}</Header>
          <Header type="h5">Raw TX: {tx.hex}</Header>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, otherProps) => {
  const pluginState = state.plugins[PLUGIN_NAMESPACE] || {};
  const { selectedMultisigWallet, selectedProposal } = pluginState;
  const proposalMTXs = state.wallets.proposalMTXs;

  const proposalMTX = safeEval(() => proposalMTXs[selectedMultisigWallet][selectedProposal], {});
  const proposals = safeEval(() => state.wallets.proposals[selectedMultisigWallet], []);
  const selectedProposalInfo = proposals.find(p => p.name === selectedProposal) || {};
  return {
    proposalMTX,
    selectedProposalInfo,
    ...otherProps
  }
}

export default connect(mapStateToProps)(ProposalInfo);
