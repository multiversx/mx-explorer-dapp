import moment from 'moment';

type KeyType = 'theme' | 'accessToken';

const storage = {
  saveToLocal: ({
    key,
    data,
    expirationDate,
  }: {
    key: KeyType;
    data: string;
    expirationDate: Date;
  }) => {
    localStorage.setItem(
      key,
      JSON.stringify({
        expirationDate,
        data,
      })
    );
  },
  getFromLocal: (key: KeyType) => {
    const lsEntry = localStorage.getItem(key);

    if (!lsEntry) {
      return null;
    }

    const item = JSON.parse(lsEntry);
    if (!item.hasOwnProperty('expirationDate') || !item.hasOwnProperty('data')) {
      localStorage.removeItem(key);
      return null;
    }

    if (moment().isAfter(moment(item.expirationDate))) {
      localStorage.removeItem(key);
      return null;
    }

    return item.data;
  },
  removeFromLocal: (key: string) => {
    localStorage.removeItem(key);
  },
};

export default storage;
