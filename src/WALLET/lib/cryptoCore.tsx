// @ts-ignore
import elrondCoreJS from '@elrondnetwork/elrond-core-js';

export default (function cryptoCore() {
  return {
    newAccount,
    loadAccountFromKeyFile,
    generateKeyFileFromPrivateKey,
    loadAccountFromPrivateKey,
    createTransaction,
    loadAccountFromPEMSecret,
  };

  function newAccount(password: string) {
    const account = new elrondCoreJS.account(); // eslint-disable-line
    const kdFile = account.initNewAccountFromPassword(password);

    return [account, kdFile];
  }

  function loadAccountFromKeyFile(kdJson: any, password: string) {
    const account = new elrondCoreJS.account(); // eslint-disable-line
    account.loadFromKeyFile(kdJson, password);

    return account;
  }

  function generateKeyFileFromPrivateKey(privateKey: string, password: string) {
    const account = new elrondCoreJS.account(); // eslint-disable-line
    console.warn(account);

    const kdFile = account.generateKeyFileFromPrivateKey(privateKey, password); // eslint-disable-line

    return kdFile;
  }

  function loadAccountFromPEMSecret(privateKey: string) {
    const account = new elrondCoreJS.account(); // eslint-disable-line
    account.loadFromSeed(privateKey);
    return account;
  }

  function loadAccountFromPrivateKey(privateKey: string) {
    const account = new elrondCoreJS.account(); // eslint-disable-line
    account.loadFromHexPrivateKey(privateKey);
    return account;
  }

  interface TransactionType {
    nonce: number;
    from: string;
    to: string;
    value: string;
    gasPrice: number;
    gasLimit: number;
    data: string;
  }

  function createTransaction({
    nonce = 0,
    from = '',
    to = '',
    value = '',
    gasPrice = 0,
    gasLimit = 0,
    data = '',
  }: TransactionType) {
    const transaction = new elrondCoreJS.transaction(
      nonce,
      from,
      to,
      value,
      gasPrice,
      gasLimit,
      data
    );
    return transaction;
  }
})();
