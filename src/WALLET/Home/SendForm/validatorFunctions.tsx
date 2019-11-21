import { string, object, number, ObjectSchema, boolean } from 'yup';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import denominate from './../../../sharedComponents/Denominate/denominate';
import { addressIsHash } from './../../../helpers';
import cryptoCore from '../../lib/cryptoCore';

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
  let parts = input.toString().split('.');

  let count = parts[1] ? denomination - parts[1].length : denomination;

  let transformed = parts.join('') + '0'.repeat(count);

  // remove beginning zeros
  while (transformed.substring(0, 1) == '0' && transformed.length > 1) {
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
    .test('addressIsHash', 'Invalid address', value => value && addressIsHash(value)),
  amount: number()
    .typeError('Invalid number')
    .required('Required')
    .moreThan(0)
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
        const dataPlusGas = data ? data.length : 0 + testnetGasLimit;
        return schema.test(
          'minValue',
          `Gas limit must be greater or equal to ${dataPlusGas}`,
          (value: any) => value && value >= dataPlusGas
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
  const fee = web3.utils.toBN(gasPrice * gasLimit);
  const bNbalance = web3.utils.toBN(myBalance);
  const entireBalance = bNbalance.sub(fee);
  // entireBalance >= 0
  if (entireBalance.isZero || !entireBalance.isNeg) {
    const input = bNbalance.sub(fee).toString(10);
    const denominated = denominate({ input, denomination, decimals, showAllDecimals: true });
    return denominated.replace(/,/g, '');
  }
  return undefined;
};

export const denominateGasPrice = ({ gasPrice, denomination, decimals }: EntireBalanceType) =>
  denominate({ input: gasPrice.toString(), denomination, decimals, showAllDecimals: true });

interface PrepareTransactionType {
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
  const tx = cryptoCore.createTransaction({
    nonce,
    from: publicKey,
    to: dstAddress,
    value: largeAmount,
    gasPrice,
    gasLimit,
    data,
  });
  tx.signature = account.sign(tx.prepareForSigning());
  return tx;
};
