import { useSelector } from 'react-redux';

import { Tabs } from 'components/Tabs';
import { isProof, urlBuilder } from 'helpers';
import { nftSelector } from 'redux/selectors';
import { nftRoutes, tokensRoutes } from 'routes';
import { NftTypeEnum } from 'types';

export const NftTabs = () => {
  const { nftState } = useSelector(nftSelector);
  const { identifier, type, metadata, rarities } = nftState;
  const isNftProof = isProof(nftState);

  const showOverview = Boolean(
    type &&
      type !== NftTypeEnum.MetaESDT &&
      (metadata?.attributes || (rarities && Object.keys(rarities).length > 0))
  );

  const tabs = [
    {
      show: showOverview,
      tabTo: urlBuilder.nftDetails(identifier),
      tabLabel: 'Overview',
      activationRoutes: [nftRoutes.nftDetails]
    },
    {
      show: type && (type !== NftTypeEnum.MetaESDT || isNftProof),
      tabTo: isNftProof
        ? urlBuilder.proofDetails(identifier)
        : urlBuilder.nftDetailsTransactions(identifier),
      tabLabel: 'Transactions',
      activationRoutes: [
        nftRoutes.nftDetailsTransactions,
        tokensRoutes.tokensProofDetails
      ]
    },
    {
      show: type && (type === NftTypeEnum.SemiFungibleESDT || isNftProof),
      tabTo: isNftProof
        ? urlBuilder.proofDetailsAccounts(identifier)
        : urlBuilder.nftDetailsAccounts(identifier),
      tabLabel: 'Holders',
      activationRoutes: [
        nftRoutes.nftDetailsAccounts,
        tokensRoutes.tokensProofDetailsAccounts
      ]
    }
  ];

  return <Tabs tabs={tabs} />;
};
