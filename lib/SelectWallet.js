import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  Header,
  Input,
  Table,
  Text,
  ExpandedDataRow
} from '@bpanel/bpanel-ui';
import { Amount } from 'bcoin';

// Third Party
import { pick, omit } from 'lodash';

// First Party
import QRCode from './QRCode';
import { safeEval, preventDefault, buildSingleRowTable } from './utilities';

// configuration
import {
  PLUGIN_NAMESPACE,
  TXN_HISTORY_TABLE_VALUES,
  TXN_DISPLAY_COUNT
} from './constants';

import styles from './styles';

class SelectWallet extends PureComponent {
  constructor(props) {
    super(props);
    this.loadingAccount = false;
    this.mainTxCats = ['tx', 'hash', 'block'];
    this.txTableInit = <Text type="p">Must select a wallet and account to display transaction history</Text>;
    this.txTableLoading = <Text type="p">Loading transaction history...</Text>;
    // only grab the TXN_DISPLAY_COUNT most recent transactions
    // TXN_DISPLAY_COUNT will never be too large of a number
    this.negatedTx = ~TXN_DISPLAY_COUNT + 1;
    console.assert(this.negatedTx < TXN_DISPLAY_COUNT);
  }

  parseTxnHistory(transactions = []) {
    // sort the list by confirmations and size
    // then slice the back negatedTx amount of txs (least # of confirmations)
    // and reverse the list (so most recent txs are at the top)
    const txns = transactions.sort((a, b) => {
      // put lower confirmations at higher index
      if (a.confirmations < b.confirmations) return 1;
      else if (a.confirmations > b.confirmations) return -1;
      // if confirmations the same, sort by virtual size
      else if (a.virtualSize < b.virtualSize) return 1;
      else if (a.virtualSize > b.virtualSize) return -1;
      return 0;
    }).slice(this.negatedTx).reverse();

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
      receiveAddress: PropTypes.object
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
    const walletTableData = buildSingleRowTable(wallets, 'Wallets');
    const accountTableData = buildSingleRowTable(accounts, 'Accounts');

    // evaluate safely in case undefined values exist
    const _walletBalance = safeEval(
      () =>
        new Amount(info[pluginState.selectedWallet].balance.confirmed).toBTC(),
      ''
    );
    const _accountBalance = safeEval(
      () =>
        new Amount(
          balance[pluginState.selectedWallet][
            pluginState.selectedAccount
          ].confirmed
        ).toBTC(),
      ''
    );
    const _receiveAddress = safeEval(
      () => accountInfo[selectedWallet][selectedAccount].receiveAddress,
      ''
    );
    const _qrText = safeEval(
      () => accountInfo[selectedWallet][selectedAccount].receiveAddress,
      ''
    );
    let expandedData = [{ mainData: [], subData: [] }];

    // Setup TX History table
    let txTable = this.txTableInit;
    if (selectedAccount && this.loadingAccount && !txnHistory.length) {
      txTable = this.txTableLoading;
    } else if (selectedAccount && txnHistory.length){
      this.loadingAccount = false;
      expandedData = txnHistory.map(tx => ({
        mainData: pick(tx, this.mainTxCats),
        subData: omit(tx, this.mainTxCats)
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
              onRowClick={e => handleSelect(preventDefault(e).rowData.Wallets, 'wallet')}
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
              onChange={e => handleUpdate(preventDefault(e).target.value, 'accountNameInput')}
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
          {/* TODO: allow for conversions in BTC display units */}
          <div className="col-sm">
            <Header type="h4">Wallet Balance</Header>
            <Text type="p">{`Balance: ${_walletBalance} BTC`}</Text>
          </div>
          <div className="col-sm">
            <Header type="h4">Account Balance</Header>
            <Text type="p">{`Balance: ${_accountBalance} BTC`}</Text>
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
              value={sendBalanceInput.value.toString()}
              style={styles.inputStyle}
              onChange={e =>
                handleUpdate(preventDefault(e).target.value, 'sendBalanceInput')
              }
            />
            <Input
              type="text"
              name="recipientInput"
              placeholder="recipient address"
              className="form-control"
              style={styles.inputStyle}
              value={recipientInput.value.toString()}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'recipientInput')}
            />
            <Input
              type="text"
              name="transactionFeeInput"
              placeholder="rate (satoshis/kb)"
              className="form-control"
              style={styles.inputStyle}
              value={transactionFeeInput.value.toString()}
              onChange={e => handleUpdate(preventDefault(e).target.value, 'transactionFeeInput')}
            />
            <Input
              type="text"
              name="sendWalletPassphraseInput"
              placeholder="wallet passphrase"
              className="form-control"
              style={styles.inputStyle}
              value={sendWalletPassphraseInput.value.toString()}
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
                )
              }
            >
              Send
            </Button>
          </div>
          <div className="col-sm">
            <Header type="h4">Receive</Header>
            <Text type="p">{`Address: ${_receiveAddress}`}</Text>
            <QRCode containerStyle={styles.qrCodeContainer} text={_qrText} />
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
            { txTable }
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
    ...otherProps
  };
};

export default connect(mapStateToProps)(SelectWallet);
