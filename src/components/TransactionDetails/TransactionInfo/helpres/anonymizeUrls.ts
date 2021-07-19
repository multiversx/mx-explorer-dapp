import anchorme from 'anchorme';

const blacklist = [
  'lottery-elrond',
  'l0ttery-elr0nd',
  'l0ttery-elrond',
  'lottery-elr0nd',
  'bitly.com',
  'bit.ly',
];

const anonymizeUrls = (input: string) => {
  if (input.length > 1000) {
    return input;
  }

  // eslint-disable-next-line
  let clean = input.normalize('NFKC').replace(/[\u200B-\u200D\uFEFF]/g, '');

  blacklist.forEach((item) => {
    if (clean.replace(/\s/g, '').toLocaleLowerCase().includes(item)) {
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
