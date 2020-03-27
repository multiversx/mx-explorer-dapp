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

  function newAccount(password?: string) {
    const account = new elrondCoreJS.account();
    // const kdFile = account.initNewAccountFromPassword(password);

    return account;
  }

  function loadAccountFromKeyFile(kdJson: any, password: string) {
    const account = new elrondCoreJS.account();
    account.loadFromKeyFile(kdJson, password);

    return account;
  }

  function generateKeyFileFromPrivateKey(privateKey: Buffer, password: string) {
    const account = new elrondCoreJS.account();

    const kdFile = account.generateKeyFileFromPrivateKey(privateKey, password);

    return kdFile;
  }

  function loadAccountFromPEMSecret(privateKey: string) {
    const account = new elrondCoreJS.account();
    account.loadFromSeed(privateKey);
    return account;
  }

  function loadAccountFromPrivateKey(privateKey: string) {
    const account = new elrondCoreJS.account();
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
    return new elrondCoreJS.transaction(nonce, from, to, value, gasPrice, gasLimit, data);
  }
})();
