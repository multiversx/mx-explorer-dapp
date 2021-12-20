import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchange } from '@fortawesome/pro-regular-svg-icons/faExchange';
import { CopyButton, Trim, DataDecode } from 'sharedComponents';
import { EventType } from 'helpers/types';

const EventTopics = ({ topics }: { topics: EventType['topics'] }) => {
  const mergedTopics = topics.filter((topic) => topic).join('\n');

  return <DataDecode value={mergedTopics} />;
};

const EventsList = ({ events }: { events: EventType[] }) => {
  return (
    <div className="events-list detailed-list d-flex flex-column mt-1">
      {events.map((event: EventType, i) => {
        return (
          <div key={i} className="detailed-item d-flex border-left border-bottom ml-3 py-3">
            <div className="transaction-icon">
              <FontAwesomeIcon icon={faExchange} />
            </div>

            <div className="detailed-item-content">
              {event.address !== undefined && (
                <div className="row mb-3 d-flex flex-column flex-sm-row">
                  <div className="col col-left">Address</div>
                  <div className="col d-flex align-items-center">
                    <Trim text={event.address} />
                    <CopyButton text={event.address} className="side-action ml-2" />
                  </div>
                </div>
              )}

              {event.identifier !== undefined && (
                <div className="row mb-3 d-flex flex-column flex-sm-row">
                  <div className="col col-left">Identifier</div>
                  <div className="col d-flex align-items-center">{event.identifier}</div>
                </div>
              )}

              {event.topics !== undefined && event.topics.length > 0 && (
                <div className="row mb-3 d-flex flex-column flex-sm-row">
                  <div className="col col-left">Topics</div>
                  <div className="col d-flex flex-column">
                    <EventTopics topics={event.topics} />
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
