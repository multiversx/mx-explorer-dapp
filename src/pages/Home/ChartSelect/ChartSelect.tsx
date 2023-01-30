import React from 'react';
import classNames from 'classnames';
import Select, { components } from 'react-select';

import styles from './styles.module.scss';
import type { ChartSelectPropsType } from './types';

const Control: typeof components.Control = (props) => (
  <components.Control
    {...props}
    className={classNames(styles.control, {
      [styles.expanded]: props.selectProps.menuIsOpen
    })}
  />
);

const ValueContainer: typeof components.ValueContainer = (props) => (
  <components.ValueContainer {...props} className={styles.value} />
);

const SingleValue: typeof components.SingleValue = (props) => (
  <components.SingleValue {...props} className={styles.single} />
);

const Menu: typeof components.Menu = (props) => (
  <components.Menu {...props} className={styles.menu} />
);

const MenuList: typeof components.MenuList = (props) => (
  <components.MenuList {...props} className={styles.list} />
);

const Option: typeof components.Option = (props) => (
  <components.Option
    {...props}
    className={classNames(styles.option, {
      [styles.selected]: props.isSelected,
      [styles.hover]: props.isFocused
    })}
  />
);

const IndicatorsContainer: typeof components.IndicatorsContainer = (props) => (
  <components.IndicatorsContainer
    {...props}
    className={classNames(styles.indicator, {
      [styles.expanded]: props.selectProps.menuIsOpen
    })}
  />
);

export const ChartSelect = (props: ChartSelectPropsType) => (
  <Select
    {...props}
    className={styles.select}
    isMulti={false}
    isSearchable={false}
    defaultValue={props.options.find(() => true)}
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
