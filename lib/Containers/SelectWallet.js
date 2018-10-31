import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  Header,
  Input,
  Table,
  Text,
  ExpandedDataRow,
  QRCode,
} from '@bpanel/bpanel-ui';
import assert from 'bsert';
import { Amount } from 'bcoin';

// Third Party
import { pick, omit } from 'lodash';

import { safeEval, preventDefault, buildSingleColumnTable } from '../utilities';

// configuration
import {
  PLUGIN_NAMESPACE,
  TXN_HISTORY_TABLE_VALUES,
  TXN_DISPLAY_COUNT,
  currencyPropTypes,
} from '../constants';

// used in mapDispatchToProps
import { getWallets, getMultisigWallets } from '../actions';

import styles from '../styles';

class SelectWallet extends Component {
  constructor(props) {
    super(props);
    this.loadingAccount = false;
    this.mainTxCats = ['tx', 'hash', 'block'];
    this.txTableInit = (
      <Text type="p">
        Must select a wallet and account to display transaction history
      </Text>
    );
    this.txTableLoading = <Text type="p">Loading transaction history...</Text>;
    // only grab the TXN_DISPLAY_COUNT most recent transactions
    // TXN_DISPLAY_COUNT will never be too large of a number
    this.negatedTx = ~TXN_DISPLAY_COUNT + 1;
    assert(this.negatedTx < TXN_DISPLAY_COUNT);
  }

  static get propTypes() {
    return {
      // main handler functions
      handleCreate: PropTypes.func,
      handleFieldUpdate: PropTypes.func,
      handleSelect: PropTypes.func,
      // text field inputs { value, valid }
      accountNameInput: PropTypes.object,
      sendBalanceInput: PropTypes.object,
      recipientInput: PropTypes.object,
      transactionFeeInput: PropTypes.object,
      sendWalletPassphraseInput: PropTypes.object,
      // dispatcher funcitons
      getWallets: PropTypes.func,
      getMultisigWallets: PropTypes.func,
      // redux state
      accounts: PropTypes.object,
      transactionHistory: PropTypes.array,
      wallets: PropTypes.array,
      selectedAccount: PropTypes.string, // comes from plugin state
      selectedAccounts: PropTypes.array,
      receiveAddress: PropTypes.string,
      walletBalance: PropTypes.string,
      accountBalance: PropTypes.string,
      currency: currencyPropTypes,
    };
  }

  async componentDidMount() {
    try {
      // call out to wallet server to list wallets
      this.props.getWallets();
      // autoselect primary wallet on load
      this.props.handleSelect('primary', 'wallet');
      // prepopulate the list of multisig wallets
      await this.props.getMultisigWallets();
    } catch (e) {
      console.error(e); // eslint-disable-line
    }
  }

  parseTxnHistory(transactions = []) {
    // sort the list by confirmations and size
    // then slice the back negatedTx amount of txs (least # of confirmations)
    // and reverse the list (so most recent txs are at the top)
    const txns = transactions
      .sort((a, b) => {
        // put lower confirmations at higher index
        if (a.confirmations < b.confirmations) return 1;
        else if (a.confirmations > b.confirmations) return -1;
        // if confirmations the same, sort by virtual size
        else if (a.virtualSize < b.virtualSize) return 1;
        else if (a.virtualSize > b.virtualSize) return -1;
        return 0;
      })
      .slice(this.negatedTx)
      .reverse();

    return txns.map(txn => {
      const t = pick(txn, TXN_HISTORY_TABLE_VALUES);
      // make sure all values are strings
      // to populate the table with appropriate values
      Object.keys(t).forEach(key => {
        // sometimes the value is null but don't
        // exclude 0 just because it is falsy
        if (t[key] || t[key] === 0) {
          t[key] = t[key].toString();
        } else {
          // NOTE: if key === 'block', we know that the txn has never been included in a block
          console.warn(`unexpected value for key ${key} found in txn`);
          console.warn(t);
        }
      });
      return t;
    });
  }

