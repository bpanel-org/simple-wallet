import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Header, Table } from '@bpanel/bpanel-ui';

import { safeEval, preventDefault, buildSingleColumnTable } from '../utilities';
import { PLUGIN_NAMESPACE } from '../constants';

import styles from '../styles';

class ProposalList extends Component {
  constructor() {
    super();
  }

  static get propTypes() {
    return {
      handleSelect: PropTypes.func,
      proposals: PropTypes.array,
    };
  }

  render() {
    const { handleSelect, proposals } = this.props;

    return (
      <div>
        <div className="row">
          <Header type="h3">Proposals</Header>
        </div>
        <div className="row">
          <div className="col-sm">
            <Table
              colHeaders={['Name']}
              styles={Object.assign(styles.selectListStyle)}
              tableData={buildSingleColumnTable(
                proposals.map(p => p.name),
                'Name'
              )}
              onRowClick={e =>
                handleSelect(
                  preventDefault(e).rowData['Name'],
                  'multisigProposal'
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
  const { selectedMultisigWallet } = pluginState;
  const proposals = safeEval(
    () => state.wallets.proposals[selectedMultisigWallet],
    []
  );

  return {
    proposals,
    ...otherProps,
  };
};

export default connect(mapStateToProps)(ProposalList);
