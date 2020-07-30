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
    activeTestnet: { denomination, decimals },
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
      {showErd && <> EGLD</>}
    </>
  );
};

export default Denominate;
