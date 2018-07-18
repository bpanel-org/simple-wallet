import { bwalletClient, bmultisigClient } from '@bpanel/bpanel-utils';

import {
  SET_WALLET_HISTORY,
  SET_WALLETS,
  SET_WALLET_ACCOUNTS,
  USER_SELECT_WALLET,
  USER_SELECT_ACCOUNT,
  USER_SELECT_MULTISIG_WALLET,
  SET_WALLET_INFO,
  SET_WALLET_ACCOUNT_INFO,
  SET_WALLET_ACCOUNT_BALANCE,
  WALLET_CREATE_ACCOUNT,
  CREATE_WALLET_RECEIVE_ADDRESS,
  SET_MULTISIG_WALLETS,
  SET_MULTISIG_WALLET_INFO,
  SET_MULTISIG_WALLET_PROPOSALS,
  USER_SELECT_MULTISIG_PROPOSAL,
  SET_MULTISIG_PROPOSAL_MTX,
  USER_SELECT_XPUB,
  UPDATE_TEXT_FIELD
} from './constants';

const client = bwalletClient();
const multisigClient = bmultisigClient();

// action creators
const _setHistory = (walletId, accountId, history) => ({
  type: SET_WALLET_HISTORY,
  payload: { walletId, accountId, history }
});
const _setWallets = wallets => ({
  type: SET_WALLETS,
  payload: { wallets }
});
const _setAccounts = (walletId, accounts) => ({
  type: SET_WALLET_ACCOUNTS,
  payload: { accounts, walletId }
});
const _selectWallet = walletId => ({
  type: USER_SELECT_WALLET,
  payload: { walletId }
});
const _selectAccount = accountId => ({
  type: USER_SELECT_ACCOUNT,
  payload: { accountId }
});
const _setWalletInfo = (walletId, walletInfo) => ({
  type: SET_WALLET_INFO,
  payload: { walletInfo, walletId }
});
const _setAccountInfo = (walletId, accountId, accountInfo) => ({
  type: SET_WALLET_ACCOUNT_INFO,
  payload: { walletId, accountId, accountInfo }
});
const _setAccountBalance = (walletId, accountId, balance) => ({
  type: SET_WALLET_ACCOUNT_BALANCE,
  payload: { walletId, accountId, balance }
});

// NOTE: may need to pass payload in here in the future
const _createReceiveAddress = () => ({
  type: CREATE_WALLET_RECEIVE_ADDRESS,
  payload: {}
});
const _createAccount = (walletId, accountId, accountInfo) => ({
  type: WALLET_CREATE_ACCOUNT,
  payload: { walletId, accountId, accountInfo }
});
// multisig wallet helpers
const _getMultisigWallets = multisigWallets => ({
  type: SET_MULTISIG_WALLETS,
  payload: { multisigWallets }
});
const _selectMultisigWallet = walletId => ({
  type: USER_SELECT_MULTISIG_WALLET,
  payload: { walletId }
});
const _selectMultisigProposal = proposalId => ({
  type: USER_SELECT_MULTISIG_PROPOSAL,
  payload: { proposalId }
});
const _setMultisigWalletInfo = (walletId, multisigWalletInfo) => ({
  type: SET_MULTISIG_WALLET_INFO,
  payload: { walletId, multisigWalletInfo }
});
const _setMultisigProposal = (walletId, proposals) => ({
  type: SET_MULTISIG_WALLET_PROPOSALS,
  payload: { walletId, proposals }
});
const _setMultisigProposalMTX = (walletId, proposalId, mtx) => ({
  type: SET_MULTISIG_PROPOSAL_MTX,
  payload: { walletId, proposalId, mtx }
});
const _selectXPUB = xpub => ({
  type: USER_SELECT_XPUB,
  payload: { selectedXPUB: xpub }
});

export const selectXPUB = xpub => async dispatch => {
  dispatch(_selectXPUB(xpub));
};

export const selectMultisigProposal = proposalId => async dispatch => {
  dispatch(_selectMultisigProposal(proposalId));
};

export const getMultisigWallets = () => async dispatch => {
  const wallets = await multisigClient.getWallets();
  dispatch(_getMultisigWallets(wallets));
};

export const getMultisigWalletProposals = walletId => async dispatch => {
  const proposals = await multisigClient.getProposals(walletId, true);
  dispatch(_setMultisigProposal(walletId, proposals));
};
export const getMultisigWalletProposalMTX = (
  walletId,
  proposalId
) => async dispatch => {
  const mtx = await multisigClient.getProposalMTX(walletId, proposalId, {
    path: true,
    scripts: true
  });
  dispatch(_setMultisigProposalMTX(walletId, proposalId, mtx));
};

export const selectMultisigWallet = walletId => async dispatch => {
  const info = await multisigClient.getInfo(walletId, true);
  dispatch(_setMultisigWalletInfo(walletId, info));
  // selectMultisigWallet must come second
  dispatch(_selectMultisigWallet(walletId));
};

export const getHistory = (walletId, accountId) => async dispatch => {
  // TODO: figure out pagination
  const history = await client.getHistory(walletId, accountId);
  dispatch(_setHistory(walletId, accountId, history));
};

export const getWallets = () => async dispatch => {
  // list of strings, the wallet name
  const wallets = await client.getWallets();
  dispatch(_setWallets(wallets));
};

export const getAccounts = walletId => async dispatch => {
  // list of strings, the account names
  const accounts = await client.getAccounts(walletId);
  dispatch(_setAccounts(walletId, accounts));
};

export const getAccountInfo = (walletId, accountId) => async dispatch => {
  const accountInfo = await client.getAccount(walletId, accountId);
  dispatch(_setAccountInfo(walletId, accountId, accountInfo));
};

export const getAccountBalance = (walletId, accountId) => async dispatch => {
  const balance = await client.getBalance(walletId, accountId);
  dispatch(_setAccountBalance(walletId, accountId, balance));
};

export const createWallet = (walletId, options) => async dispatch => {
  const walletInfo = await client.createWallet(walletId, options);
  dispatch(_setWalletInfo(walletId, walletInfo));
};

export const createAccount = (
  walletId,
  accountId,
  options = {}
) => async dispatch => {
  const accountInfo = await client.createAccount(walletId, accountId, options);
  dispatch(_createAccount(walletId, accountId, accountInfo));
};

export const selectWallet = walletId => async dispatch => {
  dispatch(_selectWallet(walletId));
  const walletInfo = await client.getInfo(walletId);
  dispatch(_setWalletInfo(walletId, walletInfo));
};

export const selectAccount = accountId => dispatch => {
  dispatch(_selectAccount(accountId));
};

export const createReceiveAddress = (walletId, accountId) => async dispatch => {
  const addressInfo = await client.createAddress(walletId, accountId);
  // we don't actually need addressInfo right now
  // might need it in the future
  dispatch(_createReceiveAddress());
};

export const updateTextField = (field, value, valid) => dispatch => {
  dispatch({
    type: UPDATE_TEXT_FIELD,
    payload: { field, value, valid }
  });
};
