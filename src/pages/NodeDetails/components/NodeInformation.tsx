import {
  ShardSpan,
  NetworkLink,
  Trim,
  CopyButton,
  CardItem,
  Denominate,
  LockedAmountTooltip,
  AccountLink
} from 'components';
import { getIcon } from 'components/NodesTable/components/RowIcon';
import { urlBuilder } from 'helpers';
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
import { NodeType } from 'types';

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
    owner
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
            Public key:
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
          {shard !== undefined ? (
            <NetworkLink to={urlBuilder.shard(shard)} data-testid='shardLink'>
              <ShardSpan shard={shard} />
            </NetworkLink>
          ) : (
            <>N/A</>
          )}
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
        <CardItem title='Type' icon={getIcon(nodeData) || faCogs}>
          <>
            {type === 'observer' && (
              <>Observer {Boolean(fullHistory) ? ' - Full History' : ''}</>
            )}
            {type !== 'observer' && (
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
        {type !== 'observer' && locked !== undefined && (
          <CardItem title='Locked' icon={faLock}>
            <div className='d-flex align-items-center'>
              <span className='me-2'>
                <Denominate value={locked} />
              </span>

              <LockedAmountTooltip
                small
                lockedDetails={[
                  { label: 'Stake', value: <Denominate value={stake} /> },
                  {
                    label: 'Topup',
                    value: <Denominate value={topUp} />
                  }
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
