import {
  useAccountRequests,
  useAnalyticsRequests,
  useBlockRequests,
  useCollectionRequests,
  useExtraRequests,
  useGeneralRequests,
  useNftRequests,
  useTokenRequests,
  useTransactionRequests,
  useValidatorRequests
} from './requests';

export const useAdapter = () => {
  const accountRequests = useAccountRequests();
  const analyticsRequests = useAnalyticsRequests();
  const blockRequests = useBlockRequests();
  const collectionRequests = useCollectionRequests();
  const extraRequests = useExtraRequests();
  const generalRequests = useGeneralRequests();
  const nftRequests = useNftRequests();
  const tokenRequests = useTokenRequests();
  const transactionsRequests = useTransactionRequests();
  const validatorRequests = useValidatorRequests();

  return {
    ...generalRequests,

    /* Blocks */
    ...blockRequests,

    /* Transactions */
    ...transactionsRequests,

    /* Account */
    ...accountRequests,

    /* Validators */
    ...validatorRequests,

    /* Tokens */
    ...tokenRequests,

    /* Collections */
    ...collectionRequests,

    /* NFTs */
    ...nftRequests,

    /* Growth / Analytics */
    ...analyticsRequests,

    /* Extra Requests: xExchange, etc */
    ...extraRequests
  };
};
