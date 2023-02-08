import React from 'react';
import { faDocker, faRust } from '@fortawesome/free-brands-svg-icons';
import { faCogs } from '@fortawesome/pro-solid-svg-icons';

import { CardItem, Trim } from 'components';
import { VerifiedContractType } from 'types';

export const ContractCards = ({
  contract
}: {
  contract: VerifiedContractType;
}) => {
  const abi = contract?.source?.abi;

  return (
    <div className='card bg-neutral-900'>
      <div className='card-header'>
        <h5 className='mb-0'>Build Info</h5>
      </div>
      <div className='card-body'>
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
          {contract?.dockerImage && (
            <CardItem title='Docker Image' icon={faDocker} className='double'>
              {contract.dockerImage}
            </CardItem>
          )}
        </div>
        <h6 className='px-3 py-2 rounded bg-table-header mt-2'>Rust</h6>
        <div className='card-item-container'>
          {abi?.buildInfo?.rustc?.channel && (
            <CardItem title='Channel' icon={faRust}>
              {abi.buildInfo.rustc.channel}
            </CardItem>
          )}
          {abi?.buildInfo?.rustc?.commitDate && (
            <CardItem title='Commit Date' icon={faRust}>
              {abi.buildInfo.rustc.commitDate}
            </CardItem>
          )}
          {abi?.buildInfo?.rustc?.version && (
            <CardItem title='version' icon={faRust}>
              {abi.buildInfo.rustc.version}
            </CardItem>
          )}
          {abi?.buildInfo?.rustc?.short && (
            <CardItem title='short' icon={faRust}>
              {abi.buildInfo.rustc.short}
            </CardItem>
          )}
          {abi?.buildInfo?.rustc?.commitHash && (
            <CardItem title='Commit Hash' icon={faRust}>
              <Trim text={abi.buildInfo.rustc.commitHash} />
            </CardItem>
          )}
        </div>
      </div>
    </div>
  );
};
