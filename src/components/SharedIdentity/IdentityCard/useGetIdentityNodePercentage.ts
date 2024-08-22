import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { useAdapter } from 'hooks';
import { stakeExtraSelector } from 'redux/selectors';
import { IdentityType } from 'types';

export const useGetIdentityNodePercentage = ({
  identity
}: {
  identity: IdentityType;
}) => {
  const { isNodesIdentityCountFetched, unprocessed } =
    useSelector(stakeExtraSelector);
  const { getIdentities } = useAdapter();

  const [validatorsPercent, setValidatorsPercent] = useState(ELLIPSIS);

  const getData = async () => {
    if (isNodesIdentityCountFetched && unprocessed.totalIdentityNodes) {
      const displayPercentage = new BigNumber(identity.validators)
        .dividedBy(unprocessed.totalIdentityNodes)
        .times(100);

      setValidatorsPercent(displayPercentage.toFormat());

      return;
    }

    const { success, data } = await getIdentities({ fields: 'validators' });
    if (success && data) {
      const totalValidators = (data as IdentityType[])
        .map(({ validators }) => validators || 0)
        .reduce((a, b) => new BigNumber(a).plus(b), new BigNumber(0));

      const displayPercentage = new BigNumber(identity.validators)
        .dividedBy(totalValidators)
        .times(100);

      setValidatorsPercent(displayPercentage.toFormat());
    }
  };

  useEffect(() => {
    if (identity.validators) {
      getData();
    }
  }, [isNodesIdentityCountFetched, identity]);

  return validatorsPercent;
};
