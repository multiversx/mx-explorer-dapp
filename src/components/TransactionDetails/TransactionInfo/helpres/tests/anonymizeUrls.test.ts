import anonymizeUrls from '../anonymizeUrls';

describe('anonymizeUrls tests', () => {
  const strings: { [key: string]: string } = {
    '[...] link.com': '[...] l***k.com',
    '[...] http://google.com': '[...] http://g***e.com',
    '[...] https://linkedin.com': '[...] https://l***n.com',
    '[...] http://google.com?asd=true': '[...] http://g***e.com?asd=true',
    '[...] http://www1.google.com': '[...] http://w***e.com',
    '[...] http://www.google.ceva.com': '[...] http://w***a.com',
  };
  for (let i = 0; i < Object.keys(strings).length; i++) {
    const input = Object.keys(strings)[i];
    const output = strings[input];
    test(`anonymize ${input} -> ${output}`, () => {
      const result = anonymizeUrls(input);
      expect(result).toEqual(output);
    });
  }
});
