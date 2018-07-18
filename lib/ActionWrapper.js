import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  bwalletClient,
  bmultisigClient,
  bpanelClient
} from '@bpanel/bpanel-utils';

import {
  getHistory,
  getWallets,
  getAccounts,
  selectWallet,
  selectAccount,
  createWallet,
  getAccountInfo,
  getAccountBalance,
  createReceiveAddress,
  createAccount,
  getMultisigWallets,
  joinMultisigWallet,
  selectMultisigWallet,
  getMultisigWalletProposals,
  selectMultisigProposal,
  getMultisigWalletProposalMTX,
  selectXPUB,
  updateTextField
} from './actions';

import { safeEval, validateTextField } from './utilities';

import {
  buildXpubPath,
  newLedgerBcoin,
  getPublicKey,
  signTX
} from './hardwareWalletUtilities';

import { PLUGIN_NAMESPACE } from './constants';

class ActionContainer extends Component {
  constructor(props) {
    super(props);

    // initialize wallet clients
    this.walletClient = bwalletClient();
    this.multisigWalletClient = bmultisigClient();
    this.nodeClient = bpanelClient();

    // bind this value to current context
    this.handleSelect = this.handleSelect.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleFieldUpdate = this.handleFieldUpdate.bind(this);
  }

  // updates text fields in redux
  handleFieldUpdate(_value, field) {
    const [value, isValid] = validateTextField(_value, field);
    this.props.updateTextField(field, value, isValid);
  }

  async handleCreate(value, type) {
    const { walletClient, handleFieldUpdate } = this;
    const {
      createWallet,
      createAccount,
      createReceiveAddress,
      getAccounts,
      getHistory,
      getWallets,
      getAccountInfo,
      pluginState = {},
      getMultisigWallets,
      selectMultisigWallet,
      getMultisigWalletProposals,
      wallets
    } = this.props;

    try {
      switch (type) {
        case 'newAccount':
          // create account
          await createAccount(pluginState.selectedWallet, value);
          // then update the account list
          await getAccounts(pluginState.selectedWallet);
          break;
        case 'receiveAddress':
          // create receive address
          await createReceiveAddress(pluginState.selectedWallet, value);
          // then update the account state
          await getAccountInfo(pluginState.selectedWallet, value);
          break;
        case 'sendTransaction':
          // send txn
          try {
            const response = await walletClient.send(
              pluginState.selectedWallet,
              value
            );
            // TODO: notify user that txn was sent in a better way
            window.alert(`Successful transaction: ${response.hash}`);
            // update txn history
            getHistory(pluginState.selectedWallet, pluginState.selectedAccount);
            // clean input fields
            handleFieldUpdate('', 'sendBalanceInput');
            handleFieldUpdate('', 'transactionFeeInput');
            handleFieldUpdate('', 'recipientInput');
            handleFieldUpdate('', 'sendWalletPassphraseInput');
          } catch (e) {
            window.alert(`Unsuccessful transaction: ${e}`);
          }
          break;
        case 'newWallet':
          // create a wallet
          await createWallet(value.name, { passphrase: value.passphrase });
          await getWallets();
          break;
        case 'newMultisigWallet':
          const cosignerPath = buildXpubPath(value.hardwareAccountInput);
          console.assert(
            pluginState.selectedXPUB !== undefined,
            'Please select xpub'
          );
          const opts = {
            m: value.m,
            n: value.n,
            xpub: pluginState.selectedXPUB,
            cosignerName: value.cosignerName,
            cosignerPath
          };
          const response = await this.multisigWalletClient.createWallet(
            value.name,
            opts
          );
          const { joinKey, cosigners } = response;

          alert(
            `Please record your join key - this is very important and will only be shown once: ${joinKey}`
          );
          let token = null;
          for (let i = 0; i < cosigners.length; i++) {
            if (token === null && 'token' in cosigners[i]) {
              token = cosigners[i].token;
            }
          }
          alert(`cosigner token: ${token}`);

          await getWallets();
          await getMultisigWallets();
          break;
        case 'joinWallet':
          const { walletName, ...options } = value;
          const {
            cosigners: joinCosigners
          } = await this.multisigWalletClient.join(walletName, options);

          // TODO: fix copy/paste code block, same as above
          let joinToken = null;
          for (let i = 0; i < joinCosigners.length; i++) {
            if (joinToken === null && 'token' in joinCosigners[i]) {
              joinToken = joinCosigners[i].token;
            }
          }
          alert(`cosigner token: ${joinToken}`);
          await selectMultisigWallet(walletName);
          break;
        case 'newProposal':
          const { walletId, proposalName, ...txoptions } = value;
          console.assert('token' in txoptions, 'Must use cosigner token');
          await this.multisigWalletClient.createProposal(
            walletId,
            proposalName,
            txoptions
          );
          await getMultisigWalletProposals(walletId);

          break;
        case 'multisigApprove':
          console.log(value);
          console.assert(
            value.walletId !== undefined,
            'must select a multisig wallet'
          );
          console.assert(
            value.proposalId !== undefined,
            'must select a proposal'
          );
          console.assert(
            value.account !== undefined,
            'Please select a hardware account'
          );

          console.assert('token' in value, 'Must use cosigner token');

          const tx = safeEval(
            () => wallets.proposalMTXs[value.walletId][value.proposalId],
            {}
          );
          const { device, ledgerBcoin } = await newLedgerBcoin();
          const account = buildXpubPath(value.account);
          const signedTx = await signTX(
            ledgerBcoin,
            this.multisigWalletClient,
            account,
            tx,
            value.walletId
          );
          const raw = signedTx.toRaw().toString('hex');
          const approvalResponse = await this.multisigWalletClient.post(
            `/${value.walletId}/proposal/${value.proposalId}/approve`,
            { tx: raw, token: value.token }
          );
          console.log('approval response:');
          console.log(approvalResponse);
          await getMultisigWalletProposals(value.walletId);

          device.close();
          break;
        case 'multisigReject':
          console.log('multisigReject');
          console.log(value);
          await this.multisigWalletClient.rejectProposal(
            value.walletId,
            value.proposalId
          );
          await getMultisigWalletProposals(value.walletId);

          break;
        default:
          throw new Error(`unkown create type: ${type}`);
      }
    } catch (e) {
      console.error(e); // eslint-disable-line
    }
  }