  createTransaction(value, address, rate) {
    const input = {
      outputs: [{ value, address }],
      rate,
    };
    this.props.handleCreate(input, 'sendTransaction');
  }

  render() {
    const {
      currency,
      handleSelect,
      handleCreate,
      handleFieldUpdate,
      wallets,
      selectedAccounts,
      receiveAddress,
      walletBalance,
      accountBalance,
      transactionHistory,
      selectedAccount,
      accountNameInput,
      sendBalanceInput,
      recipientInput,
      transactionFeeInput,
      sendWalletPassphraseInput,
    } = this.props;

    const currencyUnit = currency ? currency.getUnit('unit').toUpperCase() : '';
    const baseUnit = currency ? currency.getUnit('base').concat('s') : '';
    const txnHistory = this.parseTxnHistory(transactionHistory);
    const walletTableData = buildSingleColumnTable(wallets, 'Wallets');
    const accountTableData = buildSingleColumnTable(
      selectedAccounts,
      'Accounts'
    );

    let expandedData = [{ mainData: [], subData: [] }];

    // Setup TX History table
    let txTable = this.txTableInit;
    if (selectedAccount && this.loadingAccount && !txnHistory.length) {
      txTable = this.txTableLoading;
    } else if (selectedAccount && txnHistory.length) {
      this.loadingAccount = false;
      expandedData = txnHistory.map(tx => ({
        mainData: pick(tx, this.mainTxCats),
        subData: omit(tx, this.mainTxCats),
      }));
      txTable = (
        <Table
          colHeaders={TXN_HISTORY_TABLE_VALUES}
          tableData={txnHistory}
          expandedData={expandedData}
          expandedHeight={250}
          ExpandedComponent={ExpandedDataRow}
        />
      );
    }
    return (
      <div className="container">
        <div className="row" style={styles.componentContainer}>
          {/* WALLETS SECTION */}
          <div className="col-sm">
            <Header type="h4">Wallets</Header>
            <Table
              colHeaders={['Wallets']}
              styles={styles.selectListStyle}
              tableData={walletTableData}
              onRowClick={e =>
                handleSelect(preventDefault(e).rowData.Wallets, 'wallet')
              }
            />
          </div>
          {/* ACCOUNTS SECTION */}
          <div className="col-sm">
            <Header type="h4">Accounts</Header>
            <Table
              colHeaders={['Accounts']}
              styles={styles.selectListStyle}
              tableData={accountTableData}
              onRowClick={e => {
                this.loadingAccount = true;
                handleSelect(preventDefault(e).rowData.Accounts, 'account');
              }}
            />
            <Input
              type="text"
              name="accountNameInput"
              placeholder="account name"
              className="form-control"
              value={accountNameInput.value}
              style={styles.inputStyle}
              onChange={e =>
                handleFieldUpdate(
                  preventDefault(e).target.value,
                  'accountNameInput'
                )
              }
            />
            <Button
              type="action"
              style={styles.wideButton}
              onClick={() =>
                handleCreate(this.props.accountNameInput.value, 'newAccount')
              }
            >
              Create Account
            </Button>
          </div>
        </div>
        <div className="row" styles={styles.componentContainer}>
          <div className="col-sm">
            <Header type="h4">Wallet Balance</Header>
            <Text type="p">{`Balance: ${walletBalance} ${currencyUnit}`}</Text>
          </div>
          <div className="col-sm">
            <Header type="h4">Account Balance</Header>
            <Text type="p">{`Balance: ${accountBalance} ${currencyUnit}`}</Text>
          </div>
        </div>
        {/* SEND SECTION */}
        <div className="row" styles={styles.componentContainer}>
          <div className="col-sm">
            <Header type="h4">Send</Header>
            <Input
              type="text"
              name="sendBalanceInput"
              placeholder={`amount (${baseUnit})`}
              className="form-control"
              value={`${sendBalanceInput.value}`}
              style={styles.inputStyle}
              onChange={e =>
                handleFieldUpdate(
                  preventDefault(e).target.value,
                  'sendBalanceInput'
                )
              }
            />
            <Input
              type="text"
              name="recipientInput"
              placeholder="recipient address"
              className="form-control"
              style={styles.inputStyle}
              value={`${recipientInput.value}`}
              onChange={e =>
                handleFieldUpdate(
                  preventDefault(e).target.value,
                  'recipientInput'
                )
              }
            />
            <Input
              type="text"
              name="transactionFeeInput"
              placeholder={`rate (${baseUnit}/kb)`}
              className="form-control"
              style={styles.inputStyle}
              value={`${transactionFeeInput.value}`}
              onChange={e =>
                handleFieldUpdate(
                  preventDefault(e).target.value,
                  'transactionFeeInput'
                )
              }
            />
            <Input
              type="text"
              name="sendWalletPassphraseInput"
              placeholder="wallet passphrase"
              className="form-control"
              style={styles.inputStyle}
              value={`${sendWalletPassphraseInput.value}`}
              onChange={e =>
                handleFieldUpdate(
                  preventDefault(e).target.value,
                  'sendWalletPassphraseInput'
                )
              }
            />
            <Button
              type="action"
              style={styles.wideButton}
              onClick={() =>
                this.createTransaction(
                  sendBalanceInput.value,
                  recipientInput.value,
                  transactionFeeInput.value
                )
              }
            >
              Send
            </Button>
          </div>
          <div className="col-sm">
            <Header type="h4">Receive</Header>
            <Text type="p">{`Address: ${receiveAddress}`}</Text>
            <QRCode
              containerStyle={styles.qrCodeContainer}
              style={styles.qrCodeContainer}
              text={receiveAddress}
            />
            <Button
              type="action"
              style={styles.wideButton}
              onClick={() => handleCreate(selectedAccount, 'receiveAddress')}
            >
              New Receive Address
            </Button>
          </div>
        </div>
        <div className="row" styles={styles.componentContainer}>
          <div className="col-sm">
            <Header type="h4">Transaction History</Header>
            {txTable}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, otherProps) => {
  const pluginState = state.plugins[PLUGIN_NAMESPACE] || {};
  const { selectedAccount, selectedWallet, textFields = {} } = pluginState;
  const accounts = state.wallets.accounts;
  const receiveAddress = safeEval(
    () =>
      state.wallets.accountInfo[selectedWallet][selectedAccount].receiveAddress,
    ''
  );
  const selectedAccounts = safeEval(() => accounts[selectedWallet], []);
  const info = state.wallets.info;
  const balance = state.wallets.balance;
  const history = state.wallets.history;

  const walletBalance = safeEval(
    () => new Amount(info[selectedWallet].balance.confirmed).toBTC(),
    ''
  );
  const accountBalance = safeEval(
    () =>
      new Amount(balance[selectedWallet][selectedAccount].confirmed).toBTC(),
    ''
  );
  const transactionHistory = safeEval(
    () => history[selectedWallet][selectedAccount],
    []
  );

  // default values
  const {
    accountNameInput = { value: '', valid: true },
    sendBalanceInput = { value: '', valid: true },
    recipientInput = { value: '', valid: true },
    transactionFeeInput = { value: '', valid: true },
    sendWalletPassphraseInput = { value: '', valid: true },
  } = textFields;

  return {
    wallets: state.wallets.wallets,
    accounts,
    receiveAddress,
    selectedAccounts,
    walletBalance,
    accountBalance,
    transactionHistory,
    selectedAccount,
    accountNameInput,
    sendBalanceInput,
    recipientInput,
    transactionFeeInput,
    sendWalletPassphraseInput,
    ...otherProps,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getWallets: async () => dispatch(getWallets()),
    getMultisigWallets: async () => dispatch(getMultisigWallets()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectWallet);
