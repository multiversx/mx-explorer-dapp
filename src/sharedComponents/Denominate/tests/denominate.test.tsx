import denominate from './../denominate';

describe('denomination 4,4', () => {
  const numbers: { [key: string]: string } = {
    '9999999999999999999999990000': '999,999,999,999,999,999,999,999',
    '0': '0',
  };
  const denomination = 4;
  const decimals = 4;
  for (let i = 0; i < Object.keys(numbers).length; i++) {
    const input = Object.keys(numbers)[i];
    const output = numbers[input];
    it(`denominate ${input} -> ${output}`, () => {
      const withCommas = denominate({
        input,
        denomination,
        decimals,
        showLastNonZeroDecimal: false,
      });
      expect(withCommas).toBe(output);
    });
  }
});

describe('denomination 8,4', () => {
  const numbers: { [key: string]: string } = {
    '9999999999999999999899996000': '99,999,999,999,999,999,998.9999',
    '0': '0',
    '10000': '0.0001',
  };
  const denomination = 8;
  const decimals = 4;
  for (let i = 0; i < Object.keys(numbers).length; i++) {
    const input = Object.keys(numbers)[i];
    const output = numbers[input];
    it(`denominate ${input} -> ${output}`, () => {
      const withCommas = denominate({
        input,
        denomination,
        decimals,
        showLastNonZeroDecimal: false,
      });
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
      const withCommas = denominate({
        input,
        denomination,
        decimals,
        showLastNonZeroDecimal: false,
      });
      expect(withCommas).toBe(output);
    });
  }
});

describe('denomination 4,8,true', () => {
  const numbers: { [key: string]: string } = {
    '12345678901234567890123': '123,456,789,012,345.67890123',
  };
  const denomination = 8;
  const decimals = 4;
  for (let i = 0; i < Object.keys(numbers).length; i++) {
    const input = Object.keys(numbers)[i];
    const output = numbers[input];
    it(`denominate ${input} -> ${output}`, () => {
      const withCommas = denominate({
        input,
        denomination,
        decimals,
        showLastNonZeroDecimal: true,
      });
      expect(withCommas).toBe(output);
    });
  }
});

describe('denomination 18,0,true', () => {
  const numbers: { [key: string]: string } = {
    '102000000000000000': '0.102',
    '100000000000000000': '0.1',
    '1000000000000000000': '1',
  };
  const denomination = 18;
  const decimals = 0;
  for (let i = 0; i < Object.keys(numbers).length; i++) {
    const input = Object.keys(numbers)[i];
    const output = numbers[input];
    it(`denominate ${input} -> ${output}`, () => {
      const withCommas = denominate({
        input,
        denomination,
        decimals,
        showLastNonZeroDecimal: true,
      });
      expect(withCommas).toBe(output);
    });
  }
});

describe('denomination float throws error', () => {
  const numbers: { [key: string]: string } = {
    '0.015': 'Throws error',
    '01000000000000000000': 'Throws error',
  };
  const denomination = 18;
  const decimals = 4;
  for (let i = 0; i < Object.keys(numbers).length; i++) {
    const input = Object.keys(numbers)[i];
    const output = numbers[input];
    it(`denominate ${input} -> ${output}`, () => {
      let err = '';
      try {
        denominate({
          input,
          denomination,
          decimals,
          addCommas: false,
          showLastNonZeroDecimal: true,
        });
        expect(err).toBeInstanceOf(Error);
      } catch (error) {
        err = error;
        expect(err).toBeInstanceOf(Error);
        expect(error).toHaveProperty('message', 'Invalid input');
      }
    });
  }
});

describe('denomination negative', () => {
  const numbers: { [key: string]: string } = {
    '-922506751086064008': '-0.922506751086064008',
    '-578345000000000000000': '-578.3450',
    '-1578345000000000000000': '-1,578.3450',
    '-3456000000000000000': '-3.4560',
  };
  const denomination = 18;
  const decimals = 4;
  for (let i = 0; i < Object.keys(numbers).length; i++) {
    const input = Object.keys(numbers)[i];
    const output = numbers[input];
    it(`denominate ${input} -> ${output}`, () => {
      const withCommas = denominate({
        input,
        denomination,
        decimals,
        showLastNonZeroDecimal: true,
      });
      expect(withCommas).toBe(output);
    });
  }
});
