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
    <ValidatorsLayout title="Validators">
      <Table {...validatorData} validatorDetails={validatorDetails || false} />
    </ValidatorsLayout>
  );
};

export default ValidatorsTable;
