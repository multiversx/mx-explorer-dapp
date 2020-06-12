import { useGlobalState } from 'context';
import React from 'react';
import BrandTable from './BrandTable';
import ValidatorsLayout from './../ValidatorsLayout';

const ValidatorsBrandTable = () => {
  const { validatorData, brandData } = useGlobalState();
  return (
    <ValidatorsLayout>
      <BrandTable allValidators={validatorData.validators} brandData={brandData} />
    </ValidatorsLayout>
  );
};

export default ValidatorsBrandTable;
