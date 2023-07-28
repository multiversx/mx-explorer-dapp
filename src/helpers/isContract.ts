import { SC_INIT_CHARACTERS_LENGTH } from 'appConstants';

export const isContract = (hash: string) => {
  return (
    hash &&
    SC_INIT_CHARACTERS_LENGTH > 0 &&
    hash
      .substring('erd1'.length)
      .startsWith('q'.repeat(SC_INIT_CHARACTERS_LENGTH))
  );
};
