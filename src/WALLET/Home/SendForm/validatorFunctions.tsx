import { string, object, number } from 'yup';
import Web3 from 'web3';
import denominate from './../../../sharedComponents/Denominate/denominate';
import { addressIsHash } from './../../../helpers';

export function isValidNumber(number: number) {
  return !(
    isNaN(number) ||
    isNaN(parseInt(number.toString())) ||
    !/^[+]?\d+(\.\d+)?$/.test(number.toString())
  );
}

export const validationSchema = object().shape({
  dstAddress: string()
    .required('Required')
    .test('addressIsHash', 'Invalid address', value => value && addressIsHash(value)),
  amount: number()
    .typeError('Invalid number')
    .required('Required')
    .test('isValidNumber', 'Invalid number', value => value && isValidNumber(value)),
  gasPrice: number()
    .typeError('Invalid number')
    .required('Required')
    .test('isValidNumber', 'Invalid number', value => value && isValidNumber(value)),
  gasLimit: number()
    .typeError('Invalid number')
    .required('Required')
    .test('isValidNumber', 'Invalid number', value => value && isValidNumber(value)),
});

interface EntireBalanceType {
  balance: string;
  gasPrice: number;
  gasLimit: number;
  denomination: number;
  decimals: number;
}

export const entireBalance = ({
  balance: myBalance,
  gasLimit,
  gasPrice,
  denomination,
  decimals,
}: EntireBalanceType) => {
  const web3 = new Web3();
  const fee = web3.utils.toBN(gasPrice * gasLimit);
  const balance = web3.utils.toBN(myBalance);
  const entireBalance = balance.sub(fee);
  if (entireBalance.isZero || !entireBalance.isNeg) {
    // entireBalance >= 0
    const input = balance.sub(fee).toString(10);
    const denominated = denominate({ input, denomination, decimals, showAllDecimals: true });
    return denominated.replace(/,/g, '');
  }
};
