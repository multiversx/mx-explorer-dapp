import * as React from 'react';
import anchorme from 'anchorme';
import axios from 'axios';
import { useGlobalState, useGlobalDispatch } from 'context';
import { extrasApi } from 'appConfig';

const useScamDetect = () => {
  const { urlBlacklist } = useGlobalState();
  const dispatch = useGlobalDispatch();
  const blacklist: string[] = urlBlacklist ? urlBlacklist : [];

  React.useEffect(() => {
    if (urlBlacklist === undefined) {
      axios.get(`${extrasApi}/blacklist`).then(({ data }) => {
        dispatch({ type: 'setUrlBlacklist', urlBlacklist: data });
      });
    }
  }, [dispatch, urlBlacklist]);

  return scamDetect(blacklist);
};

export const scamDetect = (blacklist: string[]) => (input: string) => {
  if (input.length > 1000) {
    return input;
  }

  let output = input.normalize('NFKC');

  // eslint-disable-next-line
  const clean = output.toLocaleLowerCase().replace(/[^\x00-\x7F]/g, '');

  if (
    anchorme.list(clean.replace(/\s/g, '')).length ||
    blacklist.filter((item) => input.includes(item)).length ||
    blacklist.filter((item) => clean.includes(item)).length
  ) {
    output = '[Message hidden due to suspicious content]';
  }

  return output;
};

export default useScamDetect;
