import classNames from 'classnames';
import { default as ReactSelect, SingleValue, components } from 'react-select';

export interface SelectOptionType {
  label: string;
  value: string;
}

export interface SelectPropsType {
  options: SelectOptionType[];
  value?: SelectOptionType;
  onChange: (option: SingleValue<SelectOptionType>) => void;
  defaultValue?: SelectOptionType;
}

const Control: typeof components.Control = (props) => (
  <components.Control
    {...props}
    className={classNames('control', {
      expanded: props.selectProps.menuIsOpen
    })}
  />
);

const ValueContainer: typeof components.ValueContainer = (props) => (
  <components.ValueContainer {...props} className='value' />
);

const SingleValue: typeof components.SingleValue = (props) => (
  <components.SingleValue {...props} className='single' />
);

const Menu: typeof components.Menu = (props) => (
  <components.Menu {...props} className='menu' />
);

const MenuList: typeof components.MenuList = (props) => (
  <components.MenuList {...props} className='list' />
);

const Option: typeof components.Option = (props) => (
  <components.Option
    {...props}
    className={classNames('option', {
      selected: props.isSelected,
      hover: props.isFocused
    })}
  />
);

const IndicatorsContainer: typeof components.IndicatorsContainer = (props) => (
  <components.IndicatorsContainer
    {...props}
    className={classNames('indicator', {
      expanded: props.selectProps.menuIsOpen
    })}
  />
);

export const Select = (props: SelectPropsType) => (
  <ReactSelect
    {...props}
    className='react-select'
    isMulti={false}
    isSearchable={false}
    defaultValue={props.defaultValue || props.options.find(() => true)}
    components={{
      Menu,
      MenuList,
      Control,
      Option,
      ValueContainer,
      SingleValue,
      IndicatorsContainer,
      IndicatorSeparator: null
    }}
  />
);
