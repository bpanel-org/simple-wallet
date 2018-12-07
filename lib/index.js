import MainContainer from './Containers/MainContainer';

import {
  SET_WALLET_HISTORY,
  SET_WALLETS,
  WALLET_TX,
  SET_WALLET_ACCOUNTS,
  SET_WALLET_INFO,
  SET_WALLET_ACCOUNT_INFO,
  SET_WALLET_ACCOUNT_BALANCE,
  CREATE_WALLET_RECEIVE_ADDRESS,
  PLUGIN_NAMESPACE,
  SET_MULTISIG_WALLETS,
  SET_MULTISIG_WALLET_INFO,
  SET_MULTISIG_WALLET_PROPOSALS,
  SET_MULTISIG_PROPOSAL_MTX,
} from './constants';

import { safeSet } from './utilities';
import reducers from './reducers';

export const metadata = {
  name: '@bpanel/simple-wallet',
  pathName: 'simple-wallet',
  displayName: 'Simple Wallet',
  author: '@bpanel',
  sidebar: true,
  icon: 'money',
  description: 'simple bitcoin wallet management tool',
  version: require('../package.json').version,
};

// Decorate a target component (e.g. Footer, Header, Sidebar)
export const decoratePanel = (Panel, { React, PropTypes }) => {
  return class DecoratedMainContainer extends React.PureComponent {
    static displayName() {
      return metadata.name;
    }

    static get propTypes() {
      return {
        customChildren: PropTypes.array,
      };
    }

    render() {
      const { customChildren = [] } = this.props;
      const pluginData = {
        metadata,
        Component: MainContainer,
      };

      return (
        <Panel
          {...this.props}
          customChildren={customChildren.concat(pluginData)}
        />
      );
    }
  };
};

export const getRouteProps = {
  [metadata.name]: (parentProps, props) =>
    Object.assign(props, {
      ...parentProps,
    }),
};

export const mapComponentState = {
  Panel: (state, map) =>
    Object.assign(map, {
      wallets: state.wallets,
      network: state.node.node.network,
      pluginState: state.plugins[PLUGIN_NAMESPACE],
    }),
};
export const pluginReducers = reducers;

export const reduceWallets = (state, action) => {
  const { type, payload = {} } = action;
  let newState = { ...state };
  const {
    history,
    wallets,
    walletInfo,
    walletId,
    accountId,
    accounts,
    accountInfo,
    balance,
    multisigWallets = [],
    multisigWalletInfo,
    proposals = [],
    proposalId,
    mtx,
  } = payload;
  switch (type) {
    case SET_WALLET_HISTORY:
      newState = safeSet(newState, `history.${walletId}.${accountId}`, history);
      return newState;
    case SET_WALLETS:
      newState = safeSet(newState, 'wallets', wallets);
      return newState;
    case SET_WALLET_INFO:
      newState = safeSet(newState, `info.${walletId}`, walletInfo);
      return newState;
    case SET_WALLET_ACCOUNTS:
      newState = safeSet(newState, `accounts.${walletId}`, accounts);
      return newState;
    case SET_WALLET_ACCOUNT_INFO:
      newState = safeSet(
        newState,
        `accountInfo.${walletId}.${accountId}`,
        accountInfo
      );
      return newState;
    case SET_WALLET_ACCOUNT_BALANCE:
      newState = safeSet(newState, `balance.${walletId}.${accountId}`, balance);
      return newState;
    case CREATE_WALLET_RECEIVE_ADDRESS:
      // handled by subsequent api call
      // dispatching for consistency
      return newState;
    case SET_MULTISIG_WALLETS:
      newState = safeSet(newState, 'multisigWallets', multisigWallets);
      return newState;
    case SET_MULTISIG_WALLET_INFO:
      newState = safeSet(
        newState,
        `multisigInfo.${walletId}`,
        multisigWalletInfo
      );
      return newState;
    case SET_MULTISIG_WALLET_PROPOSALS:
      newState = safeSet(newState, `proposals.${walletId}`, proposals);
      return newState;
    case SET_MULTISIG_PROPOSAL_MTX:
      newState = safeSet(
        newState,
        `proposalMTXs.${walletId}.${proposalId}`,
        mtx
      );
      return newState;
    default:
      return state;
  }
};

export const addSocketConstants = (sockets = { listeners: [] }) => {
  sockets.listeners.push({
    event: 'wallet tx',
    actionType: WALLET_TX,
  });

  return Object.assign(sockets, {
    socketListeners: sockets.listeners,
  });
};
