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
    return {}
  }

  render() {
    const {
      handleCreate,
      handleUpdate,
      multisigWalletNameInput,
      proposalNameInput,
      multisigSendBalanceInput,
      multisigTransactionFeeInput,
      multisigRecipientInput,
      proposalCosignerTokenInput,
      selectedMultisigWallet,
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
             onChange={e => handleUpdate(preventDefault(e).target.value, 'proposalNameInput')}
           />
           <Header type="h5">Cosigner Token</Header>
           <Input
             type="text"
             name="proposalTokenInput"
             placeholder="cosigner token"
             style={styles.inputStyle}
             className="form-control"
             value={proposalCosignerTokenInput.value}
             onChange={e => handleUpdate(preventDefault(e).target.value, 'proposalCosignerTokenInput')}
           />
         </div>
         <div className="col-sm">
           <Input
             type="text"
             name="sendBalanceInput"
             placeholder="amount (satoshis)"
             className="form-control"
             style={styles.inputStyle}
             value={multisigSendBalanceInput.value}
             style={styles.inputStyle}
             onChange={e =>
               handleUpdate(preventDefault(e).target.value, 'multisigSendBalanceInput')
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
             onChange={e => handleUpdate(preventDefault(e).target.value, 'multisigRecipientInput')}
           />
           <Input
             type="text"
             name="transactionFeeInput"
             placeholder="rate (satoshis/kb)"
             style={styles.inputStyle}
             className="form-control"
             style={styles.inputStyle}
             value={multisigTransactionFeeInput.value}
             onChange={e => handleUpdate(preventDefault(e).target.value, 'multisigTransactionFeeInput')}
           />
           <Button
             type="action"
             style={styles.wideButton}
             onClick={() =>
               handleCreate(
                 {
                   proposalName: proposalNameInput.value,
                   walletId: selectedMultisigWallet,
                   token: proposalCosignerTokenInput.value,
                   outputs: [
                     {
                       value: multisigSendBalanceInput.value,
                       address: multisigRecipientInput.value
                     }
                   ],
                   rate: multisigTransactionFeeInput.value
                 },
                 'newProposal'
               )
             }
           >
             Create Proposal
           </Button>
         </div>
       </div>
     </div>
    )
  }
}

const mapStateToProps = (state, otherProps) => {
  const pluginState = state.plugins[PLUGIN_NAMESPACE] || {};
  const { selectedMultisigWallet } = pluginState;

  return {
    selectedMultisigWallet,
    ...otherProps,
  }
}

export default connect(mapStateToProps)(CreateProposal);

