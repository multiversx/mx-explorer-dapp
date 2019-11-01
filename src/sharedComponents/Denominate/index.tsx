import React from 'react';
import { useGlobalState } from '../../context';
import denominate from './denominate';

interface DenominateType {
  value: string;
  showAllDecimals?: boolean;
}

const Denominate = ({ value, showAllDecimals = false }: DenominateType) => {
  const {
    activeTestnet: { denomination, decimals },
  } = useGlobalState();

  const denominatedValue = denominate({
    input: value,
    denomination,
    decimals,
    showAllDecimals,
  });

  return <>{denominatedValue}&nbsp;ERD</>;
};

export default Denominate;
