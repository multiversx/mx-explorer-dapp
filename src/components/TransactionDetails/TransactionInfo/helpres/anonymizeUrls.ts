import anchorme from 'anchorme';

const blacklist = ['lottery-elrond.com', 'bitly.com', 'bit.ly'];

const anonymizeUrls = (input: string) => {
  if (input.length > 1000) {
    return input;
  }

  // eslint-disable-next-line
  let clean = input.normalize('NFKC').replace(/[^\x00-\x7F]/g, '');

  blacklist.forEach((item) => {
    if (clean.replace(/\s/g, '').includes(item)) {
      clean = '***** [message removed for security reasons]';
    }
  });

  return anchorme({
    input: clean,
    options: {
      specialTransform: [
        {
          test: /.*$/,
          transform: () => {
            return '***** [link removed for security reasons]';
          },
        },
      ],
    },
  });
};

export default anonymizeUrls;
