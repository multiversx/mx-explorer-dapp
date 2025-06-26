import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { CopyButton, DetailItem, Loader, PageState } from 'components';
import { useAdapter } from 'hooks';
import { faExchange } from 'icons/regular';
import { EventType } from 'types';

export const EventDetails = () => {
  const params: any = useParams();
  const { hash: txHash } = params;

  const { getEvent } = useAdapter();

  const [event, setEvent] = useState<EventType | undefined>();
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const fetchTransaction = () => {
    if (txHash) {
      getEvent(txHash).then(({ success, data }) => {
        setEvent(data);
        setDataReady(success);
      });
    }
  };

  useEffect(fetchTransaction, [txHash]);

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
          <div className='transaction-info card'>
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
              <DetailItem title='Hash'>
                <div className='d-flex align-items-center text-break-all text-neutral-100'>
                  {event.txHash}
                  <CopyButton text={event.txHash} />
                </div>
              </DetailItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
