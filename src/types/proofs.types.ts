import { SliceType } from './general.types';
import { TokenAssetType } from './token.types';

export interface ProofType {
  identifier: string;
  collectionId?: string;
  name?: string;
  nonce?: number;
  properties?: Record<string, string>;
  tags?: string[];
  uris?: string[];
  hash?: string;
  creator?: string;

  // ??
  assets?: TokenAssetType;
}

export interface ProofSliceType extends SliceType {
  proofState: ProofType;
}
