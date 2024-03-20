import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { ReactComponent as MultiversXSymbol } from 'assets/img/symbol.svg';
import { activeNetworkSelector } from 'redux/selectors';
import { WithClassnameType } from 'types';

export interface FormatEGLDUIType extends WithClassnameType {
  value: string | number;
  showEgldLabel?: boolean;
  superSuffix?: boolean;
}

// TODO - will expand on FormatAmount ( FormatAmount )

export const FormatEGLD = ({
  value,
  showEgldLabel,
  superSuffix,
  className
}: FormatEGLDUIType) => {
  const { egldLabel } = useSelector(activeNetworkSelector);

  if (!value) {
    return null;
  }
  if (!egldLabel || !(String(value).includes(egldLabel) || showEgldLabel)) {
    return value;
  }

  const [amount, decimals] = String(value).replace(egldLabel, '').split('.');

  return (
    <span className={classNames(className, 'fam-e')}>
      <MultiversXSymbol className='sym' /> <span className='am'>{amount}</span>
      {decimals && <span className='dec'>.{decimals}</span>}
      <>
        {superSuffix ? (
          <sup className='suf'>&nbsp;{egldLabel}</sup>
        ) : (
          <span className='suf'>&nbsp;{egldLabel}</span>
        )}
      </>
    </span>
  );
};
