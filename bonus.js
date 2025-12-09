/////////////npm run start:bonus/////////////////////////////////////////////
var longestCommonPrefix = function (strs) {
  let valueOfPrefix = '';
  if (strs.length === 1) return strs[0];

  for (let charIndex = 0; charIndex < strs[0].length; charIndex++) {
    if (strs.some((str) => str[charIndex] !== strs[0][charIndex])) {
      return valueOfPrefix;
    }
    valueOfPrefix += strs[0][charIndex];
  }
  return valueOfPrefix;
};
console.log(
  'second solution ' + longestCommonPrefix(['flower', 'flow', 'flight']),
);
/////////////str1 , str2, str3 //str[charIndex] !== strs[0][charIndex] some
//char 1 'f'// [false,false,false] //false prefix="f"
//char 2 'l'// [false,false,false] //false prefix="fl"
//char 3 'o'// [false,false,true ] //true break the loop
//char 4 'w'// [false,false,true]
//char 5 'e'// [false,true,true]
//char 6 'r'// [false,true,true]

////////////////////////////////////////////////////////////////////////////
var longestCommonPrefix = function (strs) {
  if (strs.length === 0) return '';
  else if (strs.length === 1) return strs[0];
  let pre = '';
  let index = 1;
  for (let i = 0; i < strs[0].length; i++) {
    while (true) {
      if (strs[index][i] !== strs[0][i]) {
        return pre;
      }
      if (index === strs.length - 1) {
        index = 1;
        break;
      }
      index++;
    }
    pre += strs[0][i];
  }
  return pre;
};
console.log(
  'second solution ' + longestCommonPrefix(['flower', 'flow', 'flight']),
);
////////////////////////////////////////////////////////////////////////
var longestCommonPrefix = function (strs) {
  let valueOfPrefix = '';
  if (strs.length === 1) return strs[0];
  for (let index = 0; index < strs[0].length; index++) {
    for (let i = 1; i < strs.length; i++) {
      if (strs[i][index] !== strs[0][index]) {
        return valueOfPrefix;
      }
    }
    valueOfPrefix += strs[0][index];
  }
  return valueOfPrefix;
};
console.log(
  'second solution ' + longestCommonPrefix(['flower', 'flow', 'flight']),
);
/////////////////////////////////////////////////////////////////////
