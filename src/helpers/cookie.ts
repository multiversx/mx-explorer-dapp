import { CUSTOM_NETWORK_ID } from 'appConstants';
import { DEFAULT_HOSTNAME } from 'config/sharedConfig';

type KeyType = typeof CUSTOM_NETWORK_ID;

const domain = `domain=.${
  import.meta.env.VITE_APP_SHARE_PREFIX
}${DEFAULT_HOSTNAME}`;

export const cookie = {
  saveToCookies: ({
    key,
    data,
    expirationDate
  }: {
    key: KeyType;
    data: string;
    expirationDate: Date;
  }) => {
    const expires = `expires=${expirationDate.toUTCString()}`;
    document.cookie = `${key}=${data}; ${expires}; ${domain}; path=/;`;
  },
  getFromCookies: (key: KeyType) => {
    const name = key + '=';
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let c = cookies[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  },
  removeFromCookies: (key: KeyType) => {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; ${domain}; path=/;`;
  }
};
