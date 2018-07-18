// utility functions

import { isEqual } from 'lodash';

import { EXTRA_VERBOSE } from './constants';

// safely evaluate a function when it may referencing
// undefined values, provide a context to help with debugging
const context = 'not provided';
export const safeEval = (fn, fallback, context = context) => {
  try {
    const response = fn();
    if (response === undefined) {
      throw new Error();
    }
    return response;
  } catch (e) {
    if (EXTRA_VERBOSE) {
      console.warn(`safeEval failure: ${fn.toString()}
  context ${context}`);
    }
    return fallback;
  }
};

// safely set a value nested deeply in an objects
export const safeSet = (obj, dotpath, data) => {
  const path = dotpath.split('.');
  let copy = { ...obj };
  let target = copy;
  path.forEach((el, i) => {
    // create an object if it doesn't exist
    if (!(el in target)) {
      target[el] = {};
    }
    // if we are at last iteration
    // set data
    if (i === path.length - 1) {
      target[el] = data;
    }
    target = target[el];
  });
  return copy;
};

// preventDefault may sometimes be passed an object
// with an event property, so we check for that edge
// case
export const preventDefault = e => {
  if (e instanceof Event) {
    e.preventDefault();
  } else if (e.event instanceof Event) {
    e.event.preventDefault();
  }
  return e;
};

// turn an array into the proper data format
// to be used in a data table
// TODO: generalize to n columns
export const buildSingleColumnTable = (data = [], title = '') => {
  return data.map(el => ({ [title]: el }));
};

// standard mergeProps function
export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return Object.assign({}, ownProps, stateProps, dispatchProps);
};

// deeply compare an object or array
export const deepEqual = (a, b) => {
  return isEqual(a, b);
};

// validate text fields
// TODO: use enum for cases
export const validateTextField = (value, field) => {
  try {
    switch (field) {
      case 'sendBalanceInput':
      case 'multisigSendBalanceInput':
        // TODO: check to make sure less than total balance
        // in current account
        // check if invalid number
        if (isNaN(+value)) {
          return [value, false];
        }
        // is it possible to send using sum of 2 accounts?
        // convert value to int
        return [+value, true];
      case 'transactionFeeInput':
      case 'multisigTransactionFeeInput':
        // TODO: check that sendBalance + txnFee < totalBalance
        if (isNaN(+value)) {
          return [value, false];
        }
        return [+value, true];
      case 'recipientInput':
      case 'multisigRecipientInput':
        // TODO: validate address
        return [value, true];
      case 'createWalletPassphraseInput':
      case 'sendWalletPassphraseInput':
        // TODO: determine contraints on passphrase
        return [value, true];
      case 'walletNameInput':
      case 'accountNameInput':
      case 'proposalNameInput':
      case 'multisigWalletNameInput':
      case 'createCosignerNameInput':
      case 'joinCosignerNameInput':
        // TODO: determine contstraints on wallet/account names
        return [value, true];
      case 'createWalletMInput':
      case 'createWalletNInput':
        // m cannot be larger than n
        return [+value, true];
      case 'hardwareAccountInput':
      case 'proposalUXCosignerAccountInput':
        // test for integer
        if (/^\d+$/.test(+value)) {
          return [+value, false];
        }
        return [+value, true];
      case 'joinXpubInput':
        // regex for xpub
        // check prefix against network
        return [value, true];
      case 'joinKeyInput':
        // regex for joinKey
        return [value, true];
      case 'cosignerPathInput':
        // regex for valid cosigner path
        return [value, true];
      case 'proposalCosignerTokenInput':
      case 'proposalUXCosignerTokenInput':
        // regex for valid token
        return [value, true];
      default:
        // developer error
        throw new Error(`invalid field: ${field}, value: ${value}`);
    }
  } catch (e) {
    // catch any other sort of error
    // eslint-disable-next-line
    console.error(`bad validation operation for ${field}, value: ${value}`);
    return [value, false];
  }
};
