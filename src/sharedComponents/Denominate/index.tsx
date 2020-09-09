import React from 'react';
import { useGlobalState } from '../../context';
import denominate from './denominate';

interface DenominateType {
  value: string;
  showLastNonZeroDecimal?: boolean;
  showErd?: boolean;
}

const Denominate = ({ value, showLastNonZeroDecimal = false, showErd = true }: DenominateType) => {
  const {
    activeNetwork: { denomination, decimals },
    config: { erdLabel },
  } = useGlobalState();

  const denominatedValue = denominate({
    input: value,
    denomination,
    decimals,
    showLastNonZeroDecimal,
  });

  return (
    <>
      {denominatedValue}
      {showErd && <> {erdLabel}</>}
    </>
  );
};

export default Denominate;
