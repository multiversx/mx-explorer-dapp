import anchorme from 'anchorme';

const anonymizeUrls = (input: string) => {
  if (input.length > 1000) {
    return input;
  }

  let output = input.normalize('NFKC');

  // eslint-disable-next-line
  const clean = output.toLocaleLowerCase().replace(/[^\x00-\x7F]/g, '');

  if (anchorme.list(clean.replace(/\s/g, '')).length) {
    output = '***** [message removed for security reasons]';
  }

  return output;
};

export default anonymizeUrls;
