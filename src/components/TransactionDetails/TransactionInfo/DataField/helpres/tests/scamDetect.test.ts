import { scamDetect } from '../useScamDetect';

describe('scamDetect tests', () => {
  const blacklist = ['lottery', 'l0ttery', '🅻🅾🆃🆃🅴🆁🆈'];
  const output = '[Message hidden due to suspicious content]';
  const strings: { [key: string]: string } = {
    '👉 link.com': '👉 http://link.com',
    'first-link.com or 🎉 second-link.com 🎉':
      'http://first-link.com or 🎉 http://second-link.com 🎉',
    'http://google.com 🎉': 'http://google.com 🎉',
    '👉 https://linkedin.com 🎉': '👉 https://linkedin.com 🎉',
    'http://google.com?asd=true': 'http://google.com?asd=true',
    'http://www1.google.com': 'http://www1.google.com',
    'http://www.google.ceva.com': 'http://www.google.ceva.com',
    '[...] 🅻🅾🆃🆃🅴🆁🆈': '[...] 🅻🅾🆃🆃🅴🆁🆈',
  };
  for (let i = 0; i < Object.keys(strings).length; i++) {
    const input = Object.keys(strings)[i];
    const msg = strings[input];
    test(`anonymize ${input} -> ${msg}`, () => {
      const { output: result, stringWithLinks } = scamDetect(blacklist)(input);
      expect(result).toEqual(output);
      expect(stringWithLinks).toEqual(msg);
    });
  }
});
