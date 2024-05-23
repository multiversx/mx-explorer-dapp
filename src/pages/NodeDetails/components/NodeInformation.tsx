import {
  NetworkLink,
  Trim,
  CopyButton,
  CardItem,
  FormatAmount,
  LockedAmountTooltip,
  AccountLink,
  ShardLink
} from 'components';
import { urlBuilder, getNodeIcon } from 'helpers';
import { faFlagAlt } from 'icons/regular';
import {
  faCogs,
  faExclamationTriangle,
  faLayerGroup,
  faStream,
  faLock,
  faServer,
  faCheck,
  faCode,
  faUser
} from 'icons/solid';
import { NodeType, NodeTypeEnum } from 'types';

import { Alert } from './Alert';

export const NodeInformation = ({ nodeData }: { nodeData: NodeType }) => {
  const {
    bls,
    type,
    shard,
    version,
    name,
    nonce,
    instances,
    provider,
    status,
    locked,
    topUp,
    stake,
    issues,
    position,
    fullHistory,
    owner,
    auctionQualified,
    auctionTopUp
  } = nodeData;

  const versionOudated =
    version === undefined || (issues && issues.includes('versionMismatch'));

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-header-item'>
          <h5 data-testid='title' className='mb-0 d-flex align-items-center'>
            Node Details
          </h5>
        </div>
        <div className='card-header-item compact card card-sm bg-table-header p-3 d-flex flex-row align-items-center mt-3'>
          <span className='flex-shrink-0 text-neutral-400 me-2'>
            Public Key:
          </span>

          <div className='d-flex flex-column min-w-0'>
            <div className='d-flex align-items-center'>
              <Trim text={bls} />
              <CopyButton text={bls} className='ms-2' />
            </div>
            <Alert node={nodeData} />
          </div>
        </div>
      </div>
      <div className='card-body card-item-container my-n2 mx-spacing'>
        <CardItem title='Shard' icon={faLayerGroup}>
          <ShardLink shard={shard} data-testid='shardLink' />
        </CardItem>
        <CardItem
          title='Version'
          icon={versionOudated ? faExclamationTriangle : faCheck}
        >
          <span data-testid='version'>{version ? version : <>N/A</>}</span>
        </CardItem>
        <CardItem
          title='Instances'
          icon={instances !== 1 ? faExclamationTriangle : faCheck}
        >
          {instances ? instances : <>N/A</>}
        </CardItem>
        <CardItem title='Name' icon={faServer}>
          {name ? name : <>N/A</>}
        </CardItem>
        <CardItem title='Type' icon={getNodeIcon(nodeData) || faCogs}>
          <>
            {type === NodeTypeEnum.observer && (
              <>Observer {Boolean(fullHistory) ? ' - Full History' : ''}</>
            )}
            {type !== NodeTypeEnum.observer && (
              <>
                Validator{' '}
                <span className='text-neutral-400 ms-1'>({status})</span>
              </>
            )}
          </>
        </CardItem>
        <CardItem title='Nonce' icon={faStream}>
          {nonce ? nonce : <>N/A</>}
        </CardItem>
        {type !== NodeTypeEnum.observer && locked !== undefined && (
          <CardItem title='Locked' icon={faLock}>
            <div className='d-flex align-items-center'>
              <FormatAmount value={locked} />
              <LockedAmountTooltip
                lockedDetails={[
                  { label: 'Stake', value: <FormatAmount value={stake} /> },
                  {
                    label: 'Top Up',
                    value: <FormatAmount value={topUp} />
                  },
                  ...(auctionQualified && auctionTopUp
                    ? [
                        {
                          label: 'Qualified Top Up',
                          value: <FormatAmount value={auctionTopUp} />
                        }
                      ]
                    : [])
                ]}
              />
            </div>
          </CardItem>
        )}
        {position !== undefined && position > 0 && (
          <CardItem title='Queue Position' icon={faFlagAlt}>
            {position.toLocaleString('en')}
          </CardItem>
        )}
        {provider ? (
          <CardItem title='Provider' icon={faCode}>
            <div className='d-flex align-items-center min-w-0'>
              <NetworkLink
                to={urlBuilder.providerDetails(provider)}
                className='trim-wrapper'
              >
                <Trim text={provider} />
              </NetworkLink>
              <CopyButton text={provider} />
            </div>
          </CardItem>
        ) : (
          <>
            {owner && (
              <CardItem title='Owner' icon={faUser}>
                <div className='d-flex align-items-center min-w-0'>
                  <AccountLink address={owner} />
                  <CopyButton text={owner} />
                </div>
              </CardItem>
            )}
          </>
        )}
      </div>
    </div>
  );
};
