import { string, object, mixed, number } from 'yup';
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
