// utility functions

import { EXTRA_VERBOSE } from './constants';

// safely evaluate a function when it may referencing
// undefined values, provide a context to help with debugging
const context = 'not provided';
export const safeEval = (fn, fallback, context = context) => {
  try {
    return fn();
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
}

export const preventDefault = e => {
  e.preventDefault();
  return e
};

