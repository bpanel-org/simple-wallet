// utility functions

// safely evaluate a function when it may referencing
// undefined values, provide a context to help with debugging
const context = 'not provided';
export const safeEval = (fn, fallback, context = context) => {
  try {
    return fn();
  } catch (e) {
    console.warn(`safeParse failure: ${fn.toString()}
context ${context}`);
    return fallback;
  }
};

export const preventDefault = e => {
  e.preventDefault();
  return e
};

