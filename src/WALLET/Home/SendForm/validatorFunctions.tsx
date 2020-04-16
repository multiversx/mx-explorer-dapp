import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { boolean, mixed, number, object, ObjectSchema, string } from 'yup';
import cryptoCore from '../../lib/cryptoCore';
import { isHash } from './../../../helpers';
import denominate from './../../../sharedComponents/Denominate/denominate';

export function isValidNumber(number: number) {
  return !(
    isNaN(number) ||
    isNaN(parseInt(number.toString())) ||
    !/^[+]?\d+(\.\d+)?$/.test(number.toString())
  );
}

function isValidInt(number: number) {
  return !(
    isNaN(number) ||
    isNaN(parseInt(number.toString())) ||
    !/^\+?(0|[1-9]\d*)$/.test(number.toString())
  );
}

function nominate(input: string, denomination: number) {
  // const web3 = new Web3();
  // const bnInput = new BigNumber(input);
  // let web3String = web3.utils.toBN(bnInput as any).toString(10);
  const parts = input.toString().split('.');

  const count = parts[1] ? denomination - parts[1].length : denomination;

  let transformed = parts.join('') + '0'.repeat(count);

  // remove beginning zeros
  while (transformed.substring(0, 1) === '0' && transformed.length > 1) {
    transformed = transformed.substring(1);
  }

  return transformed;
}

const amountDenomination = (amount: string, denomination: number) => {
  if (
    amount !== undefined &&
    amount.toString().indexOf('.') >= 0 &&
    (amount as any)
      .toString()
      .split('.')
      .pop().length > denomination
  ) {
    return false;
  }
  return true;
};

// sa se ruleze validarea atat cand scriem cat si la submit
export const validationSchema = object().shape({
  dstAddress: string()
    .required('Required')
    .test('addressIsHash', 'Invalid address', value => value && isHash(value)),
  amount: mixed()
    .typeError('Invalid number')
    .required('Required')
    // .test('notZero', 'Must be ', value => value && isValidNumber(value))
    .when('denomination', (denomination: number, schema: ObjectSchema) => {
      return schema.test(
        'denomination',
        `Maximum ${denomination} decimals allowed`,
        (amount: any) => amountDenomination(amount, denomination)
      );
    })
    .when(
      ['balance', 'data', 'testnetGasLimit', 'testnetGasPrice', 'denomination'],
      (
        balance: string,
        data: string,
        testnetGasLimit: number,
        testnetGasPrice: number,
        denomination: number,
        schema: ObjectSchema
      ) => {
        return schema.test('denomination', `Insufficient funds`, (amount: any) => {
          if (amount !== undefined && amountDenomination(amount, denomination)) {
            const nominatedAmount = nominate(amount.toString(), denomination);
            const bnAmount = new BigNumber(nominatedAmount);
            const bnBalance = new BigNumber(balance);
            const dataLength = data !== undefined ? data.toString().length : 0;
            const fee = new BigNumber(testnetGasPrice * testnetGasLimit + dataLength);
            return !(bnBalance.comparedTo(bnAmount.plus(fee)) === -1);
          }
          return true;
        });
      }
    )
    .test('isValidNumber', 'Invalid number', value => value && isValidNumber(value)),
  gasLimit: number()
    .typeError('Invalid number')
    .required('Required')
    .when(
      ['data', 'testnetGasLimit'],
      (data: string, testnetGasLimit: number, schema: ObjectSchema) => {
        const dataPlusGas = data ? data.length + testnetGasLimit : 0 + testnetGasLimit;

        return schema.test(
          'minValue',
          `Gas limit must be greater or equal to ${dataPlusGas}`,
          (value: any) => {
            return value && value >= dataPlusGas;
          }
        );
      }
    )
    .test('isValidInteger', 'Invalid integer', value => value && isValidInt(value)),
  data: string(),
  testnetGasLimit: number(),
  testnetGasPrice: number(),
  denomination: number(),
  balance: string(),
  economics: boolean(),
});

interface EntireBalanceType {
  balance?: string;
  gasPrice: number;
  gasLimit?: number;
  denomination: number;
  decimals: number;
}

export const entireBalance = ({
  balance = '0',
  gasLimit = 0,
  gasPrice,
  denomination,
  decimals,
}: EntireBalanceType) => {
  const myBalance = balance;
  const web3 = new Web3();
  const bnBalance = new BigNumber(myBalance);
  const bnGasPrice = new BigNumber(gasPrice);
  const bnGasLimit = new BigNumber(gasLimit);
  const entireBalance = bnBalance.minus(bnGasPrice.times(bnGasLimit));
  // entireBalance >= 0
  if (entireBalance.comparedTo(0) === 1 || entireBalance.comparedTo(0) === 0) {
    const input = web3.utils.toBN(entireBalance as any).toString(10);
    return denominate({
      input,
      denomination,
      decimals,
      showLastNonZeroDecimal: true,
      addCommas: false,
    });
  }
  return undefined;
};

export const denominateGasPrice = ({ gasPrice, denomination, decimals }: EntireBalanceType) =>
  denominate({ input: gasPrice.toString(), denomination, decimals, showLastNonZeroDecimal: true });

interface PrepareTransactionType {
  balance: string;
  amount: string;
  dstAddress: string;
  privateKey: string;
  publicKey: string;
  data: string;
  denomination: number;
  gasPrice: number;
  gasLimit: number;
  nonce: number;
}
export const prepareTransaction = ({
  balance,
  amount,
  denomination,
  privateKey,
  publicKey,
  data,
  nonce,
  dstAddress,
  gasPrice,
  gasLimit,
}: PrepareTransactionType) => {
  const web3 = new Web3();
  const bNamount = new BigNumber(nominate(amount, denomination));
  const largeAmount = web3.utils.toBN(bNamount as any).toString(10);
  const account = cryptoCore.loadAccountFromPrivateKey(privateKey);
  const transaction = cryptoCore.createTransaction({
    from: publicKey,
    nonce,
    to: dstAddress,
    value: largeAmount,
    gasPrice,
    gasLimit,
    data,
  });
  transaction.signature = account.sign(transaction.prepareForSigning());

  const bNbalance = new BigNumber(balance);
  const newBnBalance = bNbalance
    .minus(new BigNumber(nominate(amount, denomination)))
    .minus(gasPrice * gasLimit);

  const newBalance = web3.utils.toBN(newBnBalance as any).toString(10);

  return { transaction, newBalance };
};

interface ShowFaucetType {
  balance: string;
  gasLimit: number;
  gasPrice: number;
}

export const showFaucet = ({ balance, gasLimit, gasPrice }: ShowFaucetType) => {
  const bNbalance = new BigNumber(balance);
  const bNgasLimit = new BigNumber(gasLimit);
  const bNgasPrice = new BigNumber(gasPrice);
  return bNbalance.comparedTo(bNgasLimit.times(bNgasPrice)) === -1;
};
