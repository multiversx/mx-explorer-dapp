import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { ReactComponent as MultiversXSymbol } from 'assets/img/symbol.svg';
import { activeNetworkSelector } from 'redux/selectors';
import { WithClassnameType } from 'types';

export interface FormattedValueUIType extends WithClassnameType {
  value: string | number;
  showEgldLabel?: boolean;
}

export const FormattedValue = ({
  value,
  showEgldLabel,
  className
}: FormattedValueUIType) => {
  const { egldLabel } = useSelector(activeNetworkSelector);

  if (!value) {
    return null;
  }
  if (!egldLabel || !(String(value).includes(egldLabel) || showEgldLabel)) {
    return value;
  }

  const [amount, decimals] = String(value).replace(egldLabel, '').split('.');

  return (
    <span className={classNames(className, 'formatted')}>
      <MultiversXSymbol className='symbol' />{' '}
      <span className='amount'>{amount}</span>
      <span className='decimals'>{decimals}</span>
      <span className='suffix'> {egldLabel}</span>
    </span>
  );
};
