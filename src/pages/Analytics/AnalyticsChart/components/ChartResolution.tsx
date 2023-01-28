import React, { useEffect } from 'react';
import { Anchor, Dropdown } from 'react-bootstrap';

export type ChartResolutionRangeType = 'year' | 'month' | 'week';

type ChartResolutionItemType = {
  label: string;
  range: ChartResolutionRangeType;
};

export type ChartResolutionType = {
  [key in ChartResolutionRangeType]: {
    label: string;
    range: ChartResolutionRangeType;
  };
};

export const ChartResolution: ChartResolutionType = {
  year: {
    label: '365 days',
    range: 'year'
  },
  month: {
    label: '30 days',
    range: 'month'
  },
  week: {
    label: '7 days',
    range: 'week'
  }
};

type ChartResolutionSelectorProps = {
  value: ChartResolutionRangeType;
  onChange?: (resolution: ChartResolutionItemType) => void;
};

export const ChartResolutionSelector = ({
  value,
  onChange
}: ChartResolutionSelectorProps) => {
  const [activeResolution, setActiveResolution] = React.useState(
    ChartResolution[value] ?? ChartResolution['month']
  );

  useEffect(() => {
    onChange?.(activeResolution);
  }, [activeResolution]);

  return (
    <Dropdown
      className=''
      onSelect={(eventKey: ChartResolutionRangeType | string | null) => {
        return eventKey
          ? setActiveResolution(
              ChartResolution[eventKey as ChartResolutionRangeType]
            )
          : ChartResolution['month'];
      }}
    >
      <Dropdown.Toggle
        variant='dark'
        size='sm'
        className={'py-1 d-flex align-items-center justify-content-between'}
        id='chart-resolution'
      >
        <span className='me-2'>{activeResolution.label}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu style={{ marginTop: '0.35rem', marginBottom: '0.35rem' }}>
        <Dropdown.Item
          as={Anchor} // This is needed due to issues between threejs, react-bootstrap and typescript, what a time to be alive: https://github.com/react-bootstrap/react-bootstrap/issues/6283
          eventKey={ChartResolution['year'].range}
          className={`${
            activeResolution.range === ChartResolution['year'].range
              ? 'active'
              : ''
          }`}
        >
          {ChartResolution['year'].label}
        </Dropdown.Item>
        <Dropdown.Item
          as={Anchor}
          eventKey={ChartResolution['month'].range}
          className={`${
            activeResolution.range === ChartResolution['month'].range
              ? 'active'
              : ''
          }`}
        >
          {ChartResolution['month'].label}
        </Dropdown.Item>
        <Dropdown.Item
          as={Anchor}
          eventKey={ChartResolution['week'].range}
          className={`${
            activeResolution.range === ChartResolution['week'].range
              ? 'active'
              : ''
          }`}
        >
          {ChartResolution['week'].label}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
