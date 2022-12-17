export const breakStringByLine = (str: string, numChars: number): string => {
  let newStr = '';
  let currentIndex = 0;
  while (currentIndex < str.length) {
    newStr += str.substring(currentIndex, currentIndex + numChars);
    currentIndex += numChars;
    if (currentIndex < str.length) {
      newStr += '\n';
    }
  }
  return newStr;
};
