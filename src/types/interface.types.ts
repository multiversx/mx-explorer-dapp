import { SortOrderEnum } from './general.types';
import { WithClassnameType } from './withClassname.types';

export enum ThemesEnum {
  default = 'default',
  testnet = 'testnet'
}

export interface TableFilterUIType extends WithClassnameType {
  text: React.ReactNode;
  hideFilters?: boolean;
  defaultActive?: boolean;
  defaultOrder?: SortOrderEnum;
}

export interface NotificationType {
  id: string;
  text: string;
  priority: number;
  bgClassName: string;
  dismissable: boolean;
}

export interface ShardType {
  shard: number;
  validators: number;
  activeValidators: number;
}
