import { useActiveRoute } from 'hooks';
import {
  validatorsRoutes,
  searchRoutes,
  transactionsRoutes,
  blocksRoutes,
  accountsRoutes,
  applicationsRoutes,
  tokensRoutes,
  collectionRoutes,
  nftRoutes,
  analyticsRoutes,
  routes
} from 'routes';

export const useShowGlobalStats = () => {
  const activeRoute = useActiveRoute();
  const routeExists = Object.values(routes).some((path) => activeRoute(path));

  const isCollectionDetails =
    activeRoute(collectionRoutes.collectionDetails) &&
    !(
      activeRoute(collectionRoutes.collectionsNft) ||
      activeRoute(collectionRoutes.collectionsSft)
    );

  switch (true) {
    case !routeExists:
    case activeRoute('/'):
    case activeRoute(searchRoutes.index):
    case activeRoute(searchRoutes.query):
    case activeRoute(analyticsRoutes.compare):
    case activeRoute(blocksRoutes.blocksDetails):
    case activeRoute(blocksRoutes.miniBlockDetails):
    case activeRoute(accountsRoutes.accountDetails):
    case activeRoute(accountsRoutes.accountTokens):
    case activeRoute(accountsRoutes.accountNfts):
    case activeRoute(accountsRoutes.accountContracts):
    case activeRoute(accountsRoutes.accountStaking):
    case activeRoute(accountsRoutes.accountAnalytics):
    case activeRoute(accountsRoutes.accountCode):
    case activeRoute(accountsRoutes.accountCodeEndpoints):
    case activeRoute(accountsRoutes.accountCodeTypes):
    case activeRoute(accountsRoutes.accountCodeConstructor):
    case activeRoute(accountsRoutes.accountCodeEvents):
    case activeRoute(accountsRoutes.accountRolesCollections):
    case activeRoute(accountsRoutes.accountRolesTokens):
    case isCollectionDetails:
    case activeRoute(collectionRoutes.collectionDetailsRoles):
    case activeRoute(collectionRoutes.collectionDetailsTransactions):
    case activeRoute(nftRoutes.nftDetails):
    case activeRoute(nftRoutes.nftDetailsAccounts):
    case activeRoute(nftRoutes.nftDetailsTransactions):
    case activeRoute(tokensRoutes.tokenDetails):
    case activeRoute(tokensRoutes.tokenDetailsAccounts):
    case activeRoute(tokensRoutes.tokenDetailsLockedAccounts):
    case activeRoute(tokensRoutes.tokenDetailsRoles):
    case activeRoute(tokensRoutes.tokensMetaEsdtDetails):
    case activeRoute(tokensRoutes.tokensMetaEsdtDetailsRoles):
    case activeRoute(transactionsRoutes.transactionDetails):
    case activeRoute(transactionsRoutes.transactionDetailsLogs):
    case activeRoute(validatorsRoutes.identityDetails):
    case activeRoute(validatorsRoutes.providerDetails):
    case activeRoute(validatorsRoutes.providerTransactions):
    case activeRoute(validatorsRoutes.nodeDetails):
      return false;
  }

  return true;
};

export const useShowCustomStats = () => {
  const activeRoute = useActiveRoute();

  switch (true) {
    case activeRoute(blocksRoutes.blocks):
    case activeRoute(accountsRoutes.accounts):
    case activeRoute(tokensRoutes.tokens):
    case activeRoute(tokensRoutes.tokensMeta):
    case activeRoute(tokensRoutes.tokensMetaEsdt):
    case activeRoute(collectionRoutes.collections):
    case activeRoute(collectionRoutes.collectionsNft):
    case activeRoute(collectionRoutes.collectionsSft):
      return true;

    default:
      return false;
  }
};

export const useShowTransactionStats = () => {
  const activeRoute = useActiveRoute();

  switch (true) {
    case activeRoute(transactionsRoutes.transactions):
      return true;

    default:
      return false;
  }
};

export const useShowApplicationsStats = () => {
  const activeRoute = useActiveRoute();

  switch (true) {
    case activeRoute(applicationsRoutes.applications):
      return true;

    default:
      return false;
  }
};

export const useShowNodesStats = () => {
  const activeRoute = useActiveRoute();

  switch (true) {
    case activeRoute(validatorsRoutes.identities):
    case activeRoute(validatorsRoutes.providers):
    case activeRoute(validatorsRoutes.nodes):
    case activeRoute(validatorsRoutes.statistics):
    case activeRoute(validatorsRoutes.queue):
    case activeRoute(validatorsRoutes.auctionList):
      return true;
  }

  return false;
};
