import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchange } from '@fortawesome/pro-regular-svg-icons/faExchange';
import { faCaretRight } from '@fortawesome/pro-solid-svg-icons/faCaretRight';
import decodeTopic from './helpers/decodeTopic';
import { CopyButton, Trim } from 'sharedComponents';

export interface EventType {
  address: string;
  identifier: string;
  topics: string[];
}

const EventTopics = ({ topics }: { topics: EventType['topics'] }) => {
  const [topicList, setTopicList] = React.useState<string[]>(topics);
  const [isDecoded, setIsDecoded] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (isDecoded) {
      const decodedTopics = topics.map((topic) => decodeTopic(topic));
      setTopicList(decodedTopics);
    } else {
      setTopicList(topics);
    }
  }, [isDecoded, topics]);

  return (
    <>
      {topicList.map((topic, index) => (
        <>
          {topic && (
            <div className="text-break d-flex align-items-center" key={`${topic}-${index}`}>
              <FontAwesomeIcon icon={faCaretRight} size="xs" className="text-secondary mr-2" />
              {topic}
            </div>
          )}
        </>
      ))}
      <div className="d-flex flex-row mt-3">
        <button
          type="button"
          onClick={() => {
            setIsDecoded(true);
          }}
          className="mr-3"
        >
          Decode
        </button>
        <button
          type="button"
          onClick={() => {
            setIsDecoded(false);
          }}
          className="mr-3"
        >
          Reset
        </button>
      </div>
    </>
  );
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
