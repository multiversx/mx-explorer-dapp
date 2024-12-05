import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Anchor, Dropdown } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { faFilter } from 'icons/regular';
import { faFilter as faFilterSolid } from 'icons/solid';
import { TransactionInPoolTypeEnum } from 'types';

export const TransactionInPoolTypeFilter = ({
  text,
  hideFilters
}: {
  text: React.ReactNode;
  hideFilters?: boolean;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    type = TransactionInPoolTypeEnum.Transaction,
    page,
    size,
    ...rest
  } = Object.fromEntries(searchParams);

  const typeLink = (type: TransactionInPoolTypeEnum) => {
    const nextUrlParams = {
      ...rest,
      ...(type ? { type } : {})
    };

    setSearchParams(nextUrlParams);
  };

  if (hideFilters) {
    return text;
  }

  return (
    <div
      className={classNames({
        'text-primary-100': type !== undefined
      })}
    >
      {text}
      <Dropdown
        className='d-inline-flex'
        onSelect={(eventKey: any) => {
          return typeLink(eventKey ?? '');
        }}
      >
        <Dropdown.Toggle
          className='btn-link-unstyled side-action cursor-pointer'
          variant='link'
        >
          <FontAwesomeIcon
            icon={type !== undefined ? faFilterSolid : faFilter}
            className={type !== undefined ? 'text-primary' : ''}
          />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {Object.keys(TransactionInPoolTypeEnum).map(
            (transactionType, key) => {
              return (
                <Dropdown.Item
                  as={Anchor}
                  eventKey={transactionType}
                  className={`dropdown-item ${
                    type === transactionType ? 'active' : ''
                  }`}
                  key={key}
                >
                  {transactionType}
                </Dropdown.Item>
              );
            }
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};
