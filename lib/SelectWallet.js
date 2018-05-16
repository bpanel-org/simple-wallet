import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button, Header, Input, Table, Text } from '@bpanel/bpanel-ui';
import { Amount } from 'bcoin';

// Third Party
import _ from 'lodash';

// First Party
import QRCode from './QRCode';
import { safeEval, preventDefault } from './utilities';

// configuration
import { PLUGIN_NAMESPACE, TXN_HISTORY_TABLE_VALUES, TXN_DISPLAY_COUNT  } from './constants';

// TODO: import styles from single file
const styles = {
  inputStyle: { margin: '0.5rem' },
  selectListStyle: { margin: '0.5rem' },
  componentContainer: { padding: '0.5rem' },
  wideButton: { width: '100%', margin: '0 0.5rem' },
  qrCodeContainer: { textAlign: 'center', margin: '0.5rem' }
};

class SelectWallet extends Component {
  constructor(props) {
    super(props);
  }

  parseTxnHistory(transactions = []) {
    // only grab the TXN_DISPLAY_COUNT most recent transactions
    // TXN_DISPLAY_COUNT will never be too large of a number
    const negated = ~TXN_DISPLAY_COUNT + 1;
    console.assert(negated < TXN_DISPLAY_COUNT);

    // reverse the list to display most recent first
    const txns = transactions.slice(negated).reverse();
    return txns.map(txn => {
      const t = _.pick(txn, TXN_HISTORY_TABLE_VALUES);
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
  // turn an array into the proper data format
  // to be used in a data table
  // TODO: generalize to n rows
  buildSingleRowTable(data = [], title = '') {
    return data.map(el => ({ [title]: el }));
  }

  static get propTypes() {
    return {
      // main handler functions
      handleCreate: PropTypes.func,
      handleUpdate: PropTypes.func,
      handleSelect: PropTypes.func,
      // text field inputs { value, valid }
      accountNameInput: PropTypes.object,
      sendBalanceInput: PropTypes.object,
      recipientInput: PropTypes.object,
      transactionFeeInput: PropTypes.object,
      sendWalletPassphraseInput: PropTypes.object,
      // redux state
      accounts: PropTypes.array,
      transactionHistory: PropTypes.array,
      wallets: PropTypes.array,
      info: PropTypes.object, //  wallet info
      accountInfo: PropTypes.object, // account info
      balance: PropTypes.object, // balance info
      pluginState: PropTypes.object,
      selectedWallet: PropTypes.string, // comes from plugin state
      selectedAccount: PropTypes.string, // comes from plugin state
      receiveAddress: PropTypes.object,
    };
  }

  render() {
    const {
      handleSelect,
      handleCreate,
      handleUpdate,
      wallets,
      accounts,
      transactionHistory,
      accountNameInput,
      selectedWallet,
      selectedAccount,
      sendBalanceInput,
      recipientInput,
      transactionFeeInput,
      sendWalletPassphraseInput,
      pluginState = {},
      info,
      accountInfo,
      balance
    } = this.props;

    const txnHistory = this.parseTxnHistory(transactionHistory);
    const walletTableData = this.buildSingleRowTable(wallets, 'Wallets');
    const accountTableData = this.buildSingleRowTable(accounts, 'Accounts');

    // evaluate safely in case undefined values exist
    const _walletBalance = safeEval(() => new Amount(info[pluginState.selectedWallet].balance.confirmed).toBTC(), '');
    const _accountBalance = safeEval(() => new Amount(balance[pluginState.selectedWallet][pluginState.selectedAccount].confirmed).toBTC(), '');
    const _receiveAddress = safeEval(() => accountInfo[selectedWallet][selectedAccount].receiveAddress, '');
    const _qrText = safeEval(() => accountInfo[selectedWallet][selectedAccount].receiveAddress, '');

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
              onRowClick={e => handleSelect(e.rowData.Wallets, 'wallet')}
            />
          </div>
          {/* ACCOUNTS SECTION */}
          <div className="col-sm">
            <Header type="h4">Accounts</Header>
            <Table
              colHeaders={['Accounts']}
              styles={styles.selectListStyle}
              tableData={accountTableData}
              onRowClick={e => handleSelect(e.rowData.Accounts, 'account')}
            />
            <Input
              type="text"
              name="accountNameInput"
              placeholder="account name"
              className="form-control"
              value={accountNameInput.value}
              style={styles.inputStyle}
              onChange={e => handleUpdate(e.target.value, 'accountNameInput')}
            />
            <Button
              type="action"
              style={styles.wideButton}
              onClick={() => handleCreate(this.props.accountNameInput.value, 'newAccount')}
            >
              Create Account
            </Button>
          </div>
        </div>
        <div className="row" styles={styles.componentContainer}>
          {/* TODO: allow for conversions in BTC display units */}
          <div className="col-sm">
            <Header type="h4">Wallet Balance</Header>
            <Text type="p">
              {`Balance: ${_walletBalance} BTC`}
            </Text>
          </div>
          <div className="col-sm">
            <Header type="h4">Account Balance</Header>
            <Text type="p">
              {`Balance: ${_accountBalance} BTC`}
            </Text>
          </div>
        </div>
        {/* SEND SECTION */}
        <div className="row" styles={styles.componentContainer}>
          <div className="col-sm">
            <Header type="h4">Send</Header>
            <Input
              type="text"
              name="sendBalanceInput"
              placeholder="amount (satoshis)"
              className="form-control"
              value={sendBalanceInput.value}
              style={styles.inputStyle}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'sendBalanceInput')}
            />
            <Input
              type="text"
              name="recipientInput"
              placeholder="recipient address"
              className="form-control"
              style={styles.inputStyle}
              value={recipientInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'recipientInput')}
            />
            <Input
              type="text"
              name="transactionFeeInput"
              placeholder="rate (satoshis/kb)"
              className="form-control"
              style={styles.inputStyle}
              value={transactionFeeInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'transactionFeeInput')}
            />
            <Input
              type="text"
              name="sendWalletPassphraseInput"
              placeholder="wallet passphrase"
              className="form-control"
              style={styles.inputStyle}
              value={sendWalletPassphraseInput.value}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'sendWalletPassphraseInput')}
            />
            <Button
              type="action"
              style={styles.wideButton}
              onClick={() =>
                handleCreate(
                  {
                    outputs: [
                      {
                        value: sendBalanceInput.value,
                        address: recipientInput.value
                      }
                    ],
                    rate: transactionFeeInput.value
                  },
                  'sendTransaction'
                )}
            >
              Send
            </Button>
          </div>
          <div className="col-sm">
            <Header type="h4">Receive</Header>
            <Text type="p">
              {`Address: ${_receiveAddress}`}
            </Text>
            <QRCode
              containerStyle={styles.qrCodeContainer}
              text={_qrText}
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
            <Table
              colHeaders={TXN_HISTORY_TABLE_VALUES}
              tableData={txnHistory}
              onRowClick={rowData => console.log(rowData)}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, otherProps) => {
  return {
    pluginState: state.plugins[PLUGIN_NAMESPACE],
    info: state.wallets.info,
    accountInfo: state.wallets.accountInfo,
    balance: state.wallets.balance,
    accountInfo: state.wallets.accountInfo,
    ...otherProps
  };
};

export default connect(mapStateToProps)(SelectWallet);
