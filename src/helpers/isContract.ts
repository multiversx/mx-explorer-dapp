import { numInitCharactersForScAddress } from 'appConfig';

export default function isContract(hash: string) {
  return (
    hash &&
    numInitCharactersForScAddress > 0 &&
    hash.substr('erd1'.length).startsWith('q'.repeat(numInitCharactersForScAddress))
  );
}
