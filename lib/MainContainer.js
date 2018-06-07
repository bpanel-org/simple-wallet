import React, { Component } from 'react';
import { connect } from 'react-redux';

// bpanel imports
import { Header, TabMenu } from '@bpanel/bpanel-ui';
import { bwalletClient, bmultisigClient } from '@bpanel/bpanel-utils';

// local imports
import CreateWallet from './CreateWallet';
import SelectWallet from './SelectWallet';
import MultisigWallet from './MultisigWallet';
import { safeEval } from './utilities';

import { buildBIP44PathByAccount,
         newLedgerBcoin,
         getPublicKey
} from './hardwareWalletUtilities';

export default class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // keep track of all text fields here
      textFields: {
        sendBalanceInput: { value: '', valid: true },
        transactionFeeInput: { value: '', valid: true },
        recipientInput: { value: '', valid: true },
        walletNameInput: { value: '', valid: true },
        createWalletPassphraseInput: { value: '', valid: true },
        sendWalletPassphraseInput: { value: '', valid: true },
        accountNameInput: { value: '', valid: true },
        createWalletNInput: { value: 0, valid: true },
        createWalletMInput: { value: 0, valid: true },
        hardwareAccountInput: { value: '', valid: true },
        multisigWalletNameInput: { value: '', valid: true },
        createCosignerNameInput: { value: '', valid: true },
        joinCosignerNameInput: { value: '', valid: true },
        proposalNameInput: { value: '', valid: true },
        joinXpubInput: { value: '', valid: true },
        joinKeyInput: { value: '', valid: true },
        cosignerPathInput: { value: '', valid: true },
        // multisig versions
        // TODO: move state into component itself
        multisigSendBalanceInput: { value: '', valid: true },
        multisigTransactionFeeInput: { value: '', valid: true },
        multisigRecipientInput: { value: '', valid: true },
        proposalCosignerTokenInput: { value: '', valid: true },
      },
      // TODO: reduxify
      selectedXPUB: '',
    };
    // initialize wallet clients
    this.walletClient = bwalletClient();
    this.multisigWalletClient = bmultisigClient();

    // bind this value to current context
    this.handleSelect = this.handleSelect.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  async componentDidMount() {
    try {
      // call out to wallet server to list wallets
      this.props.getWallets();
      // autoselect primary wallet on load
      this.handleSelect('primary', 'wallet');
      // prepopulate the list of multisig wallets
      await this.props.getMultisigWallets();
    } catch (e) {
      console.error(e); // eslint-disable-line
    }
  }

  // updates text fields
  handleUpdate(_value, fieldToUpdate) {
    const [value, isValid] = this.validate(_value, fieldToUpdate);
    this.setState({
      textFields: Object.assign({}, this.state.textFields, {
        [fieldToUpdate]: { value, valid: isValid }
      })
    });
  }

  // validate text field updates
  validate(value, field) {
    try {
      switch (field) {
        case 'sendBalanceInput':
        case 'multisigSendBalanceInput':
          // TODO: check to make sure less than total balance
          // in current account
          // check if invalid number
          if (isNaN(+value)) {
            return [value, false];
          }
          // is it possible to send using sum of 2 accounts?
          // convert value to int
          return [+value, true];
        case 'transactionFeeInput':
        case 'multisigTransactionFeeInput':
          // TODO: check that sendBalance + txnFee < totalBalance
          if (isNaN(+value)) {
            return [value, false];
          }
          return [+value, true];
        case 'recipientInput':
        case 'multisigRecipientInput':
          // TODO: validate address
          return [value, true];
        case 'createWalletPassphraseInput':
        case 'sendWalletPassphraseInput':
          // TODO: determine contraints on passphrase
          return [value, true];
        case 'walletNameInput':
        case 'accountNameInput':
        case 'proposalNameInput':
        case 'multisigWalletNameInput':
        case 'createCosignerNameInput':
        case 'joinCosignerNameInput':
          // TODO: determine contstraints on wallet/account names
          return [value, true];
        case 'createWalletMInput':
          const { createWalletNInput } = this.state.textFields;
          // m cannot be larger than n
          if (+value > createWalletNInput) {
            return [+value, false]
          }
          return [+value, true]
        case 'createWalletNInput':
          const { createWalletMInput } = this.state.textFields;
          // m cannot be larger than n
          if (createWalletMInput > +value) {
            return [+value, false]
          }
          return [+value, true]
        case 'hardwareAccountInput':
          // test for integer
          if (/^\d+$/.test(+value)) {
            return [+value, false];
          }
          return [+value, true]
        case 'joinXpubInput':
          // regex for xpub
          // check prefix against network
          return [value, true]
        case 'joinKeyInput':
          // regex for joinKey
          return [value, true]
        case 'cosignerPathInput':
          // regex for valid cosigner path
          return [value, true];
        case 'proposalCosignerTokenInput':
          // regex for valid token
          return [value, true];
        default:
          // developer error
          throw new Error(`invalid field: ${field}, value: ${value}`);
      }
    } catch (e) {
      // catch any other sort of error
      // eslint-disable-next-line
      console.error(`bad validation operation for ${field}, value: ${value}`);
      return [value, false];
    }
  }

  async handleCreate(value, type) {
    const { walletClient, handleUpdate } = this;
    const {
      createWallet,
      createAccount,
      createReceiveAddress,
      selectReceiveAddress,
      getAccounts,
      getHistory,
      getWallets,
      getAccountInfo,
      pluginState = {},
      getMultisigWallets,
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
          await createReceiveAddress(pluginState.selectedWallet, value)
            // then update the account state
          await getAccountInfo(pluginState.selectedWallet, value);
          break;
        case 'sendTransaction':
          // send txn
          try {
            const response = await walletClient.send(pluginState.selectedWallet, value);
            // TODO: notify user that txn was sent in a better way
            window.alert(`Successful transaction: ${response.hash}`);
            // update txn history
            getHistory(pluginState.selectedWallet, pluginState.selectedAccount);
            // clean input fields
            handleUpdate('', 'sendBalanceInput');
            handleUpdate('', 'transactionFeeInput');
            handleUpdate('', 'recipientInput');
            handleUpdate('', 'sendWalletPassphraseInput');
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
          const cosignerPath = buildBIP44PathByAccount(value.hardwareAccountInput);
          // TODO: determine what defines a good cosigner name
          const opts = {
            m: value.m,
            n: value.n,
            xpub: this.state.selectedXPUB,
            cosignerName: value.cosignerName,
            cosignerPath,
          };
          const response = await this.multisigWalletClient.createWallet(value.name, opts);
          const { joinKey, cosigners } = response;

          alert(`Please record your join key - this is very important and will only be shown once: ${joinKey}`);
          let token = null;
          for (let i = 0; i < cosigners.length; i++) {
            if (token === null && 'token' in cosigners[i]) {
              token = cosigners[i].token;
            }
          }
          alert(`cosigner token: ${token}`);
          // need joinKey here and token

          await getWallets();
          await getMultisigWallets();
          break;
        case 'joinWallet':
          const { walletName, ...options } = value;
          // TODO: do we need the response for anything?
          await this.multisigWalletClient.join(walletName, options)
          // TODO: set fields to be empty
          break;
        case 'newProposal':
          const { walletId, proposalName, ...txoptions } = value;
          console.assert('token' in txoptions, 'Must use cosigner token');
          await this.multisigWalletClient.createProposal(walletId, proposalName, txoptions);
          // TODO: getProposals

          break;
        default:
          throw new Error(`unkown create type: ${type}`);
      }
    } catch (e) {
      console.error(e); // eslint-disable-line
    }
  }

  async handleSelect(value, type) {
    const { handleUpdate } = this;
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
          handleUpdate('', 'accountNameInput');
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
          handleUpdate(value, 'hardwareAccountInput');
          const path =  buildBIP44PathByAccount(value);
          const { device, ledgerBcoin } = await newLedgerBcoin();
          const hdpubkey = await getPublicKey(ledgerBcoin, path);
          // network comes from redux
          const xpub = hdpubkey.xpubkey(network);
          // keep track of selected xpub in the state
          await this.setState({ ...this.state, selectedXPUB: xpub });
          // close device after use
          device.close();
          break;
        case 'multisigWallet':
          await selectMultisigWallet(value);
          await getMultisigWalletProposals(value);
          break;
        case 'multisigCosigner':
        case 'multisigProposal':
          // nothing to do here yet
          break;
        default:
          throw new Error(`unknown change type: ${type}`);
      }
    } catch(e) {
      // eslint-disable-next-line
      console.error(e)
    }
  }

  render() {
    // TODO: initial population of pluginState in redux store
    const { pluginState = {}, wallets = {} } = this.props;
    const { selectedAccount, selectedWallet, selectedMultisigWallet } = pluginState;
    const { accounts, history, multisigWallets = [] } = wallets;

    const _transactionHistory = safeEval(() => history[selectedWallet][selectedAccount], []);
    const _accounts = safeEval(() => accounts[selectedWallet], []);
    const _proposals = safeEval(() => wallets.proposals[selectedMultisigWallet], []);
    const tabs = [
      {
        header: 'Select Wallet',
        body: (
          <SelectWallet
            walletClient={this.walletClient}
            handleSelect={this.handleSelect}
            handleCreate={this.handleCreate}
            handleUpdate={this.handleUpdate}
            accounts={_accounts}
            wallets={wallets.wallets}
            selectedWallet={selectedWallet}
            selectedAccount={selectedAccount}
            transactionHistory={_transactionHistory}
            sendBalanceInput={this.state.textFields.sendBalanceInput}
            recipientInput={this.state.textFields.recipientInput}
            transactionFeeInput={this.state.textFields.transactionFeeInput}
            accountNameInput={this.state.textFields.accountNameInput}
            sendWalletPassphrase={this.state.textFields.sendWalletPassphrase}
            sendWalletPassphraseInput={this.state.textFields.sendWalletPassphraseInput}
          />
        )
      },
      {
        header: 'Create Wallet',
        body: (
          <CreateWallet
            walletClient={this.walletClient}
            handleSelect={this.handleSelect}
            handleUpdate={this.handleUpdate}
            handleSelect={this.handleSelect}
            handleCreate={this.handleCreate}
            walletNameInput={this.state.textFields.walletNameInput}
            createWalletPassphraseInput={
              this.state.textFields.createWalletPassphraseInput
            }
          />
        )
      },
      {
        header: 'Multisig Wallet',
        body: (
          <MultisigWallet
            handleSelect={this.handleSelect}
            handleUpdate={this.handleUpdate}
            handleCreate={this.handleCreate}
            multisigWallets={multisigWallets}
            createWalletMInput={this.state.textFields.createWalletMInput}
            createWalletNInput={this.state.textFields.createWalletNInput}
            hardwareAccountInput={this.state.textFields.hardwareAccountInput}
            multisigWalletNameInput={this.state.textFields.multisigWalletNameInput}
            createCosignerNameInput={this.state.textFields.createCosignerNameInput}
            joinCosignerNameInput={this.state.textFields.joinCosignerNameInput}
            proposalNameInput={this.state.textFields.proposalNameInput}
            selectedXPUB={this.state.selectedXPUB}
            joinKeyInput={this.state.textFields.joinKeyInput}
            cosignerPathInput={this.state.textFields.cosignerPathInput}
            joinXpubInput={this.state.textFields.joinXpubInput}
            selectedMultisigWallet={selectedMultisigWallet}
            multisigInfo={wallets.multisigInfo}
            multisigSendBalanceInput={this.state.textFields.multisigSendBalanceInput}
            multisigTransactionFeeInput={this.state.textFields.multisigTransactionFeeInput}
            multisigRecipientInput={this.state.textFields.multisigRecipientInput}
            proposalCosignerTokenInput={this.state.textFields.proposalCosignerTokenInput}
            proposals={_proposals}
          />
        )
      }
    ];

    return (
      <div className="dashboard-container">
        <Header type="h2">Wallet Dashboard</Header>
        <TabMenu tabs={tabs} />
      </div>
    );
  }
}

