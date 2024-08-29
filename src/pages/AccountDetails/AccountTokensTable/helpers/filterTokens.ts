import { TokenTypeEnum } from 'types';

import { ProcessedTokenType } from '../helpers';

export interface FilterTokensType {
  tokens: ProcessedTokenType[];
  type?: TokenTypeEnum;
  search?: string;
}

export const filterTokens = ({ tokens, type, search }: FilterTokensType) => {
  const searchTerm = (term?: string) => {
    if (!search) {
      return true;
    }

    if (!term) {
      return false;
    }

    return term.toLowerCase().includes(search.toLowerCase());
  };

  return tokens
    .filter((token) => !type || token.type === type)
    .filter(({ name, identifier, assets }) => {
      if (!search) {
        return true;
      }

      return (
        searchTerm(name) ||
        searchTerm(identifier) ||
        searchTerm(assets?.description) ||
        searchTerm(assets?.name)
      );
    });
};
