import MainContainer from './MainContainer';

import {
  SET_WALLET_HISTORY,
  SET_WALLETS,
  WALLET_TX,
  SET_WALLET_ACCOUNTS,
  USER_SELECT_ACCOUNT,
  USER_SELECT_WALLET,
  SET_WALLET_INFO,
  SET_WALLET_ACCOUNT_INFO,
  SET_WALLET_ACCOUNT_BALANCE,
  CREATE_WALLET_RECEIVE_ADDRESS,
  PLUGIN_NAMESPACE
} from './constants';

import {
  getHistory,
  getWallets,
  getAccounts,
  selectWallet,
  selectAccount,
  createWallet,
  getAccountInfo,
  getAccountBalance,
  createReceiveAddress,
  createAccount
} from './actions';

import { safeSet } from './utilities';

export const metadata = {
  name: '@bpanel/simple-wallet',
  pathName: 'simple-wallet',
  displayName: 'Simple Wallet',
  author: '@bpanel',
  sidebar: true,
  icon: 'money',
  description: 'simple bitcoin wallet management tool',
  version: require('../package.json').version
};

// Decorate a target component (e.g. Footer, Header, Sidebar)
export const decoratePanel = (Panel, { React, PropTypes }) => {
  return class DecoratedMainContainer extends React.PureComponent {
    static displayName() {
      return metadata.name;
    }

    static get propTypes() {
      return {
        customChildren: PropTypes.array
      };
    }

    render() {
      const { customChildren = [] } = this.props;
      const pluginData = {
        metadata,
        Component: MainContainer
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
      ...parentProps
    })
};

export const mapComponentDispatch = {
  Panel: (dispatch, map) =>
    Object.assign(map, {
      getWallets: async () => dispatch(getWallets()),
      getHistory: async (walletId, accountId) =>
        dispatch(getHistory(walletId, accountId)),
      getAccounts: async walletId => dispatch(getAccounts(walletId)),
      selectWallet: walletId => dispatch(selectWallet(walletId)),
      selectAccount: accountId => dispatch(selectAccount(accountId)),
      createWallet: async (walletId, options) =>
        dispatch(createWallet(walletId, options)),
      getAccountInfo: async (walletId, accountId) =>
        dispatch(getAccountInfo(walletId, accountId)),
      getAccountBalance: async (walletId, accountId) =>
        dispatch(getAccountBalance(walletId, accountId)),
      getReceiveAddress: async (walletId, accountId) =>
        dispatch(getReceiveAddress(walletId, accountId)),
      createAccount: async (walletId, accountId) =>
        dispatch(createAccount(walletId, accountId)),
      createReceiveAddress: async (walletId, accountId) =>
        dispatch(createReceiveAddress(walletId, accountId))
    })
};

export const mapComponentState = {
  Panel: (state, map) =>
    Object.assign(map, {
      wallets: state.wallets,
      pluginState: state.plugins[PLUGIN_NAMESPACE]
    })
};

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
    addressInfo
  } = payload;
  switch (type) {
    case SET_WALLET_HISTORY:
      newState = safeSet(newState, `history.${walletId}.${accountId}`, history);
      return newState;
    case SET_WALLETS:
      newState = safeSet(newState, 'wallets', wallets);
      return newState
    case SET_WALLET_INFO:
      newState = safeSet(newState, `info.${walletId}`, walletInfo);
      return newState;
    case SET_WALLET_ACCOUNTS:
      newState = safeSet(newState, `accounts.${walletId}`, accounts);
      return newState;
    case SET_WALLET_ACCOUNT_INFO:
      newState = safeSet(newState, `accountInfo.${walletId}.${accountId}`, accountInfo);
      return newState;
    case SET_WALLET_ACCOUNT_BALANCE:
      newState = safeSet(newState, `balance.${walletId}.${accountId}`, balance);
      return newState;
    case CREATE_WALLET_RECEIVE_ADDRESS:
      // handled by subsequent api call
      // dispatching for consistency
      return newState;
    default:
      return state;
  }
};

// TODO: use redux to set initial state so it
// doesn't start undefined
export const reducePlugins = (state, action) => {
  const { type, payload = {} } = action;
  let newState = { ...state };

  const { walletId, accountId, index } = payload;
  switch (type) {
    case USER_SELECT_WALLET:
      newState = safeSet(newState, `${PLUGIN_NAMESPACE}.selectedWallet`, walletId);
      return newState;
    case USER_SELECT_ACCOUNT:
      newState = safeSet(newState, `${PLUGIN_NAMESPACE}.selectedAccount`, accountId);
      return newState;
    default:
      return state;
  }
};

// add new socket listeners
// push an object with event and actionType properties
// onto existing array of listeners
export const addSocketConstants = (sockets = { listeners: [] }) => {
  sockets.listeners.push({
    event: 'wallet tx',
    actionType: WALLET_TX
  });

  return Object.assign(sockets, {
    socketListeners: sockets.listeners
  });
};

