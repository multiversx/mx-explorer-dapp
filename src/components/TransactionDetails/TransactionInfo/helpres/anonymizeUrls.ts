import anchorme from 'anchorme';

// const inputs = [
//   '[...] link.com',
//   '[...] http://google.com',
//   '[...] https://linkedin.com',
//   '[...] http://google.com?asd=true',
//   '[...] http://www1.google.com',
//   '[...] http://www.google.ceva.com',
// ];

// TODO: create tests

const anonymizeUrls = (input: string) =>
  anchorme({
    input,
    options: {
      specialTransform: [
        {
          test: /.*$/,
          transform: (found) => {
            const url = new URL(found.includes('http') ? found : `http://${found}`);

            const parts = url.hostname.split('.');
            const anonymized =
              parts[0][0] +
              '***' +
              parts[parts.length - 2][parts[parts.length - 2].length - 1] +
              '.' +
              parts[parts.length - 1];

            const result = found.replace(url.hostname, anonymized);

            return result;
          },
        },
      ],
    },
  });

export default anonymizeUrls;
