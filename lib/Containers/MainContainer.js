import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// bpanel imports
import { Header, TabMenu } from '@bpanel/bpanel-ui';
import { Currency, getClient } from '@bpanel/bpanel-utils';

// local imports
import CreateWallet from './CreateWallet';
import SelectWallet from './SelectWallet';
import MultisigWallet from './MultisigWallet';
import ActionContainer from './ActionWrapper';
import { hydrateWallets } from '../actions';

class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.client = null;
  }

  static get propTypes() {
    return {
      clientInfo: PropTypes.shape({
        id: PropTypes.string,
        chain: PropTypes.string,
      }),
      hydrateWallets: PropTypes.func.isRequired,
    };
  }

  componentDidMount() {
    const { clientInfo, hydrateWallets } = this.props;
    this.client = getClient();
    this.client.on('set clients', hydrateWallets);
    this.currency = new Currency(clientInfo.chain);
  }

  componentDidUpdate() {
    const { clientInfo } = this.props;
    if (clientInfo.chain !== this.currency.chain)
      this.currency = new Currency(clientInfo.chain);
  }

  render() {
    // build tabs to render
    const tabs = [
      {
        header: 'Select Wallet',
        body: (
          <ActionContainer currency={this.currency}>
            <SelectWallet />
          </ActionContainer>
        ),
      },
      {
        header: 'Create Wallet',
        body: (
          <ActionContainer currency={this.currency}>
            <CreateWallet />
          </ActionContainer>
        ),
      },
      {
        header: 'Multisig Wallet',
        body: <MultisigWallet currency={this.currency} />,
      },
    ];

    return (
      <div className="dashboard-container">
        <Header type="h2">Wallet Dashboard</Header>
        <TabMenu tabs={tabs} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    clientInfo: state.clients.currentClient,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    hydrateWallets: () => dispatch(hydrateWallets()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainContainer);
