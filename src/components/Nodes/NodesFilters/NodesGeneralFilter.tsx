import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Anchor, Dropdown } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { faFilter } from 'icons/regular';
import { faFilter as faFilterSolid } from 'icons/solid';
import { NodeTypeEnum } from 'types';

export const NodesGeneralFilter = ({ text }: { text: React.ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    online,
    page,
    size,
    fullHistory,
    issues,
    isAuctioned,
    isAuctionDangerZone,
    isQualified,
    ...rest
  } = Object.fromEntries(searchParams);

  const resetFiltersLink = () => {
    const nextUrlParams = {
      ...rest
    };

    setSearchParams(nextUrlParams);
  };

  const onlineLink = (onlineValue: string) => {
    const nextUrlParams = {
      ...rest,
      ...(issues ? { issues } : {}),
      ...(fullHistory ? { fullHistory } : {}),
      ...(onlineValue ? { online: onlineValue } : {})
    };

    setSearchParams(nextUrlParams);
  };

  const issuesLink = (issuesValue: boolean) => {
    const nextUrlParams = {
      ...rest,
      ...(online !== undefined ? { online } : {}),
      ...(issuesValue
        ? { issues: String(issuesValue), type: NodeTypeEnum.validator }
        : {})
    };

    setSearchParams(nextUrlParams);
  };

  const fullHistoryLink = (fullHistoryValue: boolean) => {
    const nextUrlParams = {
      ...rest,
      ...(online !== undefined ? { online } : {}),
      ...(fullHistoryValue
        ? { fullHistory: String(fullHistoryValue), type: NodeTypeEnum.observer }
        : {})
    };

    setSearchParams(nextUrlParams);
  };

  const isFiltered = [online, issues, fullHistory].some(
    (filter) => filter !== undefined
  );

  return (
    <div>
      <Dropdown
        className='d-inline-flex'
        onSelect={(eventKey: string | null) => {
          switch (eventKey) {
            case 'issues':
              return issuesLink(true);
            case 'fullHistory':
              return fullHistoryLink(true);
            case 'all':
              return resetFiltersLink();
            default:
              return onlineLink(eventKey ?? '');
          }
        }}
      >
        <Dropdown.Toggle className='btn-general-filter btn-dark-980 no-toggle ms-n2 my-n2 me-2'>
          <FontAwesomeIcon
            icon={isFiltered ? faFilterSolid : faFilter}
            className={isFiltered ? 'text-primary' : ''}
          />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item as={Anchor} eventKey='all'>
            All
          </Dropdown.Item>
          <Dropdown.Item
            as={Anchor}
            eventKey='true'
            className={`dropdown-item ${online === 'true' ? 'active' : ''}`}
          >
            Online
          </Dropdown.Item>
          <Dropdown.Item
            as={Anchor}
            eventKey='false'
            className={`dropdown-item ${online === 'false' ? 'active' : ''}`}
          >
            Offline
          </Dropdown.Item>
          <Dropdown.Item
            as={Anchor}
            eventKey='issues'
            className={`dropdown-item ${issues ? 'active' : ''}`}
          >
            Issues
          </Dropdown.Item>
          <Dropdown.Item
            as={Anchor}
            eventKey='fullHistory'
            className={`dropdown-item ${fullHistory ? 'active' : ''}`}
          >
            Full History
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {text}
    </div>
  );
};
