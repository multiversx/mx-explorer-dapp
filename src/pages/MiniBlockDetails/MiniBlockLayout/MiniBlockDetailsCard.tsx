import React from 'react';
import { useSelector } from 'react-redux';

import {
  Trim,
  NetworkLink,
  DetailItem,
  ShardSpan,
  CopyButton
} from 'components';
import { urlBuilder } from 'helpers';
import { miniBlockSelector } from 'redux/selectors';

export const MiniBlockDetailsCard = () => {
  const {
    senderShard,
    receiverShard,
    senderBlockHash,
    receiverBlockHash,
    type,
    miniBlockHash
  } = useSelector(miniBlockSelector);

  return miniBlockHash ? (
    <div className='miniblock-details-card row mb-3'>
      <div className='col-12'>
        <div className='card'>
          <div className='card-header'>
            <div className='card-header-item d-flex align-items-center'>
              <h5
                data-testid='title'
                className='mb-0 d-flex align-items-center'
              >
                MiniBlock Details
              </h5>
            </div>
          </div>
          <div className='card-body'>
            <DetailItem title='Miniblock Hash'>
              <div className='d-flex align-items-center text-break-all'>
                {miniBlockHash}
                <CopyButton text={miniBlockHash} />
              </div>
            </DetailItem>
            <DetailItem title='Sender Shard'>
              <div className='d-flex'>
                <NetworkLink to={urlBuilder.shard(senderShard)}>
                  <ShardSpan shard={senderShard} />
                </NetworkLink>
              </div>
            </DetailItem>

            <DetailItem title='Receiver Shard'>
              <div className='d-flex'>
                <NetworkLink to={urlBuilder.shard(receiverShard)}>
                  <ShardSpan shard={receiverShard} />
                </NetworkLink>
              </div>
            </DetailItem>

            <DetailItem title='Sender Block'>
              <div className='d-flex align-items-center'>
                {senderBlockHash !== '' ? (
                  <NetworkLink
                    className='trim-wrapper'
                    to={`/blocks/${senderBlockHash}`}
                  >
                    <Trim text={senderBlockHash} />
                  </NetworkLink>
                ) : (
                  <span className='text-neutral-400'>N/A</span>
                )}
              </div>
            </DetailItem>

            <DetailItem title='Receiver Block'>
              <div className='d-flex align-items-center'>
                {receiverBlockHash !== '' ? (
                  <NetworkLink
                    className='trim-wrapper'
                    to={`/blocks/${receiverBlockHash}`}
                  >
                    <Trim text={receiverBlockHash} />
                  </NetworkLink>
                ) : (
                  <span className='text-neutral-400'>N/A</span>
                )}
              </div>
            </DetailItem>

            <DetailItem title='Type'>{type}</DetailItem>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
