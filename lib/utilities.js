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
      throw new Error()
    }
    return response;
  } catch (e) {
    if (EXTRA_VERBOSE) {
      console.warn(`safeParse failure: ${fn.toString()}
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
// TODO: generalize to n rows
export const buildSingleRowTable = (data = [], title = '') => {
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

