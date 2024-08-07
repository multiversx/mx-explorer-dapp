export * from './apiFields';

export const BRAND_NAME = process.env.VITE_APP_BRAND_NAME ?? 'MultiversX';

export const METACHAIN_SHARD_ID = 4294967295;
export const MAIN_SHARD_ID = 4294967293;
export const ALL_SHARDS_SHARD_ID = 4294967280;

export const TIMEOUT = 10000;
export const REFRESH_RATE = 6000;
export const PAGE_SIZE = 25;
export const MAX_TRANSACTIONS_PAGE_SIZE = 50;
export const MAX_RESULTS = 10000;

export const MAX_DISPLAY_TX_DATA_LENGTH = 1_000_000;
export const MAX_DECODE_TX_DATA_LENGTH = 60_000;
export const MAX_DISPLAY_ZERO_DECIMALS = 5;
export const MAX_ACOUNT_TOKENS_BALANCE = 1000;

export const LOW_LIQUIDITY_DISPLAY_TRESHOLD = 1_000_000;
export const LOW_LIQUIDITY_MARKET_CAP_DISPLAY_TRESHOLD = 10_000_000;

export const AUCTION_LIST_MAX_NODES = 3000;
export const AUCTION_LIST_QUALIFIED_MIN_DISPLAY_ROW_COUNT = 10;
export const AUCTION_LIST_MIN_DISPLAY_ROW_COUNT = 6;

export const LEGACY_DELEGATION_NODES_IDENTITY = 'multiversx';
export const HEROTAG_SUFFIX = '.elrond';
export const TEMP_LOCAL_NOTIFICATION_DISMISSED = 'tempNotificationDismissed2';
export const NEW_VERSION_NOTIFICATION = 'newExplorerVersion';

export const SC_INIT_CHARACTERS_LENGTH = 13;

export const N_A = 'N/A';
export const ZERO = '0';
export const ELLIPSIS = '...';
export const PLACEHOLDER_IMAGE_PATH = 'assets/img/default.png';
export const SVG_PLACEHOLDER_IMAGE_PATH = 'assets/img/default.svg';
export const SVG_ICON_PLACEHOLDER_IMAGE_PATH = 'assets/img/default-icon.svg';

export const DEFAULT_PROVIDER_COLORS: {
  [index: string]: string;
} = {
  multiversx: '#23f7dd',
  binance_staking: '#f2b92e',
  justminingfr: '#f99a28',
  validblocks: '#5e20e5',
  arcstake: '#c816cc',
  moonlorianstake: '#6c4c59',
  sikka_tech: '#ffbe00',
  rosettastake: '#1aaefb',
  middlestakingfr: '#5485a9',
  meria: '#ff592b',
  'staking-vaas': '#e20073',
  trustwallet: '#0500ff'
};
