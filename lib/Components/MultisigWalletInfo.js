import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Header, Table } from '@bpanel/bpanel-ui';

import { safeEval, preventDefault, buildSingleRowTable } from '../utilities';
import { PLUGIN_NAMESPACE } from '../constants';

import styles from '../styles';

class MultisigWalletInfo extends Component {
  constructor() {
    super();
  }

  static get propTypes() {
    return {
      proposalInfo: PropTypes.object
    }
  }

  render() {
    const { handleSelect, balance, cosigners, account, id, m, n } = this.props;

    return (
      <div className="row">
        <div className="col-sm">
          <Header type="h5">M: {m}</Header>
          <Header type="h5">N: {n}</Header>
          <Header type="h5">Balance: {balance.confirmed}</Header>
          <Header type="h5">Cosigners:</Header>
          <Table
            colHeaders={['Name']}
            styles={Object.assign(styles.selectListStyle, styles.halfWidth)}
            tableData={buildSingleRowTable(cosigners.map(c => c.name), 'Name')}
            onRowClick={e => handleSelect(preventDefault(e).rowData['Name'], 'multisigCosigner')}
          />
          <Header type="h5">Receive Address: {account.receiveAddress}</Header>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, otherProps) => {
  const pluginState = state.plugins[PLUGIN_NAMESPACE] || {};
  const { selectedMultisigWallet } = pluginState;
  const multisigInfo = state.wallets.multisigInfo;

  const selectedMultisigInfo = safeEval(() => multisigInfo[selectedMultisigWallet],  {});
  const { balance = {}, cosigners = [], account = {}, id, m, n } = selectedMultisigInfo;

  return {
    balance,
    cosigners,
    account,
    id,
    m,
    n,
    ...otherProps,
  }
}

export default connect(mapStateToProps)(MultisigWalletInfo);

