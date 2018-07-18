import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Header, Table } from '@bpanel/bpanel-ui';
import styles from '../styles';

import { safeEval, preventDefault, buildSingleRowTable } from '../utilities';
import { PLUGIN_NAMESPACE } from '../constants';

class SelectMultisigWallet extends Component {
  constructor() {
    super();
  }

  static get propTypes() {
    return {};
  }

  render() {
    const { handleSelect, multisigWalletTableData } = this.props;

    return (
      <div>
        <div className="row">
          <Header type="h3">Select a Wallet</Header>
        </div>
        <div className="row">
          <div className="col-sm">
            <Table
              colHeaders={['Name']}
              styles={Object.assign(styles.selectListStyle, styles.halfWidth)}
              tableData={multisigWalletTableData}
              onRowClick={e =>
                handleSelect(
                  preventDefault(e).rowData['Name'],
                  'multisigWallet'
                )
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, otherProps) => {
  const pluginState = state.plugins[PLUGIN_NAMESPACE] || {};
  const { selectedProposal } = pluginState;

  const multisigWallets = state.wallets.multisigWallets || [];
  const multisigWalletTableData = buildSingleRowTable(multisigWallets, 'Name');

  return {
    multisigWalletTableData,
    ...otherProps
  };
};

export default connect(mapStateToProps)(SelectMultisigWallet);
