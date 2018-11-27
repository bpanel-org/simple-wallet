import {
  USER_SELECT_WALLET,
  USER_SELECT_ACCOUNT,
  USER_SELECT_MULTISIG_WALLET,
  USER_SELECT_MULTISIG_PROPOSAL,
  USER_SELECT_XPUB,
  UPDATE_TEXT_FIELD,
} from '../constants';

const initialState = {
  selectedWallet: 'primary',
  selectedAccount: 'default',
  resetSelectedWallet: true,
  textFields: {},
};

export default function walletsReducer(state = initialState, action) {
  const { type, payload = {} } = action;
  let newState = { ...state };

  const {
    walletId,
    accountId,
    proposalId,
    selectedXPUB,
    field,
    value,
    valid,
  } = payload;

  switch (type) {
    case USER_SELECT_WALLET:
      newState.selectedWallet = walletId;
      newState.resetSelectedAccount = true;
      newState.resetSelectedWallet = false;
      return newState;
    case USER_SELECT_ACCOUNT:
      newState.selectedAccount = accountId;
      newState.resetSelectedAccount = false;
      return newState;
    case USER_SELECT_MULTISIG_WALLET:
      newState.selectedMultisigWallet = walletId;
      return newState;
    case USER_SELECT_MULTISIG_PROPOSAL:
      newState.selectedProposal = proposalId;
      return newState;
    case USER_SELECT_XPUB:
      newState.selectedXPUB = selectedXPUB;
      return newState;
    case UPDATE_TEXT_FIELD:
      newState.textFields[field] = { value, valid };
      return newState;
    default:
      return state;
  }
}
