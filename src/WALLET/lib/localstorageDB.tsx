interface LocalStorageItemType {
  expires: number;
  data: any;
}

function localStorageDB() {
  return {
    save: save,
    get: get,
    remove: remove,
    resetStorage: resetStorage,
  };

  function resetStorage(minutes = 10) {
    var now = new Date().getTime();
    var setupTime = localStorage.getItem('setupTime');
    if (setupTime == null) {
      localStorage.setItem('setupTime', now.toString());
    } else {
      if (now - parseInt(setupTime) > minutes * 60 * 1000) {
        localStorage.clear();
        localStorage.setItem('setupTime', now.toString());
      }
    }
  }

  /**
   * Saves an item in local storage with a time to live in seconds
   * @param key
   * @param val
   * @param ttl
   */
  function save(key: string, val: any, ttl = 3600) {
    const time = Math.round(new Date().getTime() / 1000);
    const toSave = {
      expires: time + ttl,
      data: val,
    };
    localStorage.setItem(key, JSON.stringify(toSave));
  }

  /**
   * Get an item from local storage. If ttl has passed, it returns nothing and deletes the old item
   * @param key
   * @returns {*}
   */
  function get(key: string) {
    const time = Math.round(new Date().getTime() / 1000);
    if (!localStorage.getItem(key)) {
      return null;
    }

    const item: LocalStorageItemType = JSON.parse(localStorage.getItem(key) as any);
    if (!item.hasOwnProperty('expires') || !item.hasOwnProperty('data')) {
      console.warn(`invalid item at key ${key} in localStorage - removing...`);
      localStorage.removeItem(key);
      return null;
    }

    if (item.expires < time) {
      localStorage.removeItem(key);
      return null;
    }

    return item.data;
  }

  function remove(key: string) {
    localStorage.removeItem(key);
  }
}

export default localStorageDB();
