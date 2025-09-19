import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  AccountLink,
  CopyButton,
  DataDecode,
  DetailItem,
  Loader,
  NetworkLink,
  PageState,
  ShardLink,
  TimeAgo
} from 'components';
import { formatDate, isContract, urlBuilder } from 'helpers';
import { useAdapter } from 'hooks';
import { faExchange } from 'icons/regular';
import { EventExtraData } from 'pages/TransactionDetails/components/EventsList/EventExtraData';
import { UIEventType } from 'types';

export const EventDetails = () => {
  const params: any = useParams();
  const { hash: txHash } = params;

  const { getEvent } = useAdapter();

  const [event, setEvent] = useState<UIEventType | undefined>();
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const decodedTopics = useMemo(() => {
    if (!event?.topics) {
      return [];
    }

    return event?.topics.map((data) => {
      const dataHexBuffer = Buffer.from(String(data), 'hex');
      return dataHexBuffer.toString('base64');
    });
  }, [event?.topics]);

  const decodedAdditionalData = useMemo(() => {
    if (!event?.additionalData) {
      return [];
    }

    return event?.additionalData.map((data) => {
      const dataHexBuffer = Buffer.from(String(data), 'hex');
      return dataHexBuffer.toString('base64');
    });
  }, [event?.additionalData]);

  const txDetailsLink = useMemo(() => {
    if (!event?.txHash) {
      return '';
    }

    const transactionDetailsRoute = event?.txHash?.split('-');

    return urlBuilder.transactionDetailsLogs(transactionDetailsRoute[0], {
      id: transactionDetailsRoute[0],
      order: Number(transactionDetailsRoute[2] ?? 0)
    });
  }, [event?.txHash]);

  const fetchEvent = () => {
    if (txHash) {
      getEvent(txHash).then(({ success, data }) => {
        setEvent(data);
        setDataReady(success);
      });
    }
  };

  useEffect(fetchEvent, [txHash]);

  if (dataReady === undefined) {
    return <Loader />;
  }

  if (dataReady === false || !event) {
    return (
      <PageState
        icon={faExchange}
        title='Unable to find this Event'
        description={
          <div className='px-spacer'>
            <span className='text-break-all'>{txHash}</span>
          </div>
        }
        isError
      />
    );
  }

  return (
    <div className='container page-content'>
      <div className='row'>
        <div className='col-12'>
          <div className='event-info card'>
            <div className='card-header'>
              <div className='card-header-item d-flex align-items-center'>
                <h5
                  data-testid='title'
                  className='mb-0 d-flex align-items-center'
                >
                  Event Details
                </h5>
              </div>
            </div>
            <div className='card-body'>
              {event.txHash && (
                <DetailItem title='Tx Hash'>
                  <div className='d-flex align-items-center text-break-all text-neutral-100'>
                    <NetworkLink
                      to={txDetailsLink}
                      className='detailed-item-icon'
                    >
                      {event.txHash.split('-')[0]}
                    </NetworkLink>
                    <CopyButton text={event.txHash.split('-')[0]} />
                  </div>
                </DetailItem>
              )}
              <DetailItem title='Age' className='text-neutral-400'>
                {event.timestamp ? (
                  <div className='d-flex flex-wrap align-items-center'>
                    <TimeAgo value={event.timestamp} />
                    &nbsp;
                    <span>({formatDate(event.timestamp, false, true)})</span>
                  </div>
                ) : (
                  <span>N/A</span>
                )}
              </DetailItem>
              <DetailItem title='Log Address'>
                <div className='d-flex flex-column'>
                  <div className='d-flex align-items-center'>
                    {isContract(event.logAddress) && (
                      <span className='me-2 text-neutral-400'>Contract</span>
                    )}
                    <AccountLink address={event.logAddress} />
                    <CopyButton className='me-2' text={event.logAddress} />
                  </div>
                </div>
              </DetailItem>
              <DetailItem title='Identifier'>
                <div className='badge badge-outline badge-outline-green-alt text-truncate mw-inherit'>
                  {event.identifier}
                </div>
              </DetailItem>
              <DetailItem title='Address'>
                <div className='d-flex flex-column'>
                  <div className='d-flex align-items-center'>
                    {isContract(event.address) && (
                      <span className='me-2 text-neutral-400'>Contract</span>
                    )}
                    <AccountLink address={event.address} hasHighlight />
                    <CopyButton className='me-2' text={event.address} />
                  </div>
                </div>
              </DetailItem>
              <DetailItem title='Shard'>
                <ShardLink shard={event.shardID} className='flex-shrink-0' />
              </DetailItem>
              <DetailItem title='Tx Order'>{event.txOrder}</DetailItem>
              <DetailItem title='Order'>{event.order}</DetailItem>
              {decodedTopics.length > 0 && (
                <DetailItem title='Topics'>
                  <EventExtraData
                    data={decodedTopics}
                    identifier={event.identifier}
                  />
                </DetailItem>
              )}
              {event.data && (
                <DetailItem title='Data'>
                  <DataDecode value={event.data} />
                </DetailItem>
              )}
              {decodedAdditionalData.length > 0 && (
                <DetailItem title='Additional Data'>
                  <EventExtraData
                    data={decodedAdditionalData}
                    identifier={event.identifier}
                  />
                </DetailItem>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
