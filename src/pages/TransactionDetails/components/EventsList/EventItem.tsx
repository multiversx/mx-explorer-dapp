import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  CopyButton,
  DataDecode,
  DecodeMethodEnum,
  AccountLink,
  NetworkLink
} from 'components';
import { urlBuilder } from 'helpers';
import {
  useActiveRoute,
  useGetTransactionUrlHashParams,
  useScrollToTransactionSection
} from 'hooks';
import { faExchange, faSearch } from 'icons/regular';
import { transactionsRoutes } from 'routes';
import { EventType } from 'types';

import { EventExtraData } from './EventExtraData';

interface EventItemUIType {
  event: EventType;
  txHash: string;
  id: string;
}

export const EventItem = ({ event, txHash, id }: EventItemUIType) => {
  const ref = useRef<HTMLDivElement>(null);
  const activeRoute = useActiveRoute();
  const {
    hashId,
    hashIndex,
    hashDecodeMethod,
    secondHashDecodeMethod,
    thirdHashDecodeMethod
  } = useGetTransactionUrlHashParams();

  const highlightEvent =
    hashId === id &&
    event.order === Number(hashIndex) &&
    activeRoute(transactionsRoutes.transactionDetailsLogs);

  const [topicsDecodeMethod, setTopicsDecodeMethod] = useState<string>(
    highlightEvent ? hashDecodeMethod : DecodeMethodEnum.raw
  );
  const [dataDecodeMethod, setDataDecodeMethod] = useState<string>(
    highlightEvent ? secondHashDecodeMethod : DecodeMethodEnum.raw
  );
  const [additionalDataDecodeMethod, setAdditionalDataDecodeMethod] =
    useState<string>(
      highlightEvent ? thirdHashDecodeMethod : DecodeMethodEnum.raw
    );

  const dataBase64Buffer = Buffer.from(String(event?.data), 'base64');
  const dataHexValue = dataBase64Buffer.toString('hex');

  const eventLink = `${urlBuilder.transactionDetailsLogs(txHash)}#${id}/${
    event.order
  }/${topicsDecodeMethod}/${dataDecodeMethod}/${additionalDataDecodeMethod}`;

  useScrollToTransactionSection(ref);

  if (!event) {
    return null;
  }

  return (
    <div
      className={`detailed-item d-flex border-start border-bottom ms-3 py-3 ${
        highlightEvent ? 'highlighted' : ''
      }`}
      {...(highlightEvent ? { ref: ref } : {})}
    >
      <NetworkLink to={eventLink} className='detailed-item-icon'>
        <FontAwesomeIcon icon={faSearch} className='hover-icon' />
        <FontAwesomeIcon icon={faExchange} className='default-icon' />
      </NetworkLink>

      <div className='detailed-item-content'>
        {event.address && (
          <div className='row mb-3 d-flex flex-column flex-sm-row'>
            <div className='col-sm-2 col-left'>Address</div>
            <div className='col-sm-10 d-flex align-items-center'>
              <AccountLink address={event.address} hasHighlight />
              <CopyButton text={event.address} className='side-action ms-2' />
            </div>
          </div>
        )}

        {event.identifier && (
          <div className='row mb-3 d-flex flex-column flex-sm-row'>
            <div className='col-sm-2 col-left'>Identifier</div>
            <div className='col-sm-10 d-flex align-items-center'>
              {event.identifier}
            </div>
          </div>
        )}

        {event.topics !== undefined && event.topics.length > 0 && (
          <div className='row mb-3 d-flex flex-column flex-sm-row'>
            <div className='col-sm-2 col-left'>Topics</div>
            <div className='col-sm-10 d-flex flex-column'>
              <EventExtraData
                data={event.topics}
                identifier={event.identifier}
                setDecodeMethod={setTopicsDecodeMethod}
                initialDecodeMethod={topicsDecodeMethod}
              />
            </div>
          </div>
        )}

        {event.data !== undefined && (
          <div className='row mb-3 d-flex flex-column flex-sm-row'>
            <div className='col-sm-2 col-left'>Data</div>
            <div className='col-sm-10 d-flex flex-column'>
              <DataDecode
                value={dataHexValue}
                setDecodeMethod={setDataDecodeMethod}
                initialDecodeMethod={dataDecodeMethod}
              />
            </div>
          </div>
        )}

        {event.additionalData && event.additionalData.length > 0 && (
          <div className='row mb-3 d-flex flex-column flex-sm-row'>
            <div className='col-sm-2 col-left'>Additional Data</div>
            <div className='col-sm-10 d-flex flex-column'>
              <EventExtraData
                data={event.additionalData}
                identifier={event.identifier}
                setDecodeMethod={setAdditionalDataDecodeMethod}
                initialDecodeMethod={additionalDataDecodeMethod}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
