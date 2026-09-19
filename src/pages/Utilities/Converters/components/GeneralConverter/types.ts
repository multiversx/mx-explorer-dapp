export enum DecoderEnum {
  bech32ToHex = 'bech32-to-hex',
  hexToBech32 = 'hex-to-bech32',
  decimalToHex = 'decimal-to-hex',
  hexToDecimal = 'hex-to-decimal',
  decimalToBase64 = 'decimal-to-base64',
  base64ToDecimal = 'base64-to-decimal',
  amountToDenominated = 'amount-to-denominated',
  denominatedToAmount = 'denominated-to-amount',
  stringToHex = 'string-to-hex',
  hexToString = 'hex-to-string',
  stringToBase64 = 'string-to-base64',
  base64ToString = 'base64-to-string',
  hexToBase64 = 'hex-to-base64',
  base64ToHex = 'base64-to-hex',
  smartTx = 'smart-tx'
}

export interface DecoderType {
  identifier: DecoderEnum;
  label: string;
  decode: (value: string) => string | undefined;
}

export interface DecodedResultType {
  identifier: DecoderEnum;
  label: string;
  result: string;
}

export interface DecodedChunkType {
  input: string;
  isFunctionName: boolean;
  results: DecodedResultType[];
  start: number;
  end: number;
}
