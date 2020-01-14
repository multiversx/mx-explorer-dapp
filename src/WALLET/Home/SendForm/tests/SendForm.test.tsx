import { fireEvent, render, wait } from '@testing-library/react';
import React from 'react';
import SendForm from '../SendForm';
import { GlobalProvider } from './../../../../context';

const formProps = {
  testnetGasLimit: 1000,
  economics: true,
  testnetGasPrice: 10,
  gasPerDataByte: 1500,
  publicKey: '39e82d234b7c73c34f76091818f2c9f68d93914d12f3e0c507c59a9d3e38ad29',
  privateKey: '39e82d234b7c73c34f76091818f2c9f68d93914d12f3e0c507c59a9d3e38ad29',
  denomination: 4,
  nonce: 0,
  nodeUrl: 'https://wallet-api.elrond.com',
  timeout: 3000,
  data: true,
  gasLimitEditable: true,
  decimals: 4,
  balance: '9999570270',
  serverBalance: '9999570270',
  dispatch: () => null,
  populateDetails: (intervalId: number) => () => null,
};

// file upload
// https://github.com/testing-library/react-testing-library/issues/93#issuecomment-405111391
// https://codesandbox.io/s/rl0wj028pp

const beforeAll = (props?: any) => {
  const sendFormProps = { ...formProps, ...props };
  return render(
    <GlobalProvider>
      <SendForm {...sendFormProps} />
    </GlobalProvider>
  );
};

describe('Destination address', () => {
  it(`should not be empty`, async () => {
    const { findByTestId, queryByText } = beforeAll();
    const data = { target: { value: '' } };
    const input: any = await findByTestId(`dstAddress`);
    fireEvent.change(input, data);
    fireEvent.blur(input);
    await wait(() => {
      expect(input.value).toBe('');
      const req = queryByText('Required');
      expect(req!.innerHTML).toBe('Required');
    });
  });
  it(`should validate address`, async () => {
    const { findByTestId, queryByText } = beforeAll();
    const input: any = await findByTestId(`dstAddress`);
    const value = '123';
    const data = { target: { value } };
    fireEvent.change(input, data);
    fireEvent.blur(input);
    await wait(() => {
      const req = queryByText('Invalid address');
      expect(req!.innerHTML).toBe('Invalid address');
    });
  });
});

describe('Amount', () => {
  it(`should not be empty`, async () => {
    const { queryByText, getByLabelText } = beforeAll();
    const data = { target: { value: '' } };
    const input: any = getByLabelText(`Amount (ERD)`);
    fireEvent.change(input, data);
    fireEvent.blur(input);
    await wait(() => {
      expect(input.value).toBe('');
      const req = queryByText('Required');
      expect(req!.innerHTML).toBe('Required');
    });
  });
  it(`should be numeric`, async () => {
    const { getByLabelText, queryByText } = beforeAll();
    const input: any = getByLabelText(`Amount (ERD)`);
    const value = 'asd';
    const data = { target: { value } };
    fireEvent.change(input, data);
    fireEvent.blur(input);
    await wait(() => {
      const req = queryByText('Invalid number');
      expect(req!.innerHTML).toBe('Invalid number');
    });
  });
  it(`should not allow comma ',' `, async () => {
    const { getByLabelText, queryByText } = beforeAll();
    const input: any = getByLabelText(`Amount (ERD)`);
    const value = '1,2';
    const data = { target: { value } };
    fireEvent.change(input, data);
    fireEvent.blur(input);
    await wait(() => {
      const req = queryByText('Invalid number');
      expect(req!.innerHTML).toBe('Invalid number');
    });
  });
  it(`should allow only max number of decimals configured by testnet`, async () => {
    const { getByLabelText, queryByText } = beforeAll();
    const input: any = getByLabelText(`Amount (ERD)`);
    const value = '1.123456';
    const data = { target: { value } };
    fireEvent.change(input, data);
    fireEvent.blur(input);
    await wait(() => {
      expect(input.value).toBe(value);
      const req = queryByText(/^Maximum/);
      expect(req!.innerHTML).toBe(`Maximum ${formProps.decimals} decimals allowed`);
    });
  });
  it(`should be =< than balance - transaction fee`, async () => {
    const { getByLabelText, queryByText } = beforeAll();
    const input: any = getByLabelText(`Amount (ERD)`);
    // const transactionFee =
    //   formProps.testnetGasPrice * formProps.testnetGasLimit * Math.pow(10, -formProps.denomination);
    // const value = parseInt(formProps.balance) - transactionFee - 1;
    const value =
      formProps.balance.substr(0, formProps.balance.length - formProps.denomination) +
      '.' +
      formProps.balance.substr(formProps.balance.length - formProps.denomination);

    const data = { target: { value } }; // 999957.0270
    fireEvent.change(input, data);
    fireEvent.blur(input);
    await wait(() => {
      const req = queryByText('Insufficient funds');
      expect(req!.innerHTML).toBe(`Insufficient funds`);
    });
  });
});

