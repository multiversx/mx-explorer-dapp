import denominate from './../denominate';
// file.only

describe('denomination 4,4', () => {
  const numbers: { [key: string]: string } = {
    '9999999999999999999999990000': '999,999,999,999,999,999,999,999.0000',
    '0': '0.0000',
  };
  const denomination = 4;
  const decimals = 4;
  for (let i = 0; i < Object.keys(numbers).length; i++) {
    const input = Object.keys(numbers)[i];
    const output = numbers[input];
    it(`denominate ${input} -> ${output}`, () => {
      const withCommas = denominate({ input, denomination, decimals, showAllDecimals: false });
      expect(withCommas).toBe(output);
    });
  }
});

describe('denomination 8,4', () => {
  const numbers: { [key: string]: string } = {
    '9999999999999999999899996000': '99,999,999,999,999,999,998.9999',
    '0': '0.0000',
    '10000': '0.0001',
  };
  const denomination = 8;
  const decimals = 4;
  for (let i = 0; i < Object.keys(numbers).length; i++) {
    const input = Object.keys(numbers)[i];
    const output = numbers[input];
    it(`denominate ${input} -> ${output}`, () => {
      const withCommas = denominate({ input, denomination, decimals, showAllDecimals: false });
      expect(withCommas).toBe(output);
    });
  }
});

describe('denomination 0,0', () => {
  const numbers: { [key: string]: string } = {
    '350': '350',
  };
  const denomination = 0;
  const decimals = 0;
  for (let i = 0; i < Object.keys(numbers).length; i++) {
    const input = Object.keys(numbers)[i];
    const output = numbers[input];
    it(`denominate ${input} -> ${output}`, () => {
      const withCommas = denominate({ input, denomination, decimals, showAllDecimals: false });
      expect(withCommas).toBe(output);
    });
  }
});

describe('denomination 4,4,true', () => {
  const numbers: { [key: string]: string } = {
    '12345678901234567890123': '123,456,789,012,345.67890123',
  };
  const denomination = 8;
  const decimals = 4;
  for (let i = 0; i < Object.keys(numbers).length; i++) {
    const input = Object.keys(numbers)[i];
    const output = numbers[input];
    it(`denominate ${input} -> ${output}`, () => {
      const withCommas = denominate({ input, denomination, decimals, showAllDecimals: true });
      expect(withCommas).toBe(output);
    });
  }
});

describe('denomination 4,4,true', () => {
  const numbers: { [key: string]: string } = {
    '20000000000000000000': '20.00000000',
  };
  const denomination = 18;
  const decimals = 8;
  for (let i = 0; i < Object.keys(numbers).length; i++) {
    const input = Object.keys(numbers)[i];
    const output = numbers[input];
    it(`denominate ${input} -> ${output}`, () => {
      const withCommas = denominate({ input, denomination, decimals, showAllDecimals: false });
      expect(withCommas).toBe(output);
    });
  }
});
