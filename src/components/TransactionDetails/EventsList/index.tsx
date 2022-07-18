import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchange } from '@fortawesome/pro-regular-svg-icons/faExchange';
import { useLocation } from 'react-router-dom';

import { CopyButton, Trim, DataDecode } from 'sharedComponents';
import { DecodeMethodType } from 'sharedComponents/DataDecode';
import { EventType } from 'helpers/types';

const EventTopics = ({ topics }: { topics: EventType['topics'] }) => {
  const mergedTopics = topics.filter((topic) => topic).join('\n');

  return <DataDecode value={mergedTopics} />;
};

const EventsList = ({ events, id }: { events: EventType[]; id?: string }) => {
  const { hash } = useLocation();
  const ref = React.useRef<HTMLDivElement>(null);

  const hashValues = hash.split('/');
  const formattedHash = hashValues[0] ? hashValues[0].replace('#', '') : '';
  const eventOrder = hashValues[1] ?? 0;
  const initialDecodeMethod = hashValues[2] ?? DecodeMethodType.raw;

  React.useEffect(() => {
    if (ref.current && ref.current !== null) {
      window.scrollTo({
        top: ref.current.getBoundingClientRect().top - 70,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    <div className="events-list detailed-list d-flex flex-column mt-1">
      {events.map((event: EventType, i) => {
        const dataBase64Buffer = Buffer.from(String(event?.data), 'base64');
        const dataHexValue = dataBase64Buffer.toString('hex');
        const highlightTx = formattedHash === id && event.order === Number(eventOrder);

        return (
          <div
            key={i}
            className={`detailed-item d-flex border-left border-bottom ml-3 py-3 ${
              highlightTx ? 'highlighted' : ''
            }`}
            {...(highlightTx ? { ref: ref } : {})}
          >
            <div className="transaction-icon">
              <FontAwesomeIcon icon={faExchange} />
            </div>

            <div className="detailed-item-content">
              {event.address !== undefined && (
                <div className="row mb-3 d-flex flex-column flex-sm-row">
                  <div className="col-sm-2 col-left">Address</div>
                  <div className="col-sm-10 d-flex align-items-center">
                    <Trim text={event.address} />
                    <CopyButton text={event.address} className="side-action ml-2" />
                  </div>
                </div>
              )}

              {event.identifier !== undefined && (
                <div className="row mb-3 d-flex flex-column flex-sm-row">
                  <div className="col-sm-2 col-left">Identifier</div>
                  <div className="col-sm-10 d-flex align-items-center">{event.identifier}</div>
                </div>
              )}

              {event.topics !== undefined && event.topics.length > 0 && (
                <div className="row mb-3 d-flex flex-column flex-sm-row">
                  <div className="col-sm-2 col-left">Topics</div>
                  <div className="col-sm-10 d-flex flex-column">
                    <EventTopics topics={event.topics} />
                  </div>
                </div>
              )}

              {event.data !== undefined && (
                <div className="row mb-3 d-flex flex-column flex-sm-row">
                  <div className="col-sm-2 col-left">Data</div>
                  <div className="col-sm-10 d-flex flex-column">
                    <DataDecode
                      value={dataHexValue}
                      {...(highlightTx ? { initialDecodeMethod } : {})}
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

export default EventsList;
