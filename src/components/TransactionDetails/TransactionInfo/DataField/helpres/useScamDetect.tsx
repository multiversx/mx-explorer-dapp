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

// eslint-disable-next-line
const cleanLink = (input: string) => input.toLocaleLowerCase().replace(/[^\x00-\x7F]/g, '');
const cleanAndReplace = (input: string) => cleanLink(input).replace(/\s/g, '');

export const scamDetect = (blacklist: string[]) => (
  input: string
): { output: string; stringWithLinks: string } => {
  if (input.length > 1000) {
    return { output: input, stringWithLinks: '' };
  }

  let output = input.normalize('NFKC');

  const clean = cleanLink(output);
  const cleanedWithReplace = cleanAndReplace(output);

  const allLinks = anchorme.list(clean);

  let parts = [];

  if (allLinks.length > 0) {
    let remainingOutput = output;

    allLinks.forEach((entry, index) => {
      const { string: foundLink } = entry;
      let firstPart = '';
      let lastPart = '';
      let link = `${
        foundLink.startsWith('http://') || foundLink.startsWith('https://')
          ? foundLink
          : `http://${foundLink}`
      }`;

      for (let i = 0; i < remainingOutput.length; i++) {
        const start = remainingOutput.slice(i);
        const [newFoundLink] = anchorme.list(cleanLink(start));
        if (newFoundLink && foundLink === newFoundLink.string) {
          firstPart = remainingOutput.substring(0, i);
        }
      }
      for (let i = output.length; i > 0; i--) {
        const start = remainingOutput.slice(0, i);
        const [newFoundLink] = anchorme.list(cleanLink(start));
        if (newFoundLink && foundLink === newFoundLink.string) {
          lastPart = remainingOutput.substring(i);
        }
      }
      parts.push(firstPart);
      parts.push(link);
      remainingOutput = lastPart;

      if (index === allLinks.length - 1) {
        parts.push(lastPart);
      }
    });
  } else {
    parts.push(input);
  }

  if (
    anchorme.list(cleanedWithReplace).length ||
    blacklist.filter((item) => input.includes(item)).length ||
    blacklist.filter((item) => clean.includes(item)).length
  ) {
    output = '[Message hidden due to suspicious content]';
  }

  return { output, stringWithLinks: parts.join('') };
};

export default useScamDetect;
