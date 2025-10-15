import { getPercentageFilled } from 'helpers';
import { ProviderType, SortOrderEnum } from 'types';

export enum SortProviderFieldEnum {
  filled = 'filled',
  serviceFee = 'serviceFee',
  numNodes = 'numNodes',
  apr = 'apr',
  locked = 'locked',
  delegationCap = 'delegationCap',
  name = 'name'
}

export const sortProviders = ({
  field,
  order,
  sortArray = []
}: {
  field?: SortProviderFieldEnum;
  order?: SortOrderEnum;
  sortArray: ProviderType[];
}) => {
  if (field && order) {
    const sortParams = order === SortOrderEnum.asc ? [1, -1] : [-1, 1];

    switch (true) {
      case field === SortProviderFieldEnum.name:
        const sortedNames = sortArray.filter(
          (provider) => provider.identityInfo && provider.identityInfo.name
        );
        const sortedContracts = sortArray.filter(
          (provider) => !(provider.identityInfo && provider.identityInfo.name)
        );
        sortedNames.sort((a, b) => {
          const aName =
            a.identityInfo && a.identityInfo.name ? a.identityInfo.name : '';
          const bName =
            b.identityInfo && b.identityInfo.name ? b.identityInfo.name : '';
          return aName.toLowerCase() > bName.toLowerCase()
            ? sortParams[0]
            : sortParams[1];
        });
        sortedContracts.sort((a, b) =>
          a.provider > b.provider ? sortParams[0] : sortParams[1]
        );
        sortArray = [...sortedNames, ...sortedContracts];
        break;

      case field === SortProviderFieldEnum.filled:
        sortArray.sort((a, b) => {
          const aFilled = getPercentageFilled(a.locked, a.delegationCap);
          const bFilled = getPercentageFilled(b.locked, b.delegationCap);
          return parseFloat(aFilled) > parseFloat(bFilled)
            ? sortParams[0]
            : sortParams[1];
        });
        break;

      case field === SortProviderFieldEnum.serviceFee:
        sortArray.sort((a, b) => {
          const aFee = a.serviceFee ? a.serviceFee : -1;
          const bFee = b.serviceFee ? b.serviceFee : -1;
          return aFee > bFee ? sortParams[0] : sortParams[1];
        });
        break;

      case field === SortProviderFieldEnum.numNodes:
        sortArray.sort((a, b) => {
          const aNnodes =
            a.identityInfo?.validators !== undefined
              ? a.identityInfo.validators
              : a.numNodes ?? 0;
          const bNnodes =
            b.identityInfo?.validators !== undefined
              ? b.identityInfo.validators
              : b.numNodes ?? 0;

          return aNnodes > bNnodes ? sortParams[0] : sortParams[1];
        });
        break;

      default:
        sortArray.sort((a: any, b: any) =>
          parseFloat(a[field]) > parseFloat(b[field])
            ? sortParams[0]
            : sortParams[1]
        );
        break;
    }
  }

  return sortArray;
};
