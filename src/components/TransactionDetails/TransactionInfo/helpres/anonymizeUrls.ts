import anchorme from 'anchorme';

const anonymizeUrls = (input: string) =>
  anchorme({
    input,
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

export default anonymizeUrls;
