import React from 'react';
import { faCogs } from '@fortawesome/pro-solid-svg-icons';
import { CardItem } from 'components';
import { ContractAbiType } from 'types';

export const ContractCards = ({ abi }: { abi: ContractAbiType }) => {
  return (
    <div className='card-item-container'>
      {abi?.name && (
        <CardItem title='Name' icon={faCogs}>
          {abi.name}
        </CardItem>
      )}
      {abi?.hasCallback && (
        <CardItem title='Has Callback' icon={faCogs}>
          {String(abi.hasCallback)}
        </CardItem>
      )}
      {abi?.buildInfo?.framework && (
        <CardItem title={abi.buildInfo?.framework?.name} icon={faCogs}>
          {abi.buildInfo?.framework?.version}
        </CardItem>
      )}
      {abi?.buildInfo?.rustc && (
        <CardItem title='Rust C Version' icon={faCogs}>
          {abi.buildInfo?.rustc?.version}
        </CardItem>
      )}
    </div>
  );
};
