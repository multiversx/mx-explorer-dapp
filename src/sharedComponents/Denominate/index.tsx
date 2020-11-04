import React from 'react';
import { useGlobalState } from '../../context';
import denominate from './denominate';
import { denomination, decimals as configDecimals } from 'appConfig';

interface DenominateType {
  value: string;
  showLastNonZeroDecimal?: boolean;
  showErd?: boolean;
  decimals?: number;
  'data-testid'?: string;
}

const denominateInvalid = (props: DenominateType) => {
  return (
    <span data-testid={props['data-testid'] ? props['data-testid'] : 'denominateComponent'}>
      <span className="int-amount">...</span>
    </span>
  );
};

const denominateValid = (props: DenominateType, erdLabel: string) => {
  const { value, showLastNonZeroDecimal = false, showErd = true } = props;
  const decimals = props.decimals !== undefined ? props.decimals : configDecimals;

  const denominatedValue = denominate({
    input: value,
    denomination,
    decimals,
    showLastNonZeroDecimal,
  });

  const valueParts = denominatedValue.split('.');
  const hasNoDecimals = valueParts.length === 1;
  const isNotZero = denominatedValue !== '0';

  if (decimals > 0 && hasNoDecimals && isNotZero) {
    let zeros = '';

    for (let i = 1; i <= decimals; i++) {
      zeros = zeros + '0';
    }

    valueParts.push(zeros);
  }

  return (
    <span data-testid={props['data-testid'] ? props['data-testid'] : 'denominateComponent'}>
      <span className="int-amount">{valueParts[0]}</span>
      {valueParts.length > 1 && <span className="decimals">.{valueParts[1]}</span>}
      {showErd && <span className="symbol">&nbsp;{erdLabel}</span>}
    </span>
  );
};

const Denominate = (props: DenominateType) => {
  const {
    activeNetwork: { erdLabel },
  } = useGlobalState();
  const { value } = props;

  return isNaN(parseFloat(value)) ? denominateInvalid(props) : denominateValid(props, erdLabel);
};

export default Denominate;
