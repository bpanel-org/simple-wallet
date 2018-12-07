import PropTypes from 'prop-types';

export const SET_WALLET_HISTORY = 'SIMPLE_WALLET_SET_WALLET_HISTORY';
export const SET_WALLETS = 'SIMPLE_WALLET_SET_WALLETS';
export const WALLET_TX = 'SIMPLE_WALLET_WALLET_TX';
export const SET_WALLET_ACCOUNTS = 'SIMPLE_WALLET_SET_WALLET_ACCOUNTS';
export const SET_WALLET_INFO = 'SIMPLE_WALLET_SET_WALLET_INFO';
export const SET_WALLET_ACCOUNT_INFO = 'SIMPLE_WALLET_SET_WALLET_ACCOUNT_INFO';
export const SET_RECEIVE_ADDRESS = 'SIMPLE_WALLET_SET_RECEIVE_ADDRESS';
export const SET_WALLET_ACCOUNT_BALANCE = 'SIMPLE_WALLET_SET_WALLET_ACCOUNT_BALANCE';
export const CREATE_WALLET_RECEIVE_ADDRESS = 'SIMPLE_WALLET_CREATE_WALLET_RECEIVE_ADDRESS';
export const WALLET_CREATE_ACCOUNT = 'SIMPLE_WALLET_WALLET_CREATE_ACCOUNT';
// multisig specific
export const SET_MULTISIG_WALLETS = 'SIMPLE_WALLET_SET_MULTISIG_WALLETS';
export const SET_MULTISIG_WALLET_INFO = 'SIMPLE_WALLET_SET_MULTISIG_WALLET_INFO';
export const SET_MULTISIG_WALLET_PROPOSALS = 'SIMPLE_WALLET_SET_MULTISIG_WALLET_PROPOSALS';
export const USER_SELECT_MULTISIG_PROPOSAL = 'SIMPLE_WALLET_USER_SELECT_MULTISIG_PROPOSAL';
export const SET_MULTISIG_PROPOSAL_MTX = 'SIMPLE_WALLET_SET_MULTISIG_PROPOSAL_MTX';
// plugin specific constants
export const USER_SELECT_WALLET = 'SIMPLE_WALLET_USER_SELECT_WALLET';
export const USER_SELECT_ACCOUNT = 'SIMPLE_WALLET_USER_SELECT_ACCOUNT';
export const USER_SELECT_MULTISIG_WALLET = 'SIMPLE_WALLET_USER_SELECT_MULTISIG_WALLET';
export const USER_SELECT_XPUB = 'SIMPLE_WALLET_USER_SELECT_XPUB';
export const UPDATE_TEXT_FIELD = 'SIMPLE_WALLET_UPDATE_TEXT_FIELD';

// TODO: parse from metadata?
// does this already happen?
export const PLUGIN_NAMESPACE = '@bpanel/simple-wallet';

// values to use from transaction history api
export const TXN_HISTORY_TABLE_VALUES = [
  'block',
  'confirmations',
  'date',
  'fee',
  'hash',
  'tx',
  'height',
  'virtualSize',
];

// TODO: figure out how to set this
// via webpack at runtime
// extra verbose logging toggle
export const EXTRA_VERBOSE = false;

// HACK: until we have a paginating table
export const TXN_DISPLAY_COUNT = 100;

export const currencyPropTypes = PropTypes.shape({
  chain: PropTypes.string,
  units: PropTypes.shape({
    base: PropTypes.string,
    currency: PropTypes.string,
    micro: PropTypes.string,
    milli: PropTypes.string,
    unit: PropTypes.string,
  }),
  value: PropTypes.number,
});
