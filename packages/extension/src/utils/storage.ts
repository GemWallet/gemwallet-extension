/*
 * Common storage functions
 */

export const generateKey = () => {
  return (Date.now() + Math.random()).toString();
};
