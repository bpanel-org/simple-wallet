export const SET_WALLET_HISTORY = 'SET_WALLET_HISTORY';
export const SET_WALLETS = 'SET_WALLETS';
export const WALLET_TX = 'WALLET_TX';
export const SET_WALLET_ACCOUNTS = 'SET_WALLET_ACCOUNTS';
export const SET_WALLET_INFO = 'SET_WALLET_INFO';
export const SET_WALLET_ACCOUNT_INFO = 'SET_WALLET_ACCOUNT_INFO';
export const SET_RECEIVE_ADDRESS = 'SET_RECEIVE_ADDRESS';
export const SET_WALLET_ACCOUNT_BALANCE = 'SET_WALLET_ACCOUNT_BALANCE';
export const CREATE_WALLET_RECEIVE_ADDRESS = 'CREATE_WALLET_RECEIVE_ADDRESS';
export const WALLET_CREATE_ACCOUNT = 'WALLET_CREATE_ACCOUNT';
// plugin specific constants
export const USER_SELECT_WALLET = 'USER_SELECT_WALLET';
export const USER_SELECT_ACCOUNT = 'USER_SELECT_ACCOUNT';

// TODO: parse from metadata?
// does this already happen?
export const PLUGIN_NAMESPACE = '@bpanel/wallet';

// values to use from transaction history api
export const TXN_HISTORY_TABLE_VALUES = [
  'block',
  'confirmations',
  'date',
  'fee',
  'hash',
  'tx',
  'virtualSize'
];

// TODO: figure out how to set this
// via webpack at runtime
// extra verbose logging toggle
export const EXTRA_VERBOSE = false;

// HACK: until we have a paginating table
export const TXN_DISPLAY_COUNT = 15;

