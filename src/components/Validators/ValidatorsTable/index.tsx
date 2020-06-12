import { useGlobalState } from 'context';
import React from 'react';
import Table from './Table';
import ValidatorsLayout from './../ValidatorsLayout';

const ValidatorsTable = () => {
  const {
    activeTestnet: { validatorDetails },
    validatorData,
  } = useGlobalState();

  return (
    <ValidatorsLayout>
      <Table {...validatorData} validatorDetails={validatorDetails || false} />
    </ValidatorsLayout>
  );
};

export default ValidatorsTable;
