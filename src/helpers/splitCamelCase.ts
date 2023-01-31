export const splitCamelCase = (word: string) => {
  if (typeof word !== 'string') {
    return word;
  }
  let output;
  let i;
  let l;
  let capRe = /[A-Z]/;

  output = [];
  for (i = 0, l = word.length; i < l; i += 1) {
    if (i === 0) {
      output.push(word[i].toUpperCase());
    } else {
      if (i > 0 && capRe.test(word[i])) {
        output.push(' ');
      }
      output.push(word[i]);
    }
  }
  return output.join('');
};
