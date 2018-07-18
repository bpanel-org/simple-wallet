import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Header, Button } from '@bpanel/bpanel-ui';
import styles from '../styles';

import { safeEval, preventDefault } from '../utilities';
import { PLUGIN_NAMESPACE } from '../constants';

class SelectHardware extends Component {
  constructor() {
    super();
  }

  static get propTypes() {
    return {}
  }

  render() {

    const {
      handleSelect,
      hardwareAccountInput,
      selectedXPUB,
    } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-sm">
            <Header type="h3">Insert Hardware Wallet</Header>
          </div>
          <div className="col-sm">
            <input
              type="number"
              name="ledgerAccountText"
              placeholder="ledger account"
              className="form-control"
              min="0"
              value={hardwareAccountInput.value}
              onChange={(e) => handleSelect(preventDefault(e).target.value, 'hardwareAccount')}
            />
          </div>
        </div>
        <div className="row">
          <Header type="h5">{selectedXPUB}</Header>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, otherProps) => {
  const pluginState = state.plugins[PLUGIN_NAMESPACE] || {};
  const { selectedXPUB, textFields = {} } = pluginState;

  const {
    hardwareAccountInput = { value: '', valid: true },
  } = textFields;

  return {
    hardwareAccountInput,
    selectedXPUB,
    ...otherProps
  }
}

export default connect(mapStateToProps)(SelectHardware);