describe('Gas limit', () => {
  it(`should not be empty`, async () => {
    const { getByLabelText } = beforeAll();
    const input: any = getByLabelText(`Gas Limit`);
    await wait(() => {
      expect(input.value).toBe(formProps.testnetGasLimit.toString());
    });
  });
  it(`should be integer`, async () => {
    const { getByLabelText, queryByText } = beforeAll();
    const input: any = getByLabelText(`Gas Limit`);
    const value = 'string';
    const data = { target: { value } };
    fireEvent.change(input, data);
    fireEvent.blur(input);
    await wait(() => {
      const req = queryByText('Invalid number');
      expect(req!.innerHTML).toBe('Invalid number');
    });
  });
  it(`should >= than the one set by testnet config`, async () => {
    const { getByLabelText, queryByText } = beforeAll();
    const input: any = getByLabelText(`Gas Limit`);
    const value = formProps.testnetGasLimit - 1;
    const data = { target: { value } };
    fireEvent.change(input, data);
    fireEvent.blur(input);
    await wait(() => {
      const req = queryByText(/^Gas limit must be greater/);
      expect(req!.innerHTML).toBe(
        `Gas limit must be greater or equal to ${formProps.testnetGasLimit}`
      );
    });
  });
  it(`should >= than the testnetGasLimit + data.length if data is set`, async () => {
    const { getByLabelText, queryByText } = beforeAll();

    const dataInput: any = getByLabelText(`Data`);
    const dataValue = 'four';
    fireEvent.change(dataInput, { target: { value: dataValue } });
    fireEvent.blur(dataInput);

    const input: any = getByLabelText(`Gas Limit`);
    const value = formProps.testnetGasLimit;
    const data = { target: { value } };
    fireEvent.change(input, data);
    fireEvent.blur(input);

    await wait(() => {
      const req = queryByText(/^Gas limit must be greater/);
      expect(req!.innerHTML).toBe(
        `Gas limit must be greater or equal to ${formProps.testnetGasLimit + dataValue.length}`
      );
    });
  });
  it(`should not show error when writing in data`, async () => {
    const { getByLabelText, queryByText, getByText, findByTestId } = beforeAll();

    const address: any = getByLabelText(`To`);
    fireEvent.change(address, { target: { value: formProps.publicKey } });
    fireEvent.blur(address);

    const entireBalaceButton = getByText(`Entire balance`);
    fireEvent.click(entireBalaceButton);

    const transactionFeeValue = await findByTestId(`transactionFeeValue`);
    fireEvent.click(transactionFeeValue);

    const gasLimit: any = getByLabelText(`Gas Limit`);
    fireEvent.blur(gasLimit);

    const data = getByLabelText(`Data`);
    fireEvent.change(data, { target: { value: '123' } });
    fireEvent.keyUp(data);

    await wait(() => {
      const req = queryByText(/^Gas limit must be greater/);
      expect(req).toBe(null);
    });
  });
});

describe('Data field tests', () => {
  test('data changes transaction fee', async () => {
    const data = { target: { value: 'four' } };
    const props = {
      testnetGasLimit: 1000000, // 1000,
      testnetGasPrice: 100000000000000, // 10,
      denomination: 18, // 4
    };
    const { getByLabelText, findByTestId } = beforeAll(props);

    const input = getByLabelText('Data');
    fireEvent.change(input, data);
    const transactionFeeValue = await findByTestId(`transactionFeeValue`);
    expect(transactionFeeValue.innerHTML).toBe(`100.6000&nbsp;ERD`);
  });
});

describe('Entire balance button', () => {
  test('Pressing entire balance fills amount with balance - fee', async () => {
    const { getByLabelText, getByText } = beforeAll();

    const entireBalaceButton = getByText(`Entire balance`);
    fireEvent.click(entireBalaceButton);
    const input: any = getByLabelText(`Amount (ERD)`);
    expect(input.value).toBe('999956.0270');
  });
});
