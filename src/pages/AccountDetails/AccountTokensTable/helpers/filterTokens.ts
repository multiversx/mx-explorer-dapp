import { TokenTypeEnum } from 'types';

import { ProcessedTokenType } from './processTokens';

export interface FilterTokensType {
  tokens: ProcessedTokenType[];
  type?: TokenTypeEnum;
  search?: string;
}

export const filterTokens = ({ tokens, type, search }: FilterTokensType) => {
  const searchTerm = (term?: string) => {
    if (!search || !term) {
      return true;
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
