import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Text, Input, Table } from '@bpanel/bpanel-ui';
import { connect } from 'react-redux';

import ProposalInfo from './Components/ProposalInfo';
import MultisigWalletInfo from './Components/MultisigWalletInfo';
import MultisigUX from './Components/MultisigUX';
import SelectHardware from './Components/SelectHardware';
import CreateMultisigWallet from './Components/CreateMultisigWallet';
import SelectMultisigWallet from './Components/SelectMultisigWallet';

import { preventDefault, buildSingleRowTable } from './utilities';
import { PLUGIN_NAMESPACE } from './constants';

import styles from './styles';

class MultisigWallet extends Component {
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
    const {
      handleCreate,
      handleUpdate,
      handleSelect,
      textFields,
      shouldRender,
    } = this.props;

    const {
      createWalletPassphraseInput,
      createWalletNInput,
      createWalletMInput,
      hardwareAccountInput,
      multisigWalletNameInput,
      createCosignerNameInput,
      joinCosignerNameInput,
      proposalNameInput,
      joinXpubInput,
      joinKeyInput,
      cosignerPathInput,
      multisigSendBalanceInput,
      multisigTransactionFeeInput,
      multisigRecipientInput,
      proposalCosignerTokenInput,
      proposalUXCosignerTokenInput,
      proposalUXCosignerAccountInput,
    } = textFields;

    const multisigWalletInfo = shouldRender.MultisigInfo
      ? (<MultisigWalletInfo handleSelect={handleSelect} />)
      : (<div className="col-sm"><Header type="h5">No wallet selected</Header></div>);

    const selectedWalletUI = shouldRender.MultisigUX
      ? (<MultisigUX
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
          handleSelect={handleSelect}
          textFields={{
            createWalletPassphraseInput,
            createWalletNInput,
            createWalletMInput,
            hardwareAccountInput,
            multisigWalletNameInput,
            createCosignerNameInput,
            joinCosignerNameInput,
            proposalNameInput,
            joinXpubInput,
            joinKeyInput,
            cosignerPathInput,
            multisigSendBalanceInput,
            multisigTransactionFeeInput,
            multisigRecipientInput,
            proposalCosignerTokenInput,
            proposalUXCosignerTokenInput,
            proposalUXCosignerAccountInput
          }}
        />)
      : (<div />)

    return (
      <div className="container">
        <SelectHardware
          handleSelect={handleSelect}
          textFields={{
            hardwareAccountInput
          }}
        />
        <CreateMultisigWallet
          handleUpdate={handleUpdate}
          handleCreate={handleCreate}
          textFields={{
            multisigWalletNameInput,
            createCosignerNameInput,
            createWalletMInput,
            createWalletNInput,
            hardwareAccountInput,
            multisigWalletNameInput,
          }}
        />
        <SelectMultisigWallet
          handleSelect={handleSelect}
        />
        {multisigWalletInfo}
        {selectedWalletUI}
      </div>
    );
  }
}

const mapStateToProps = (state, otherProps) => {
  const pluginState = state.plugins[PLUGIN_NAMESPACE] || {};
  const { selectedMultisigWallet, selectedProposal } = pluginState;

  const shouldRender = {
    ProposalInfo: !!selectedProposal,
    MultisigInfo: !!selectedMultisigWallet,
    MultisigUX: !!selectedMultisigWallet,
  }

  return {
    shouldRender,
    ...otherProps,
  }
}

export default connect(mapStateToProps)(MultisigWallet);
