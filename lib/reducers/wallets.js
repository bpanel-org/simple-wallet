import { USER_SELECT_WALLET, USER_SELECT_ACCOUNT } from '../constants';

const initialState = {
  selectedWallet: 'primary',
  selectedAccount: 'default'
};

export default function walletsReducer(state = initialState, action) {
  const { type, payload = {} } = action;
  let newState = { ...state };

  const { walletId, accountId } = payload;
  switch (type) {
    case USER_SELECT_WALLET:
      newState.selectedWallet = walletId;
      return newState;
    case USER_SELECT_ACCOUNT:
      newState.selectedAccount = accountId;
      return newState;
    default:
      return state;
  }
}
