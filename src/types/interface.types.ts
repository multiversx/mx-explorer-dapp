export enum ThemesEnum {
  default = 'default',
  testnet = 'testnet'
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
