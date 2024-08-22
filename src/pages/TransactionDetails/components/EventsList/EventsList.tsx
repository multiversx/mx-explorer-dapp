import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation } from 'react-router-dom';

import { CopyButton, DataDecode, AccountLink } from 'components';
import { DecodeMethodType } from 'components/DataDecode';
import { faExchange } from 'icons/regular';
import { EventType } from 'types';

const EventExtraData = ({
  data,
  identifier
}: {
  data: string[];
  identifier?: string;
}) => {
  const mergedData = data.join('\n');

  return <DataDecode value={mergedData} identifier={identifier} />;
};

export const EventsList = ({
  events,
  id
}: {
  events: EventType[];
  id?: string;
}) => {
  const { hash } = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  const hashValues = hash.split('/');
  const formattedHash = hashValues[0] ? hashValues[0].replace('#', '') : '';
  const eventOrder = hashValues[1] ?? 0;
  const initialDecodeMethod = hashValues[2] ?? DecodeMethodType.raw;

  useEffect(() => {
    setTimeout(() => {
      if (formattedHash && ref.current && ref.current !== null) {
        window.scrollTo({
          top: ref.current.getBoundingClientRect().top - 86,
          behavior: 'smooth'
        });
      }
    }, 200);
  }, [formattedHash]);

  return (
    <div className='events-list detailed-list d-flex flex-column mt-1'>
      {events.map((event: EventType, i) => {
        const dataBase64Buffer = Buffer.from(String(event?.data), 'base64');
        const dataHexValue = dataBase64Buffer.toString('hex');
        const highlightTx =
          formattedHash === id && event.order === Number(eventOrder);

        return (
          <div
            key={i}
            className={`detailed-item d-flex border-start border-bottom ms-3 py-3 ${
              highlightTx ? 'highlighted' : ''
            }`}
            {...(highlightTx ? { ref: ref } : {})}
          >
            <div className='transaction-icon'>
              <FontAwesomeIcon icon={faExchange} />
            </div>

            <div className='detailed-item-content'>
              {event.address !== undefined && (
                <div className='row mb-3 d-flex flex-column flex-sm-row'>
                  <div className='col-sm-2 col-left'>Address</div>
                  <div className='col-sm-10 d-flex align-items-center'>
                    <AccountLink address={event.address} hasHighlight />
                    <CopyButton
                      text={event.address}
                      className='side-action ms-2'
                    />
                  </div>
                </div>
              )}

              {event.identifier !== undefined && (
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
                      {...(highlightTx ? { initialDecodeMethod } : {})}
                    />
                  </div>
                </div>
              )}

              {event.additionalData !== undefined &&
                event.additionalData.length > 0 && (
                  <div className='row mb-3 d-flex flex-column flex-sm-row'>
                    <div className='col-sm-2 col-left'>Additional Data</div>
                    <div className='col-sm-10 d-flex flex-column'>
                      <EventExtraData
                        data={event.additionalData}
                        identifier={event.identifier}
                      />
                    </div>
                  </div>
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
