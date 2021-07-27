import { scamDetect } from '../useScamDetect';

describe('scamDetect tests', () => {
  const blacklist = ['lottery', 'l0ttery', '🅻🅾🆃🆃🅴🆁🆈'];
  const output = '[Message hidden due to suspicious content]';
  const strings: { [key: string]: string } = {
    '[...] link.com': output,
    '[...] http://google.com': output,
    '[...] https://linkedin.com': output,
    '[...] http://google.com?asd=true': output,
    '[...] http://www1.google.com': output,
    '[...] http://www.google.ceva.com': output,
    '[...] 🅻🅾🆃🆃🅴🆁🆈': output,
  };
  for (let i = 0; i < Object.keys(strings).length; i++) {
    const input = Object.keys(strings)[i];
    const msg = strings[input];
    test(`anonymize ${input} -> ${msg}`, () => {
      const result = scamDetect(blacklist)(input);
      expect(result).toEqual(msg);
    });
  }
});
