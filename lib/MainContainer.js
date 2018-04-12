import React, { Component } from 'react';

// bpanel imports
import { Header, TabMenu } from '@bpanel/bpanel-ui';
import { bwalletClient } from '@bpanel/bpanel-utils';

// local imports
import CreateWallet from './CreateWallet';
import SelectWallet from './SelectWallet';
import { safeEval } from './utilities';

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
        accountNameInput: { value: '', valid: true }
      }
    };
    this.walletClient = bwalletClient();

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
          // TODO: check that sendBalance + txnFee < totalBalance
          if (isNaN(+value)) {
            return [value, false];
          }
          return [+value, true];
        case 'recipientInput':
          // TODO: validate address
          return [value, true];
        case 'createWalletPassphraseInput':
        case 'sendWalletPassphraseInput':
          // TODO: determine contraints on passphrase
          return [value, true];
        case 'walletNameInput':
        case 'accountNameInput':
          // TODO: determine contstraints on wallet/account names
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
      pluginState = {}
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
          // then update the wallet list
          await getWallets();
          break;
        default:
          throw new Error(`unkown create type: ${type}`);
      }
    } catch (e) {
      console.error(e); // eslint-disable-line
    }
  }

  // TODO: big try/catch block
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
    const { selectedAccount, selectedWallet } = pluginState;
    const { accounts, history } = wallets;

    const _transactionHistory = safeEval(() => history[selectedWallet][selectedAccount], []);
    const _accounts = safeEval(() => accounts[pluginState.selectedWallet], []);
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
            handleCreate={this.handleCreate}
            walletNameInput={this.state.textFields.walletNameInput}
            createWalletPassphraseInput={
              this.state.textFields.createWalletPassphraseInput
            }
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