  async handleSelect(value, type) {
    const { handleFieldUpdate } = this;
    const {
      getHistory,
      getAccounts,
      selectWallet,
      selectAccount,
      getAccountInfo,
      getAccountBalance,
      pluginState = {},
      network,
      selectMultisigWallet,
      getMultisigWalletProposals,
      selectMultisigProposal,
      getMultisigWalletProposalMTX,
      selectXPUB
    } = this.props;

    try {
      switch (type) {
        case 'wallet':
          // get the accounts and wallet info
          await getAccounts(value);
          selectWallet(value);
          // NOTE: every wallet has a default account
          // so this is safe, refactor to use first index?
          selectAccount('default');
          getAccountInfo(value, 'default');
          getAccountBalance(value, 'default');
          // reset the account name input to being empty
          handleFieldUpdate('', 'accountNameInput');
          break;
        case 'account':
          // TODO: validate selectedWallet isn't undefined
          selectAccount(value);
          // no await as these do not need to wait for each other
          getAccountInfo(pluginState.selectedWallet, value);
          getAccountBalance(pluginState.selectedWallet, value);
          getHistory(pluginState.selectedWallet, value);
          break;
        // fetch from hardware wallet xpub
        case 'hardwareAccount':
          handleFieldUpdate(value, 'hardwareAccountInput');
          const path = buildXpubPath(value);
          const { device, ledgerBcoin } = await newLedgerBcoin();
          const hdpubkey = await getPublicKey(ledgerBcoin, path);
          // network comes from redux
          const xpub = hdpubkey.xpubkey(network);
          // keep track of selected xpub
          await selectXPUB(xpub);
          // close device after use
          device.close();
          break;
        case 'multisigWallet':
          await selectMultisigWallet(value);
          await getMultisigWalletProposals(value);
          break;
        case 'multisigCosigner':
          // nothing to do here yet
          break;
        case 'multisigProposal':
          await selectMultisigProposal(value);
          await getMultisigWalletProposals(pluginState.selectedMultisigWallet);
          await getMultisigWalletProposalMTX(
            pluginState.selectedMultisigWallet,
            value
          );
          break;
        default:
          throw new Error(`unknown change type: ${type}`);
      }
    } catch (e) {
      // eslint-disable-next-line
      console.error(e)
    }
  }

  render() {
    const { children } = this.props;

    return (
      <div>
        {React.Children.map(children, (Component, i) =>
          React.cloneElement(Component, {
            key: i,
            handleCreate: this.handleCreate,
            handleSelect: this.handleSelect,
            handleFieldUpdate: this.handleFieldUpdate,
            walletClient: this.walletClient,
            multisigWalletClient: this.multisigWalletClient,
            nodeClient: this.nodeClient
          })
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, otherProps) => {
  const pluginState = state.plugins[PLUGIN_NAMESPACE] || {};
  const wallets = state.wallets;
  const network = state.node.node.network;
  return {
    pluginState,
    wallets,
    network,
    ...otherProps
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createWallet: async (walletId, options) =>
      dispatch(createWallet(walletId, options)),
    createAccount: async (walletId, accountId) =>
      dispatch(createAccount(walletId, accountId)),
    createReceiveAddress: async (walletId, accountId) =>
      dispatch(createReceiveAddress(walletId, accountId)),
    createReceiveAddress: async (walletId, accountId) =>
      dispatch(createReceiveAddress(walletId, accountId)),
    getAccounts: async walletId => dispatch(getAccounts(walletId)),
    getHistory: async (walletId, accountId) =>
      dispatch(getHistory(walletId, accountId)),
    getWallets: async () => dispatch(getWallets()),
    getAccountInfo: async (walletId, accountId) =>
      dispatch(getAccountInfo(walletId, accountId)),
    getMultisigWallets: async () => dispatch(getMultisigWallets()),
    selectMultisigWallet: async walletId =>
      dispatch(selectMultisigWallet(walletId)),
    getMultisigWalletProposals: async walletId =>
      dispatch(getMultisigWalletProposals(walletId)),
    updateTextField: async (field, value) =>
      dispatch(updateTextField(field, value)),
    selectWallet: walletId => dispatch(selectWallet(walletId)),
    selectAccount: accountId => dispatch(selectAccount(accountId)),
    getAccountBalance: async (walletId, accountId) =>
      dispatch(getAccountBalance(walletId, accountId)),
    selectMultisigProposal: async proposalId =>
      dispatch(selectMultisigProposal(proposalId)),
    getMultisigWalletProposalMTX: async (walletId, proposalId) =>
      dispatch(getMultisigWalletProposalMTX(walletId, proposalId)),
    selectXPUB: async xpub => dispatch(selectXPUB(xpub))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionContainer);
